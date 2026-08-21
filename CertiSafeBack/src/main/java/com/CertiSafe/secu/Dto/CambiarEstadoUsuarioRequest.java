package com.CertiSafe.secu.Dto;

import com.CertiSafe.secu.Enum.EstadoUsuario;
import lombok.Data;

@Data
public class CambiarEstadoUsuarioRequest {

    private EstadoUsuario estado;
}
