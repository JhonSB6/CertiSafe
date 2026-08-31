package com.CertiSafe.secu.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetalleTallerResponse {

    private Long idTaller;

    private String nombre;

    private String descripcion;

    private LocalDate fecha;

    private LocalTime horaInicio;

    private LocalTime horaFin;

    private Integer aforo;

    private String certificacion;

    private String estado;

    private String capacitador;

    private Long programados;

    private Long confirmados;

    private Long pendientes;

    private List<DetalleOperarioTallerResponse> operarios;

}

