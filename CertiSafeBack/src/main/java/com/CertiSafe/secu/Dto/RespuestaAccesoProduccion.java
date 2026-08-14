package com.CertiSafe.secu.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class RespuestaAccesoProduccion {

    private boolean acceso;

    private String mensaje;

    private List<String> faltantes;

    private String codigoAcceso;
}