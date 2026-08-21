package com.CertiSafe.secu.Service.impl;

import com.CertiSafe.secu.Service.ServiceEmail;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
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

        try {

            MimeMessage mensaje = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(mensaje, true, "UTF-8");

            helper.setTo(correoDestino);

            helper.setSubject(
                    "CertiSafe - Recuperación de contraseña"
            );

            String enlace =
                    "http://localhost:5173/restablecer-contrasena?token="
                            + token;

            String contenido = """
                    <!DOCTYPE html>
                    <html lang="es">

                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport"
                              content="width=device-width, initial-scale=1.0">
                        <title>Recuperación de contraseña</title>
                    </head>

                    <body style="
                        margin: 0;
                        padding: 0;
                        background-color: #f4f6f8;
                        font-family: Arial, Helvetica, sans-serif;
                    ">

                        <div style="
                            max-width: 600px;
                            margin: 40px auto;
                            background-color: #ffffff;
                            border-radius: 10px;
                            overflow: hidden;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                        ">

                            <div style="
                                background-color: #1f4e79;
                                padding: 25px;
                                text-align: center;
                            ">

                                <h1 style="
                                    margin: 0;
                                    color: #ffffff;
                                    font-size: 28px;
                                ">
                                    CERTISAFE
                                </h1>

                            </div>

                            <div style="
                                padding: 35px;
                                color: #333333;
                            ">

                                <h2 style="
                                    margin-top: 0;
                                    color: #1f4e79;
                                ">
                                    Recuperación de contraseña
                                </h2>

                                <p>
                                    Hola,
                                </p>

                                <p>
                                    Hemos recibido una solicitud para
                                    restablecer la contraseña de tu cuenta
                                    de CertiSafe.
                                </p>

                                <p>
                                    Para crear una nueva contraseña,
                                    haz clic en el siguiente botón:
                                </p>

                                <div style="
                                    text-align: center;
                                    margin: 30px 0;
                                ">

                                    <a href="%s"
                                       style="
                                           display: inline-block;
                                           padding: 14px 28px;
                                           background-color: #1f4e79;
                                           color: #ffffff;
                                           text-decoration: none;
                                           border-radius: 6px;
                                           font-size: 16px;
                                           font-weight: bold;
                                       ">
                                        Restablecer contraseña
                                    </a>

                                </div>

                                <p>
                                    Este enlace será válido durante
                                    <strong>15 minutos</strong> y solo
                                    puede utilizarse una vez.
                                </p>

                                <p>
                                    Si no solicitaste recuperar tu
                                    contraseña, puedes ignorar este mensaje.
                                </p>

                                <p style="
                                    color: #666666;
                                    font-size: 14px;
                                ">
                                    Por seguridad, no compartas este enlace
                                    con otras personas.
                                </p>

                            </div>

                            <div style="
                                background-color: #f4f6f8;
                                padding: 20px;
                                text-align: center;
                                color: #777777;
                                font-size: 13px;
                            ">

                                <p style="margin: 0;">
                                    Saludos,<br>
                                    <strong>Equipo CertiSafe</strong>
                                </p>

                                <p style="margin-top: 10px;">
                                    © 2026 CertiSafe
                                </p>

                            </div>

                        </div>

                    </body>

                    </html>
                    """.formatted(enlace);

            helper.setText(contenido, true);

            mailSender.send(mensaje);

        } catch (MessagingException e) {

            throw new RuntimeException(
                    "No fue posible enviar el correo de recuperación",
                    e
            );
        }
    }
}
