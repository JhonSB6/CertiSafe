package com.CertiSafe.secu.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table (name = "tipo_certificacion")

public class TipoCertificacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idTipoCertificacion;

    @Column(nullable = false, length = 100)
    private String nombre;
}
