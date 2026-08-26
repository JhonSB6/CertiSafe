package com.CertiSafe.secu.Service.impl;

import com.CertiSafe.secu.Entity.Notificacion;
import com.CertiSafe.secu.Enum.EstadoTipoNotificacion;
import com.CertiSafe.secu.Repository.RepositoryNotificacion;
import com.CertiSafe.secu.Service.ServiceNotificacion;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ServiceNotificacionimpl implements ServiceNotificacion {

    private final RepositoryNotificacion repositoryNotificacion;

    @Override
    public List<Notificacion> listarNotificaciones(Long idUsuario) {

        return repositoryNotificacion
                .findByUsuarioIdusuarioOrderByFechaDesc(idUsuario);
    }

    @Override
    public Optional<Notificacion> buscarPorId(Long id) {

        return repositoryNotificacion.findById(id);
    }

    @Override
    public Notificacion guardar(Notificacion notificacion) {

        if (notificacion.getLeida() == null) {
            notificacion.setLeida(false);
        }

        return repositoryNotificacion.save(notificacion);
    }

    @Override
    public void marcarComoLeida(Long id) {

        Notificacion notificacion =
                repositoryNotificacion.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notificación no encontrada con id: " + id));

        notificacion.setLeida(true);

        repositoryNotificacion.save(notificacion);
    }
    @Override
    public long contarNoLeidas(Long idUsuario) {

        return repositoryNotificacion
                .countByUsuarioIdusuarioAndLeidaFalse(
                        idUsuario);
    }
    @Override
    public void marcarTodasComoLeidas(Long idUsuario) {

        List<Notificacion> notificaciones =
                repositoryNotificacion
                        .findByUsuarioIdusuarioAndLeidaFalse(idUsuario);

        for (Notificacion notificacion : notificaciones) {

            notificacion.setLeida(true);
        }

        repositoryNotificacion.saveAll(notificaciones);
    }
}
