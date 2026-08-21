package com.CertiSafe.secu.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UsuarioResponse {

    private Long idUsuario;
    private String documento;
    private String nombre;
    private String apellido;
    private String correo;
    private String estado;
    private String rol;
}
