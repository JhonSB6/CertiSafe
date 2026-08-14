package com.CertiSafe.secu.Controller;

import com.CertiSafe.secu.Dto.RespuestaAccesoProduccion;
import com.CertiSafe.secu.Service.ServiceIngresoProduccion;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ingreso-produccion")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ControllerIngresoProduccion {

    private final ServiceIngresoProduccion serviceIngresoProduccion;

    @GetMapping("/verificar/{idUsuario}")
    public ResponseEntity<RespuestaAccesoProduccion> verificarAcceso(
            @PathVariable Long idUsuario) {

        return ResponseEntity.ok(
                serviceIngresoProduccion.verificarAcceso(idUsuario)
        );
    }
    @PostMapping("/solicitar/{idUsuario}")
    public ResponseEntity<RespuestaAccesoProduccion> solicitarIngreso(
            @PathVariable Long idUsuario) {

        return ResponseEntity.ok(
                serviceIngresoProduccion.solicitarIngreso(idUsuario)
        );
    }
}
