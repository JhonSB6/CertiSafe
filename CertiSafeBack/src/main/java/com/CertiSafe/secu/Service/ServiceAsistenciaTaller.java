package com.CertiSafe.secu.Service;

import com.CertiSafe.secu.Entity.AsistenciaTaller;
import com.CertiSafe.secu.Enum.EstadoAsistencia;

import java.util.*;

public interface ServiceAsistenciaTaller {
    List<AsistenciaTaller> listarAsistencias();

    Optional<AsistenciaTaller> buscarPorId(Long id);

    AsistenciaTaller guardar(AsistenciaTaller asistencia);

    AsistenciaTaller actualizar(Long id, AsistenciaTaller asistencia);

    void registrarAusencia(Long id);

    List<AsistenciaTaller> listarPorTaller(Long idTaller, EstadoAsistencia estado);
}
