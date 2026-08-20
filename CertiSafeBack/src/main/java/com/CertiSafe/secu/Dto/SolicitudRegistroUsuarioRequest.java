package com.CertiSafe.secu.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SolicitudRegistroUsuarioRequest {

    private String documento;

    private String nombre;

    private String apellido;

    private String correo;

    private String contrasena;

    private Long idRol;
}
