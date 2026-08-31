package com.CertiSafe.secu.Controller;

import com.CertiSafe.secu.Entity.Certificacion;
import com.CertiSafe.secu.Service.ServiceCertificacion;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certificaciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ControllerCertificacion {

    private final ServiceCertificacion serviceCertificacion;

    @PostMapping("/certificar/{idTaller}/{idAsistencia}/{idCapacitador}")
    public ResponseEntity<Certificacion> certificarOperario(
            @PathVariable Long idTaller,
            @PathVariable Long idAsistencia,
            @PathVariable Long idCapacitador) {

        return ResponseEntity.ok(
                serviceCertificacion.certificarOperario(
                        idTaller,
                        idAsistencia,
                        idCapacitador
                )
        );
    }
    @GetMapping("/verificar/{idUsuario}/{idTipoCertificacion}")
    public ResponseEntity<Boolean> verificarCertificacion(
            @PathVariable Long idUsuario,
            @PathVariable Long idTipoCertificacion) {

        return ResponseEntity.ok(
                serviceCertificacion.estaCertificado(
                        idUsuario,
                        idTipoCertificacion)
        );
    }
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<Certificacion>> listarPorUsuario(
            @PathVariable Long idUsuario) {

        return ResponseEntity.ok(
                serviceCertificacion.listarPorUsuario(idUsuario)
        );
    }
    @PostMapping("/no-certificar/{idTaller}/{idAsistencia}/{idCapacitador}")
    public ResponseEntity<Void> noCertificarOperario(
            @PathVariable Long idTaller,
            @PathVariable Long idAsistencia,
            @PathVariable Long idCapacitador,
            @RequestParam String motivo) {

        serviceCertificacion.noCertificarOperario(
                idTaller,
                idAsistencia,
                idCapacitador,
                motivo
        );

        return ResponseEntity.noContent().build();
    }
}


