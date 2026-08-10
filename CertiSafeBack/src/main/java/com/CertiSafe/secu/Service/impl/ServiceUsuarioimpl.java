package com.CertiSafe.secu.Service.impl;

import com.CertiSafe.secu.Entity.Rol;
import com.CertiSafe.secu.Enum.EstadoUsuario;
import com.CertiSafe.secu.Repository.RepositoryRol;
import com.CertiSafe.secu.Service.ServiceUsuario;
import com.CertiSafe.secu.Repository.RepositoryUsuario;
import com.CertiSafe.secu.Entity.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ServiceUsuarioimpl implements ServiceUsuario {
    private final RepositoryUsuario repositoryUsuario;
    private final RepositoryRol repositoryRol;

    @Override
    public List<Usuario> listarUsuarios(){
        return repositoryUsuario.findAll();
    }

    @Override
    public List<Usuario> listarOperarios() {
        return repositoryUsuario.findByRolNombre("OPERARIO");
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
}
