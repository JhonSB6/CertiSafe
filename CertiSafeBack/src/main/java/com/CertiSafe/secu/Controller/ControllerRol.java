package com.CertiSafe.secu.Controller;

import com.CertiSafe.secu.Entity.Rol;
import com.CertiSafe.secu.Service.ServiceRol;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.*;

@RestController
@RequestMapping("/roles")
@RequiredArgsConstructor

public class ControllerRol {
    private final ServiceRol serviceRol;

    @GetMapping("/{id}")
    public Rol buscarPorId(@PathVariable Long id) {
        return serviceRol.buscarPorId(id);
    }

    @GetMapping
    public List<Rol> listarRoles() {
        return serviceRol.listarRoles();
    }

    @PostMapping
    public Rol guardar(@RequestBody Rol rol) {
        return serviceRol.guardar(rol);
    }
}
