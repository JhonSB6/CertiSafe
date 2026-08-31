package com.CertiSafe.secu.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActualizarUsuarioAdminRequest {

    private String nombre;

    private String apellido;

    private String correo;

    private Long idRol;
}
