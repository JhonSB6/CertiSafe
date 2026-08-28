package com.CertiSafe.secu.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResultadoCargaMasivaResponse {

    private boolean exitoso;
    private int totalRegistros;
    private int registrosValidos;
    private int registrosConError;

    private List<ErrorCargaMasivaResponse> errores;

    private List<UsuarioCargaMasivaDTO> usuarios;
}
