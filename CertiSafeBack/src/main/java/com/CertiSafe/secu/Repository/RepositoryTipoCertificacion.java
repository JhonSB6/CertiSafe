package com.CertiSafe.secu.Repository;
import com.CertiSafe.secu.Entity.TipoCertificacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RepositoryTipoCertificacion extends JpaRepository<TipoCertificacion, Long> {

    Optional<TipoCertificacion> findByNombre(String nombre);
}
