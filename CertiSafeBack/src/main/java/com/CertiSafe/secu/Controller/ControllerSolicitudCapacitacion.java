package com.CertiSafe.secu.Controller;

import com.CertiSafe.secu.Entity.SolicitudCapacitacion;
import com.CertiSafe.secu.Enum.EstadoSolicitudCapacitacion;
import com.CertiSafe.secu.Service.ServiceSolicitudCapacitacion;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solicitudes-capacitacion")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ControllerSolicitudCapacitacion {

    private final ServiceSolicitudCapacitacion serviceSolicitudCapacitacion;


    // =========================================================
    // LISTAR TODAS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<SolicitudCapacitacion>> listarSolicitudes() {

        return ResponseEntity.ok(
                serviceSolicitudCapacitacion.listarSolicitudes()
        );
    }


    // =========================================================
    // BUSCAR POR ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<SolicitudCapacitacion> buscarPorId(
            @PathVariable Long id) {

        return serviceSolicitudCapacitacion.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    // =========================================================
    // LISTAR SOLICITUDES DE UN OPERARIO
    // =========================================================

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<SolicitudCapacitacion>> listarPorUsuario(
            @PathVariable Long idUsuario) {

        return ResponseEntity.ok(
                serviceSolicitudCapacitacion
                        .listarPorUsuario(idUsuario)
        );
    }


    // =========================================================
    // LISTAR POR ESTADO
    // =========================================================

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<SolicitudCapacitacion>> listarPorEstado(
            @PathVariable EstadoSolicitudCapacitacion estado) {

        return ResponseEntity.ok(
                serviceSolicitudCapacitacion
                        .listarPorEstado(estado)
        );
    }


    // =========================================================
    // CREAR SOLICITUD
    // =========================================================

    @PostMapping
    public ResponseEntity<SolicitudCapacitacion> crearSolicitud(
            @RequestParam Long idUsuario,
            @RequestParam Long idTipoCertificacion,
            @RequestParam(required = false) String observacion) {

        SolicitudCapacitacion solicitud =
                serviceSolicitudCapacitacion.crearSolicitud(
                        idUsuario,
                        idTipoCertificacion,
                        observacion
                );

        return ResponseEntity.ok(solicitud);
    }


    // =========================================================
    // ACTUALIZAR ESTADO
    // =========================================================

    @PutMapping("/{id}/estado")
    public ResponseEntity<Void> actualizarEstado(
            @PathVariable Long id,
            @RequestParam EstadoSolicitudCapacitacion estado) {

        serviceSolicitudCapacitacion.actualizarEstado(
                id,
                estado
        );

        return ResponseEntity.ok().build();
    }
}