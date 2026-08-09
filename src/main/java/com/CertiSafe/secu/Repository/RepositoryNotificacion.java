package com.CertiSafe.secu.Repository;

import com.CertiSafe.secu.Entity.Notificacion;
import com.CertiSafe.secu.Enum.EstadoTipoNotificacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RepositoryNotificacion extends JpaRepository<Notificacion, Long> {

    List<Notificacion> findByUsuarioIdusuarioOrderByFechaDesc(Long idUsuario);

    boolean existsByTallerIdtallerAndTipo(Long idTaller, EstadoTipoNotificacion tipo);
}
