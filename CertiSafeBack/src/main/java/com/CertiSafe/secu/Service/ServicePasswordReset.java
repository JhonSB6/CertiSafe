package com.CertiSafe.secu.Service;

public interface ServicePasswordReset {

    void solicitarRecuperacion(String documento);

    void restablecerContrasena(String token, String nuevaContrasena);
}
