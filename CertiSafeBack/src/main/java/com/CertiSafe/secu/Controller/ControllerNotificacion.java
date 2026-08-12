package com.CertiSafe.secu.Controller;

import com.CertiSafe.secu.Entity.Notificacion;
import com.CertiSafe.secu.Service.ServiceNotificacion;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notificaciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ControllerNotificacion {

    private final ServiceNotificacion serviceNotificacion;

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<Notificacion>> listarNotificaciones(
            @PathVariable Long idUsuario) {

        return ResponseEntity.ok(
                serviceNotificacion.listarNotificaciones(idUsuario)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Notificacion> buscarPorId(
            @PathVariable Long id) {

        return serviceNotificacion.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Notificacion> guardar(
            @RequestBody Notificacion notificacion) {

        return ResponseEntity.ok(
                serviceNotificacion.guardar(notificacion)
        );
    }

    @PutMapping("/{id}/leer")
    public ResponseEntity<Void> marcarComoLeida(
            @PathVariable Long id) {

        serviceNotificacion.marcarComoLeida(id);

        return ResponseEntity.noContent().build();
    }
}
