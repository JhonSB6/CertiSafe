package com.CertiSafe.secu.Service;
import com.CertiSafe.secu.Entity.Certificacion;
import java.util.*;

public interface ServiceCertificacion {
    List<Certificacion> listarCertificacion();

    Optional<Certificacion> buscarCertificacion(Long id);

    Certificacion guardar(Certificacion certificacion);

    Certificacion actualizar(Long id, Certificacion certificacion);

    void eliminar(Long id);
}
