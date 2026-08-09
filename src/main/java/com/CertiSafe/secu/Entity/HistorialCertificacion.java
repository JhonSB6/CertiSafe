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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_certificacion", nullable = false)
    private Certificacion certificacion;

}
