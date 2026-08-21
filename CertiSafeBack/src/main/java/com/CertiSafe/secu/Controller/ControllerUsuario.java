package com.CertiSafe.secu.Controller;

import com.CertiSafe.secu.Dto.*;
import com.CertiSafe.secu.Entity.Usuario;
import com.CertiSafe.secu.Service.ServiceUsuario;
import com.CertiSafe.secu.Dto.ActualizarPerfilRequest;
import com.CertiSafe.secu.Dto.CambiarEstadoUsuarioRequest;
import com.CertiSafe.secu.Dto.UsuarioResponse;
import com.CertiSafe.secu.Enum.EstadoUsuario;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
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

    @PatchMapping("/{id}/estado")
    public ResponseEntity<UsuarioResponse> cambiarEstado(
            @PathVariable Long id,
            @RequestBody CambiarEstadoUsuarioRequest request
    ) {

        return ResponseEntity.ok(
                serviceUsuario.cambiarEstado(
                        id,
                        request.getEstado()
                )
        );
    }

    @PostMapping
    public ResponseEntity<Usuario> guardar(@RequestBody Usuario usuario) {
        return ResponseEntity.ok(serviceUsuario.guardar(usuario));
    }

    @GetMapping("/admin")
    public ResponseEntity<List<UsuarioResponse>> listarUsuariosSeguros() {

        return ResponseEntity.ok(
                serviceUsuario.listarUsuariosSeguros()
        );
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

    @PostMapping("/validar-documento")
    public ResponseEntity<ValidacionDocumentoResponse> validarDocumento(
            @RequestParam String documento) {

        return ResponseEntity.ok(
                serviceUsuario.validarDocumento(documento)
        );
    }
    @PutMapping("/{id}/cambiar-password")
    public ResponseEntity<Void> cambiarContrasena(
            @PathVariable Long id,
            @RequestBody CambiarContrasenaRequest request) {

        serviceUsuario.cambiarContrasena(
                id,
                request.getNuevaContrasena()
        );

        return ResponseEntity.noContent().build();
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        try {

            LoginResponse respuesta = serviceUsuario.login(
                    request.getDocumento(),
                    request.getContrasena()
            );

            return ResponseEntity.ok(respuesta);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());
        }
    }
    @GetMapping("/capacitadores")
    public ResponseEntity<List<Usuario>> listarCapacitadores() {

        return ResponseEntity.ok(
                serviceUsuario.listarCapacitadores()
        );
    }
    @PutMapping("/{id}/perfil")
    public ResponseEntity<UsuarioResponse> actualizarPerfil(
            @PathVariable Long id,
            @RequestBody ActualizarPerfilRequest request
    ) {

        return ResponseEntity.ok(
                serviceUsuario.actualizarPerfil(
                        id,
                        request
                )
        );
    }

    @GetMapping("/{id}/perfil")
    public ResponseEntity<UsuarioResponse> obtenerPerfil(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                serviceUsuario.obtenerPerfil(id)
        );
    }

}
