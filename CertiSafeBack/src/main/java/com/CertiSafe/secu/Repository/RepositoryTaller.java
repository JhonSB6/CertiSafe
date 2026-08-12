package com.CertiSafe.secu.Repository;

import com.CertiSafe.secu.Entity.Taller;
import com.CertiSafe.secu.Entity.TipoCertificacion;
import com.CertiSafe.secu.Enum.EstadoTaller;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RepositoryTaller extends JpaRepository<Taller, Long> {

    Optional<TipoCertificacion> findByNombre(String nombre);

    List<Taller> findByCapacitadorIdusuarioAndEstado(Long idCapacitador, EstadoTaller estado);

}
