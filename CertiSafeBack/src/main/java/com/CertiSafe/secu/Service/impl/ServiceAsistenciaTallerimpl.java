package com.CertiSafe.secu.Service.impl;
import com.CertiSafe.secu.Entity.AsistenciaTaller;
import com.CertiSafe.secu.Enum.EstadoAsistencia;
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
}
