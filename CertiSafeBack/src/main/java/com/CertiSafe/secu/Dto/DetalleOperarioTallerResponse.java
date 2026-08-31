package com.CertiSafe.secu.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetalleOperarioTallerResponse {

    private String documento;

    private String nombre;

    private String apellido;

    private String inscripcion;

    private String certificacion;

    private String motivo;

}
