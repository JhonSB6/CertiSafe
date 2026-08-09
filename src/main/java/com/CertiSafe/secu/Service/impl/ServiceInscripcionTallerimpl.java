package com.CertiSafe.secu.Service.impl;

import com.CertiSafe.secu.Entity.InscripcionTaller;
import com.CertiSafe.secu.Enum.EstadoInscripcion;
import com.CertiSafe.secu.Repository.RepositoryInscripcionTaller;
import com.CertiSafe.secu.Service.ServiceInscripcionTaller;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;
@Service
@RequiredArgsConstructor
public class ServiceInscripcionTallerimpl implements ServiceInscripcionTaller {
    private final RepositoryInscripcionTaller inscripcionRepository;

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
        existente.setEstado(inscripcion.getEstado());
        existente.setUsuario(inscripcion.getUsuario());
        existente.setTaller(inscripcion.getTaller());

        return inscripcionRepository.save(existente);
    }

    @Override
    public void confirmarInscripcion(Long id) {

        InscripcionTaller inscripcion =
                inscripcionRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Inscripción no encontrada con id: " + id));

        inscripcion.setEstado(EstadoInscripcion.CONFIRMADA);

        inscripcionRepository.save(inscripcion);
    }

    @Override
    public void cancelarInscripcion(Long id) {

        InscripcionTaller inscripcion = inscripcionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Inscripción no encontrada con id: " + id));

        inscripcion.setEstado(
                com.CertiSafe.secu.Enum.EstadoInscripcion.CANCELADA
        );

        inscripcionRepository.save(inscripcion);
    }
}
