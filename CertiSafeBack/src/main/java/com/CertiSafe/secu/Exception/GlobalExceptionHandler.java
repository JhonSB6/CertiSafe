package com.CertiSafe.secu.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // =========================================================
    // DOCUMENTO NO VÁLIDO
    // =========================================================

    @ExceptionHandler(DocumentoNoValidoException.class)
    public ResponseEntity<String> manejarDocumentoNoValido(
            DocumentoNoValidoException exception) {

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(exception.getMessage());
    }

    // =========================================================
    // REGLA DE NEGOCIO
    // =========================================================

    @ExceptionHandler(ReglaNegocioException.class)
    public ResponseEntity<Map<String, String>> manejarReglaNegocio(
            ReglaNegocioException exception) {

        Map<String, String> respuesta = new HashMap<>();

        respuesta.put(
                "mensaje",
                exception.getMessage()
        );

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(respuesta);
    }
}