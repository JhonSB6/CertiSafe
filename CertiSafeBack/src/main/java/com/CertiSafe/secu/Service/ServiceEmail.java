package com.CertiSafe.secu.Service;

public interface ServiceEmail {

    void enviarCorreoRecuperacion(
            String correoDestino,
            String token
    );
}
