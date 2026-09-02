package com.CertiSafe.secu.Service.impl;

import com.CertiSafe.secu.Dto.*;
import com.CertiSafe.secu.Entity.Rol;
import com.CertiSafe.secu.Entity.SolicitudRegistroUsuario;
import com.CertiSafe.secu.Enum.EstadoSolicitudRegistro;
import com.CertiSafe.secu.Enum.EstadoTaller;
import com.CertiSafe.secu.Enum.EstadoUsuario;
import com.CertiSafe.secu.Repository.RepositoryRol;
import com.CertiSafe.secu.Repository.RepositorySolicitudRegistroUsuario;
import com.CertiSafe.secu.Service.ServiceUsuario;
import com.CertiSafe.secu.Repository.RepositoryUsuario;
import com.CertiSafe.secu.Entity.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ServiceUsuarioimpl implements ServiceUsuario {
    private final RepositoryUsuario repositoryUsuario;
    private final RepositoryRol repositoryRol;
    private final PasswordEncoder passwordEncoder;
    private final RepositorySolicitudRegistroUsuario repositorySolicitudRegistroUsuario;


    @Override
    public List<Usuario> listarUsuarios(){
        return repositoryUsuario.findAll();
    }

    @Override
    public List<Usuario> listarOperarios() {
        return repositoryUsuario.findByRolNombreAndEstado("OPERARIO", EstadoUsuario.ACTIVO);
    }
    @Override
    public List<UsuarioResponse> listarUsuariosSeguros() {

        return repositoryUsuario.findAll()
                .stream()
                .map(this::convertirUsuarioResponse)
                .toList();
    }


    @Override
    public UsuarioResponse obtenerPerfil(Long id) {

        Usuario usuario = repositoryUsuario.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Usuario no encontrado"
                        )
                );

        return convertirUsuarioResponse(usuario);
    }


    @Override
    public UsuarioResponse actualizarPerfil(
            Long id,
            ActualizarPerfilRequest request
    ) {

        Usuario usuario = repositoryUsuario.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Usuario no encontrado"
                        )
                );

        if (request.getNombre() == null ||
                request.getNombre().trim().isEmpty()) {

            throw new RuntimeException(
                    "El nombre es obligatorio"
            );
        }

        if (request.getApellido() == null ||
                request.getApellido().trim().isEmpty()) {

            throw new RuntimeException(
                    "El apellido es obligatorio"
            );
        }

        if (request.getCorreo() == null ||
                request.getCorreo().trim().isEmpty()) {

            throw new RuntimeException(
                    "El correo es obligatorio"
            );
        }

        Optional<Usuario> usuarioCorreo =
                repositoryUsuario.findByCorreo(
                        request.getCorreo().trim()
                );

        if (usuarioCorreo.isPresent() &&
                !usuarioCorreo.get()
                        .getIdusuario()
                        .equals(id)) {

            throw new RuntimeException(
                    "El correo ya está registrado por otro usuario"
            );
        }

        usuario.setNombre(
                request.getNombre().trim()
        );

        usuario.setApellido(
                request.getApellido().trim()
        );

        usuario.setCorreo(
                request.getCorreo().trim()
        );

        Usuario actualizado =
                repositoryUsuario.save(usuario);

        return convertirUsuarioResponse(actualizado);
    }

    @Override
    public UsuarioResponse actualizarUsuarioAdmin(
            Long id,
            ActualizarUsuarioAdminRequest request
    ) {

        Usuario usuario = repositoryUsuario.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Usuario no encontrado"
                        )
                );

        // =========================================================
        // VALIDAR NOMBRE
        // =========================================================

        if (request.getNombre() == null ||
                request.getNombre().trim().isEmpty()) {

            throw new RuntimeException(
                    "El nombre es obligatorio"
            );
        }


        // =========================================================
        // VALIDAR APELLIDO
        // =========================================================

        if (request.getApellido() == null ||
                request.getApellido().trim().isEmpty()) {

            throw new RuntimeException(
                    "El apellido es obligatorio"
            );
        }


        // =========================================================
        // VALIDAR CORREO
        // =========================================================

        if (request.getCorreo() == null ||
                request.getCorreo().trim().isEmpty()) {

            throw new RuntimeException(
                    "El correo es obligatorio"
            );
        }


        // =========================================================
        // VALIDAR ROL
        // =========================================================

        if (request.getIdRol() == null) {

            throw new RuntimeException(
                    "El rol es obligatorio"
            );
        }


        // =========================================================
        // VALIDAR CORREO DUPLICADO
        // =========================================================

        Optional<Usuario> usuarioCorreo =
                repositoryUsuario.findByCorreo(
                        request.getCorreo().trim()
                );

        if (usuarioCorreo.isPresent() &&
                !usuarioCorreo.get()
                        .getIdusuario()
                        .equals(id)) {

            throw new RuntimeException(
                    "El correo ya está registrado por otro usuario"
            );
        }


        // =========================================================
        // BUSCAR ROL
        // =========================================================

        Rol rol = repositoryRol.findById(
                request.getIdRol()
        ).orElseThrow(() ->
                new RuntimeException(
                        "Rol no encontrado"
                )
        );


        // =========================================================
        // ACTUALIZAR SOLAMENTE LOS CAMPOS PERMITIDOS
        // =========================================================

        usuario.setNombre(
                request.getNombre().trim()
        );

        usuario.setApellido(
                request.getApellido().trim()
        );

        usuario.setCorreo(
                request.getCorreo().trim()
        );

        usuario.setRol(rol);


        // =========================================================
        // GUARDAR
        // =========================================================

        Usuario actualizado =
                repositoryUsuario.save(usuario);


        // =========================================================
        // RESPUESTA SEGURA
        // =========================================================

        return convertirUsuarioResponse(
                actualizado
        );
    }

    @Override
    public UsuarioResponse cambiarEstado(
            Long id,
            EstadoUsuario estado
    ) {

        Usuario usuario = repositoryUsuario.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Usuario no encontrado"
                        )
                );

        if (estado == null) {

            throw new RuntimeException(
                    "El estado es obligatorio"
            );
        }

        usuario.setEstado(estado);

        Usuario actualizado =
                repositoryUsuario.save(usuario);

        return convertirUsuarioResponse(actualizado);
    }


    private UsuarioResponse convertirUsuarioResponse(
            Usuario usuario
    ) {

        return new UsuarioResponse(
                usuario.getIdusuario(),
                usuario.getDocumento(),
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getCorreo(),
                usuario.getEstado().name(),
                usuario.getRol().getNombre()
        );
    }

    @Override
    public Optional<Usuario> buscarPorId(Long id){
        return repositoryUsuario.findById(id);
    }

    @Override
    public Usuario guardar(Usuario usuario) {
        Long idRol = usuario.getRol().getIdrol();
        Rol rol = repositoryRol.findById(idRol)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        usuario.setRol(rol);

        return repositoryUsuario.save(usuario);
    }

    @Override
    public Usuario actualizar(Long id, Usuario usuario) {
        return repositoryUsuario.save(usuario);
    }

    @Override
    public void desactivar(Long id) {
        Optional<Usuario> optional = repositoryUsuario.findById(id);
        if (optional.isPresent()) {
            Usuario usuario = optional.get();
            usuario.setEstado(EstadoUsuario.INACTIVO);
            repositoryUsuario.save(usuario);
        }
    }
    @Override
    public ValidacionDocumentoResponse validarDocumento(String documento) {

        Optional<Usuario> optionalUsuario =
                repositoryUsuario.findByDocumento(documento);

        if (optionalUsuario.isEmpty()) {
            return new ValidacionDocumentoResponse(
                    false,
                    null,
                    "No existe un usuario con ese número de documento");
        }

        Usuario usuario = optionalUsuario.get();

        if (usuario.getEstado() == EstadoUsuario.INACTIVO) {
            return new ValidacionDocumentoResponse(
                    false,
                    null,
                    "El usuario se encuentra inactivo");
        }

        return new ValidacionDocumentoResponse(
                true,
                usuario.getIdusuario(),
                "Documento validado correctamente");
    }

    @Override
    public void cambiarContrasena(Long id, String nuevaContrasena) {

        Usuario usuario = repositoryUsuario.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Usuario no encontrado"));

        usuario.setContrasena(passwordEncoder.encode(nuevaContrasena));

        repositoryUsuario.save(usuario);
    }
    @Override
    public List<Usuario> listarCapacitadores() {

        return repositoryUsuario.findByRolNombreAndEstado(
                "CAPACITADOR",
                EstadoUsuario.ACTIVO
        );
    }
    @Override
    public List<Usuario> listarCapacitadoresDisponibles(
            LocalDate fecha,
            LocalTime horaInicio,
            LocalTime horaFin
    ) {

        LocalTime horaInicioConMargen =
                horaInicio.minusMinutes(30);

        LocalTime horaFinConMargen =
                horaFin.plusMinutes(30);

        List<EstadoTaller> estadosQueBloquean =
                Arrays.asList(
                        EstadoTaller.PROGRAMADO,
                        EstadoTaller.EN_CURSO
                );

        return repositoryUsuario.buscarCapacitadoresDisponibles(
                fecha,
                horaInicioConMargen,
                horaFinConMargen,
                estadosQueBloquean,
                EstadoUsuario.ACTIVO
        );
    }

    @Override
    public LoginResponse login(String documento, String contrasena) {

        Optional<Usuario> usuarioOptional =
                repositoryUsuario.findByDocumento(documento);

        // =========================================
        // EL USUARIO TODAVÍA NO EXISTE
        // =========================================

        if (usuarioOptional.isEmpty()) {

            return manejarSolicitudRegistro(documento);
        }

        Usuario usuario = usuarioOptional.get();

        // =========================================
        // USUARIO INACTIVO
        // =========================================

        if (usuario.getEstado() == EstadoUsuario.INACTIVO) {

            throw new RuntimeException(
                    "El usuario se encuentra inactivo"
            );
        }

        // =========================================
        // VALIDAR CONTRASEÑA
        // =========================================

        if (!passwordEncoder.matches(
                contrasena,
                usuario.getContrasena())) {

            throw new RuntimeException(
                    "Documento o contraseña incorrectos"
            );
        }

        // =========================================
        // LOGIN CORRECTO
        // =========================================

        return new LoginResponse(
                usuario.getIdusuario(),
                usuario.getDocumento(),
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getRol().getNombre(),
                "Inicio de sesión exitoso"
        );
    }
    private LoginResponse manejarSolicitudRegistro(String documento) {

        Optional<SolicitudRegistroUsuario> solicitud =
                repositorySolicitudRegistroUsuario
                        .findByDocumento(documento);

        if (solicitud.isPresent()) {

            EstadoSolicitudRegistro estado =
                    solicitud.get().getEstado();

            // =========================================
            // SOLICITUD PENDIENTE
            // =========================================

            if (estado == EstadoSolicitudRegistro.PENDIENTE) {

                throw new RuntimeException(
                        "Su solicitud está en proceso de validación"
                );
            }

            // =========================================
            // SOLICITUD RECHAZADA
            // =========================================

            if (estado == EstadoSolicitudRegistro.RECHAZADA) {

                throw new RuntimeException(
                        "Su solicitud de registro fue rechazada"
                );
            }

            // =========================================
            // CASO EXTRA
            // =========================================

            if (estado == EstadoSolicitudRegistro.APROBADA) {

                throw new RuntimeException(
                        "Su solicitud fue aprobada. Intente iniciar sesión nuevamente."
                );
            }
        }

        // =========================================
        // NO EXISTE NI USUARIO NI SOLICITUD
        // =========================================

        throw new RuntimeException(
                "Documento o contraseña incorrectos"
        );
    }
}
