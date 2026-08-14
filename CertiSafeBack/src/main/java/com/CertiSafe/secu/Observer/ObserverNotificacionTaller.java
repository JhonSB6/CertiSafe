package com.CertiSafe.secu.Observer;

import com.CertiSafe.secu.Entity.Notificacion;
import com.CertiSafe.secu.Entity.Taller;
import com.CertiSafe.secu.Entity.Usuario;
import com.CertiSafe.secu.Enum.EstadoInscripcion;
import com.CertiSafe.secu.Enum.EstadoTipoNotificacion;
import com.CertiSafe.secu.Enum.EstadoUsuario;
import com.CertiSafe.secu.Enum.TipoEventoTaller;
import com.CertiSafe.secu.Repository.RepositoryInscripcionTaller;
import com.CertiSafe.secu.Repository.RepositoryNotificacion;
import com.CertiSafe.secu.Repository.RepositoryUsuario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ObserverNotificacionTaller
        implements ObserverTaller {

    private final RepositoryNotificacion repositoryNotificacion;

    private final RepositoryUsuario repositoryUsuario;

    private final RepositoryInscripcionTaller repositoryInscripcionTaller;

    @Override
    public void actualizar(EventoTaller evento) {

        if (evento.getTipoEvento()
                != TipoEventoTaller.AFORO_INCOMPLETO_TRES_MINUTOS) {

            return;
        }

        Taller taller = evento.getTaller();

        boolean yaExiste =
                repositoryNotificacion
                        .existsByTallerIdtallerAndTipo(
                                taller.getIdtaller(),
                                EstadoTipoNotificacion.FALTA_AFORO);

        if (yaExiste) {
            return;
        }

        long confirmadas =
                repositoryInscripcionTaller
                        .countByTallerIdtallerAndEstado(
                                taller.getIdtaller(),
                                EstadoInscripcion.CONFIRMADA);

        List<Usuario> administradores =
                repositoryUsuario
                        .findByRolNombreAndEstado(
                                "ADMIN",
                                EstadoUsuario.ACTIVO);

        for (Usuario administrador : administradores) {

            Notificacion notificacion =
                    new Notificacion();

            notificacion.setMensaje(
                    "El aforo no se ha completado.\n\n"
                            + "Taller: "
                            + taller.getNombre()
                            + "\n"
                            + "Aforo: "
                            + confirmadas
                            + " / "
                            + taller.getAforo()
                            + "\n\n"
                            + "El taller está a punto de iniciar. "
                            + "¿Desea iniciar el taller o cancelarlo?"
            );

            notificacion.setTipo(
                    EstadoTipoNotificacion.FALTA_AFORO);

            notificacion.setLeida(false);

            notificacion.setFecha(
                    LocalDateTime.now());

            notificacion.setUsuario(
                    administrador);

            notificacion.setTaller(
                    taller);

            repositoryNotificacion.save(notificacion);
        }
    }
}
