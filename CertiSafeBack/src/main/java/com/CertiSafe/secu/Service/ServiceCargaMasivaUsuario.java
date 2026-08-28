package com.CertiSafe.secu.Service;

import com.CertiSafe.secu.Dto.ResultadoCargaMasivaResponse;
import com.CertiSafe.secu.Dto.UsuarioCargaMasivaDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ServiceCargaMasivaUsuario {

    ResultadoCargaMasivaResponse validarArchivo(MultipartFile archivo);

    ResultadoCargaMasivaResponse confirmarCarga(MultipartFile archivo);

    void confirmarCarga(List<UsuarioCargaMasivaDTO> usuarios);
}
