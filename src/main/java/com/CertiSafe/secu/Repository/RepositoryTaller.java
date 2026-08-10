package com.CertiSafe.secu.Repository;

import com.CertiSafe.secu.Entity.Taller;
import com.CertiSafe.secu.Entity.TipoCertificacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RepositoryTaller extends JpaRepository<Taller, Long> {
    Optional<TipoCertificacion> findByNombre(String nombre);
}
