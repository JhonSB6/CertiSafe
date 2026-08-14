package com.CertiSafe.secu.Service;
import com.CertiSafe.secu.Dto.RespuestaAccesoProduccion;
import com.CertiSafe.secu.Entity.IngresoProduccion;
import java.util.*;

public interface ServiceIngresoProduccion {
    List<IngresoProduccion> listarIngresos();

    Optional<IngresoProduccion> buscarPorId(Long id);

    IngresoProduccion guardar(IngresoProduccion ingreso);

    IngresoProduccion actualizar(Long id, IngresoProduccion ingreso);

    void autorizar(Long id);

    void rechazar(Long id);

    RespuestaAccesoProduccion verificarAcceso(Long idUsuario);

    RespuestaAccesoProduccion solicitarIngreso(Long idUsuario);

}
