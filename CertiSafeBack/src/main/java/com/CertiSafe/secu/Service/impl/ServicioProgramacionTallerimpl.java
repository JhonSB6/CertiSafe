package com.CertiSafe.secu.Service.impl;

import com.CertiSafe.secu.Entity.Taller;
import com.CertiSafe.secu.Enum.EstadoTaller;
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

    @Scheduled(fixedRate = 30000)
    public void revisarTalleresProximos() {

        LocalDateTime ahora = LocalDateTime.now();

        List<Taller> talleres =
                repositoryTaller.findAll();

        for (Taller taller : talleres) {

            if (taller.getEstado() != EstadoTaller.PROGRAMADO) {
                continue;
            }

            LocalDateTime inicio =
                    LocalDateTime.of(
                            taller.getFecha(),
                            taller.getHoraInicio());

            LocalDateTime unMinutoAntes =
                    inicio.minusMinutes(1);

            if (!ahora.isBefore(unMinutoAntes)
                    && ahora.isBefore(inicio)) {

                serviceTaller.revisarAforo(
                        taller.getIdtaller());
            }

            if (!ahora.isBefore(inicio)) {

                serviceTaller.iniciarTaller(
                        taller.getIdtaller());
            }
        }
    }
}
