package com.CertiSafe.secu.Controller;

import com.CertiSafe.secu.Dto.ResultadoCargaMasivaResponse;
import com.CertiSafe.secu.Dto.UsuarioCargaMasivaDTO;
import com.CertiSafe.secu.Service.ServiceCargaMasivaUsuario;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/carga-masiva-usuarios")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ControllerCargaMasivaUsuario {

    private final ServiceCargaMasivaUsuario service;

    // =========================================
    // VALIDAR ARCHIVO EXCEL
    // =========================================

    @PostMapping("/validar")
    public ResponseEntity<?> validarArchivo(
            @RequestParam("archivo") MultipartFile archivo) {

        try {

            ResultadoCargaMasivaResponse resultado =
                    service.validarArchivo(archivo);

            return ResponseEntity.ok(resultado);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =========================================
    // CONFIRMAR CARGA MASIVA
    // =========================================

    @PostMapping("/confirmar")
    public ResponseEntity<?> confirmarCarga(
            @RequestBody List<UsuarioCargaMasivaDTO> usuarios) {

        try {

            service.confirmarCarga(usuarios);

            return ResponseEntity.ok(
                    "Carga masiva confirmada correctamente. " +
                            "Las solicitudes quedaron pendientes de aprobación."
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}
