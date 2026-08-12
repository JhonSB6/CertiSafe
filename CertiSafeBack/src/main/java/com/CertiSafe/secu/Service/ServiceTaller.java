package com.CertiSafe.secu.Service;

import com.CertiSafe.secu.Entity.InscripcionTaller;
import com.CertiSafe.secu.Entity.Taller;
import com.CertiSafe.secu.Entity.Usuario;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface ServiceTaller {
    List<Taller> listarTalleres();

    Optional<Taller> buscarPorId(Long id);

    Taller guardar(Taller taller);

    Taller actualizar(Long id, Taller taller);

    void iniciarTaller(Long id, boolean forzarInicio);

    void desactivar(Long id);

    List<Usuario> buscarOperariosDisponibles(Long idTaller);

    void revisarAforo(Long id);

    Map<String, Object> obtenerResumen(Long idTaller);
}
