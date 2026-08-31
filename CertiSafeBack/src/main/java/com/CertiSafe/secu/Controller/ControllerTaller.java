package com.CertiSafe.secu.Controller;

import com.CertiSafe.secu.Dto.DetalleTallerResponse;
import com.CertiSafe.secu.Entity.Taller;
import com.CertiSafe.secu.Entity.Usuario;
import com.CertiSafe.secu.Enum.EstadoTaller;
import com.CertiSafe.secu.Service.ServiceTaller;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/talleres")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
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
    @GetMapping("/{id}/resumen")
    public ResponseEntity<Map<String, Object>> obtenerResumen(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                serviceTaller.obtenerResumen(id)
        );
    }

    @PostMapping("/{id}/iniciar")
    public ResponseEntity<Void> iniciarTaller(
            @PathVariable Long id,
            @RequestParam(defaultValue = "false") boolean forzarInicio) {

        serviceTaller.iniciarTaller(id, forzarInicio);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/capacitador/{idCapacitador}/finalizados")
    public ResponseEntity<List<Taller>> listarTalleresFinalizados(
            @PathVariable Long idCapacitador) {

        return ResponseEntity.ok(
                serviceTaller.listarPorCapacitador(
                        idCapacitador,
                        EstadoTaller.FINALIZADO
                )
        );
    }

    @PutMapping("/{id}/finalizar")
    public ResponseEntity<Void> finalizarTaller(
            @PathVariable Long id) {

        serviceTaller.finalizarTaller(id);

        return ResponseEntity.noContent().build();
    }
    @GetMapping("/capacitador/{idCapacitador}/activos")
    public ResponseEntity<List<Taller>> listarTalleresActivos(
            @PathVariable Long idCapacitador) {

        List<Taller> talleresProgramados =
                serviceTaller.listarPorCapacitador(
                        idCapacitador,
                        EstadoTaller.PROGRAMADO
                );

        List<Taller> talleresEnCurso =
                serviceTaller.listarPorCapacitador(
                        idCapacitador,
                        EstadoTaller.EN_CURSO
                );

        List<Taller> talleres = new ArrayList<>();

        talleres.addAll(talleresProgramados);
        talleres.addAll(talleresEnCurso);

        talleres.sort(
                Comparator.comparing(
                        Taller::getFecha
                ).thenComparing(
                        Taller::getHoraInicio
                )
        );

        return ResponseEntity.ok(talleres);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarTaller(
            @PathVariable Long id) {

        serviceTaller.eliminarTaller(id);

        return ResponseEntity.noContent().build();
    }


    @GetMapping("/{id}/detalle")
    public ResponseEntity<DetalleTallerResponse> obtenerDetalleTaller(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                serviceTaller.obtenerDetalleTaller(id)
        );
    }

}
