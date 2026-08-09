package com.CertiSafe.secu.Repository;

import com.CertiSafe.secu.Entity.InscripcionTaller;
import com.CertiSafe.secu.Enum.EstadoInscripcion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface RepositoryInscripcionTaller extends JpaRepository<InscripcionTaller, Long> {
    Long countByTallerIdtallerAndEstado(
            Long idTaller,
            EstadoInscripcion estado);
}
