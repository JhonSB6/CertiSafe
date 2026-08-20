package com.CertiSafe.secu.Service.impl;

import com.CertiSafe.secu.Dto.SolicitudRegistroUsuarioRequest;
import com.CertiSafe.secu.Dto.SolicitudRegistroUsuarioResponse;
import com.CertiSafe.secu.Entity.Rol;
import com.CertiSafe.secu.Entity.SolicitudRegistroUsuario;
import com.CertiSafe.secu.Entity.Usuario;
import com.CertiSafe.secu.Enum.EstadoSolicitudRegistro;
import com.CertiSafe.secu.Enum.EstadoUsuario;
import com.CertiSafe.secu.Repository.RepositoryRol;
import com.CertiSafe.secu.Repository.RepositorySolicitudRegistroUsuario;
import com.CertiSafe.secu.Repository.RepositoryUsuario;
import com.CertiSafe.secu.Service.ServiceSolicitudRegistroUsuario;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ServiceSolicitudRegistroUsuarioimpl implements ServiceSolicitudRegistroUsuario {

    private final RepositorySolicitudRegistroUsuario repositorySolicitud;
    private final RepositoryUsuario repositoryUsuario;
    private final RepositoryRol repositoryRol;
    private final PasswordEncoder passwordEncoder;

    @Override
    public SolicitudRegistroUsuarioResponse crearSolicitud(
            SolicitudRegistroUsuarioRequest request) {

        // =========================================
        // VALIDAR DOCUMENTO EN USUARIOS
        // =========================================

        if (repositoryUsuario
                .findByDocumento(request.getDocumento())
                .isPresent()) {

            throw new RuntimeException(
                    "El documento ya se encuentra registrado"
            );
        }


        // =========================================
        // VALIDAR CORREO EN USUARIOS
        // =========================================

        boolean correoExiste = repositoryUsuario
                .findAll()
                .stream()
                .anyMatch(usuario ->
                        usuario.getCorreo()
                                .equalsIgnoreCase(request.getCorreo())
                );

        if (correoExiste) {

            throw new RuntimeException(
                    "El correo ya se encuentra registrado"
            );
        }


        // =========================================
        // VALIDAR SOLICITUD PENDIENTE
        // =========================================

        Optional<SolicitudRegistroUsuario> solicitudDocumento =
                repositorySolicitud.findByDocumento(
                        request.getDocumento()
                );

        if (solicitudDocumento.isPresent()
                && solicitudDocumento.get().getEstado()
                == EstadoSolicitudRegistro.PENDIENTE) {

            throw new RuntimeException(
                    "Ya existe una solicitud pendiente para este documento"
            );
        }


        Optional<SolicitudRegistroUsuario> solicitudCorreo =
                repositorySolicitud.findByCorreo(
                        request.getCorreo()
                );

        if (solicitudCorreo.isPresent()
                && solicitudCorreo.get().getEstado()
                == EstadoSolicitudRegistro.PENDIENTE) {

            throw new RuntimeException(
                    "Ya existe una solicitud pendiente para este correo"
            );
        }


        // =========================================
        // BUSCAR ROL
        // =========================================

        Rol rol = repositoryRol.findById(
                request.getIdRol()
        ).orElseThrow(() ->
                new RuntimeException(
                        "Rol no encontrado"
                )
        );


        // =========================================
        // SOLO OPERARIO / CAPACITADOR
        // =========================================

        String nombreRol = rol.getNombre();

        if (!nombreRol.equals("OPERARIO")
                && !nombreRol.equals("CAPACITADOR")) {

            throw new RuntimeException(
                    "El registro solo permite los roles OPERARIO y CAPACITADOR"
            );
        }


        // =========================================
        // CREAR SOLICITUD
        // =========================================

        SolicitudRegistroUsuario solicitud =
                new SolicitudRegistroUsuario();

        solicitud.setDocumento(request.getDocumento());
        solicitud.setNombre(request.getNombre());
        solicitud.setApellido(request.getApellido());
        solicitud.setCorreo(request.getCorreo());

        solicitud.setContrasena(
                passwordEncoder.encode(
                        request.getContrasena()
                )
        );

        solicitud.setRol(rol);

        solicitud.setFechaSolicitud(
                LocalDateTime.now()
        );

        solicitud.setEstado(
                EstadoSolicitudRegistro.PENDIENTE
        );


        SolicitudRegistroUsuario guardada =
                repositorySolicitud.save(solicitud);


        return convertirResponse(guardada);
    }


    // =========================================
    // LISTAR PENDIENTES
    // =========================================

    @Override
    public List<SolicitudRegistroUsuarioResponse> listarPendientes() {

        return repositorySolicitud
                .findByEstado(
                        EstadoSolicitudRegistro.PENDIENTE
                )
                .stream()
                .map(this::convertirResponse)
                .toList();
    }


    // =========================================
    // APROBAR
    // =========================================

    @Override
    public void aprobar(Long idSolicitud) {

        SolicitudRegistroUsuario solicitud =
                repositorySolicitud.findById(idSolicitud)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Solicitud no encontrada"
                                )
                        );


        if (solicitud.getEstado()
                != EstadoSolicitudRegistro.PENDIENTE) {

            throw new RuntimeException(
                    "La solicitud ya fue procesada"
            );
        }


        // =========================================
        // CREAR USUARIO
        // =========================================

        Usuario usuario = new Usuario();

        usuario.setDocumento(
                solicitud.getDocumento()
        );

        usuario.setNombre(
                solicitud.getNombre()
        );

        usuario.setApellido(
                solicitud.getApellido()
        );

        usuario.setCorreo(
                solicitud.getCorreo()
        );

        // Ya está encriptada
        usuario.setContrasena(
                solicitud.getContrasena()
        );

        usuario.setRol(
                solicitud.getRol()
        );

        usuario.setEstado(
                EstadoUsuario.ACTIVO
        );


        repositoryUsuario.save(usuario);


        // =========================================
        // ACTUALIZAR SOLICITUD
        // =========================================

        solicitud.setEstado(
                EstadoSolicitudRegistro.APROBADA
        );

        repositorySolicitud.save(solicitud);
    }


    // =========================================
    // RECHAZAR
    // =========================================

    @Override
    public void rechazar(Long idSolicitud) {

        SolicitudRegistroUsuario solicitud =
                repositorySolicitud.findById(idSolicitud)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Solicitud no encontrada"
                                )
                        );


        if (solicitud.getEstado()
                != EstadoSolicitudRegistro.PENDIENTE) {

            throw new RuntimeException(
                    "La solicitud ya fue procesada"
            );
        }


        solicitud.setEstado(
                EstadoSolicitudRegistro.RECHAZADA
        );

        repositorySolicitud.save(solicitud);
    }


    // =========================================
    // CONSULTAR ESTADO POR DOCUMENTO
    // =========================================

    @Override
    public EstadoSolicitudRegistro buscarEstadoPorDocumento(
            String documento) {

        return repositorySolicitud
                .findByDocumento(documento)
                .map(SolicitudRegistroUsuario::getEstado)
                .orElse(null);
    }


    // =========================================
    // CONVERTIR A RESPONSE
    // =========================================

    private SolicitudRegistroUsuarioResponse convertirResponse(
            SolicitudRegistroUsuario solicitud) {

        return new SolicitudRegistroUsuarioResponse(

                solicitud.getIdSolicitud(),

                solicitud.getDocumento(),

                solicitud.getNombre(),

                solicitud.getApellido(),

                solicitud.getCorreo(),

                solicitud.getRol().getNombre(),

                solicitud.getFechaSolicitud(),

                solicitud.getEstado()
        );
    }
}