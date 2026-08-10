package com.CertiSafe.secu.Dto;

import lombok.Data;

@Data
public class LoginRequest {

    private String documento;
    private String contrasena;
}
