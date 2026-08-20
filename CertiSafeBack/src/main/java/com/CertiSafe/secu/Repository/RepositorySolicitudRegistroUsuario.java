package com.CertiSafe.secu.Repository;

import com.CertiSafe.secu.Entity.SolicitudRegistroUsuario;
import com.CertiSafe.secu.Enum.EstadoSolicitudRegistro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RepositorySolicitudRegistroUsuario extends JpaRepository<SolicitudRegistroUsuario, Long> {

    Optional<SolicitudRegistroUsuario> findByDocumento(String documento);

    Optional<SolicitudRegistroUsuario> findByCorreo(String correo);

    List<SolicitudRegistroUsuario> findByEstado(EstadoSolicitudRegistro estado);

}
