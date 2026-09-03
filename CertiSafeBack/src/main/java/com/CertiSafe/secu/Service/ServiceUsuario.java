package com.CertiSafe.secu.Service;

import com.CertiSafe.secu.Dto.*;
import com.CertiSafe.secu.Entity.Usuario;
import com.CertiSafe.secu.Enum.EstadoUsuario;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface ServiceUsuario {

    List<Usuario> listarUsuarios();

    List<Usuario> listarOperarios();

    Optional<Usuario> buscarPorId(Long id);

    Usuario guardar(Usuario usuario);

    Usuario actualizar(Long id, Usuario usuario);

    void desactivar(Long id);

    ValidacionDocumentoResponse validarDocumento(String documento);

    void cambiarContrasena(Long id, String nuevaContrasena);

    LoginResponse login(String documento, String contrasena);

    List<Usuario> listarCapacitadores();

    List<UsuarioResponse> listarUsuariosSeguros();

    UsuarioResponse obtenerPerfil(Long id);

    UsuarioResponse actualizarPerfil(Long id, ActualizarPerfilRequest request);

    UsuarioResponse cambiarEstado(Long id, EstadoUsuario estado);

    UsuarioResponse actualizarUsuarioAdmin(
            Long id,
            ActualizarUsuarioAdminRequest request
    );

    List<Usuario> listarCapacitadoresDisponibles(
            LocalDate fecha,
            LocalTime horaInicio,
            LocalTime horaFin
    );
//
    //
}