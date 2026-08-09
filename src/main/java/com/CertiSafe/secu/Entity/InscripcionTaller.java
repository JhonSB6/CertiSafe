package com.CertiSafe.secu.Entity;

import com.CertiSafe.secu.Enum.EstadoInscripcion;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Data

@Table(name = "inscripcion_taller")
public class InscripcionTaller {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_inscripcion")
    private Long idinscripcion;

    @Enumerated(EnumType.STRING)
    private EstadoInscripcion estado;

    @Column(nullable = false)
    private Date fechaInscripcion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_taller", nullable = false)
    private Taller taller;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

}
