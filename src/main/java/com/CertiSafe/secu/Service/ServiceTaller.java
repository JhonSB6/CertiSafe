package com.CertiSafe.secu.Service;

import com.CertiSafe.secu.Entity.Taller;

import java.util.List;
import java.util.Optional;

public interface ServiceTaller {
    List<Taller> listarTalleres();

    Optional<Taller> buscarPorId(Long id);

    Taller guardar(Taller taller);

    Taller actualizar(Long id, Taller taller);

    void desactivar(Long id);
}
