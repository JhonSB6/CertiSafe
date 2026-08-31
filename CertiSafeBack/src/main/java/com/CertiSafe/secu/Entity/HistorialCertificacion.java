package com.CertiSafe.secu.Entity;

import com.CertiSafe.secu.Enum.EstadoCertificacion;
import com.CertiSafe.secu.Enum.EstadoDecisionCertificacion;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@Table(name = "historial_certificacion")
public class HistorialCertificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historial")
    private Long idhistorial;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_certificacion")
    private Certificacion certificacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_asistencia", nullable = false)
    private AsistenciaTaller asistencia;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoDecisionCertificacion decision;

    @Column(name = "motivo_no_certificacion", length = 500)
    private String motivoNoCertificacion;
}