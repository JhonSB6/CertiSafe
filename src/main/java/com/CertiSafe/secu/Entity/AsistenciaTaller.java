package com.CertiSafe.secu.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
 @Data

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

    @Column(nullable = false)
    private Boolean cumplimiento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_taller", nullable = false)
    private Taller taller;
}
