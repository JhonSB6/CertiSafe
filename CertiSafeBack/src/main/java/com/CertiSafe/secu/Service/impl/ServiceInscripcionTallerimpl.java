package com.CertiSafe.secu.Service.impl;

import com.CertiSafe.secu.Entity.InscripcionTaller;
import com.CertiSafe.secu.Enum.EstadoInscripcion;
import com.CertiSafe.secu.Repository.RepositoryCertificacion;
import com.CertiSafe.secu.Repository.RepositoryInscripcionTaller;
import com.CertiSafe.secu.Repository.RepositoryTaller;
import com.CertiSafe.secu.Repository.RepositoryUsuario;
import com.CertiSafe.secu.Service.ServiceInscripcionTaller;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.CertiSafe.secu.Entity.Taller;
import com.CertiSafe.secu.Entity.Usuario;
import com.CertiSafe.secu.Enum.EstadoCertificacion;
import com.CertiSafe.secu.Enum.EstadoTipoProgramacion;
import java.sql.Date;

import java.util.Optional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceInscripcionTallerimpl implements ServiceInscripcionTaller {
    private final RepositoryInscripcionTaller inscripcionRepository;
    private final RepositoryTaller repositoryTaller;
    private final RepositoryUsuario repositoryUsuario;
    private final RepositoryCertificacion repositoryCertificacion;

    @Override
    public List<InscripcionTaller> listarInscripciones() {
        return inscripcionRepository.findAll();
    }

    @Override
    public Optional<InscripcionTaller> buscarPorId(Long id) {
        return inscripcionRepository.findById(id);
    }

    @Override
    public InscripcionTaller guardar(InscripcionTaller inscripcion) {
        inscripcion.setEstado(EstadoInscripcion.PENDIENTE);
        return inscripcionRepository.save(inscripcion);
    }

    @Override
    public InscripcionTaller actualizar(Long id, InscripcionTaller inscripcion) {

        InscripcionTaller existente = inscripcionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Inscripción no encontrada con id: " + id));
        existente.setFechaInscripcion(inscripcion.getFechaInscripcion());
        existente.setUsuario(inscripcion.getUsuario());
        existente.setTaller(inscripcion.getTaller());

        return inscripcionRepository.save(existente);
    }

    @Override
    public void confirmarInscripcion(Long id) {

        InscripcionTaller inscripcion =
                inscripcionRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Inscripción no encontrada con id: " + id));

        if (inscripcion.getEstado() != EstadoInscripcion.PENDIENTE) {
            throw new RuntimeException(
                    "La inscripción no está pendiente de confirmación");
        }

        Taller taller = inscripcion.getTaller();

        long confirmadas =
                inscripcionRepository
                        .countByTallerIdtallerAndEstado(
                                taller.getIdtaller(),
                                EstadoInscripcion.CONFIRMADA);

        if (confirmadas >= taller.getAforo()) {
            throw new RuntimeException(
                    "El aforo del taller ya está completo");
        }

        inscripcion.setEstado(EstadoInscripcion.CONFIRMADA);

        inscripcionRepository.save(inscripcion);
    }

    @Override
    public void cancelarInscripcion(Long id) {

        InscripcionTaller inscripcion = inscripcionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Inscripción no encontrada con id: " + id));

        if (inscripcion.getEstado() == EstadoInscripcion.CANCELADA) {
            throw new RuntimeException(
                    "La inscripción ya se encuentra cancelada");
        }
        inscripcion.setEstado(com.CertiSafe.secu.Enum.EstadoInscripcion.CANCELADA);

        inscripcionRepository.save(inscripcion);
    }

    @Override
    public void programarOperario(
            Long idTaller,
            Long idUsuario,
            EstadoTipoProgramacion tipoProgramacion) {

        Taller taller = repositoryTaller.findById(idTaller)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Taller no encontrado con id: " + idTaller));

        Usuario usuario = repositoryUsuario.findById(idUsuario)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Usuario no encontrado con id: " + idUsuario));

        if (!usuario.getRol().getNombre().equalsIgnoreCase("OPERARIO")) {
            throw new RuntimeException(
                    "El usuario seleccionado no es un operario");
        }

        Long idTipoCertificacion =
                taller.getTipoCertificacion()
                        .getIdTipoCertificacion();

        boolean tieneCertificacionVigente =
                repositoryCertificacion
                        .findByUsuarioIdusuarioAndTipoCertificacionIdTipoCertificacionAndEstado(
                                idUsuario,
                                idTipoCertificacion,
                                EstadoCertificacion.VIGENTE)
                        .isPresent();

        if (tieneCertificacionVigente) {
            throw new RuntimeException(
                    "El operario ya tiene la certificación vigente para este taller");
        }

        boolean yaEstaInscrito =
                inscripcionRepository
                        .existsByTallerIdtallerAndUsuarioIdusuarioAndEstadoNot(
                                idTaller,
                                idUsuario,
                                EstadoInscripcion.CANCELADA);

        if (yaEstaInscrito) {
            throw new RuntimeException(
                    "El operario ya tiene una inscripción activa en este taller");
        }

        InscripcionTaller inscripcion = new InscripcionTaller();

        inscripcion.setTaller(taller);
        inscripcion.setUsuario(usuario);
        inscripcion.setFechaInscripcion(new Date(System.currentTimeMillis()));
        inscripcion.setEstado(EstadoInscripcion.PENDIENTE);
        inscripcion.setEstadoTipoProgramacion(tipoProgramacion);

        inscripcionRepository.save(inscripcion);
    }

}
