package com.CertiSafe.secu.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {

    private Long idUsuario;
    private String documento;
    private String nombre;
    private String apellido;
    private String rol;
    private String mensaje;
}
