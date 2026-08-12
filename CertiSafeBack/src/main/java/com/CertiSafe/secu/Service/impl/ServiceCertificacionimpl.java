package com.CertiSafe.secu.Service.impl;
import com.CertiSafe.secu.Entity.*;
import com.CertiSafe.secu.Enum.EstadoAsistencia;
import com.CertiSafe.secu.Enum.EstadoCertificacion;

import com.CertiSafe.secu.Enum.EstadoTaller;
import com.CertiSafe.secu.Repository.*;
import com.CertiSafe.secu.Service.ServiceCertificacion;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ServiceCertificacionimpl implements ServiceCertificacion{

    private final RepositoryCertificacion repositoryCertificacion;
    private final RepositoryTaller repositoryTaller;
    private final RepositoryAsistenciaTaller repositoryAsistenciaTaller;
    private final RepositoryUsuario repositoryUsuario;
    private final RepositoryHistorialCertificacion repositoryHistorialCertificacion;

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
    @Override
    public Certificacion certificarOperario(
            Long idTaller,
            Long idAsistencia,
            Long idCapacitador) {

        Taller taller = repositoryTaller.findById(idTaller)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Taller no encontrado con id: " + idTaller));

        if (taller.getEstado() != EstadoTaller.FINALIZADO) {
            throw new RuntimeException(
                    "El taller todavía no ha finalizado");
        }

        if (taller.getCapacitador() == null ||
                !taller.getCapacitador()
                        .getIdusuario()
                        .equals(idCapacitador)) {

            throw new RuntimeException(
                    "El capacitador no está asignado a este taller");
        }

        AsistenciaTaller asistencia =
                repositoryAsistenciaTaller.findById(idAsistencia)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Asistencia no encontrada con id: "
                                                + idAsistencia));

        if (!asistencia.getTaller()
                .getIdtaller()
                .equals(idTaller)) {

            throw new RuntimeException(
                    "La asistencia no pertenece a este taller");
        }

        if (asistencia.getEstado() != EstadoAsistencia.PRESENTE) {
            throw new RuntimeException(
                    "El operario no tiene asistencia registrada como PRESENTE");
        }

        Usuario usuario = asistencia.getUsuario();

        Long idTipoCertificacion =
                taller.getTipoCertificacion()
                        .getIdTipoCertificacion();

        boolean yaTieneCertificacion =
                repositoryCertificacion
                        .findByUsuarioIdusuarioAndTipoCertificacionIdTipoCertificacionAndEstado(
                                usuario.getIdusuario(),
                                idTipoCertificacion,
                                EstadoCertificacion.VIGENTE)
                        .isPresent();

        if (yaTieneCertificacion) {
            throw new RuntimeException(
                    "El operario ya tiene esta certificación vigente");
        }

        Certificacion certificacion = new Certificacion();

        certificacion.setNombre(
                taller.getTipoCertificacion().getNombre());

        certificacion.setFechaExpedicion(
                new java.sql.Date(System.currentTimeMillis()));

        certificacion.setFechaVigencia(
                new java.sql.Date(System.currentTimeMillis()));

        certificacion.setEstado(
                EstadoCertificacion.VIGENTE);

        certificacion.setAsistencia(asistencia);
        certificacion.setUsuario(usuario);
        certificacion.setTipoCertificacion(
                taller.getTipoCertificacion());

        Certificacion certificacionGuardada =
                repositoryCertificacion.save(certificacion);

        HistorialCertificacion historial =
                new HistorialCertificacion();

        historial.setCertificacion(certificacionGuardada);

        repositoryHistorialCertificacion.save(historial);

        return certificacionGuardada;
    }
}


