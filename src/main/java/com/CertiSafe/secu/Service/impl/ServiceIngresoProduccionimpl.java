package com.CertiSafe.secu.Service.impl;
import com.CertiSafe.secu.Entity.IngresoProduccion;
import com.CertiSafe.secu.Enum.EstadoIngreso;
import com.CertiSafe.secu.Service.ServiceIngresoProduccion;
import com.CertiSafe.secu.Repository.RepositoryIngresoProduccion;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ServiceIngresoProduccionimpl implements ServiceIngresoProduccion {
    private final RepositoryIngresoProduccion repositoryIngresoProduccion;

    @Override
    public List<IngresoProduccion> listarIngresos() {
        return repositoryIngresoProduccion.findAll();
    }

    @Override
    public Optional<IngresoProduccion> buscarPorId(Long id) {
        return repositoryIngresoProduccion.findById(id);
    }

    @Override
    public IngresoProduccion guardar(IngresoProduccion ingreso) {

        ingreso.setAutorizar(EstadoIngreso.PENDIENTE);

        return repositoryIngresoProduccion.save(ingreso);
    }

    @Override
    public IngresoProduccion actualizar(Long id, IngresoProduccion ingreso) {

        IngresoProduccion existente = repositoryIngresoProduccion.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Ingreso no encontrado con id: " + id));

        existente.setNombre(ingreso.getNombre());
        existente.setFechaingreso(ingreso.getFechaingreso());
        existente.setFechasalida(ingreso.getFechasalida());
        existente.setUsuario(ingreso.getUsuario());
        existente.setHistorial(ingreso.getHistorial());
        return repositoryIngresoProduccion.save(existente);
    }

    @Override
    public void autorizar(Long id){
        IngresoProduccion ingresoProduccion = repositoryIngresoProduccion.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Ingreso no encontrado con id: " + id));
        ingresoProduccion.setAutorizar(EstadoIngreso.AUTORIZADO);

        repositoryIngresoProduccion.save(ingresoProduccion);
    }
    @Override
    public void rechazar(Long id){
        IngresoProduccion ingresoProduccion = repositoryIngresoProduccion.findById(id)
                .orElseThrow(() -> new RuntimeException("Ingreso no encotrado con id: " + id));
        ingresoProduccion.setAutorizar(EstadoIngreso.RECHAZADO);
    }
}
