package com.CertiSafe.secu.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioCargaMasivaDTO {

    private String documento;
    private String nombre;
    private String apellido;
    private String correo;
    private String rol;
}
