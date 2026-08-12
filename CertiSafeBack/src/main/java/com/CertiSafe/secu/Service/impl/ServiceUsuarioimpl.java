package com.CertiSafe.secu.Service.impl;

import com.CertiSafe.secu.Dto.LoginResponse;
import com.CertiSafe.secu.Dto.ValidacionDocumentoResponse;
import com.CertiSafe.secu.Entity.Rol;
import com.CertiSafe.secu.Enum.EstadoUsuario;
import com.CertiSafe.secu.Repository.RepositoryRol;
import com.CertiSafe.secu.Service.ServiceUsuario;
import com.CertiSafe.secu.Repository.RepositoryUsuario;
import com.CertiSafe.secu.Entity.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ServiceUsuarioimpl implements ServiceUsuario {
    private final RepositoryUsuario repositoryUsuario;
    private final RepositoryRol repositoryRol;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<Usuario> listarUsuarios(){
        return repositoryUsuario.findAll();
    }

    @Override
    public List<Usuario> listarOperarios() {
        return repositoryUsuario.findByRolNombre("OPERARIO", EstadoUsuario.ACTIVO);
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

        return repositoryUsuario.findByRolNombre(
                "CAPACITADOR",
                EstadoUsuario.ACTIVO
        );
    }
    @Override
    public LoginResponse login(String documento, String contrasena) {

        Usuario usuario = repositoryUsuario.findByDocumento(documento)
                .orElseThrow(() ->
                        new RuntimeException("Documento o contraseña incorrectos"));

        if (usuario.getEstado() == EstadoUsuario.INACTIVO) {
            throw new RuntimeException("El usuario se encuentra inactivo");
        }

        if (!passwordEncoder.matches(
                contrasena,
                usuario.getContrasena())) {

            throw new RuntimeException(
                    "Documento o contraseña incorrectos");
        }

        return new LoginResponse(
                usuario.getIdusuario(),
                usuario.getDocumento(),
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getRol().getNombre(),
                "Inicio de sesión exitoso"
        );
    }
}
