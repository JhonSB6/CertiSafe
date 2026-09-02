package com.CertiSafe.secu.Repository;

import com.CertiSafe.secu.Enum.EstadoTaller;
import com.CertiSafe.secu.Enum.EstadoUsuario;
import com.CertiSafe.secu.Entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface RepositoryUsuario extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByDocumento(String documento);

    List<Usuario> findByRolNombreAndEstado(
            String nombre,
            EstadoUsuario estado
    );

    Optional<Usuario> findByCorreo(String correo);


    @Query("""
        SELECT u
        FROM Usuario u
        WHERE UPPER(u.rol.nombre) = 'CAPACITADOR'
        AND u.estado = :estado
        AND NOT EXISTS (
            SELECT t
            FROM Taller t
            WHERE t.capacitador.idusuario = u.idusuario
            AND t.fecha = :fecha
            AND t.estado IN :estados
            AND t.horaInicio < :horaFinConMargen
            AND t.horaFin > :horaInicioConMargen
        )
    """)
    List<Usuario> buscarCapacitadoresDisponibles(
            @Param("fecha") LocalDate fecha,
            @Param("horaInicioConMargen") LocalTime horaInicioConMargen,
            @Param("horaFinConMargen") LocalTime horaFinConMargen,
            @Param("estados") List<EstadoTaller> estados,
            @Param("estado") EstadoUsuario estado
    );
}