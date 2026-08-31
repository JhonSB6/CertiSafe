package com.CertiSafe.secu.Entity;

import com.CertiSafe.secu.Enum.EstadoAsistencia;
import com.CertiSafe.secu.Enum.EstadoDecisionCertificacion;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@Table(name = "asistencia")
public class AsistenciaTaller {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_asistencia")
    private Long idasistencia;

    @Column(nullable = false)
    private java.sql.Date fechainicio;

    @Column(nullable = false)
    private java.sql.Date fechafin;

    @Enumerated(EnumType.STRING)
    private EstadoAsistencia estado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_taller", nullable = false)
    private Taller taller;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column
    private EstadoDecisionCertificacion decisionCertificacion;

    @Column(length = 500)
    private String motivoNoCertificacion;
}
