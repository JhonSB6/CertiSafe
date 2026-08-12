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
import java.util.*;
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
    public void iniciarTaller(Long id, boolean forzarInicio) {

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

        if (confirmadas < taller.getAforo() && !forzarInicio) {

            long faltantes =
                    taller.getAforo() - confirmadas;

            throw new RuntimeException(
                    "No se puede iniciar el taller. "
                            + "Faltan "
                            + faltantes
                            + " operarios confirmados."
            );
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
                repositoryUsuario.findByRolNombre("OPERARIO", EstadoUsuario.ACTIVO);

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

        // Solo revisamos talleres que todavía están programados
        if (taller.getEstado() != EstadoTaller.PROGRAMADO) {
            return;
        }

        long confirmadas =
                repositoryInscripcionTaller
                        .countByTallerIdtallerAndEstado(
                                id,
                                EstadoInscripcion.CONFIRMADA);

        long faltantes = taller.getAforo() - confirmadas;

        // ==========================================
        // AFORO COMPLETO
        // ==========================================

        if (faltantes <= 0) {
            return;
        }

        // ==========================================
        // BUSCAR TODOS LOS OPERARIOS DISPONIBLES
        // ==========================================

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

        // ==========================================
        // PROGRAMAR TODOS LOS DISPONIBLES
        // ==========================================

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

        // ==========================================
        // NOTIFICACIÓN AL ADMINISTRADOR
        // ==========================================

        boolean notificacionExiste =
                repositoryNotificacion
                        .existsByTallerIdtallerAndTipo(
                                id,
                                EstadoTipoNotificacion.FALTA_AFORO);

        if (!notificacionExiste) {

            List<Usuario> administradores =
                    repositoryUsuario
                            .findByRolNombre(
                                    "ADMIN",
                                    EstadoUsuario.ACTIVO);

            for (Usuario administrador : administradores) {

                Notificacion notificacion =
                        new Notificacion();

                notificacion.setMensaje(
                        "El taller "
                                + taller.getNombre()
                                + " tiene el aforo incompleto. "
                                + "Aforo requerido: "
                                + taller.getAforo()
                                + ". Confirmados: "
                                + confirmadas
                                + ". Faltan: "
                                + faltantes
                                + "."
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

                repositoryNotificacion.save(
                        notificacion);
            }
        }
    }
    @Override
    public Map<String, Object> obtenerResumen(Long idTaller) {

        Taller taller = repositoryTaller.findById(idTaller)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Taller no encontrado con id: " + idTaller));

        long programados =
                repositoryInscripcionTaller
                        .countInscripcionesActivas(idTaller);

        long confirmados =
                repositoryInscripcionTaller
                        .countByTallerIdtallerAndEstado(
                                idTaller,
                                EstadoInscripcion.CONFIRMADA);

        long pendientes =
                repositoryInscripcionTaller
                        .countByTallerIdtallerAndEstado(
                                idTaller,
                                EstadoInscripcion.PENDIENTE);

        Map<String, Object> resumen = new HashMap<>();

        resumen.put("aforo", taller.getAforo());
        resumen.put("programados", programados);
        resumen.put("confirmados", confirmados);
        resumen.put("pendientes", pendientes);

        return resumen;
    }
}
