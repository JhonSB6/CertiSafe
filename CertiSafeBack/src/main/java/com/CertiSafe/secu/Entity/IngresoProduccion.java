package com.CertiSafe.secu.Entity;

import com.CertiSafe.secu.Enum.EstadoIngreso;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "ingreso_produccion")
public class IngresoProduccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ingreso")
    private Long idingreso;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private Date fechaingreso;

    @Column
    private Date fechasalida;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoIngreso autorizar;

    /*
     * Código único que identifica el acceso del operario
     * cuando cumple las certificaciones obligatorias.
     *
     * Posteriormente este código se podrá convertir
     * en un código QR desde React.
     */
    @Column(name = "codigo_acceso", unique = true)
    private String codigoAcceso;

    /*
     * Operario que solicita el ingreso a producción.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;
}
