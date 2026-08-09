package com.CertiSafe.secu.Service;
import com.CertiSafe.secu.Entity.TipoCertificacion;

import java.util.*;

public interface ServiceTipoCertificacion {
    List<TipoCertificacion> listarTipo();

    Optional<TipoCertificacion> buscarTipo(Long id);

    TipoCertificacion guardar(TipoCertificacion tipoCertificacion);

    TipoCertificacion actualizar(Long id, TipoCertificacion tipoCertificacion);

    void eliminar(Long id);


}
