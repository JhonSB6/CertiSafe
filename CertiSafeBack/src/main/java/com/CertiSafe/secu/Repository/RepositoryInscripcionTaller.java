package com.CertiSafe.secu.Repository;

import com.CertiSafe.secu.Entity.InscripcionTaller;
import com.CertiSafe.secu.Enum.EstadoInscripcion;
import com.CertiSafe.secu.Enum.EstadoTipoProgramacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.*;

public interface RepositoryInscripcionTaller extends JpaRepository<InscripcionTaller, Long> {

    Long countByTallerIdtallerAndEstado(
            Long idTaller,
            EstadoInscripcion estado);

    List<InscripcionTaller> findByTallerIdtallerAndEstado(Long idTaller, EstadoInscripcion estado);

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
    AND i.estado <> com.CertiSafe.secu.Enum.EstadoInscripcion.CANCELADA""")
    Long countInscripcionesActivas(@Param("idTaller") Long idTaller);

    void deleteByTallerIdtaller(Long idTaller);
}
