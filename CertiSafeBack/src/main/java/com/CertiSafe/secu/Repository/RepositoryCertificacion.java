package com.CertiSafe.secu.Repository;

import com.CertiSafe.secu.Entity.Certificacion;
import com.CertiSafe.secu.Enum.EstadoCertificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface RepositoryCertificacion extends JpaRepository<Certificacion, Long> {
    Optional<Certificacion> findByUsuarioIdusuarioAndTipoCertificacionIdTipoCertificacionAndEstado(
            Long idUsuario,
            Long idTipoCertificacion,
            EstadoCertificacion estado);

    List<Certificacion> findByUsuarioIdusuario(Long idUsuario);

}
