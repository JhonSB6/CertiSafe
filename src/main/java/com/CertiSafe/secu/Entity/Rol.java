package com.CertiSafe.secu.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data

@Table(name = "rol")
public class Rol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rol")
    private Long idrol;

    @Column(nullable = false, unique = true,  length = 50)
    private String nombre;

}
