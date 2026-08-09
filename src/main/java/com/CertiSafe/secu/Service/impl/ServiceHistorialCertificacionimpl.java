package com.CertiSafe.secu.Service.impl;
import com.CertiSafe.secu.Entity.HistorialCertificacion;
import com.CertiSafe.secu.Enum.EstadoCertificacion;
import com.CertiSafe.secu.Repository.RepositoryHistorialCertificacion;
import com.CertiSafe.secu.Service.ServiceHistorialCertificacion;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor

public class ServiceHistorialCertificacionimpl implements ServiceHistorialCertificacion {
    private final RepositoryHistorialCertificacion repositoryHistorialCertificacion;

    @Override
    public List<HistorialCertificacion> listarCertificaciones(){
        return repositoryHistorialCertificacion.findAll();
    }

    @Override
    public Optional<HistorialCertificacion> buscarPorId(Long id){
        return repositoryHistorialCertificacion.findById(id);
    }

    @Override
    public HistorialCertificacion guardar(HistorialCertificacion historialCertificacion){
        return repositoryHistorialCertificacion.save(historialCertificacion);
    }

    @Override
    public HistorialCertificacion actualizar(Long id, HistorialCertificacion historialCertificacion){
        HistorialCertificacion existente =  repositoryHistorialCertificacion.findById(id).orElseThrow(() ->
                new RuntimeException(
                        "Certificación no encontrada con id: " + id));
        existente.setNombre(historialCertificacion.getNombre());
        existente.setFechaExpedicion(historialCertificacion.getFechaExpedicion());
        existente.setFechaVigencia(
                historialCertificacion.getFechaVigencia());
        existente.setEstado(historialCertificacion.getEstado());
        existente.setEstado(historialCertificacion.getEstado());
        return repositoryHistorialCertificacion.save(existente);
    }

    @Override
    public void estado(Long id){
        HistorialCertificacion certificacion =
                repositoryHistorialCertificacion.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Certificación no encontrada con id: "+ id));

        certificacion.setEstado(
                EstadoCertificacion.VIGENTE
        );

        repositoryHistorialCertificacion.save(certificacion);
    }
}
