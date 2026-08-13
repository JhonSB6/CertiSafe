package com.CertiSafe.secu.Observer;

public interface SubjectTaller {

    void agregarObserver(ObserverTaller observer);

    void eliminarObserver(ObserverTaller observer);

    void notificarObservers(EventoTaller evento);
}