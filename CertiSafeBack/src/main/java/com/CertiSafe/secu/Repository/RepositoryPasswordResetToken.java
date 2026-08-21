package com.CertiSafe.secu.Repository;

import com.CertiSafe.secu.Entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface RepositoryPasswordResetToken extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByToken(String token);

    @Query("""
        SELECT p
        FROM PasswordResetToken p
        WHERE p.usuario.idusuario = :idUsuario
        AND p.usado = false
    """)
    Optional<PasswordResetToken> findTokenActivoPorUsuario(
            @Param("idUsuario") Long idUsuario
    );
}