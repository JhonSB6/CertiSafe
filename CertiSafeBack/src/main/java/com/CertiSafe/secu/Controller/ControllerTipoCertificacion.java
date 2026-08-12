package com.CertiSafe.secu.Controller;

import com.CertiSafe.secu.Entity.TipoCertificacion;
import com.CertiSafe.secu.Service.ServiceTipoCertificacion;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tipos-certificacion")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ControllerTipoCertificacion {

    private final ServiceTipoCertificacion serviceTipoCertificacion;

    @GetMapping
    public ResponseEntity<List<TipoCertificacion>> listarTipo() {

        return ResponseEntity.ok(
                serviceTipoCertificacion.listarTipo()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<TipoCertificacion> buscarTipo(
            @PathVariable Long id) {

        return serviceTipoCertificacion.buscarTipo(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TipoCertificacion> guardar(
            @RequestBody TipoCertificacion tipoCertificacion) {

        return ResponseEntity.ok(
                serviceTipoCertificacion.guardar(tipoCertificacion)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<TipoCertificacion> actualizar(
            @PathVariable Long id,
            @RequestBody TipoCertificacion tipoCertificacion) {

        return ResponseEntity.ok(
                serviceTipoCertificacion.actualizar(id, tipoCertificacion)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Long id) {

        serviceTipoCertificacion.eliminar(id);

        return ResponseEntity.noContent().build();
    }
}
