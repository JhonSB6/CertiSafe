package com.CertiSafe.secu.Controller;

import com.CertiSafe.secu.Service.ServicePlantillaUsuario;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carga-masiva-usuarios")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ControllerPlantillaUsuario {

    private final ServicePlantillaUsuario service;


    @GetMapping("/plantilla")
    public ResponseEntity<InputStreamResource>
    descargarPlantilla() {

        InputStreamResource resource =
                new InputStreamResource(
                        service.generarPlantilla()
                );

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=plantilla_usuarios_certisafe.xlsx"
                )
                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        )
                )
                .body(resource);
    }
}
