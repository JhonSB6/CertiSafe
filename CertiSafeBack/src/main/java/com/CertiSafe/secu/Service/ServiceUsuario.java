package com.CertiSafe.secu.Service;

import com.CertiSafe.secu.Dto.LoginResponse;
import com.CertiSafe.secu.Dto.ValidacionDocumentoResponse;
import com.CertiSafe.secu.Entity.Usuario;

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
}