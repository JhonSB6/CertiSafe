package com.CertiSafe.secu.Service.impl;

import com.CertiSafe.secu.Entity.Notificacion;
import com.CertiSafe.secu.Entity.SolicitudCapacitacion;
import com.CertiSafe.secu.Entity.TipoCertificacion;
import com.CertiSafe.secu.Entity.Usuario;
import com.CertiSafe.secu.Enum.EstadoSolicitudCapacitacion;
import com.CertiSafe.secu.Enum.EstadoTipoNotificacion;
import com.CertiSafe.secu.Enum.EstadoUsuario;
import com.CertiSafe.secu.Repository.RepositoryNotificacion;
import com.CertiSafe.secu.Repository.RepositorySolicitudCapacitacion;
import com.CertiSafe.secu.Repository.RepositoryTipoCertificacion;
import com.CertiSafe.secu.Repository.RepositoryUsuario;
import com.CertiSafe.secu.Service.ServiceNotificacion;
import com.CertiSafe.secu.Service.ServiceSolicitudCapacitacion;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ServiceSolicitudCapacitacionimpl implements ServiceSolicitudCapacitacion {

    private final RepositorySolicitudCapacitacion repositorySolicitudCapacitacion;

    private final RepositoryUsuario repositoryUsuario;

    private final ServiceNotificacion serviceNotificacion;

    private final RepositoryTipoCertificacion repositoryTipoCertificacion;

    private final RepositoryNotificacion repositoryNotificacion;


    // =========================================================
    // LISTAR TODAS LAS SOLICITUDES
    // =========================================================

    @Override
    public List<SolicitudCapacitacion> listarSolicitudes() {

        return repositorySolicitudCapacitacion.findAll();
    }


    // =========================================================
    // BUSCAR POR ID
    // =========================================================

    @Override
    public Optional<SolicitudCapacitacion> buscarPorId(Long id) {

        return repositorySolicitudCapacitacion.findById(id);
    }


    // =========================================================
    // LISTAR SOLICITUDES DE UN OPERARIO
    // =========================================================

    @Override
    public List<SolicitudCapacitacion> listarPorUsuario(
            Long idUsuario) {

        return repositorySolicitudCapacitacion
                .findByUsuarioIdusuarioOrderByFechaSolicitudDesc(
                        idUsuario
                );
    }


    // =========================================================
    // LISTAR POR ESTADO
    // =========================================================

    @Override
    public List<SolicitudCapacitacion> listarPorEstado(
            EstadoSolicitudCapacitacion estado) {

        return repositorySolicitudCapacitacion
                .findByEstadoOrderByFechaSolicitudDesc(
                        estado
                );
    }


    // =========================================================
    // GUARDAR
    // =========================================================

    @Override
    public SolicitudCapacitacion guardar(
            SolicitudCapacitacion solicitud) {

        if (solicitud.getEstado() == null) {

            solicitud.setEstado(
                    EstadoSolicitudCapacitacion.PENDIENTE
            );
        }

        if (solicitud.getFechaSolicitud() == null) {

            solicitud.setFechaSolicitud(
                    LocalDateTime.now()
            );
        }

        return repositorySolicitudCapacitacion.save(
                solicitud
        );
    }


    // =========================================================
    // CREAR SOLICITUD
    // =========================================================

    @Override
    public SolicitudCapacitacion crearSolicitud(
            Long idUsuario,
            Long idTipoCertificacion,
            String observacion) {

        Usuario usuario =
                repositoryUsuario.findById(idUsuario)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Usuario no encontrado con id: "
                                                + idUsuario
                                )
                        );

        TipoCertificacion tipoCertificacion =
                repositoryTipoCertificacion
                        .findById(idTipoCertificacion)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Tipo de certificación no encontrado con id: "
                                                + idTipoCertificacion
                                )
                        );


        // =====================================================
        // EVITAR SOLICITUD DUPLICADA
        // =====================================================

        boolean existeSolicitud =
                repositorySolicitudCapacitacion
                        .existsByUsuarioIdusuarioAndTipoCertificacionIdTipoCertificacionAndEstado(
                                idUsuario,
                                idTipoCertificacion,
                                EstadoSolicitudCapacitacion.PENDIENTE
                        );

        if (existeSolicitud) {

            throw new RuntimeException(
                    "Ya existe una solicitud pendiente para esta capacitación."
            );
        }


        // =====================================================
        // CREAR SOLICITUD
        // =====================================================

        SolicitudCapacitacion solicitud =
                new SolicitudCapacitacion();

        solicitud.setUsuario(usuario);

        solicitud.setTipoCertificacion(
                tipoCertificacion
        );

        solicitud.setEstado(
                EstadoSolicitudCapacitacion.PENDIENTE
        );

        solicitud.setFechaSolicitud(
                LocalDateTime.now()
        );

        solicitud.setObservacion(
                observacion
        );


        // =====================================================
        // GUARDAR SOLICITUD
        // =====================================================

        SolicitudCapacitacion guardada =
                repositorySolicitudCapacitacion.save(
                        solicitud
                );


        // =====================================================
        // BUSCAR ADMINISTRADOR
        // =====================================================

        Usuario administrador =
                repositoryUsuario.findById(1L)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Administrador no encontrado."
                                )
                        );


        // =====================================================
        // CREAR NOTIFICACIÓN PARA EL ADMINISTRADOR
        // =====================================================

        Notificacion notificacion =
                new Notificacion();

        notificacion.setMensaje(
                usuario.getNombre() + " " +
                        usuario.getApellido() +
                        " solicita capacitación en " +
                        tipoCertificacion.getNombre()
        );

        notificacion.setTipo(
                EstadoTipoNotificacion.SOLICITUD_CAPACITACION
        );

        notificacion.setLeida(false);

        notificacion.setFecha(
                LocalDateTime.now()
        );

        notificacion.setUsuario(
                administrador
        );

        // La solicitud todavía no está asociada a un taller
        notificacion.setTaller(null);


        // =====================================================
        // GUARDAR NOTIFICACIÓN
        // =====================================================

        serviceNotificacion.guardar(
                notificacion
        );


        return guardada;
    }


    // =========================================================
    // ACTUALIZAR ESTADO
    // =========================================================

    @Override
    public void actualizarEstado(
            Long idSolicitud,
            EstadoSolicitudCapacitacion estado) {

        SolicitudCapacitacion solicitud =
                repositorySolicitudCapacitacion.findById(
                        idSolicitud
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Solicitud no encontrada con id: "
                                        + idSolicitud
                        )
                );


        solicitud.setEstado(estado);

        repositorySolicitudCapacitacion.save(
                solicitud
        );
    }
}
