package com.CertiSafe.secu.Service.impl;
import com.CertiSafe.secu.Dto.HistorialCertificacionDTO;
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
    public List<HistorialCertificacionDTO> listarHistorialCompleto() {
        return repositoryHistorialCertificacion.listarHistorialCompleto();
    }

}
