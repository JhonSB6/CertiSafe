package com.CertiSafe.secu.Service.impl;

import com.CertiSafe.secu.Dto.ErrorCargaMasivaResponse;
import com.CertiSafe.secu.Dto.ResultadoCargaMasivaResponse;
import com.CertiSafe.secu.Dto.UsuarioCargaMasivaDTO;
import com.CertiSafe.secu.Service.ServiceCargaMasivaUsuario;
import com.CertiSafe.secu.Entity.Rol;
import com.CertiSafe.secu.Entity.SolicitudRegistroUsuario;
import com.CertiSafe.secu.Entity.Usuario;
import com.CertiSafe.secu.Repository.RepositoryRol;
import com.CertiSafe.secu.Repository.RepositorySolicitudRegistroUsuario;
import com.CertiSafe.secu.Repository.RepositoryUsuario;
import com.CertiSafe.secu.Dto.UsuarioCargaMasivaDTO;
import com.CertiSafe.secu.Entity.Rol;
import com.CertiSafe.secu.Entity.SolicitudRegistroUsuario;
import com.CertiSafe.secu.Enum.EstadoSolicitudRegistro;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import java.io.IOException;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ServiceCargaMasivaUsuarioImpl
        implements ServiceCargaMasivaUsuario {

    private final RepositoryUsuario repositoryUsuario;
    private final RepositoryRol repositoryRol;
    private final RepositorySolicitudRegistroUsuario repositorySolicitud;
    private final PasswordEncoder passwordEncoder;

    // =========================================================
    // VALIDAR ARCHIVO
    // =========================================================

    @Override
    public ResultadoCargaMasivaResponse validarArchivo(
            MultipartFile archivo) {

        List<ErrorCargaMasivaResponse> errores =
                new ArrayList<>();

        List<UsuarioCargaMasivaDTO> usuarios =
                new ArrayList<>();

        // -----------------------------------------------------
        // VALIDAR ARCHIVO
        // -----------------------------------------------------

        if (archivo == null || archivo.isEmpty()) {

            errores.add(
                    new ErrorCargaMasivaResponse(
                            0,
                            "Archivo",
                            "",
                            "Debe seleccionar un archivo Excel."
                    )
            );

            return construirResultado(
                    errores,
                    usuarios
            );
        }

        String nombreArchivo =
                archivo.getOriginalFilename();

        if (nombreArchivo == null
                || !nombreArchivo
                .toLowerCase()
                .endsWith(".xlsx")) {

            errores.add(
                    new ErrorCargaMasivaResponse(
                            0,
                            "Archivo",
                            nombreArchivo,
                            "El archivo debe estar en formato .xlsx."
                    )
            );

            return construirResultado(
                    errores,
                    usuarios
            );
        }

        // -----------------------------------------------------
        // ABRIR EXCEL
        // -----------------------------------------------------

        try (Workbook workbook =
                     WorkbookFactory.create(
                             archivo.getInputStream()
                     )) {

            if (workbook.getNumberOfSheets() == 0) {

                errores.add(
                        new ErrorCargaMasivaResponse(
                                0,
                                "Hoja",
                                "",
                                "El archivo no contiene ninguna hoja."
                        )
                );

                return construirResultado(
                        errores,
                        usuarios
                );
            }

            Sheet hoja = workbook.getSheetAt(0);

            // -------------------------------------------------
            // VALIDAR ENCABEZADOS
            // -------------------------------------------------

            Row encabezado = hoja.getRow(0);

            if (!validarEncabezados(
                    encabezado,
                    errores
            )) {

                return construirResultado(
                        errores,
                        usuarios
                );
            }

            // -------------------------------------------------
            // CONJUNTOS PARA DETECTAR DUPLICADOS
            // -------------------------------------------------

            Set<String> documentosExcel =
                    new HashSet<>();

            Set<String> correosExcel =
                    new HashSet<>();

            // -------------------------------------------------
            // RECORRER FILAS
            // -------------------------------------------------

            for (int i = 1;
                 i <= hoja.getLastRowNum();
                 i++) {

                Row fila = hoja.getRow(i);

                // Ignorar filas completamente vacías
                if (fila == null
                        || filaVacia(fila)) {

                    continue;
                }

                int numeroFila = i + 1;

                String documento =
                        leerCeldaComoTexto(
                                fila.getCell(0)
                        );

                String nombre =
                        leerCeldaComoTexto(
                                fila.getCell(1)
                        );

                String apellido =
                        leerCeldaComoTexto(
                                fila.getCell(2)
                        );

                String correo =
                        leerCeldaComoTexto(
                                fila.getCell(3)
                        );

                String rol =
                        leerCeldaComoTexto(
                                fila.getCell(4)
                        );

                // -------------------------------------------------
                // NORMALIZAR
                // -------------------------------------------------

                documento = documento.trim();
                nombre = nombre.trim();
                apellido = apellido.trim();
                correo = correo.trim().toLowerCase();
                rol = rol.trim().toUpperCase();

                // -------------------------------------------------
                // VALIDAR CAMPOS
                // -------------------------------------------------

                boolean filaValida = true;

                // DOCUMENTO

                if (documento.isBlank()) {

                    agregarError(
                            errores,
                            numeroFila,
                            "Documento",
                            documento,
                            "El documento es obligatorio."
                    );

                    filaValida = false;

                } else {

                    if (!documentosExcel.add(documento)) {

                        agregarError(
                                errores,
                                numeroFila,
                                "Documento",
                                documento,
                                "El documento está duplicado dentro del archivo."
                        );

                        filaValida = false;
                    }

                    if (repositoryUsuario
                            .findByDocumento(documento)
                            .isPresent()) {

                        agregarError(
                                errores,
                                numeroFila,
                                "Documento",
                                documento,
                                "El documento ya se encuentra registrado."
                        );

                        filaValida = false;
                    }

                    if (repositorySolicitud
                            .findByDocumento(documento)
                            .isPresent()) {

                        agregarError(
                                errores,
                                numeroFila,
                                "Documento",
                                documento,
                                "El documento ya tiene una solicitud de registro."
                        );

                        filaValida = false;
                    }
                }

                // NOMBRE

                if (nombre.isBlank()) {

                    agregarError(
                            errores,
                            numeroFila,
                            "Nombre",
                            nombre,
                            "El nombre es obligatorio."
                    );

                    filaValida = false;
                }

                // APELLIDO

                if (apellido.isBlank()) {

                    agregarError(
                            errores,
                            numeroFila,
                            "Apellido",
                            apellido,
                            "El apellido es obligatorio."
                    );

                    filaValida = false;
                }

                // CORREO

                if (correo.isBlank()) {

                    agregarError(
                            errores,
                            numeroFila,
                            "Correo",
                            correo,
                            "El correo es obligatorio."
                    );

                    filaValida = false;

                } else {

                    if (!correoValido(correo)) {

                        agregarError(
                                errores,
                                numeroFila,
                                "Correo",
                                correo,
                                "El formato del correo no es válido."
                        );

                        filaValida = false;
                    }

                    if (!correosExcel.add(correo)) {

                        agregarError(
                                errores,
                                numeroFila,
                                "Correo",
                                correo,
                                "El correo está duplicado dentro del archivo."
                        );

                        filaValida = false;
                    }

                    Optional<Usuario> usuarioCorreo =
                            repositoryUsuario
                                    .findByCorreo(correo);

                    if (usuarioCorreo.isPresent()) {

                        agregarError(
                                errores,
                                numeroFila,
                                "Correo",
                                correo,
                                "El correo ya se encuentra registrado."
                        );

                        filaValida = false;
                    }

                    Optional<SolicitudRegistroUsuario>
                            solicitudCorreo =
                            repositorySolicitud
                                    .findByCorreo(correo);

                    if (solicitudCorreo.isPresent()) {

                        agregarError(
                                errores,
                                numeroFila,
                                "Correo",
                                correo,
                                "El correo ya tiene una solicitud de registro."
                        );

                        filaValida = false;
                    }
                }

                // ROL

                if (rol.isBlank()) {

                    agregarError(
                            errores,
                            numeroFila,
                            "Rol",
                            rol,
                            "El rol es obligatorio."
                    );

                    filaValida = false;

                } else if (!rol.equals("OPERARIO")
                        && !rol.equals("CAPACITADOR")) {

                    agregarError(
                            errores,
                            numeroFila,
                            "Rol",
                            rol,
                            "El rol no está permitido. "
                                    + "Solo se permiten OPERARIO y CAPACITADOR."
                    );

                    filaValida = false;

                } else {

                    Optional<Rol> rolBD =
                            repositoryRol.findByNombre(rol);

                    if (rolBD.isEmpty()) {

                        agregarError(
                                errores,
                                numeroFila,
                                "Rol",
                                rol,
                                "El rol no existe en el sistema."
                        );

                        filaValida = false;
                    }
                }

                // -------------------------------------------------
                // SI LA FILA ES VÁLIDA
                // -------------------------------------------------

                if (filaValida) {

                    usuarios.add(
                            new UsuarioCargaMasivaDTO(
                                    documento,
                                    nombre,
                                    apellido,
                                    correo,
                                    rol
                            )
                    );
                }
            }

        } catch (IOException e) {

            errores.add(
                    new ErrorCargaMasivaResponse(
                            0,
                            "Archivo",
                            nombreArchivo,
                            "No fue posible leer el archivo Excel."
                    )
            );

        } catch (Exception e) {

            errores.add(
                    new ErrorCargaMasivaResponse(
                            0,
                            "Archivo",
                            nombreArchivo,
                            "El archivo no tiene un formato Excel válido."
                    )
            );
        }

        return construirResultado(
                errores,
                usuarios
        );
    }

    // =========================================================
    // CONFIRMAR CARGA
    // =========================================================

    @Override
    public ResultadoCargaMasivaResponse confirmarCarga(
            MultipartFile archivo) {

        /*
         * Esta parte la implementaremos después.
         *
         * Primero terminamos y probamos completamente
         * la validación del Excel.
         */

        return validarArchivo(archivo);
    }

    @Override
    @Transactional
    public void confirmarCarga(
            List<UsuarioCargaMasivaDTO> usuarios) {

        for (UsuarioCargaMasivaDTO usuarioDTO : usuarios) {

            // =========================================
            // BUSCAR ROL
            // =========================================

            Rol rol = repositoryRol
                    .findByNombre(
                            usuarioDTO.getRol().toUpperCase()
                    )
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Rol no encontrado: "
                                            + usuarioDTO.getRol()
                            )
                    );


            // =========================================
            // GENERAR CONTRASEÑA AUTOMÁTICA
            // =========================================

            String contrasenaTemporal =
                    generarContrasenaTemporal();


            // =========================================
            // CREAR SOLICITUD
            // =========================================

            SolicitudRegistroUsuario solicitud =
                    new SolicitudRegistroUsuario();

            solicitud.setDocumento(
                    usuarioDTO.getDocumento()
            );

            solicitud.setNombre(
                    usuarioDTO.getNombre()
            );

            solicitud.setApellido(
                    usuarioDTO.getApellido()
            );

            solicitud.setCorreo(
                    usuarioDTO.getCorreo()
            );

            solicitud.setContrasena(
                    passwordEncoder.encode(
                            contrasenaTemporal
                    )
            );

            solicitud.setRol(rol);

            solicitud.setFechaSolicitud(
                    LocalDateTime.now()
            );

            solicitud.setEstado(
                    EstadoSolicitudRegistro.PENDIENTE
            );


            // =========================================
            // GUARDAR SOLICITUD
            // =========================================

            repositorySolicitud.save(solicitud);
        }
    }

    private String generarContrasenaTemporal() {

        return UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 12);
    }
    // =========================================================
    // VALIDAR ENCABEZADOS
    // =========================================================

    private boolean validarEncabezados(
            Row encabezado,
            List<ErrorCargaMasivaResponse> errores) {

        if (encabezado == null) {

            errores.add(
                    new ErrorCargaMasivaResponse(
                            1,
                            "Encabezados",
                            "",
                            "El archivo no contiene encabezados."
                    )
            );

            return false;
        }

        String[] esperados = {
                "Documento",
                "Nombre",
                "Apellido",
                "Correo",
                "Rol"
        };

        boolean correcto = true;

        for (int i = 0; i < esperados.length; i++) {

            String valor =
                    leerCeldaComoTexto(
                            encabezado.getCell(i)
                    );

            if (!esperados[i]
                    .equalsIgnoreCase(
                            valor.trim()
                    )) {

                errores.add(
                        new ErrorCargaMasivaResponse(
                                1,
                                "Columna " + (i + 1),
                                valor,
                                "Se esperaba el encabezado: "
                                        + esperados[i]
                        )
                );

                correcto = false;
            }
        }

        return correcto;
    }

    // =========================================================
    // LEER CELDA
    // =========================================================

    private String leerCeldaComoTexto(Cell celda) {

        if (celda == null) {
            return "";
        }

        DataFormatter formatter =
                new DataFormatter();

        return formatter.formatCellValue(celda);
    }

    // =========================================================
    // FILA VACÍA
    // =========================================================

    private boolean filaVacia(Row fila) {

        for (int i = 0; i < 5; i++) {

            Cell celda = fila.getCell(i);

            if (celda != null
                    && !leerCeldaComoTexto(celda)
                    .trim()
                    .isEmpty()) {

                return false;
            }
        }

        return true;
    }

    // =========================================================
    // VALIDAR CORREO
    // =========================================================

    private boolean correoValido(String correo) {

        return correo.matches(
                "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$"
        );
    }

    // =========================================================
    // AGREGAR ERROR
    // =========================================================

    private void agregarError(
            List<ErrorCargaMasivaResponse> errores,
            int fila,
            String campo,
            String valor,
            String mensaje) {

        errores.add(
                new ErrorCargaMasivaResponse(
                        fila,
                        campo,
                        valor,
                        mensaje
                )
        );
    }

    // =========================================================
    // CONSTRUIR RESULTADO
    // =========================================================

    private ResultadoCargaMasivaResponse construirResultado(
            List<ErrorCargaMasivaResponse> errores,
            List<UsuarioCargaMasivaDTO> usuarios) {

        int totalRegistros =
                usuarios.size()
                        + contarFilasConError(errores);

        boolean exitoso =
                !errores.isEmpty()
                        ? false
                        : !usuarios.isEmpty();

        return new ResultadoCargaMasivaResponse(
                exitoso,
                totalRegistros,
                usuarios.size(),
                contarFilasConError(errores),
                errores,
                exitoso
                        ? usuarios
                        : List.of()
        );
    }

    // =========================================================
    // CONTAR FILAS CON ERROR
    // =========================================================

    private int contarFilasConError(
            List<ErrorCargaMasivaResponse> errores) {

        return (int) errores.stream()
                .map(ErrorCargaMasivaResponse::getFila)
                .filter(fila -> fila > 1)
                .distinct()
                .count();
    }
}
