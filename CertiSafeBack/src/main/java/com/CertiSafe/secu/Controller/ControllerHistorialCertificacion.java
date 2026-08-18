package com.CertiSafe.secu.Controller;

import com.CertiSafe.secu.Dto.HistorialCertificacionDTO;
import com.CertiSafe.secu.Service.ServiceHistorialCertificacion;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/historial-certificaciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ControllerHistorialCertificacion {

    private final ServiceHistorialCertificacion serviceHistorialCertificacion;

    @GetMapping
    public ResponseEntity<List<HistorialCertificacionDTO>> listarHistorial() {

        return ResponseEntity.ok(
                serviceHistorialCertificacion.listarHistorialCompleto()
        );
    }
}
