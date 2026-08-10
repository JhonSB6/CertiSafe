package com.CertiSafe.secu.Controller;

import com.CertiSafe.secu.Entity.Taller;
import com.CertiSafe.secu.Entity.Usuario;
import com.CertiSafe.secu.Service.ServiceTaller;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/talleres")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ControllerTaller {

    private final ServiceTaller serviceTaller;

    @GetMapping
    public ResponseEntity<List<Taller>> listarTalleres() {

        return ResponseEntity.ok(
                serviceTaller.listarTalleres()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Taller> buscarPorId(
            @PathVariable Long id) {

        return serviceTaller.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Taller> guardar(
            @RequestBody Taller taller) {

        return ResponseEntity.ok(
                serviceTaller.guardar(taller)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Taller> actualizar(
            @PathVariable Long id,
            @RequestBody Taller taller) {

        return ResponseEntity.ok(
                serviceTaller.actualizar(id, taller)
        );
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancelar(
            @PathVariable Long id) {

        serviceTaller.desactivar(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/operarios-disponibles")
    public ResponseEntity<List<Usuario>> operariosDisponibles(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                serviceTaller.buscarOperariosDisponibles(id)
        );
    }

    @PostMapping("/{id}/revisar-aforo")
    public ResponseEntity<Void> revisarAforo(
            @PathVariable Long id) {

        serviceTaller.revisarAforo(id);

        return ResponseEntity.noContent().build();
    }
}
