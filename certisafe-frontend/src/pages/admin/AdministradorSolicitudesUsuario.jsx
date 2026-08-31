import { useEffect, useState } from "react";
import "./AdministradorSolicitudesUsuario.css";

function AdministradorSolicitudesUsuario() {

    const [solicitudes, setSolicitudes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [procesando, setProcesando] = useState(null);

    // =========================================
    // CARGAR SOLICITUDES PENDIENTES
    // =========================================

    const cargarSolicitudes = async () => {

        try {

            setCargando(true);
            setError("");

            const respuesta = await fetch(
                "http://localhost:8080/api/solicitudes-registro/pendientes"
            );

            if (!respuesta.ok) {
                throw new Error(
                    "No se pudieron cargar las solicitudes"
                );
            }

            const datos = await respuesta.json();

            setSolicitudes(datos);

        } catch (error) {

            console.error(
                "Error cargando solicitudes:",
                error
            );

            setError(
                "No se pudieron cargar las solicitudes de registro."
            );

        } finally {

            setCargando(false);
        }
    };


    useEffect(() => {

        cargarSolicitudes();

    }, []);


    // =========================================
    // APROBAR SOLICITUD
    // =========================================

    const aprobarSolicitud = async (idSolicitud) => {

        try {

            setProcesando(idSolicitud);
            setError("");

            const respuesta = await fetch(
                `http://localhost:8080/api/solicitudes-registro/${idSolicitud}/aprobar`,
                {
                    method: "PATCH"
                }
            );

            const mensaje = await respuesta.text();

            if (!respuesta.ok) {

                throw new Error(mensaje);
            }

            // Quitamos la solicitud de la lista
            setSolicitudes(
                solicitudes.filter(
                    solicitud =>
                        solicitud.idSolicitud !== idSolicitud
                )
            );

        } catch (error) {

            console.error(
                "Error aprobando solicitud:",
                error
            );

            setError(
                error.message ||
                "No se pudo aprobar la solicitud."
            );

        } finally {

            setProcesando(null);
        }
    };


    // =========================================
    // RECHAZAR SOLICITUD
    // =========================================

    const rechazarSolicitud = async (idSolicitud) => {

        try {

            setProcesando(idSolicitud);
            setError("");

            const respuesta = await fetch(
                `http://localhost:8080/api/solicitudes-registro/${idSolicitud}/rechazar`,
                {
                    method: "PATCH"
                }
            );

            const mensaje = await respuesta.text();

            if (!respuesta.ok) {

                throw new Error(mensaje);
            }

            // Quitamos la solicitud de la lista
            setSolicitudes(
                solicitudes.filter(
                    solicitud =>
                        solicitud.idSolicitud !== idSolicitud
                )
            );

        } catch (error) {

            console.error(
                "Error rechazando solicitud:",
                error
            );

            setError(
                error.message ||
                "No se pudo rechazar la solicitud."
            );

        } finally {

            setProcesando(null);
        }
    };


    // =========================================
    // CARGANDO
    // =========================================

    if (cargando) {

        return (
            <section className="seccion-solicitudes-usuario">

                <h1>
                    Solicitudes de usuarios
                </h1>

                <p className="mensaje-cargando-solicitudes">
                    Cargando solicitudes...
                </p>

            </section>
        );
    }


    return (

        <section className="seccion-solicitudes-usuario">

            {/* =================================
                ENCABEZADO
            ================================== */}

            <div className="encabezado-seccion-admin">

                <div>

                    <h1>
                        Solicitudes de usuarios
                    </h1>

                    <p>
                        Revisa y valida las solicitudes de registro pendientes.
                    </p>

                </div>

                <div className="contador-seccion-admin">
                    {solicitudes.length}
                </div>

            </div>


            {/* =================================
                ERROR
            ================================== */}

            {error && (

                <div className="mensaje-error-solicitud">

                    {error}

                </div>

            )}


            {/* =================================
                SIN SOLICITUDES
            ================================== */}

            {solicitudes.length === 0 && !error && (

                <div className="sin-solicitudes">

                    <div className="icono-sin-solicitudes">
                        ✓
                    </div>

                    <h2>
                        No hay solicitudes pendientes
                    </h2>

                    <p>
                        Todas las solicitudes de registro
                        han sido procesadas.
                    </p>

                </div>
            )}


            {/* =================================
                LISTA
            ================================== */}

            <div className="lista-solicitudes-usuario">

                {solicitudes.map((solicitud) => (

                    <article
                        key={solicitud.idSolicitud}
                        className="solicitud-usuario-card"
                    >

                        {/* =========================
                            INFORMACIÓN PRINCIPAL
                        ========================== */}

                        <div className="solicitud-usuario-info">

                            <div className="avatar-solicitud">

                                {solicitud.nombre
                                    ?.charAt(0)
                                    .toUpperCase()}

                            </div>


                            <div className="datos-solicitud">

                                <h2>
                                    {solicitud.nombre}{" "}
                                    {solicitud.apellido}
                                </h2>

                                <p>
                                    <strong>
                                        Documento:
                                    </strong>{" "}
                                    {solicitud.documento}
                                </p>

                                <p>
                                    <strong>
                                        Correo:
                                    </strong>{" "}
                                    {solicitud.correo}
                                </p>

                            </div>

                        </div>


                        {/* =========================
                            ROL
                        ========================== */}

                        <div className="solicitud-usuario-rol">

                            <span className="etiqueta-rol">
                                {solicitud.rol}
                            </span>

                            <span className="estado-solicitud">
                                PENDIENTE
                            </span>

                        </div>


                        {/* =========================
                            FECHA
                        ========================== */}

                        <div className="fecha-solicitud">

                            <span>
                                Solicitud
                            </span>

                            <strong>
                                {new Date(
                                    solicitud.fechaSolicitud
                                ).toLocaleDateString(
                                    "es-CO"
                                )}
                            </strong>

                        </div>


                        {/* =========================
                            BOTONES
                        ========================== */}

                        <div className="acciones-solicitud">

                            <button
                                className="boton-aprobar-solicitud"
                                title="Aprobar solicitud"
                                disabled={
                                    procesando ===
                                    solicitud.idSolicitud
                                }
                                onClick={() =>
                                    aprobarSolicitud(
                                        solicitud.idSolicitud
                                    )
                                }
                            >
                                ✓
                            </button>


                            <button
                                className="boton-rechazar-solicitud"
                                title="Rechazar solicitud"
                                disabled={
                                    procesando ===
                                    solicitud.idSolicitud
                                }
                                onClick={() =>
                                    rechazarSolicitud(
                                        solicitud.idSolicitud
                                    )
                                }
                            >
                                ✕
                            </button>

                        </div>

                    </article>

                ))}

            </div>

        </section>
    );
}

export default AdministradorSolicitudesUsuario;