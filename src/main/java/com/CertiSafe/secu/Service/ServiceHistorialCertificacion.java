package com.CertiSafe.secu.Service;
import com.CertiSafe.secu.Entity.HistorialCertificacion;
import java.util.*;

public interface ServiceHistorialCertificacion {

    List<HistorialCertificacion> listarCertificaciones();

    Optional<HistorialCertificacion> buscarPorId(Long id);

    HistorialCertificacion guardar(HistorialCertificacion certificacion);

    HistorialCertificacion actualizar(Long id, HistorialCertificacion certificacion);

    void estado(Long id);

}
