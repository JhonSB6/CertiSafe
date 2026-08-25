package com.CertiSafe.secu.Service.impl;

import com.CertiSafe.secu.Entity.PasswordResetToken;
import com.CertiSafe.secu.Entity.Usuario;
import com.CertiSafe.secu.Enum.EstadoUsuario;
import com.CertiSafe.secu.Repository.RepositoryPasswordResetToken;
import com.CertiSafe.secu.Repository.RepositoryUsuario;
import com.CertiSafe.secu.Service.ServiceEmail;
import com.CertiSafe.secu.Service.ServicePasswordReset;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class ServicePasswordResetImpl implements ServicePasswordReset {

    private final RepositoryUsuario repositoryUsuario;
    private final RepositoryPasswordResetToken repositoryPasswordResetToken;
    private final PasswordEncoder passwordEncoder;
    private final ServiceEmail serviceEmail;

    public ServicePasswordResetImpl(
            RepositoryUsuario repositoryUsuario,
            RepositoryPasswordResetToken repositoryPasswordResetToken,
            PasswordEncoder passwordEncoder,
            ServiceEmail serviceEmail) {

        this.repositoryUsuario = repositoryUsuario;
        this.repositoryPasswordResetToken = repositoryPasswordResetToken;
        this.passwordEncoder = passwordEncoder;
        this.serviceEmail = serviceEmail;
    }

    @Override
    public void solicitarRecuperacion(String documento) {

        Usuario usuario = repositoryUsuario.findByDocumento(documento)
                .orElseThrow(() ->
                        new RuntimeException("No se pudo procesar la solicitud"));

        if (usuario.getEstado() == null ||
                usuario.getEstado() != EstadoUsuario.ACTIVO) {

            throw new RuntimeException("No se pudo procesar la solicitud");
        }

        repositoryPasswordResetToken
                .findTokenActivoPorUsuario(usuario.getIdusuario())
                .ifPresent(tokenActivo -> {
                    tokenActivo.setUsado(true);
                    repositoryPasswordResetToken.save(tokenActivo);
                });

        String token = UUID.randomUUID().toString();

        PasswordResetToken passwordResetToken = new PasswordResetToken();

        passwordResetToken.setToken(token);
        passwordResetToken.setUsuario(usuario);
        passwordResetToken.setFechaExpiracion(
                LocalDateTime.now().plusMinutes(15)
        );
        passwordResetToken.setUsado(false);

        repositoryPasswordResetToken.save(passwordResetToken);

        serviceEmail.enviarCorreoRecuperacion(
                usuario.getCorreo(),
                token
        );
    }

    @Override
    public void restablecerContrasena(
            String token,
            String nuevaContrasena) {

        PasswordResetToken passwordResetToken =
                repositoryPasswordResetToken.findByToken(token)
                        .orElseThrow(() ->
                                new RuntimeException("Token inválido"));

        if (passwordResetToken.isUsado()) {
            throw new RuntimeException("El token ya fue utilizado");
        }

        if (passwordResetToken.getFechaExpiracion()
                .isBefore(LocalDateTime.now())) {

            throw new RuntimeException("El token ha expirado");
        }

        Usuario usuario = passwordResetToken.getUsuario();

        usuario.setContrasena(
                passwordEncoder.encode(nuevaContrasena)
        );

        repositoryUsuario.save(usuario);

        passwordResetToken.setUsado(true);

        repositoryPasswordResetToken.save(passwordResetToken);
    }
}
