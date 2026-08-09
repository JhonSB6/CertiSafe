package com.CertiSafe.secu.Entity;

import com.CertiSafe.secu.Enum.EstadoCertificacion;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;

@Entity
@Data
@AllArgsConstructor
@Table(name = "certificacion")

public class Certificacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idcertificacion;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private java.sql.Date fechaExpedicion;

    @Column(nullable = false)
    private java.sql.Date fechaVigencia;

    @Enumerated(EnumType.STRING)
    private EstadoCertificacion estado;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_asistencia", nullable = false)
    private AsistenciaTaller asistencia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tipo_certificacion", nullable = false)
    private TipoCertificacion tipoCertificacion;

}
