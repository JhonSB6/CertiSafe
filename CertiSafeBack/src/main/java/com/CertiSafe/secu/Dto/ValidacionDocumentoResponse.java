package com.CertiSafe.secu.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ValidacionDocumentoResponse {

    private boolean valido;
    private Long idUsuario;
    private String mensaje;
}
