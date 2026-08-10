package com.CertiSafe.secu.Service.impl;

import com.CertiSafe.secu.Service.ServiceRol;
import com.CertiSafe.secu.Entity.Rol;
import com.CertiSafe.secu.Repository.RepositoryRol;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ServiceRolimpl implements ServiceRol {
    private final RepositoryRol repositoryRol;

    @Override
    public List<Rol> listarRoles() {
        return repositoryRol.findAll();
    }

    @Override
    public Rol buscarPorId(Long id) {
        return repositoryRol.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
    }

    @Override
    public Rol guardar(Rol rol) {
        return repositoryRol.save(rol);
    }

    @Override
    public Rol actualizar(Long id, Rol rol) {
        Optional<Rol> rolExistente = repositoryRol.findById(id);
        if (rolExistente.isPresent()) {
            rol.setIdrol(id);
            return repositoryRol.save(rol);
        } else {
            throw new RuntimeException("Rol no encontrado con id: " + id);
        }
    }

//    @Override
//    public void eliminar(Long id) {
//        Optional<Rol> rolExistente = repositoryRol.findById(id);
//        if (rolExistente.isPresent()) {
//            Rol rol = rolExistente.get();
//            rol.setActivo(false);
//            repositoryRol.save(rol);
//        } else {
//            throw new RuntimeException("Rol no encontrado con id: " + id);
//        }
//    } SI ES NECESARIO ELIMINAR O DESACTIVAR EL ROL, SE PUEDE IMPLEMENTAR ESTE MÉTODO.
}
