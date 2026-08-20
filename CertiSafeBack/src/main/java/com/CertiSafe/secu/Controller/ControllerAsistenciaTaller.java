package com.CertiSafe.secu.Controller;

import com.CertiSafe.secu.Entity.AsistenciaTaller;
import com.CertiSafe.secu.Enum.EstadoAsistencia;
import com.CertiSafe.secu.Enum.EstadoDecisionCertificacion;
import com.CertiSafe.secu.Service.ServiceAsistenciaTaller;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/asistencias")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ControllerAsistenciaTaller {

    private final ServiceAsistenciaTaller serviceAsistenciaTaller;

    @GetMapping("/taller/{idTaller}")
    public ResponseEntity<List<AsistenciaTaller>> listarPorTaller(
            @PathVariable Long idTaller) {

        return ResponseEntity.ok(
                serviceAsistenciaTaller.listarPorTaller(
                        idTaller,
                        EstadoAsistencia.PRESENTE)
        );
    }
    @GetMapping("/taller/{idTaller}/presentes")
    public ResponseEntity<List<AsistenciaTaller>> listarPresentes(
            @PathVariable Long idTaller) {

        return ResponseEntity.ok(
                serviceAsistenciaTaller.listarPorTaller(
                        idTaller,
                        EstadoAsistencia.PRESENTE
                )
        );
    }
    @PatchMapping("/{id}/decision-certificacion")
    public ResponseEntity<?> decidirCertificacion(
            @PathVariable Long id,
            @RequestParam EstadoDecisionCertificacion decision) {

        try {

            serviceAsistenciaTaller.decidirCertificacion(
                    id,
                    decision
            );

            return ResponseEntity.ok(
                    "Decisión registrada correctamente"
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

}
