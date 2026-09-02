package com.CertiSafe.secu.Service;

import com.CertiSafe.secu.Entity.Rol;

import java.util.List;
import java.util.Optional;

public interface ServiceRol {
    List<Rol> listarRoles();

    Rol buscarPorId(Long id);

    Rol guardar(Rol rol);

    Rol actualizar(Long id, Rol rol);

}
