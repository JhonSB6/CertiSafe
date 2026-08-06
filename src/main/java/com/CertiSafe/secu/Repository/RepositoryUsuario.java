package com.CertiSafe.secu.Repository;

import com.CertiSafe.secu.Entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RepositoryUsuario extends JpaRepository<Usuario,Long> {

    Optional<Usuario> findByDocumento(String documento);
}
