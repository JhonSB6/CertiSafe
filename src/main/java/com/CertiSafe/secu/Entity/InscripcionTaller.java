package com.CertiSafe.secu.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data

@Table(name = "inscripcion_taller")
public class InscripcionTaller {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_inscripcion")
    private Long idinscripcion;

    @Column(nullable = false)
    private Boolean estado;

    @Column(nullable = false)
    private java.sql.Date fecha;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

}
