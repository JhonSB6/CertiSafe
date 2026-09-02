package com.CertiSafe.secu.Service.impl;

import com.CertiSafe.secu.Dto.DetalleOperarioTallerResponse;
import com.CertiSafe.secu.Dto.DetalleTallerResponse;
import com.CertiSafe.secu.Entity.*;
import com.CertiSafe.secu.Enum.*;
import com.CertiSafe.secu.Exception.ReglaNegocioException;
import com.CertiSafe.secu.Observer.EventoTaller;
import com.CertiSafe.secu.Enum.EstadoDecisionCertificacion;
import com.CertiSafe.secu.Observer.PublisherTaller;
import com.CertiSafe.secu.Repository.*;
import com.CertiSafe.secu.Service.ServiceTaller;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.Arrays;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceTallerimpl implements ServiceTaller {

    private final RepositoryTaller repositoryTaller;
    private final RepositoryInscripcionTaller repositoryInscripcionTaller;
    private final RepositoryUsuario repositoryUsuario;
    private final RepositoryCertificacion repositoryCertificacion;
    private final RepositoryNotificacion repositoryNotificacion;
    private final RepositoryAsistenciaTaller repositoryAsistenciaTaller;
    private final RepositoryHistorialCertificacion repositoryHistorialCertificacion;
    private final PublisherTaller publisherTaller;
    private static final long DURACION_MINIMA_MINUTOS = 30;
    private static final long DURACION_MAXIMA_HORAS = 8;
    private static final long MARGEN_TALLERES_MINUTOS = 30;

    private void validarFechaHoraYDuracion(Taller taller) {

        if (taller.getFecha() == null) {
            throw new ReglaNegocioException(
                    "La fecha del taller es obligatoria");
        }

        if (taller.getHoraInicio() == null) {
            throw new ReglaNegocioException(
                    "La hora de inicio del taller es obligatoria");
        }

        if (taller.getHoraFin() == null) {
            throw new ReglaNegocioException(
                    "La hora de finalización del taller es obligatoria");
        }

        LocalDateTime inicio = LocalDateTime.of(
                taller.getFecha(),
                taller.getHoraInicio());

        LocalDateTime fin = LocalDateTime.of(
                taller.getFecha(),
                taller.getHoraFin());

        LocalDateTime ahora = LocalDateTime.now();

        if (!inicio.isAfter(ahora)) {
            throw new ReglaNegocioException(
                    "El taller debe programarse para una fecha u hora futura");
        }

        if (!fin.isAfter(inicio)) {
            throw new ReglaNegocioException(
                    "La hora de finalización debe ser mayor que la hora de inicio");
        }

        long duracionMinutos =
                Duration.between(inicio, fin).toMinutes();

        if (duracionMinutos < DURACION_MINIMA_MINUTOS) {
            throw new ReglaNegocioException(
                    "La duración mínima del taller es de 30 minutos");
        }

        if (duracionMinutos > DURACION_MAXIMA_HORAS * 60) {
            throw new ReglaNegocioException(
                    "La duración máxima del taller es de 8 horas");
        }
    }

    private void validarDisponibilidadCapacitador(
            Long idCapacitador,
            LocalDate fecha,
            LocalTime horaInicio,
            LocalTime horaFin,
            Long idTallerExcluir) {

        LocalTime horaInicioConMargen =
                horaInicio.minusMinutes(MARGEN_TALLERES_MINUTOS);

        LocalTime horaFinConMargen =
                horaFin.plusMinutes(MARGEN_TALLERES_MINUTOS);

        List<EstadoTaller> estadosQueBloquean =
                Arrays.asList(
                        EstadoTaller.PROGRAMADO,
                        EstadoTaller.EN_CURSO
                );

        List<Taller> conflictos =
                repositoryTaller.buscarConflictosCapacitador(
                        idCapacitador,
                        fecha,
                        horaInicioConMargen,
                        horaFinConMargen,
                        estadosQueBloquean,
                        idTallerExcluir
                );

        if (conflictos.isEmpty()) {
            return;
        }

        /*
         * Revisamos todos los talleres encontrados para identificar
         * exactamente el motivo del conflicto.
         */
        for (Taller conflicto : conflictos) {

            LocalTime inicioConflicto =
                    conflicto.getHoraInicio();

            LocalTime finConflicto =
                    conflicto.getHoraFin();

            /*
             * Verificar si existe solapamiento real entre horarios.
             */
            boolean haySolapamiento =
                    horaInicio.isBefore(finConflicto)
                            && horaFin.isAfter(inicioConflicto);

            String nombreCapacitador =
                    conflicto.getCapacitador().getNombre()
                            + " "
                            + conflicto.getCapacitador().getApellido();

            String estadoTaller =
                    conflicto.getEstado().name();

            /*
             * =====================================================
             * CONFLICTO DIRECTO DE HORARIO
             * =====================================================
             */

            if (haySolapamiento) {

                throw new ReglaNegocioException(
                        "No es posible crear el taller porque el "
                                + "capacitador "
                                + nombreCapacitador
                                + " ya tiene un taller en estado "
                                + estadoTaller
                                + " dentro de esa franja horaria "
                                + "("
                                + inicioConflicto
                                + " - "
                                + finConflicto
                                + ")."
                );
            }

            /*
             * =====================================================
             * CONFLICTO POR MARGEN DE 30 MINUTOS
             * =====================================================
             */

            throw new ReglaNegocioException(
                    "No es posible crear el taller porque el "
                            + "capacitador "
                            + nombreCapacitador
                            + " debe tener un margen mínimo de "
                            + "30 minutos entre talleres. "
                            + "Su otro taller está programado de "
                            + inicioConflicto
                            + " a "
                            + finConflicto
                            + "."
            );
        }
    }


    @Override
    public List<Taller> listarTalleres() {
        return repositoryTaller.findAll();
    }

    @Override
    public Optional<Taller> buscarPorId(Long id) {
        return repositoryTaller.findById(id);
    }

    @Override
    public Taller guardar(Taller taller) {

        // =========================================================
        // VALIDAR FECHA, HORA Y DURACIÓN
        // =========================================================

        validarFechaHoraYDuracion(taller);

        // =========================================================
        // VALIDAR CAPACITADOR
        // =========================================================

        if (taller.getCapacitador() == null) {
            throw new ReglaNegocioException(
                    "El taller debe tener un capacitador");
        }

        Long idCapacitador =
                taller.getCapacitador().getIdusuario();

        Usuario capacitador =
                repositoryUsuario.findById(idCapacitador)
                        .orElseThrow(() ->
                                new ReglaNegocioException(
                                        "El capacitador no existe"));

        if (capacitador.getEstado() != EstadoUsuario.ACTIVO) {
            throw new ReglaNegocioException(
                    "El capacitador se encuentra inactivo");
        }

        if (!capacitador.getRol().getNombre()
                .equalsIgnoreCase("CAPACITADOR")) {

            throw new ReglaNegocioException(
                    "El usuario seleccionado no tiene rol de capacitador");
        }

        // =========================================================
        // VALIDAR DISPONIBILIDAD DEL CAPACITADOR
        // =========================================================

        validarDisponibilidadCapacitador(
                capacitador.getIdusuario(),
                taller.getFecha(),
                taller.getHoraInicio(),
                taller.getHoraFin(),
                null
        );

        // =========================================================
        // EL TALLER SIEMPRE NACE PROGRAMADO
        // =========================================================

        taller.setCapacitador(capacitador);
        taller.setEstado(EstadoTaller.PROGRAMADO);

        return repositoryTaller.save(taller);
    }


    @Override
    public Taller actualizar(Long id, Taller taller) {

        Taller tallerExistente =
                repositoryTaller.findById(id)
                        .orElseThrow(() ->
                                new ReglaNegocioException(
                                        "Taller no encontrado con id: " + id));

        // =========================================================
        // SOLO SE PUEDEN EDITAR TALLERES PROGRAMADOS
        // =========================================================

        if (tallerExistente.getEstado() != EstadoTaller.PROGRAMADO) {
            throw new ReglaNegocioException(
                    "Solo se pueden editar talleres en estado PROGRAMADO");
        }

        // =========================================================
        // VALIDAR FECHA, HORA Y DURACIÓN
        // =========================================================

        validarFechaHoraYDuracion(taller);

        // =========================================================
        // VALIDAR CAPACITADOR
        // =========================================================

        if (taller.getCapacitador() == null) {
            throw new ReglaNegocioException(
                    "El taller debe tener un capacitador");
        }

        Long idCapacitador =
                taller.getCapacitador().getIdusuario();

        Usuario capacitador =
                repositoryUsuario.findById(idCapacitador)
                        .orElseThrow(() ->
                                new ReglaNegocioException(
                                        "El capacitador no existe"));

        if (capacitador.getEstado() != EstadoUsuario.ACTIVO) {
            throw new ReglaNegocioException(
                    "El capacitador se encuentra inactivo");
        }

        if (!capacitador.getRol().getNombre()
                .equalsIgnoreCase("CAPACITADOR")) {

            throw new ReglaNegocioException(
                    "El usuario seleccionado no tiene rol de capacitador");
        }

        // =========================================================
        // VALIDAR DISPONIBILIDAD
        // EXCLUYENDO EL MISMO TALLER
        // =========================================================

        validarDisponibilidadCapacitador(
                capacitador.getIdusuario(),
                taller.getFecha(),
                taller.getHoraInicio(),
                taller.getHoraFin(),
                id
        );

        // =========================================================
        // ACTUALIZAR DATOS
        // =========================================================

        tallerExistente.setNombre(taller.getNombre());
        tallerExistente.setDescripcion(taller.getDescripcion());
        tallerExistente.setFecha(taller.getFecha());
        tallerExistente.setHoraInicio(taller.getHoraInicio());
        tallerExistente.setHoraFin(taller.getHoraFin());
        tallerExistente.setAforo(taller.getAforo());
        tallerExistente.setTipoCertificacion(
                taller.getTipoCertificacion());
        tallerExistente.setCapacitador(capacitador);

        return repositoryTaller.save(tallerExistente);
    }

    @Override
    public void finalizarTaller(Long idTaller) {

        Taller taller =
                repositoryTaller.findById(idTaller)
                        .orElseThrow(() ->
                                new ReglaNegocioException(
                                        "Taller no encontrado con id: "
                                                + idTaller
                                ));

        if (taller.getEstado() != EstadoTaller.EN_CURSO) {

            throw new ReglaNegocioException(
                    "Solo se puede finalizar un taller que se encuentre EN_CURSO"
            );
        }

        LocalDateTime fechaHoraFinProgramada =
                LocalDateTime.of(
                        taller.getFecha(),
                        taller.getHoraFin()
                );

        LocalDateTime ahora =
                LocalDateTime.now();

        if (ahora.isBefore(fechaHoraFinProgramada)) {

            throw new ReglaNegocioException(
                    "El taller todavía no puede finalizar. "
                            + "La hora programada de finalización es "
                            + taller.getHoraFin()
            );
        }

        taller.setEstado(
                EstadoTaller.FINALIZADO
        );

        repositoryTaller.save(taller);
    }

    @Override
    public void desactivar(Long id) {

        Taller taller = repositoryTaller.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Taller no encontrado con id: " + id));

        taller.setEstado(EstadoTaller.CANCELADO);

        repositoryTaller.save(taller);
    }


    @Override
    public void iniciarTaller(Long id, boolean forzarInicio) {

        Taller taller =
                repositoryTaller.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Taller no encontrado con id: "
                                                + id));

        if (taller.getEstado() != EstadoTaller.PROGRAMADO) {

            throw new RuntimeException(
                    "El taller no se encuentra en estado PROGRAMADO"
            );
        }

        long confirmadas =
                repositoryInscripcionTaller
                        .countByTallerIdtallerAndEstado(
                                id,
                                EstadoInscripcion.CONFIRMADA);

        if (confirmadas < taller.getAforo() && !forzarInicio) {

            long faltantes =
                    taller.getAforo() - confirmadas;

            throw new ReglaNegocioException(
                    "No se puede iniciar el taller. "
                            + "Faltan "
                            + faltantes
                            + " operarios confirmados."
            );
        }

        List<InscripcionTaller> inscripcionesConfirmadas =
                repositoryInscripcionTaller
                        .findByTallerIdtallerAndEstado(
                                id,
                                EstadoInscripcion.CONFIRMADA);

        /*
         * Registrar asistencia de los operarios
         * confirmados al momento de iniciar el taller.
         */
        for (InscripcionTaller inscripcion :
                inscripcionesConfirmadas) {

            AsistenciaTaller asistencia =
                    new AsistenciaTaller();

            asistencia.setTaller(taller);

            asistencia.setUsuario(
                    inscripcion.getUsuario()
            );

            asistencia.setFechainicio(
                    java.sql.Date.valueOf(
                            taller.getFecha()
                    )
            );

            asistencia.setFechafin(
                    java.sql.Date.valueOf(
                            taller.getFecha()
                    )
            );

            asistencia.setEstado(
                    EstadoAsistencia.PRESENTE
            );

            asistencia.setDecisionCertificacion(null);

            repositoryAsistenciaTaller.save(
                    asistencia
            );
        }

        /*
         * EL ESTADO CAMBIA ÚNICAMENTE POR ACCIÓN
         * DEL CAPACITADOR.
         */
        taller.setEstado(
                EstadoTaller.EN_CURSO
        );

        repositoryTaller.save(taller);
    }

    // Si se quiere el taller con inicio automatico al llegar la hora
    {/*@Override
    public void iniciarAutomaticamente(Long idTaller) {

        Taller taller =
                repositoryTaller.findById(idTaller)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Taller no encontrado con id: "
                                                + idTaller));

        if (taller.getEstado() != EstadoTaller.PROGRAMADO) {
            return;
        }

        iniciarTaller(idTaller, true);

        System.out.println(
                "Taller iniciado automáticamente: "
                        + taller.getNombre());
    } */}


    @Override
    public List<Usuario> buscarOperariosDisponibles(Long idTaller) {

        Taller taller = repositoryTaller.findById(idTaller)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Taller no encontrado con id: " + idTaller));

        Long idTipoCertificacion =
                taller.getTipoCertificacion().getIdTipoCertificacion();

        List<Usuario> operarios =
                repositoryUsuario.findByRolNombreAndEstado("OPERARIO", EstadoUsuario.ACTIVO);

        return operarios.stream()
                .filter(usuario ->
                        !repositoryCertificacion
                                .findByUsuarioIdusuarioAndTipoCertificacionIdTipoCertificacionAndEstado(
                                        usuario.getIdusuario(),
                                        idTipoCertificacion,
                                        EstadoCertificacion.VIGENTE)
                                .isPresent())
                .filter(usuario ->
                        !repositoryInscripcionTaller
                                .existsByTallerIdtallerAndUsuarioIdusuarioAndEstadoNot(
                                        idTaller,
                                        usuario.getIdusuario(),
                                        EstadoInscripcion.CANCELADA))
                .collect(Collectors.toList());
    }

    @Override
    public void revisarAforoTresMinutosAntes(Long idTaller) {

        Taller taller =
                repositoryTaller.findById(idTaller)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Taller no encontrado con id: "
                                                + idTaller));

        if (taller.getEstado() != EstadoTaller.PROGRAMADO) {
            return;
        }

        long confirmadas =
                repositoryInscripcionTaller
                        .countByTallerIdtallerAndEstado(
                                idTaller,
                                EstadoInscripcion.CONFIRMADA);

        /*
         * Si el aforo ya está completo,
         * no hacemos nada.
         */
        if (confirmadas >= taller.getAforo()) {
            return;
        }

        long faltantes =
                taller.getAforo() - confirmadas;

        List<Usuario> disponibles =
                buscarOperariosDisponibles(idTaller);

        System.out.println(
                "Revisión 3 minutos antes"
                        + " | Taller: "
                        + taller.getNombre()
                        + " | Confirmadas: "
                        + confirmadas
                        + " | Faltantes: "
                        + faltantes
                        + " | Disponibles: "
                        + disponibles.size()
        );

        /*
         * Los disponibles entran a la COLA.
         */
        for (Usuario usuario : disponibles) {

            boolean yaInscrito =
                    repositoryInscripcionTaller
                            .existsByTallerIdtallerAndUsuarioIdusuarioAndEstadoNot(
                                    idTaller,
                                    usuario.getIdusuario(),
                                    EstadoInscripcion.CANCELADA);

            if (yaInscrito) {
                continue;
            }

            InscripcionTaller inscripcion =
                    new InscripcionTaller();

            inscripcion.setTaller(taller);
            inscripcion.setUsuario(usuario);

            inscripcion.setEstado(
                    EstadoInscripcion.PENDIENTE);

            inscripcion.setEstadoTipoProgramacion(
                    EstadoTipoProgramacion.COLA);

            inscripcion.setFechaInscripcion(
                    new Date(System.currentTimeMillis()));

            repositoryInscripcionTaller.save(inscripcion);
        }
    }

    @Override
    public void revisarAforoUnMinutoAntes(Long idTaller) {

        Taller taller =
                repositoryTaller.findById(idTaller)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Taller no encontrado con id: "
                                                + idTaller));

        if (taller.getEstado() != EstadoTaller.PROGRAMADO) {
            return;
        }

        long confirmadas =
                repositoryInscripcionTaller
                        .countByTallerIdtallerAndEstado(
                                idTaller,
                                EstadoInscripcion.CONFIRMADA);

        // Si el aforo ya está completo,
        // NO se genera ninguna notificación.
        if (confirmadas >= taller.getAforo()) {
            return;
        }

        // El aforo sigue incompleto.
        EventoTaller evento =
                new EventoTaller(
                        taller,
                        TipoEventoTaller.AFORO_INCOMPLETO_TRES_MINUTOS);

        publisherTaller.notificarObservers(evento);
    }

    @Override
    public Map<String, Object> obtenerResumen(Long idTaller) {

        Taller taller = repositoryTaller.findById(idTaller)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Taller no encontrado con id: " + idTaller));

        long programados =
                repositoryInscripcionTaller
                        .countInscripcionesActivas(idTaller);

        long confirmados =
                repositoryInscripcionTaller
                        .countByTallerIdtallerAndEstado(
                                idTaller,
                                EstadoInscripcion.CONFIRMADA);

        long pendientes =
                repositoryInscripcionTaller
                        .countByTallerIdtallerAndEstado(
                                idTaller,
                                EstadoInscripcion.PENDIENTE);

        Map<String, Object> resumen = new HashMap<>();

        resumen.put("aforo", taller.getAforo());
        resumen.put("programados", programados);
        resumen.put("confirmados", confirmados);
        resumen.put("pendientes", pendientes);

        return resumen;
    }

    @Override
    public List<Taller> listarTalleresFinalizadosPorCapacitador(
            Long idCapacitador) {

        return repositoryTaller
                .findByCapacitadorIdusuarioAndEstado(
                        idCapacitador,
                        EstadoTaller.FINALIZADO
                );
    }

    @Override
    public List<Taller> listarPorCapacitador(
            Long idCapacitador,
            EstadoTaller estado) {

        return repositoryTaller
                .findByCapacitadorIdusuarioAndEstado(
                        idCapacitador,
                        estado);
    }

    @Transactional
    @Override
    public void eliminarTaller(Long idTaller) {

        Taller taller =
                repositoryTaller.findById(idTaller)
                        .orElseThrow(() ->
                                new ReglaNegocioException(
                                        "Taller no encontrado con id: "
                                                + idTaller
                                )
                        );

        // =========================================
        // VALIDAR ESTADO
        // =========================================

        if (taller.getEstado() != EstadoTaller.PROGRAMADO) {

            throw new ReglaNegocioException(
                    "Solo se pueden eliminar talleres en estado PROGRAMADO"
            );
        }

        // =========================================
        // ELIMINAR INSCRIPCIONES
        // =========================================

        repositoryInscripcionTaller
                .deleteByTallerIdtaller(idTaller);

        // =========================================
        // ELIMINAR NOTIFICACIONES
        // =========================================

        repositoryNotificacion
                .deleteByTallerIdtaller(idTaller);

        // =========================================
        // ELIMINAR TALLER
        // =========================================

        repositoryTaller.delete(taller);
    }

    @Override
    public DetalleTallerResponse obtenerDetalleTaller(Long idTaller) {

        Taller taller =
                repositoryTaller.findById(idTaller)
                        .orElseThrow(() ->
                                new ReglaNegocioException(
                                        "Taller no encontrado con id: "
                                                + idTaller
                                )
                        );

        /*
         * =========================================
         * RESUMEN
         * =========================================
         */

        long programados =
                repositoryInscripcionTaller
                        .countInscripcionesActivas(idTaller);

        long confirmados =
                repositoryInscripcionTaller
                        .countByTallerIdtallerAndEstado(
                                idTaller,
                                EstadoInscripcion.CONFIRMADA
                        );

        long pendientes =
                repositoryInscripcionTaller
                        .countByTallerIdtallerAndEstado(
                                idTaller,
                                EstadoInscripcion.PENDIENTE
                        );


        /*
         * =========================================
         * OPERARIOS
         * =========================================
         */

        List<InscripcionTaller> inscripciones =
                repositoryInscripcionTaller
                        .findByTallerIdtaller(idTaller);


        List<DetalleOperarioTallerResponse> operarios =
                inscripciones.stream()
                        .map(inscripcion -> {

                            Usuario usuario =
                                    inscripcion.getUsuario();

                            String certificacion = "No certifica";
                            String motivo = "";


                            /*
                             * =====================================
                             * BUSCAR ASISTENCIA DEL OPERARIO
                             * =====================================
                             */

                            Optional<AsistenciaTaller> asistenciaEncontrada =
                                    repositoryAsistenciaTaller
                                            .findByTallerIdtallerAndUsuarioIdusuario(
                                                    idTaller,
                                                    usuario.getIdusuario()
                                            );


                            /*
                             * =====================================
                             * BUSCAR HISTORIAL DE CERTIFICACIÓN
                             * =====================================
                             */

                            if (asistenciaEncontrada.isPresent()) {

                                AsistenciaTaller asistencia =
                                        asistenciaEncontrada.get();

                                Optional<HistorialCertificacion> historialEncontrado =
                                        repositoryHistorialCertificacion
                                                .findByAsistenciaIdasistencia(
                                                        asistencia.getIdasistencia()
                                                );


                                if (historialEncontrado.isPresent()) {

                                    HistorialCertificacion historial =
                                            historialEncontrado.get();


                                    /*
                                     * =================================
                                     * NO CERTIFICADO
                                     * =================================
                                     */

                                    if (historial.getDecision()
                                            == EstadoDecisionCertificacion.NO_CERTIFICADO) {

                                        certificacion = "No";

                                        motivo =
                                                historial.getMotivoNoCertificacion();

                                    }


                                    /*
                                     * =================================
                                     * CERTIFICADO
                                     * =================================
                                     */

                                    else if (historial.getDecision()
                                            == EstadoDecisionCertificacion.CERTIFICADO) {

                                        certificacion = "Sí";

                                        motivo = "";

                                    }
                                }
                            }


                            /*
                             * =========================================
                             * CASO INSCRIPCIÓN CANCELADA
                             * =========================================
                             */

                            if (inscripcion.getEstado()
                                    == EstadoInscripcion.CANCELADA
                                    && motivo.isBlank()) {

                                motivo = "Inscripción cancelada";
                            }


                            return new DetalleOperarioTallerResponse(

                                    usuario.getDocumento(),

                                    usuario.getNombre(),

                                    usuario.getApellido(),

                                    inscripcion.getEstado() != null
                                            ? inscripcion.getEstado().name()
                                            : "",

                                    certificacion,

                                    motivo
                            );

                        })
                        .collect(Collectors.toList());


        /*
         * =========================================
         * CAPACITADOR
         * =========================================
         */

        String capacitador = "Sin asignar";

        if (taller.getCapacitador() != null) {

            capacitador =
                    taller.getCapacitador().getNombre()
                            + " "
                            + taller.getCapacitador().getApellido();
        }


        /*
         * =========================================
         * CREAR RESPUESTA
         * =========================================
         */

        return new DetalleTallerResponse(

                taller.getIdtaller(),

                taller.getNombre(),

                taller.getDescripcion(),

                taller.getFecha(),

                taller.getHoraInicio(),

                taller.getHoraFin(),

                taller.getAforo(),

                taller.getTipoCertificacion()
                        .getNombre(),

                taller.getEstado()
                        .name(),

                capacitador,

                programados,

                confirmados,

                pendientes,

                operarios
        );
    }


}
