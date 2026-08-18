package com.CertiSafe.secu.Dto;

import com.CertiSafe.secu.Enum.EstadoCertificacion;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.sql.Date;

@Data
@AllArgsConstructor
public class HistorialCertificacionDTO {

    private Long idHistorial;
    private String operario;
    private String documento;
    private String certificacion;
    private Date fechaExpedicion;
    private Date fechaVigencia;
    private EstadoCertificacion estado;
    private String taller;
}