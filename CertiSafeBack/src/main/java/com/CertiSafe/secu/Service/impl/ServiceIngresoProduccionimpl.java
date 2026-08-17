package com.CertiSafe.secu.Service.impl;
import com.CertiSafe.secu.Dto.RespuestaAccesoProduccion;
import com.CertiSafe.secu.Entity.IngresoProduccion;
import com.CertiSafe.secu.Entity.Usuario;
import com.CertiSafe.secu.Enum.EstadoIngreso;
import com.CertiSafe.secu.Enum.EstadoUsuario;
import com.CertiSafe.secu.Repository.RepositoryUsuario;
import com.CertiSafe.secu.Service.ServiceCertificacion;
import com.CertiSafe.secu.Service.ServiceIngresoProduccion;
import com.CertiSafe.secu.Repository.RepositoryIngresoProduccion;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ServiceIngresoProduccionimpl implements ServiceIngresoProduccion {
    private final RepositoryIngresoProduccion repositoryIngresoProduccion;
    private final ServiceCertificacion serviceCertificacion;
    private final RepositoryUsuario repositoryUsuario;

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
        existente.setUsuario(ingreso.getUsuario());
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
        repositoryIngresoProduccion.save(ingresoProduccion);
    }
    @Override
    public RespuestaAccesoProduccion verificarAcceso(Long idUsuario) {

        List<String> faltantes = new ArrayList<>();

        if (!serviceCertificacion.estaCertificado(idUsuario, 1L)) {
            faltantes.add("Trabajo seguro en alturas");
        }

        if (!serviceCertificacion.estaCertificado(idUsuario, 2L)) {
            faltantes.add("Manejo seguro de productos químicos");
        }

        if (!serviceCertificacion.estaCertificado(idUsuario, 3L)) {
            faltantes.add("Seguridad en espacios confinados");
        }

        if (faltantes.isEmpty()) {

            return new RespuestaAccesoProduccion(
                    true,
                    "Acceso Concedido",
                    faltantes,
                    null
            );
        }

        return new RespuestaAccesoProduccion(
                false,
                "Acceso Denegado",
                faltantes,
                null
        );
    }

    @Override
    public RespuestaAccesoProduccion solicitarIngreso(Long idUsuario) {

        Usuario usuario = repositoryUsuario.findById(idUsuario)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Usuario no encontrado con id: " + idUsuario
                        )
                );

        if (usuario.getEstado() != EstadoUsuario.ACTIVO) {

            return new RespuestaAccesoProduccion(
                    false,
                    "Acceso Denegado. El operario está inactivo.",
                    new ArrayList<>(),
                    null
            );
        }

        RespuestaAccesoProduccion verificacion =
                verificarAcceso(idUsuario);

        if (!verificacion.isAcceso()) {
            return verificacion;
        }

        Optional<IngresoProduccion> ingresoExistente =
                repositoryIngresoProduccion
                        .findByUsuarioIdusuarioAndAutorizar(
                                idUsuario,
                                EstadoIngreso.AUTORIZADO
                        );

        if (ingresoExistente.isPresent()) {

            IngresoProduccion ingreso =
                    ingresoExistente.get();

            // Si el ingreso ya existe pero no tiene código,
            // generamos uno ahora.
            if (ingreso.getCodigoAcceso() == null ||
                    ingreso.getCodigoAcceso().isBlank()) {

                ingreso.setCodigoAcceso(
                        UUID.randomUUID().toString()
                );

                ingreso = repositoryIngresoProduccion.save(ingreso);
            }

            return new RespuestaAccesoProduccion(
                    true,
                    "Acceso Concedido",
                    new ArrayList<>(),
                    ingreso.getCodigoAcceso()
            );
        }

        // Crear nuevo ingreso autorizado
        IngresoProduccion ingreso =
                new IngresoProduccion();

        ingreso.setNombre(
                usuario.getNombre() + " " + usuario.getApellido()
        );

        ingreso.setUsuario(usuario);

        ingreso.setAutorizar(
                EstadoIngreso.AUTORIZADO
        );

        ingreso.setCodigoAcceso(
                UUID.randomUUID().toString()
        );

        IngresoProduccion guardado =
                repositoryIngresoProduccion.save(ingreso);

        return new RespuestaAccesoProduccion(
                true,
                "Acceso Concedido",
                new ArrayList<>(),
                guardado.getCodigoAcceso()
        );
    }
}
