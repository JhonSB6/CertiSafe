package com.CertiSafe.secu.Repository;

import com.CertiSafe.secu.Entity.SolicitudCapacitacion;
import com.CertiSafe.secu.Enum.EstadoSolicitudCapacitacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RepositorySolicitudCapacitacion
        extends JpaRepository<SolicitudCapacitacion, Long> {

    List<SolicitudCapacitacion> findByUsuarioIdusuarioOrderByFechaSolicitudDesc(
            Long idUsuario
    );

    List<SolicitudCapacitacion> findByEstadoOrderByFechaSolicitudDesc(
            EstadoSolicitudCapacitacion estado
    );

    boolean existsByUsuarioIdusuarioAndTipoCertificacionIdTipoCertificacionAndEstado(
            Long idUsuario,
            Long idTipoCertificacion,
            EstadoSolicitudCapacitacion estado
    );
}
