package com.CertiSafe.secu.Repository;

import com.CertiSafe.secu.Enum.EstadoInscripcion;
import com.CertiSafe.secu.Enum.EstadoTipoProgramacion;
import com.CertiSafe.secu.Enum.EstadoTaller;
import com.CertiSafe.secu.Entity.InscripcionTaller;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface RepositoryInscripcionTaller
        extends JpaRepository<InscripcionTaller, Long> {

    Long countByTallerIdtallerAndEstado(
            Long idTaller,
            EstadoInscripcion estado);

    List<InscripcionTaller> findByTallerIdtallerAndEstado(
            Long idTaller,
            EstadoInscripcion estado);

    boolean existsByTallerIdtallerAndUsuarioIdusuarioAndEstadoNot(
            Long idTaller,
            Long idUsuario,
            EstadoInscripcion estado);

    List<InscripcionTaller> findByTallerIdtaller(Long idTaller);

    Long countByTallerIdtallerAndEstadoAndEstadoTipoProgramacion(
            Long idTaller,
            EstadoInscripcion estado,
            EstadoTipoProgramacion estadoTipoProgramacion);

    List<InscripcionTaller> findByUsuarioIdusuario(Long idUsuario);

    @Query("""
        SELECT COUNT(i)
        FROM InscripcionTaller i
        WHERE i.taller.idtaller = :idTaller
        AND i.estado <> com.CertiSafe.secu.Enum.EstadoInscripcion.CANCELADA
    """)
    Long countInscripcionesActivas(
            @Param("idTaller") Long idTaller);

    /**
     * Busca si un operario tiene otra inscripción CONFIRMADA
     * en un taller cuyo horario entra en conflicto.
     *
     * Se utiliza el margen de 30 minutos.
     */
    @Query("""
        SELECT i
        FROM InscripcionTaller i
        JOIN i.taller t
        WHERE i.usuario.idusuario = :idUsuario
        AND i.estado = com.CertiSafe.secu.Enum.EstadoInscripcion.CONFIRMADA
        AND t.fecha = :fecha
        AND t.estado IN :estadosTaller
        AND t.horaInicio < :horaFinConMargen
        AND t.horaFin > :horaInicioConMargen
    """)
    List<InscripcionTaller> buscarConflictosHorarioOperario(
            @Param("idUsuario") Long idUsuario,
            @Param("fecha") LocalDate fecha,
            @Param("horaInicioConMargen") LocalTime horaInicioConMargen,
            @Param("horaFinConMargen") LocalTime horaFinConMargen,
            @Param("estadosTaller") List<EstadoTaller> estadosTaller);

    void deleteByTallerIdtaller(Long idTaller);
}


