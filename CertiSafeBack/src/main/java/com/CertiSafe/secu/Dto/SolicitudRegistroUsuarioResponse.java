package com.CertiSafe.secu.Dto;

import com.CertiSafe.secu.Enum.EstadoSolicitudRegistro;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class SolicitudRegistroUsuarioResponse {

    private Long idSolicitud;

    private String documento;

    private String nombre;

    private String apellido;

    private String correo;

    private String rol;

    private LocalDateTime fechaSolicitud;

    private EstadoSolicitudRegistro estado;
}
