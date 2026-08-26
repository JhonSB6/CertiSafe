package com.CertiSafe.secu.Exception;

public class DocumentoNoValidoException extends RuntimeException {

    public DocumentoNoValidoException(String mensaje) {
        super(mensaje);
    }
}
