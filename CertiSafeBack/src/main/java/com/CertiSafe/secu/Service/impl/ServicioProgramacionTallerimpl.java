package com.CertiSafe.secu.Service.impl;

import com.CertiSafe.secu.Entity.Taller;
import com.CertiSafe.secu.Enum.EstadoTaller;
import com.CertiSafe.secu.Observer.PublisherTaller;
import com.CertiSafe.secu.Repository.RepositoryTaller;
import com.CertiSafe.secu.Service.ServiceTaller;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ServicioProgramacionTallerimpl {

    private final RepositoryTaller repositoryTaller;
    private final ServiceTaller serviceTaller;
    private final PublisherTaller publisherTaller;

    @Scheduled(fixedRate = 30000)
    public void revisarTalleres() {

        LocalDateTime ahora = LocalDateTime.now();

        List<Taller> talleres =
                repositoryTaller.findAll();

        for (Taller taller : talleres) {

            LocalDateTime inicio =
                    LocalDateTime.of(
                            taller.getFecha(),
                            taller.getHoraInicio());

            LocalDateTime fin =
                    LocalDateTime.of(
                            taller.getFecha(),
                            taller.getHoraFin());


            // ==========================================
            // 1. TALLER PROGRAMADO
            // ==========================================

            if (taller.getEstado() == EstadoTaller.PROGRAMADO) {

                LocalDateTime tresMinutosAntes =
                        inicio.minusMinutes(3);

                LocalDateTime unMinutoAntes =
                        inicio.minusMinutes(1);


                // Tres minutos antes
                if (!ahora.isBefore(tresMinutosAntes)
                        && ahora.isBefore(unMinutoAntes)) {

                    serviceTaller.revisarAforoTresMinutosAntes(
                            taller.getIdtaller());
                }


                // Un minuto antes
                if (!ahora.isBefore(unMinutoAntes)
                        && ahora.isBefore(inicio)) {

                    serviceTaller.revisarAforoUnMinutoAntes(
                            taller.getIdtaller());
                }


                // Llegó la hora de inicio
                if (!ahora.isBefore(inicio)) {

                    serviceTaller.iniciarAutomaticamente(
                            taller.getIdtaller());
                }
            }


            // ==========================================
            // 2. TALLER EN CURSO
            // ==========================================

            if (taller.getEstado() == EstadoTaller.EN_CURSO) {

                if (!ahora.isBefore(fin)) {

                    serviceTaller.finalizarTaller(
                            taller.getIdtaller());
                }
            }
        }
    }
}

