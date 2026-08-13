package com.CertiSafe.secu.Observer;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class PublisherTaller implements SubjectTaller {

    private final List<ObserverTaller> observers =
            new ArrayList<>();

    public PublisherTaller(
            ObserverNotificacionTaller observerNotificacionTaller) {

        observers.add(observerNotificacionTaller);
    }

    @Override
    public void agregarObserver(
            ObserverTaller observer) {

        observers.add(observer);
    }

    @Override
    public void eliminarObserver(
            ObserverTaller observer) {

        observers.remove(observer);
    }

    @Override
    public void notificarObservers(
            EventoTaller evento) {

        for (ObserverTaller observer : observers) {
            observer.actualizar(evento);
        }
    }
}
