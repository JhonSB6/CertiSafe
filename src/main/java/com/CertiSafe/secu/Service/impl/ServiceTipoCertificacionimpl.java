package com.CertiSafe.secu.Service.impl;
import com.CertiSafe.secu.Entity.TipoCertificacion;
import com.CertiSafe.secu.Service.ServiceTipoCertificacion;
import com.CertiSafe.secu.Repository.RepositoryTipoCertificacion;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ServiceTipoCertificacionimpl implements ServiceTipoCertificacion {
    private final RepositoryTipoCertificacion repositoryTipoCertificacion;

    @Override
    public List<TipoCertificacion> listarTipo() {
        return repositoryTipoCertificacion.findAll();
    }

    @Override
    public Optional<TipoCertificacion> buscarTipo(Long id) {
        return repositoryTipoCertificacion.findById(id);
    }

    @Override
    public TipoCertificacion guardar(TipoCertificacion tipoCertificacion) {
        return repositoryTipoCertificacion.save(tipoCertificacion);
    }

    @Override
    public TipoCertificacion actualizar(Long id, TipoCertificacion tipoCertificacion) {
        TipoCertificacion existente = repositoryTipoCertificacion.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Tipo de certifi no encon" + id));
                existente.setNombre(tipoCertificacion.getNombre());

                return  repositoryTipoCertificacion.save(existente);
    }
    public void eliminar(Long id) {
        TipoCertificacion existente = repositoryTipoCertificacion.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Tipo de certificacion no encontrado con id: " + id));

        repositoryTipoCertificacion.delete(existente);
    }
}
