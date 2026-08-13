package com.CertiSafe.secu.Observer;

import com.CertiSafe.secu.Entity.Taller;
import com.CertiSafe.secu.Enum.TipoEventoTaller;

public class EventoTaller {

    private final Taller taller;
    private final TipoEventoTaller tipoEvento;

    public EventoTaller(
            Taller taller,
            TipoEventoTaller tipoEvento) {

        this.taller = taller;
        this.tipoEvento = tipoEvento;
    }

    public Taller getTaller() {
        return taller;
    }

    public TipoEventoTaller getTipoEvento() {
        return tipoEvento;
    }
}
