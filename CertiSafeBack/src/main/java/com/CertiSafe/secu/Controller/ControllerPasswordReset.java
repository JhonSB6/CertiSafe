package com.CertiSafe.secu.Controller;

import com.CertiSafe.secu.Dto.ForgotPasswordRequest;
import com.CertiSafe.secu.Dto.ResetPasswordRequest;
import com.CertiSafe.secu.Service.ServicePasswordReset;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class ControllerPasswordReset {

    private final ServicePasswordReset servicePasswordReset;

    public ControllerPasswordReset(
            ServicePasswordReset servicePasswordReset) {

        this.servicePasswordReset = servicePasswordReset;
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @RequestBody ForgotPasswordRequest request) {

        servicePasswordReset.solicitarRecuperacion(
                request.getCorreo()
        );

        return ResponseEntity.ok(
                "Si el correo está registrado, se ha generado una solicitud de recuperación"
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestBody ResetPasswordRequest request) {

        servicePasswordReset.restablecerContrasena(
                request.getToken(),
                request.getNuevaContrasena()
        );

        return ResponseEntity.ok(
                "Contraseña actualizada correctamente"
        );
    }
}