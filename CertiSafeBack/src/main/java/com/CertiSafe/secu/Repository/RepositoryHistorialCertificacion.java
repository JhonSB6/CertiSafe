package com.CertiSafe.secu.Repository;

import com.CertiSafe.secu.Dto.HistorialCertificacionDTO;
import com.CertiSafe.secu.Entity.HistorialCertificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface RepositoryHistorialCertificacion
        extends JpaRepository<HistorialCertificacion, Long> {

    @Query("""
        SELECT new com.CertiSafe.secu.Dto.HistorialCertificacionDTO(
            h.idhistorial,

            CONCAT(u.nombre, ' ', u.apellido),

            u.documento,

            tc.nombre,

            c.fechaExpedicion,

            c.fechaVigencia,

            c.estado,

            t.nombre,

            h.decision,

            h.motivoNoCertificacion
        )

        FROM HistorialCertificacion h

        JOIN h.asistencia a
        JOIN a.usuario u
        JOIN a.taller t
        JOIN t.tipoCertificacion tc

        LEFT JOIN h.certificacion c

        ORDER BY a.fechainicio DESC
    """)
    List<HistorialCertificacionDTO> listarHistorialCompleto();

    Optional<HistorialCertificacion>
    findByAsistenciaIdasistencia(
            Long idAsistencia
    );
}