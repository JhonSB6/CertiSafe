package com.CertiSafe.secu.Controller;

import com.CertiSafe.secu.Entity.Usuario;
import com.CertiSafe.secu.Service.ServiceUsuario;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ControllerUsuario {

    private final ServiceUsuario serviceUsuario;

    @GetMapping
    public List<Usuario> listarUsuarios() {
        return serviceUsuario.listarUsuarios();
    }

    @GetMapping("/operarios")
    public List<Usuario> listarOperarios() {
        return serviceUsuario.listarOperarios();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable Long id) {
        Optional<Usuario> usuario = serviceUsuario.buscarPorId(id);

        return usuario
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Usuario> guardar(@RequestBody Usuario usuario) {
        return ResponseEntity.ok(serviceUsuario.guardar(usuario));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizar(
            @PathVariable Long id,
            @RequestBody Usuario usuario) {

        return ResponseEntity.ok(serviceUsuario.actualizar(id, usuario));
    }

    @PatchMapping("/{id}/desactivar")
    public ResponseEntity<Void> desactivar(@PathVariable Long id) {
        serviceUsuario.desactivar(id);
        return ResponseEntity.noContent().build();
    }
}
