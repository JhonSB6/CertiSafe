package com.CertiSafe.secu.Entity;

import com.CertiSafe.secu.Enum.EstadoUsuario;
import com.CertiSafe.secu.Enum.EstadoCertificacion;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@AllArgsConstructor

@Table(name = "usuario")

public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long idusuario;

    @Column(nullable = false, unique = true, length = 20)
    private String documento;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, length = 100)
    private String apellido;

    @Column(nullable = false, unique = true, length = 150)
    private String correo;

    @Column(nullable = false)
    private String contraseña;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoUsuario estado;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoCertificacion estadoCertifiacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_rol", nullable = false)
    private Rol rol;
}
