package com.CertiSafe.secu.Entity;

import com.CertiSafe.secu.Enum.EstadoTaller;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table (name = "taller")

public class Taller {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_taller")
    private Long idtaller;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(length = 300)
    private String descripcion;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(nullable = false)
    private LocalTime horaInicio;

    @Column(nullable = false)
    private LocalTime horaFin;

    @Column(nullable = false)
    private Integer aforo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoTaller estado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tipo_certificacion", nullable = false)
    private TipoCertificacion tipoCertificacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_capacitador")
    private Usuario capacitador;
}