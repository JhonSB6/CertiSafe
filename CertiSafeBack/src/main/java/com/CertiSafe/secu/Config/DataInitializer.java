package com.CertiSafe.secu.Config;

import com.CertiSafe.secu.Entity.Rol;
import com.CertiSafe.secu.Entity.Taller;
import com.CertiSafe.secu.Entity.TipoCertificacion;
import com.CertiSafe.secu.Entity.Usuario;
import com.CertiSafe.secu.Enum.EstadoTaller;
import com.CertiSafe.secu.Enum.EstadoUsuario;
import com.CertiSafe.secu.Repository.RepositoryRol;
import com.CertiSafe.secu.Repository.RepositoryTaller;
import com.CertiSafe.secu.Repository.RepositoryTipoCertificacion;
import jakarta.annotation.PostConstruct;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import com.CertiSafe.secu.Repository.RepositoryUsuario;

import java.time.LocalDate;
import java.time.LocalTime;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(
            RepositoryRol repositoryRol,
            RepositoryTipoCertificacion repositoryTipoCertificacion,
            RepositoryUsuario repositoryUsuario,
            RepositoryTaller repositoryTaller,
            PasswordEncoder passwordEncoder) {

        return args -> {

            // Roles
            if (repositoryRol.count() == 0) {

                repositoryRol.save(new Rol(null, "ADMIN"));
                repositoryRol.save(new Rol(null, "OPERARIO"));
                repositoryRol.save(new Rol(null, "CAPACITADOR"));
            }

            // Tipos de certificación
            if (repositoryTipoCertificacion.count() == 0) {

                repositoryTipoCertificacion.save(
                        new TipoCertificacion(null, "Trabajo en alturas")
                );

                repositoryTipoCertificacion.save(
                        new TipoCertificacion(null, "Manejo de productos químicos")
                );

                repositoryTipoCertificacion.save(
                        new TipoCertificacion(null, "Espacios confinados")
                );
            }

            // Usuarios
            if (repositoryUsuario.count() == 0) {

                Rol admin = repositoryRol.findByNombre("ADMIN")
                        .orElseThrow();

                Rol operario = repositoryRol.findByNombre("OPERARIO")
                        .orElseThrow();

                Rol capacitador = repositoryRol.findByNombre("CAPACITADOR")
                        .orElseThrow();

                repositoryUsuario.save(new Usuario(
                        null,
                        "1000000001",
                        "Jhon",
                        "Suarez",
                        "admin@certisafe.com",
                        passwordEncoder.encode("123456"),
                        EstadoUsuario.ACTIVO,
                        admin
                ));

                repositoryUsuario.save(new Usuario(
                        null,
                        "1000000002",
                        "Pedro",
                        "Gómez",
                        "pedro@certisafe.com",
                        passwordEncoder.encode("123456"),
                        EstadoUsuario.ACTIVO,
                        operario
                ));

                repositoryUsuario.save(new Usuario(
                        null,
                        "1000000003",
                        "Luis",
                        "Rodríguez",
                        "luis@certisafe.com",
                        passwordEncoder.encode("123456"),
                        EstadoUsuario.ACTIVO,
                        operario
                ));

                repositoryUsuario.save(new Usuario(
                        null,
                        "1000000004",
                        "Ana",
                        "Martínez",
                        "ana@certisafe.com",
                        passwordEncoder.encode("123456"),
                        EstadoUsuario.ACTIVO,
                        capacitador
                ));
                repositoryUsuario.save(new Usuario(
                        null,
                        "1000000005",
                        "Jairo",
                        "Suarez",
                        "jairo@certisafe.com",
                        passwordEncoder.encode("123456"),
                        EstadoUsuario.ACTIVO,
                        capacitador
                ));
                repositoryUsuario.save(new Usuario(
                        null,
                        "1000000006",
                        "Camila",
                        "Lopez",
                        "camila@certisafe.com",
                        passwordEncoder.encode("123456"),
                        EstadoUsuario.ACTIVO,
                        capacitador
                ));
                repositoryUsuario.save(new Usuario(
                        null,
                        "1000000007",
                        "Orlando",
                        "Ruiz",
                        "orlando@certisafe.com",
                        passwordEncoder.encode("123456"),
                        EstadoUsuario.INACTIVO,
                        operario
                ));
                repositoryUsuario.save(new Usuario(
                        null,
                        "1000000008",
                        "Daniela",
                        "Perez",
                        "daniela@certisafe.com",
                        passwordEncoder.encode("123456"),
                        EstadoUsuario.ACTIVO,
                        operario
                ));
                repositoryUsuario.save(new Usuario(
                        null,
                        "1000000009",
                        "Maria",
                        "Gonzalez",
                        "maria@certisafe.com",
                        passwordEncoder.encode("123456"),
                        EstadoUsuario.ACTIVO,
                        operario
                ));
            }

            // Talleres
            if (repositoryTaller.count() == 0) {

                TipoCertificacion alturas = repositoryTipoCertificacion
                        .findByNombre("Trabajo en alturas")
                        .orElseThrow();

                TipoCertificacion quimicos = repositoryTipoCertificacion
                        .findByNombre("Manejo de productos químicos")
                        .orElseThrow();

                TipoCertificacion espaciosConfinados = repositoryTipoCertificacion
                        .findByNombre("Espacios confinados")
                        .orElseThrow();

                Usuario capacitadorAna=
                        repositoryUsuario.findByDocumento("1000000004")
                                .orElseThrow();

                Usuario capacitadorJairo=
                        repositoryUsuario.findByDocumento("1000000005")
                                .orElseThrow();

                Usuario capacitadorCamila=
                        repositoryUsuario.findByDocumento("1000000006")
                                .orElseThrow();


                Taller taller1 = new Taller();
                taller1.setNombre("Trabajo seguro en alturas");
                taller1.setDescripcion("Capacitación sobre procedimientos y medidas de seguridad para trabajo en alturas.");
                taller1.setFecha(LocalDate.of(2026, 8, 14));
                taller1.setHoraInicio(LocalTime.of(8, 0));
                taller1.setHoraFin(LocalTime.of(12, 0));
                taller1.setAforo(5);
                taller1.setEstado(EstadoTaller.PROGRAMADO);
                taller1.setTipoCertificacion(alturas);
                taller1.setCapacitador(capacitadorAna);

                repositoryTaller.save(taller1);


                Taller taller2 = new Taller();
                taller2.setNombre("Manejo seguro de productos químicos");
                taller2.setDescripcion("Capacitación sobre manipulación y prevención de riesgos con productos químicos.");
                taller2.setFecha(LocalDate.of(2026, 8, 15));
                taller2.setHoraInicio(LocalTime.of(8, 0));
                taller2.setHoraFin(LocalTime.of(12, 0));
                taller2.setAforo(5);
                taller2.setEstado(EstadoTaller.PROGRAMADO);
                taller2.setTipoCertificacion(quimicos);
                taller2.setCapacitador(capacitadorJairo);
                repositoryTaller.save(taller2);


                Taller taller3 = new Taller();
                taller3.setNombre("Seguridad en espacios confinados");
                taller3.setDescripcion("Capacitación sobre identificación de riesgos y procedimientos en espacios confinados.");
                taller3.setFecha(LocalDate.of(2026, 8, 16));
                taller3.setHoraInicio(LocalTime.of(8, 0));
                taller3.setHoraFin(LocalTime.of(12, 0));
                taller3.setAforo(5);
                taller3.setEstado(EstadoTaller.PROGRAMADO);
                taller3.setTipoCertificacion(espaciosConfinados);
                taller3.setCapacitador(capacitadorCamila);

                repositoryTaller.save(taller3);
            }
        };
    }
}
