package com.CertiSafe.secu.Service.impl;
import com.CertiSafe.secu.Entity.Certificacion;
import com.CertiSafe.secu.Service.ServiceCertificacion;
import com.CertiSafe.secu.Repository.RepositoryCertificacion;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ServiceCertificacionimpl implements ServiceCertificacion{
    private final RepositoryCertificacion repositoryCertificacion;

    @Override
    public List<Certificacion> listarCertificacion(){
        return repositoryCertificacion.findAll();
    }

    @Override
    public Optional<Certificacion> buscarCertificacion(Long id){
        return repositoryCertificacion.findById(id);
    }

    @Override
    public Certificacion guardar(Certificacion certificacion){
        return repositoryCertificacion.save(certificacion);
    }

    @Override
    public Certificacion actualizar(Long id, Certificacion certificacion) {

        Certificacion existente = repositoryCertificacion.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Certificacion no encontrada con id: " + id));

        existente.setNombre(certificacion.getNombre());
        existente.setFechaExpedicion(certificacion.getFechaExpedicion());
        existente.setFechaVigencia(certificacion.getFechaVigencia());
        existente.setEstado(certificacion.getEstado());
        existente.setUsuario(certificacion.getUsuario());
        existente.setTipoCertificacion(certificacion.getTipoCertificacion());
        existente.setAsistencia(certificacion.getAsistencia());

        return repositoryCertificacion.save(existente);
    }

    @Override
    public void eliminar(Long id) {

        Certificacion existente = repositoryCertificacion.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Certificacion no encontrada con id: " + id));

        repositoryCertificacion.delete(existente);
    }
}


