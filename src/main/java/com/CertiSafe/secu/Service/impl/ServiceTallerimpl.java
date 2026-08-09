package com.CertiSafe.secu.Service.impl;

import com.CertiSafe.secu.Entity.Taller;
import com.CertiSafe.secu.Enum.EstadoInscripcion;
import com.CertiSafe.secu.Enum.EstadoTaller;
import com.CertiSafe.secu.Repository.RepositoryInscripcionTaller;
import com.CertiSafe.secu.Repository.RepositoryTaller;
import com.CertiSafe.secu.Service.ServiceTaller;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ServiceTallerimpl implements ServiceTaller {

    private final RepositoryTaller repositoryTaller;
    private final RepositoryInscripcionTaller repositoryInscripcionTaller;

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

        taller.setEstado(EstadoTaller.PROGRAMADO);

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

        return repositoryTaller.save(tallerExistente);
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
            throw new RuntimeException(
                    "El aforo del taller no está completo. " +
                            "Confirmados: " + confirmadas +
                            " / Aforo: " + taller.getAforo());
        }

        taller.setEstado(EstadoTaller.EN_CURSO);

        repositoryTaller.save(taller);
    }

    @Override
    public void finalizarTaller(Long id) {

        Taller taller = repositoryTaller.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Taller no encontrado con id: " + id));

        if (taller.getEstado() != EstadoTaller.EN_CURSO) {
            throw new RuntimeException(
                    "El taller no se encuentra EN_CURSO");
        }

        taller.setEstado(EstadoTaller.FINALIZADO);

        repositoryTaller.save(taller);
    }

    @Override
    public void cancelar(Long id) {

        Taller taller = repositoryTaller.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Taller no encontrado con id: " + id));

        if (taller.getEstado() == EstadoTaller.FINALIZADO) {
            throw new RuntimeException(
                    "No se puede cancelar un taller finalizado");
        }

        taller.setEstado(EstadoTaller.CANCELADO);

        repositoryTaller.save(taller);
    }
}
