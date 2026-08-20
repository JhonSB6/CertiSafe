package com.CertiSafe.secu.Controller;

import com.CertiSafe.secu.Dto.SolicitudRegistroUsuarioRequest;
import com.CertiSafe.secu.Dto.SolicitudRegistroUsuarioResponse;
import com.CertiSafe.secu.Enum.EstadoSolicitudRegistro;
import com.CertiSafe.secu.Service.ServiceSolicitudRegistroUsuario;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solicitudes-registro")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ControllerSolicitudRegistroUsuario {

    private final ServiceSolicitudRegistroUsuario service;


    // =========================================
    // CREAR SOLICITUD
    // =========================================

    @PostMapping
    public ResponseEntity<?> crearSolicitud(
            @RequestBody SolicitudRegistroUsuarioRequest request) {

        try {

            return ResponseEntity.ok(
                    service.crearSolicitud(request)
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =========================================
    // LISTAR SOLICITUDES PENDIENTES
    // =========================================

    @GetMapping("/pendientes")
    public ResponseEntity<List<SolicitudRegistroUsuarioResponse>>
    listarPendientes() {

        return ResponseEntity.ok(
                service.listarPendientes()
        );
    }


    // =========================================
    // APROBAR
    // =========================================

    @PatchMapping("/{id}/aprobar")
    public ResponseEntity<?> aprobar(
            @PathVariable Long id) {

        try {

            service.aprobar(id);

            return ResponseEntity.ok(
                    "Solicitud aprobada correctamente"
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =========================================
    // RECHAZAR
    // =========================================

    @PatchMapping("/{id}/rechazar")
    public ResponseEntity<?> rechazar(
            @PathVariable Long id) {

        try {

            service.rechazar(id);

            return ResponseEntity.ok(
                    "Solicitud rechazada correctamente"
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =========================================
    // CONSULTAR ESTADO
    // =========================================

    @GetMapping("/estado/{documento}")
    public ResponseEntity<?> consultarEstado(
            @PathVariable String documento) {

        EstadoSolicitudRegistro estado =
                service.buscarEstadoPorDocumento(
                        documento
                );

        if (estado == null) {

            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(estado);
    }
}
