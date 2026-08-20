package com.CertiSafe.secu.Service;

import com.CertiSafe.secu.Dto.SolicitudRegistroUsuarioRequest;
import com.CertiSafe.secu.Dto.SolicitudRegistroUsuarioResponse;
import com.CertiSafe.secu.Enum.EstadoSolicitudRegistro;

import java.util.List;

public interface ServiceSolicitudRegistroUsuario {

    SolicitudRegistroUsuarioResponse crearSolicitud(SolicitudRegistroUsuarioRequest request);

    List<SolicitudRegistroUsuarioResponse> listarPendientes();

    void aprobar(Long idSolicitud);

    void rechazar(Long idSolicitud);

    EstadoSolicitudRegistro buscarEstadoPorDocumento(String documento);
}
