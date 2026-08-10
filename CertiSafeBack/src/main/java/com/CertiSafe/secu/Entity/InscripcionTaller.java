package com.CertiSafe.secu.Entity;

import com.CertiSafe.secu.Enum.EstadoInscripcion;
import com.CertiSafe.secu.Enum.EstadoTipoProgramacion;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
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

    @Enumerated(EnumType.STRING)
    private EstadoTipoProgramacion estadoTipoProgramacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_taller", nullable = false)
    private Taller taller;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

}
