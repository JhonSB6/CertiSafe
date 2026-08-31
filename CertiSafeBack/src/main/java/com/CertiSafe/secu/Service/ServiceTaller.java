package com.CertiSafe.secu.Service;

import com.CertiSafe.secu.Dto.DetalleTallerResponse;
import com.CertiSafe.secu.Entity.InscripcionTaller;
import com.CertiSafe.secu.Entity.Taller;
import com.CertiSafe.secu.Entity.Usuario;
import com.CertiSafe.secu.Enum.EstadoTaller;

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

    void revisarAforoTresMinutosAntes(Long idTaller);

    void revisarAforoUnMinutoAntes(Long idTaller);

    //void iniciarAutomaticamente(Long idTaller);

    Map<String, Object> obtenerResumen(Long idTaller);

    List<Taller> listarTalleresFinalizadosPorCapacitador(Long idCapacitador);

    List<Taller> listarPorCapacitador(Long idCapacitador,EstadoTaller estado);

    void finalizarTaller(Long idTaller);

    void eliminarTaller(Long idTaller);

    DetalleTallerResponse obtenerDetalleTaller(Long idTaller);
}
