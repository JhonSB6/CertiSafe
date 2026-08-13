package com.CertiSafe.secu.Service;

import com.CertiSafe.secu.Entity.Notificacion;

import java.util.List;
import java.util.Optional;

public interface ServiceNotificacion {

    List<Notificacion> listarNotificaciones(Long idUsuario);

    Optional<Notificacion> buscarPorId(Long id);

    Notificacion guardar(Notificacion notificacion);

    void marcarComoLeida(Long id);

    long contarNoLeidas(Long idUsuario);
}
