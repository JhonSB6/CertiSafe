package com.CertiSafe.secu.Entity;

import com.CertiSafe.secu.Enum.EstadoAsistencia;
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

    @Enumerated(EnumType.STRING)
    private EstadoAsistencia estado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_taller", nullable = false)
    private Taller taller;
}
