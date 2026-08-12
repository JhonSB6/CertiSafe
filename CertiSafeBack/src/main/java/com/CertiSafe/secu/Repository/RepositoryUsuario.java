package com.CertiSafe.secu.Repository;

import com.CertiSafe.secu.Entity.Usuario;
import com.CertiSafe.secu.Enum.EstadoUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface RepositoryUsuario extends JpaRepository<Usuario,Long> {

    Optional<Usuario> findByDocumento(String documento);

    List<Usuario> findByRolNombre(String nombre, EstadoUsuario estado);

}
