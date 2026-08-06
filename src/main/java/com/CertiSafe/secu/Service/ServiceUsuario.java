package com.CertiSafe.secu.Service;

import com.CertiSafe.secu.Entity.Usuario;

import java.util.List;
import java.util.Optional;

public interface ServiceUsuario {
    List<Usuario> listarUsuarios();

    Optional<Usuario> buscarPorId(Long id);

    Usuario guardar(Usuario usuario);

    Usuario actualizar(Long id, Usuario usuario);

    void desactivar(Long id);
}