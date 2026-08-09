package com.CertiSafe.secu.Entity;

import com.CertiSafe.secu.Enum.EstadoCertificacion;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data

@Table(name = "historial_certificacion")
public class HistorialCertificacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historial")
    private Long idhistorial;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private java.sql.Date fechaExpedicion;

    @Column(nullable = false)
    private java.sql.Date fechaVigencia;

    @Enumerated(EnumType.STRING)
    private EstadoCertificacion estado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_certificacion", nullable = false)
    private Certificacion certificacion;

}
