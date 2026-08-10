package com.CertiSafe.secu.Controller;

import com.CertiSafe.secu.Entity.InscripcionTaller;
import com.CertiSafe.secu.Enum.EstadoTipoProgramacion;
import com.CertiSafe.secu.Service.ServiceInscripcionTaller;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inscripciones-taller")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ControllerInscripcionTaller {

    private final ServiceInscripcionTaller serviceInscripcionTaller;

    @GetMapping
    public ResponseEntity<List<InscripcionTaller>> listarInscripciones() {

        return ResponseEntity.ok(
                serviceInscripcionTaller.listarInscripciones()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<InscripcionTaller> buscarPorId(
            @PathVariable Long id) {

        return serviceInscripcionTaller.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<InscripcionTaller> guardar(
            @RequestBody InscripcionTaller inscripcion) {

        return ResponseEntity.ok(
                serviceInscripcionTaller.guardar(inscripcion)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<InscripcionTaller> actualizar(
            @PathVariable Long id,
            @RequestBody InscripcionTaller inscripcion) {

        return ResponseEntity.ok(
                serviceInscripcionTaller.actualizar(id, inscripcion)
        );
    }

    @PutMapping("/{id}/confirmar")
    public ResponseEntity<Void> confirmar(
            @PathVariable Long id) {

        serviceInscripcionTaller.confirmarInscripcion(id);

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancelar(
            @PathVariable Long id) {

        serviceInscripcionTaller.cancelarInscripcion(id);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/programar")
    public ResponseEntity<Void> programarOperario(
            @RequestParam Long idTaller,
            @RequestParam Long idUsuario,
            @RequestParam EstadoTipoProgramacion estadoTipoProgramacion) {

        serviceInscripcionTaller.programarOperario(
                idTaller,
                idUsuario,
                estadoTipoProgramacion
        );

        return ResponseEntity.noContent().build();
    }
}
