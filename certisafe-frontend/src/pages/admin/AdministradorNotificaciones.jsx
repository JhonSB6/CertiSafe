import { useEffect, useState } from "react";
import "./AdministradorNotificaciones.css";

function AdministradorNotificaciones({ usuario }) {

    const [notificaciones, setNotificaciones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [marcandoTodas, setMarcandoTodas] = useState(false);

    // =========================================================
    // ESTADO PARA ACCIONES DE TALLER
    // =========================================================

    const [accionandoTaller, setAccionandoTaller] = useState(null);


    // =========================================================
    // CARGAR NOTIFICACIONES
    // =========================================================

    const cargarNotificaciones = async () => {

        if (!usuario?.idUsuario) {
            return;
        }

        try {

            setError("");

            const respuesta = await fetch(
                `http://localhost:8080/api/notificaciones/usuario/${usuario.idUsuario}`
            );

            if (!respuesta.ok) {

                throw new Error(
                    "Error al consultar las notificaciones"
                );
            }

            const datos = await respuesta.json();

            console.log(
                "NOTIFICACIONES RECIBIDAS:",
                datos
            );

            setNotificaciones(datos);

        } catch (error) {

            console.error(error);

            setError(
                "No fue posible cargar las notificaciones."
            );

        } finally {

            setCargando(false);
        }
    };


    useEffect(() => {

        cargarNotificaciones();

    }, [usuario?.idUsuario]);


    // =========================================================
    // MARCAR UNA NOTIFICACIÓN COMO LEÍDA
    // =========================================================

    const marcarComoLeida = async (notificacion) => {

        if (notificacion.leida) {
            return;
        }

        try {

            const respuesta = await fetch(
                `http://localhost:8080/api/notificaciones/${notificacion.idnotificacion}/leer`,
                {
                    method: "PUT"
                }
            );

            if (!respuesta.ok) {

                throw new Error(
                    "No fue posible marcar la notificación como leída."
                );
            }


            // =================================================
            // ACTUALIZAR VISUALMENTE
            // =================================================

            setNotificaciones((anteriores) =>
                anteriores.map((item) =>
                    item.idnotificacion ===
                    notificacion.idnotificacion
                        ? {
                            ...item,
                            leida: true
                        }
                        : item
                )
            );


            // Avisar al menú lateral
            window.dispatchEvent(
                new Event("notificaciones-actualizadas")
            );

        } catch (error) {

            console.error(
                "ERROR MARCANDO NOTIFICACIÓN:",
                error
            );

            setError(
                "No fue posible marcar la notificación como leída."
            );
        }
    };


    // =========================================================
    // INICIAR TALLER DESDE NOTIFICACIÓN
    // =========================================================

    const iniciarTallerDesdeNotificacion = async (
        event,
        notificacion
    ) => {

        event.stopPropagation();

        const idTaller =
            notificacion.taller?.idtaller;

        if (!idTaller) {

            setError(
                "No fue posible identificar el taller de la notificación."
            );

            return;
        }

        try {

            setError("");

            setAccionandoTaller(
                notificacion.idnotificacion
            );


            // =================================================
            // INICIAR TALLER FORZANDO EL INICIO
            // =================================================

            const respuesta = await fetch(
                `http://localhost:8080/api/talleres/${idTaller}/iniciar?forzarInicio=true`,
                {
                    method: "POST"
                }
            );


            if (!respuesta.ok) {

                let mensaje =
                    "No fue posible iniciar el taller.";

                try {

                    const texto =
                        await respuesta.text();

                    if (texto) {
                        mensaje = texto;
                    }

                } catch {
                    // Se mantiene el mensaje predeterminado
                }

                throw new Error(mensaje);
            }


            // =================================================
            // MARCAR NOTIFICACIÓN COMO LEÍDA
            // =================================================

            await marcarComoLeida(notificacion);


            // =================================================
            // RECARGAR NOTIFICACIONES
            // =================================================

            await cargarNotificaciones();

        } catch (error) {

            console.error(
                "ERROR INICIANDO TALLER:",
                error
            );

            setError(
                error.message ||
                "No fue posible iniciar el taller."
            );

        } finally {

            setAccionandoTaller(null);
        }
    };


    // =========================================================
    // CANCELAR TALLER DESDE NOTIFICACIÓN
    // =========================================================

    const cancelarTallerDesdeNotificacion = async (
        event,
        notificacion
    ) => {

        event.stopPropagation();

        const idTaller =
            notificacion.taller?.idtaller;

        if (!idTaller) {

            setError(
                "No fue posible identificar el taller de la notificación."
            );

            return;
        }

        try {

            setError("");

            setAccionandoTaller(
                notificacion.idnotificacion
            );


            // =================================================
            // CANCELAR TALLER
            // =================================================

            const respuesta = await fetch(
                `http://localhost:8080/api/talleres/${idTaller}/cancelar`,
                {
                    method: "PUT"
                }
            );


            if (!respuesta.ok) {

                let mensaje =
                    "No fue posible cancelar el taller.";

                try {

                    const texto =
                        await respuesta.text();

                    if (texto) {
                        mensaje = texto;
                    }

                } catch {
                    // Se mantiene el mensaje predeterminado
                }

                throw new Error(mensaje);
            }


            // =================================================
            // MARCAR NOTIFICACIÓN COMO LEÍDA
            // =================================================

            await marcarComoLeida(notificacion);


            // =================================================
            // RECARGAR NOTIFICACIONES
            // =================================================

            await cargarNotificaciones();

        } catch (error) {

            console.error(
                "ERROR CANCELANDO TALLER:",
                error
            );

            setError(
                error.message ||
                "No fue posible cancelar el taller."
            );

        } finally {

            setAccionandoTaller(null);
        }
    };


    // =========================================================
    // MARCAR TODAS COMO LEÍDAS
    // =========================================================

    const marcarTodasComoLeidas = async () => {

        if (!usuario?.idUsuario) {
            return;
        }

        const existenNoLeidas =
            notificaciones.some(
                (notificacion) =>
                    !notificacion.leida
            );

        if (!existenNoLeidas) {
            return;
        }

        try {

            setMarcandoTodas(true);

            const respuesta = await fetch(
                `http://localhost:8080/api/notificaciones/usuario/${usuario.idUsuario}/leer-todas`,
                {
                    method: "PUT"
                }
            );

            if (!respuesta.ok) {

                throw new Error(
                    "No fue posible marcar todas las notificaciones."
                );
            }


            // =================================================
            // ACTUALIZAR TODAS VISUALMENTE
            // =================================================

            setNotificaciones((anteriores) =>
                anteriores.map((notificacion) => ({
                    ...notificacion,
                    leida: true
                }))
            );


            // Avisar al menú lateral
            window.dispatchEvent(
                new Event("notificaciones-actualizadas")
            );

        } catch (error) {

            console.error(
                "ERROR MARCANDO TODAS:",
                error
            );

            setError(
                "No fue posible marcar todas las notificaciones como leídas."
            );

        } finally {

            setMarcandoTodas(false);
        }
    };


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <section className="seccion-administrador">

            <div className="notificaciones-encabezado">

                <div>

                    <h1>
                        Notificaciones
                    </h1>

                    <p>
                        Notificaciones del sistema CertiSafe.
                    </p>

                </div>


                {!cargando &&
                    notificaciones.some(
                        (notificacion) =>
                            !notificacion.leida
                    ) && (

                        <button
                            className="btn-marcar-todas"
                            onClick={marcarTodasComoLeidas}
                            disabled={marcandoTodas}
                        >
                            {marcandoTodas
                                ? "Marcando..."
                                : "✓ Marcar todas como leídas"
                            }
                        </button>

                    )}

            </div>


            {/* =================================================
                CARGANDO
            ================================================= */}

            {cargando && (

                <div className="notificaciones-estado">

                    Cargando notificaciones...

                </div>

            )}


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <p className="mensaje-error">
                    {error}
                </p>

            )}


            {/* =================================================
                SIN NOTIFICACIONES
            ================================================= */}

            {!cargando &&
                !error &&
                notificaciones.length === 0 && (

                    <div className="notificaciones-vacias">

                        <div className="notificaciones-vacias-icono">
                            🔔
                        </div>

                        <h3>
                            No tienes notificaciones
                        </h3>

                        <p>
                            Cuando el sistema genere una
                            notificación aparecerá aquí.
                        </p>

                    </div>

                )}


            {/* =================================================
                LISTA
            ================================================= */}

            {!cargando &&
                !error &&
                notificaciones.length > 0 && (

                    <div className="lista-notificaciones">

                        {notificaciones.map(
                            (notificacion) => {

                                const esFaltaAforo =
                                    notificacion.tipo ===
                                    "FALTA_AFORO";

                                const accionando =
                                    accionandoTaller ===
                                    notificacion.idnotificacion;

                                return (

                                    <article
                                        key={
                                            notificacion.idnotificacion
                                        }

                                        className={
                                            notificacion.leida
                                                ? "notificacion-card leida"
                                                : "notificacion-card no-leida"
                                        }

                                        onClick={() =>
                                            marcarComoLeida(
                                                notificacion
                                            )
                                        }
                                    >

                                        <div className="notificacion-icono">

                                            🔔

                                        </div>


                                        <div className="notificacion-contenido">

                                            <div className="notificacion-titulo">

                                                <h3>
                                                    {
                                                        notificacion.tipo
                                                    }
                                                </h3>


                                                {!notificacion.leida && (

                                                    <span className="notificacion-nueva">
                                                        NUEVA
                                                    </span>

                                                )}

                                            </div>


                                            <p className="notificacion-mensaje">

                                                {
                                                    notificacion.mensaje
                                                }

                                            </p>


                                            {/* =================================================
                                                ACCIONES FALTA_AFORO
                                            ================================================= */}

                                            {esFaltaAforo &&
                                                notificacion.taller &&
                                                notificacion.taller.estado ===
                                                "PROGRAMADO" && (

                                                    <div
                                                        className="notificacion-acciones"
                                                        onClick={(event) =>
                                                            event.stopPropagation()
                                                        }
                                                    >

                                                        <button
                                                            className="btn-iniciar-taller"
                                                            onClick={(event) =>
                                                                iniciarTallerDesdeNotificacion(
                                                                    event,
                                                                    notificacion
                                                                )
                                                            }
                                                            disabled={accionando}
                                                        >

                                                            {accionando
                                                                ? "Procesando..."
                                                                : "▶ Iniciar taller"
                                                            }

                                                        </button>


                                                        <button
                                                            className="btn-cancelar-taller"
                                                            onClick={(event) =>
                                                                cancelarTallerDesdeNotificacion(
                                                                    event,
                                                                    notificacion
                                                                )
                                                            }
                                                            disabled={accionando}
                                                        >

                                                            {accionando
                                                                ? "Procesando..."
                                                                : "✕ Cancelar"
                                                            }

                                                        </button>

                                                    </div>

                                                )}


                                            <small>

                                                {new Date(
                                                    notificacion.fecha
                                                ).toLocaleString()}

                                            </small>

                                        </div>

                                    </article>

                                );

                            }
                        )}

                    </div>

                )}

        </section>
    );
}

export default AdministradorNotificaciones;