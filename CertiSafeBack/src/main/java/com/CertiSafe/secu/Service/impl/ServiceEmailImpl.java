package com.CertiSafe.secu.Service.impl;

import com.CertiSafe.secu.Service.ServiceEmail;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class ServiceEmailImpl implements ServiceEmail {

    private final JavaMailSender mailSender;

    public ServiceEmailImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void enviarCorreoRecuperacion(
            String correoDestino,
            String token) {

        SimpleMailMessage mensaje = new SimpleMailMessage();

        mensaje.setTo(correoDestino);
        mensaje.setSubject("CertiSafe - Recuperación de contraseña");

        mensaje.setText(
                "Hola,\n\n" +
                        "Hemos recibido una solicitud para restablecer tu contraseña de CertiSafe.\n\n" +
                        "Tu token de recuperación es:\n\n" +
                        token + "\n\n" +
                        "Este token tiene una vigencia de 15 minutos.\n\n" +
                        "Si no solicitaste este cambio, puedes ignorar este mensaje.\n\n" +
                        "CertiSafe"
        );

        mailSender.send(mensaje);
    }
}
