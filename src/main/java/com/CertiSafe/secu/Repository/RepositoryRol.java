package com.CertiSafe.secu.Repository;

import com.CertiSafe.secu.Entity.Rol;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RepositoryRol extends JpaRepository<Rol,Long> {
    Optional<Rol> findByNombre(String nombre);

}
