package com.CertiSafe.secu.Service;

public interface ServicePasswordReset {

    void solicitarRecuperacion(String correo);

    void restablecerContrasena(String token, String nuevaContrasena);
}
