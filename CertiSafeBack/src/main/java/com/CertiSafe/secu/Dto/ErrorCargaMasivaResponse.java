package com.CertiSafe.secu.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorCargaMasivaResponse {

    private int fila;
    private String campo;
    private String valor;
    private String mensaje;
}
