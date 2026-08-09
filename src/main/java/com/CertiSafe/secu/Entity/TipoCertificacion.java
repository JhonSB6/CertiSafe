package com.CertiSafe.secu.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table (name = "tipo_certificacion")

public class TipoCertificacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idTipoCertificacion;

    @Column(nullable = false, length = 100)
    private String nombre;
}
