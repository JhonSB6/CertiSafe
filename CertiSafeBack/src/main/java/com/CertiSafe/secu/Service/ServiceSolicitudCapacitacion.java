package com.CertiSafe.secu.Service;

import com.CertiSafe.secu.Entity.SolicitudCapacitacion;
import com.CertiSafe.secu.Enum.EstadoSolicitudCapacitacion;

import java.util.List;
import java.util.Optional;

public interface ServiceSolicitudCapacitacion {

    List<SolicitudCapacitacion> listarSolicitudes();

    Optional<SolicitudCapacitacion> buscarPorId(Long id);

    List<SolicitudCapacitacion> listarPorUsuario(Long idUsuario);

    List<SolicitudCapacitacion> listarPorEstado(
            EstadoSolicitudCapacitacion estado
    );

    SolicitudCapacitacion guardar(SolicitudCapacitacion solicitud);

    SolicitudCapacitacion crearSolicitud(
            Long idUsuario,
            Long idTipoCertificacion,
            String observacion
    );

    void actualizarEstado(
            Long idSolicitud,
            EstadoSolicitudCapacitacion estado
    );
}
