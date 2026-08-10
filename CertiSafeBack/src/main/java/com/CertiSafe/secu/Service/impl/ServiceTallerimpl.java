package com.CertiSafe.secu.Service.impl;

import com.CertiSafe.secu.Entity.InscripcionTaller;
import com.CertiSafe.secu.Entity.Notificacion;
import com.CertiSafe.secu.Entity.Taller;
import com.CertiSafe.secu.Entity.Usuario;
import com.CertiSafe.secu.Enum.*;
import com.CertiSafe.secu.Repository.*;
import com.CertiSafe.secu.Service.ServiceTaller;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceTallerimpl implements ServiceTaller {

    private final RepositoryTaller repositoryTaller;
    private final RepositoryInscripcionTaller repositoryInscripcionTaller;
    private final RepositoryUsuario repositoryUsuario;
    private final RepositoryCertificacion repositoryCertificacion;
    private final RepositoryNotificacion repositoryNotificacion;

    @Override
    public List<Taller> listarTalleres() {
        return repositoryTaller.findAll();
    }

    @Override
    public Optional<Taller> buscarPorId(Long id) {
        return repositoryTaller.findById(id);
    }

    @Override
    public Taller guardar(Taller taller) {
        return repositoryTaller.save(taller);
    }

    @Override
    public Taller actualizar(Long id, Taller taller) {

        Taller tallerExistente = repositoryTaller.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Taller no encontrado con id: " + id));

        tallerExistente.setNombre(taller.getNombre());
        tallerExistente.setDescripcion(taller.getDescripcion());
        tallerExistente.setFecha(taller.getFecha());
        tallerExistente.setHoraInicio(taller.getHoraInicio());
        tallerExistente.setHoraFin(taller.getHoraFin());
        tallerExistente.setAforo(taller.getAforo());
        tallerExistente.setTipoCertificacion(
                taller.getTipoCertificacion());

        return repositoryTaller.save(tallerExistente);
    }

    @Override
    public void desactivar(Long id) {

        Taller taller = repositoryTaller.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Taller no encontrado con id: " + id));

        taller.setEstado(EstadoTaller.CANCELADO);

        repositoryTaller.save(taller);
    }

    @Override
    public void iniciarTaller(Long id) {

        Taller taller = repositoryTaller.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Taller no encontrado con id: " + id));

        if (taller.getEstado() != EstadoTaller.PROGRAMADO) {
            throw new RuntimeException(
                    "El taller no se encuentra en estado PROGRAMADO");
        }

        long confirmadas =
                repositoryInscripcionTaller
                        .countByTallerIdtallerAndEstado(
                                id,
                                EstadoInscripcion.CONFIRMADA);

        if (confirmadas < taller.getAforo()) {
            long faltantes = taller.getAforo() - confirmadas;
            System.out.println("Aforo incompleto. Faltan" + faltantes + " operarios confirmados.");
        }

        taller.setEstado(EstadoTaller.EN_CURSO);

        repositoryTaller.save(taller);
    }
    @Override
    public List<Usuario> buscarOperariosDisponibles(Long idTaller) {

        Taller taller = repositoryTaller.findById(idTaller)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Taller no encontrado con id: " + idTaller));

        Long idTipoCertificacion =
                taller.getTipoCertificacion().getIdTipoCertificacion();

        List<Usuario> operarios =
                repositoryUsuario.findByRolNombre("OPERARIO");

        return operarios.stream()
                .filter(usuario ->
                        !repositoryCertificacion
                                .findByUsuarioIdusuarioAndTipoCertificacionIdTipoCertificacionAndEstado(
                                        usuario.getIdusuario(),
                                        idTipoCertificacion,
                                        EstadoCertificacion.VIGENTE)
                                .isPresent())
                .filter(usuario ->
                        !repositoryInscripcionTaller
                                .existsByTallerIdtallerAndUsuarioIdusuarioAndEstadoNot(
                                        idTaller,
                                        usuario.getIdusuario(),
                                        EstadoInscripcion.CANCELADA))
                .collect(Collectors.toList());
    }

    @Override
    public void revisarAforo(Long id) {

        Taller taller = repositoryTaller.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Taller no encontrado con id: " + id));

        if (taller.getEstado() != EstadoTaller.PROGRAMADO) {
            return;
        }

        long confirmadas =
                repositoryInscripcionTaller
                        .countByTallerIdtallerAndEstado(
                                id,
                                EstadoInscripcion.CONFIRMADA);

        if (confirmadas >= taller.getAforo()) {
            return;
        }

        long faltantes = taller.getAforo() - confirmadas;

        List<Usuario> disponibles =
                buscarOperariosDisponibles(id);

        System.out.println(
                "Taller: " + taller.getNombre()
                        + " | Aforo: " + taller.getAforo()
                        + " | Confirmadas: " + confirmadas
                        + " | Faltantes: " + faltantes
                        + " | Operarios disponibles: "
                        + disponibles.size()
        );

        for (Usuario usuario : disponibles) {

            InscripcionTaller inscripcion =
                    new InscripcionTaller();

            inscripcion.setTaller(taller);
            inscripcion.setUsuario(usuario);
            inscripcion.setEstado(
                    EstadoInscripcion.PENDIENTE);
            inscripcion.setEstadoTipoProgramacion(
                    EstadoTipoProgramacion.COLA);
            inscripcion.setFechaInscripcion(
                    new Date(System.currentTimeMillis()));

            repositoryInscripcionTaller.save(inscripcion);
        }

        // Verificar si ya existe una notificación
        boolean notificacionExiste =
                repositoryNotificacion.existsByTallerIdtallerAndTipo(
                        id,
                        EstadoTipoNotificacion.FALTA_AFORO);

        // Solo crearla si todavía no existe
        if (!notificacionExiste) {

            List<Usuario> administradores =
                    repositoryUsuario.findByRolNombre("ADMIN");

            for (Usuario administrador : administradores) {

                Notificacion notificacion =
                        new Notificacion();

                notificacion.setMensaje(
                        "Falta aforo para el taller "
                                + taller.getNombre()
                                + ". Faltan "
                                + faltantes
                                + " operarios confirmados."
                );

                notificacion.setTipo(
                        EstadoTipoNotificacion.FALTA_AFORO);

                notificacion.setLeida(false);

                notificacion.setFecha(
                        LocalDateTime.now());

                notificacion.setUsuario(administrador);

                notificacion.setTaller(taller);

                repositoryNotificacion.save(notificacion);
            }
        }
    }
}
