package com.CertiSafe.secu.Repository;

import com.CertiSafe.secu.Enum.EstadoTaller;
import com.CertiSafe.secu.Entity.Taller;
import com.CertiSafe.secu.Entity.TipoCertificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface RepositoryTaller extends JpaRepository<Taller, Long> {

    Optional<TipoCertificacion> findByNombre(String nombre);

    List<Taller> findByCapacitadorIdusuarioAndEstado(
            Long idCapacitador,
            EstadoTaller estado);

    /**
     * Busca talleres del mismo capacitador, en la misma fecha,
     * cuyos horarios entren en conflicto con el nuevo horario.
     *
     * El margen requerido entre talleres es de 30 minutos.
     *
     * Se consideran únicamente talleres PROGRAMADOS y EN_CURSO.
     */
    @Query("""
        SELECT t
        FROM Taller t
        WHERE t.capacitador.idusuario = :idCapacitador
        AND t.fecha = :fecha
        AND t.estado IN :estados
        AND (:idTallerExcluir IS NULL OR t.idtaller <> :idTallerExcluir)
        AND t.horaInicio < :horaFinConMargen
        AND t.horaFin > :horaInicioConMargen
    """)
    List<Taller> buscarConflictosCapacitador(
            @Param("idCapacitador") Long idCapacitador,
            @Param("fecha") java.time.LocalDate fecha,
            @Param("horaInicioConMargen") LocalTime horaInicioConMargen,
            @Param("horaFinConMargen") LocalTime horaFinConMargen,
            @Param("estados") List<EstadoTaller> estados,
            @Param("idTallerExcluir") Long idTallerExcluir);
}
