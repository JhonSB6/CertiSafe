package com.CertiSafe.secu.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;

@Entity
@Data

@Table(name = "ingreso_produccion")
public class IngresoProduccion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ingreso")
    private Long idingreso;

    @Column(nullable = false)
    private Date fechaingreso;

    @Column(nullable = false)
    private Date fechasalida;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario; // el Operario decidir si crear operario o manejar solo usuario

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_historial", nullable = false)
    private HistorialCertificacion historial;
}
