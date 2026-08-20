package com.CertiSafe.secu.Service.impl;
import com.CertiSafe.secu.Entity.AsistenciaTaller;
import com.CertiSafe.secu.Enum.EstadoAsistencia;
import com.CertiSafe.secu.Enum.EstadoDecisionCertificacion;
import com.CertiSafe.secu.Service.ServiceAsistenciaTaller;
import com.CertiSafe.secu.Repository.RepositoryAsistenciaTaller;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor

public class ServiceAsistenciaTallerimpl implements ServiceAsistenciaTaller{
    private final RepositoryAsistenciaTaller repositoryAsistenciaTaller;

    @Override
    public List<AsistenciaTaller> listarAsistencias(){
        return repositoryAsistenciaTaller.findAll();
    }

    @Override
    public Optional<AsistenciaTaller> buscarPorId(Long id){
        return repositoryAsistenciaTaller.findById(id);
    }

    @Override
    public AsistenciaTaller guardar(AsistenciaTaller asistenciaTaller){
        return repositoryAsistenciaTaller.save(asistenciaTaller);
    }

    @Override
    public AsistenciaTaller actualizar(Long id, AsistenciaTaller asistenciaTaller){
        AsistenciaTaller existente = repositoryAsistenciaTaller.findById(id)
                .orElseThrow(() -> new RuntimeException("Asistencia no encontrado" + id));
        existente.setFechainicio(asistenciaTaller.getFechainicio());
        existente.setFechafin(asistenciaTaller.getFechafin());
        existente.setEstado(asistenciaTaller.getEstado());
        return repositoryAsistenciaTaller.save(existente);
    }

    @Override
    public void registrarAusencia(Long id){
        AsistenciaTaller asistencia = repositoryAsistenciaTaller.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Asistencia no encontrada con id: " + id));

        asistencia.setEstado(EstadoAsistencia.AUSENTE);

        repositoryAsistenciaTaller.save(asistencia);
    }
    @Override
    public List<AsistenciaTaller> listarPorTaller(
            Long idTaller,
            EstadoAsistencia estado) {

        return repositoryAsistenciaTaller
                .findByTallerIdtallerAndEstado(
                        idTaller,
                        estado
                );
    }
    @Override
    public void decidirCertificacion(
            Long id,
            EstadoDecisionCertificacion decision) {

        AsistenciaTaller asistencia =
                repositoryAsistenciaTaller.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Asistencia no encontrada con id: " + id
                                )
                        );

        if (asistencia.getEstado() != EstadoAsistencia.PRESENTE) {

            throw new RuntimeException(
                    "Solo se puede tomar una decisión sobre operarios presentes"
            );
        }

        if (asistencia.getDecisionCertificacion() != null) {

            throw new RuntimeException(
                    "Ya se tomó una decisión sobre esta certificación"
            );
        }

        asistencia.setDecisionCertificacion(decision);

        repositoryAsistenciaTaller.save(asistencia);
    }

}
