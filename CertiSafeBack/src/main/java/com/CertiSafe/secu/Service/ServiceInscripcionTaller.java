package com.CertiSafe.secu.Service;

import com.CertiSafe.secu.Entity.InscripcionTaller;
import com.CertiSafe.secu.Enum.EstadoTipoProgramacion;

import java.util.List;
import java.util.Optional;

public interface ServiceInscripcionTaller {
    List<InscripcionTaller> listarInscripciones();

    Optional<InscripcionTaller> buscarPorId(Long id);

    InscripcionTaller guardar(InscripcionTaller inscripcion);

    InscripcionTaller actualizar(Long id, InscripcionTaller inscripcion);

    void confirmarInscripcion(Long id);

    void cancelarInscripcion(Long id);

    void programarOperario(Long idTaller, Long idUsuario, EstadoTipoProgramacion estadoTipoProgramacion);

    List<InscripcionTaller> listarPorUsuario(Long idUsuario);
}
