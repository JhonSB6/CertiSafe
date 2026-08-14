package com.CertiSafe.secu.Repository;

import com.CertiSafe.secu.Entity.IngresoProduccion;
import com.CertiSafe.secu.Enum.EstadoIngreso;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RepositoryIngresoProduccion extends JpaRepository<IngresoProduccion, Long> {

    Optional<IngresoProduccion> findByUsuarioIdusuarioAndEstado(Long idUsuario, EstadoIngreso estado);
}
