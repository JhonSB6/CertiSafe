package com.CertiSafe.secu.Repository;

import com.CertiSafe.secu.Dto.HistorialCertificacionDTO;
import com.CertiSafe.secu.Entity.HistorialCertificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RepositoryHistorialCertificacion extends JpaRepository<HistorialCertificacion, Long> {

    @Query("""
        SELECT new com.CertiSafe.secu.Dto.HistorialCertificacionDTO(
            h.idhistorial,
            CONCAT(u.nombre, ' ', u.apellido),
            u.documento,
            tc.nombre,
            c.fechaExpedicion,
            c.fechaVigencia,
            c.estado,
            t.nombre
        )
        FROM HistorialCertificacion h
        JOIN h.certificacion c
        JOIN c.usuario u
        JOIN c.tipoCertificacion tc
        JOIN c.asistencia a
        JOIN a.taller t
        ORDER BY c.fechaExpedicion DESC
    """)
    List<HistorialCertificacionDTO> listarHistorialCompleto();
}