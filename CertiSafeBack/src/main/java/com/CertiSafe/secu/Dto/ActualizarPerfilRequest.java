package com.CertiSafe.secu.Dto;

import lombok.Data;

@Data
public class ActualizarPerfilRequest {

    private String nombre;
    private String apellido;
    private String correo;
}
