package com.CertiSafe.secu.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;

@Entity
@Data

@Table (name = "taller")

public class Taller {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_taller")
    private Long idtaller;

    @Column(nullable = false, unique = true)
    private String codigo;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private Date fecha;

    @Column(nullable = false)
    private Integer aforo;

    @Column(nullable = false)
    private Boolean estado;
}
