package com.CertiSafe.secu.Repository;

import com.CertiSafe.secu.Entity.AsistenciaTaller;
import com.CertiSafe.secu.Enum.EstadoAsistencia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RepositoryAsistenciaTaller extends JpaRepository<AsistenciaTaller, Long> {

    List<AsistenciaTaller> findByTallerIdtallerAndEstado(Long idTaller, EstadoAsistencia estado);

    Optional<AsistenciaTaller> findByTallerIdtallerAndUsuarioIdusuario(
            Long idTaller,
            Long idUsuario);

}
