import "./VistaOperario.css";
import { useEffect, useState } from "react";
import SolicitudOperario from "./operario/SolicitudOperario";
import PerfilUsuario from "../components/PerfilUsuario";
import MenuUsuario from "../components/MenuUsuario";

function VistaOperario({ usuario, cerrarSesion, actualizarUsuario }) {

    const [vistaActual, setVistaActual] = useState("talleres");

    const [talleres, setTalleres] = useState([]);
    const [talleresAforoCompleto, setTalleresAforoCompleto] = useState([]);
    const [cargandoTalleres, setCargandoTalleres] = useState(false);
    const [errorTalleres, setErrorTalleres] = useState("");

    const [certificaciones, setCertificaciones] = useState([]);
    const [cargandoCertificaciones, setCargandoCertificaciones] = useState(false);
    const [errorCertificaciones, setErrorCertificaciones] = useState("");

    // ==========================================
    // CARGAR CERTIFICACIONES DEL OPERARIO
    // ==========================================

    const cargarCertificaciones = async () => {

        setCargandoCertificaciones(true);
        setErrorCertificaciones("");

        try {

            const respuesta = await fetch(
                `http://localhost:8080/api/certificaciones/usuario/${usuario.idUsuario}`
            );

            if (!respuesta.ok) {
                throw new Error(
                    "No fue posible consultar las certificaciones"
                );
            }

            const datos = await respuesta.json();

            console.log(
                "CERTIFICACIONES DEL OPERARIO:",
                datos
            );

            setCertificaciones(datos);

        } catch (error) {

            console.error(error);

            setErrorCertificaciones(
                "No fue posible cargar tus certificaciones."
            );

        } finally {

            setCargandoCertificaciones(false);
        }
    };


    // ==========================================
    // INSCRIBIRSE AL TALLER
    // ==========================================

    const confirmarInscripcion = async (idInscripcion) => {

        try {

            const respuesta = await fetch(
                `http://localhost:8080/api/inscripciones-taller/${idInscripcion}/confirmar`,
                {
                    method: "PUT"
                }
            );

            if (!respuesta.ok) {

                const mensaje = await respuesta.text();

                // ==========================================
                // AFORO COMPLETO
                // ==========================================

                if (respuesta.status === 409) {

                    setTalleresAforoCompleto((anteriores) => {

                        if (anteriores.includes(idInscripcion)) {
                            return anteriores;
                        }

                        return [
                            ...anteriores,
                            idInscripcion
                        ];
                    });

                    alert("Aforo Completo");

                    return;
                }

                throw new Error(
                    mensaje || "No fue posible confirmar la inscripción"
                );
            }

            alert("Inscripción confirmada correctamente");

            cargarTalleres();

        } catch (error) {

            console.error(error);

            alert(
                error.message ||
                "No fue posible confirmar la inscripción"
            );
        }
    };


    // ==========================================
    // CARGAR TALLERES DEL OPERARIO
    // ==========================================

    const cargarTalleres = async () => {

        setCargandoTalleres(true);
        setErrorTalleres("");

        try {

            const respuesta = await fetch(
                `http://localhost:8080/api/inscripciones-taller/usuario/${usuario.idUsuario}`
            );

            if (!respuesta.ok) {
                throw new Error(
                    "No fue posible consultar los talleres"
                );
            }

            const datos = await respuesta.json();

            console.log(
                "TALLERES DEL OPERARIO:",
                datos
            );

            setTalleres(datos);

        } catch (error) {

            console.error(error);

            setErrorTalleres(
                "No fue posible cargar tus talleres."
            );

        } finally {

            setCargandoTalleres(false);

        }
    };


    // ==========================================
    // CUANDO ENTRAMOS A MIS TALLERES
    // ==========================================

    useEffect(() => {

        if (vistaActual === "talleres") {

            cargarTalleres();

            /*
             * El backend cambia automáticamente el estado
             * del taller según la hora.
             *
             * Consultamos cada 10 segundos para reflejar
             * ese cambio en la pantalla del operario.
             */
            const intervalo = setInterval(() => {

                cargarTalleres();

            }, 10000);

            return () => clearInterval(intervalo);
        }

        if (vistaActual === "certificaciones") {
            cargarCertificaciones();
        }

    }, [vistaActual]);


    return (

        <div className="dashboard-operario">

            {/* ==========================================
                MENÚ LATERAL
            ========================================== */}

            <aside className="menu-lateral">

                <div className="logo-dashboard">
                    CERTISAFE
                </div>


                <nav>

                    <button
                        className={
                            vistaActual === "talleres"
                                ? "menu-activo"
                                : ""
                        }
                        onClick={() => setVistaActual("talleres")}
                    >
                        📚
                        <span>Mis talleres</span>
                    </button>


                    <button
                        className={
                            vistaActual === "certificaciones"
                                ? "menu-activo"
                                : ""
                        }
                        onClick={() =>
                            setVistaActual("certificaciones")
                        }
                    >
                        🏆
                        <span>Mis certificaciones</span>
                    </button>


                    <button
                        className={
                            vistaActual === "produccion"
                                ? "menu-activo"
                                : ""
                        }
                        onClick={() =>
                            setVistaActual("produccion")
                        }
                    >
                        🏭
                        <span>Ingreso producción</span>
                    </button>

                </nav>

            </aside>


            {/* ==========================================
                CONTENIDO PRINCIPAL
            ========================================== */}

            <main className="contenido-operario">

                {/* ==========================================
                    HEADER
                ========================================== */}

                <header className="header-operario">

                    <MenuUsuario
                        usuario={usuario}
                        onPerfil={() =>
                            setVistaActual("perfil")
                        }
                        onCerrarSesion={cerrarSesion}
                    />

                </header>


                {/* ==========================================
                    INICIO
                ========================================== */}




                {/* ==========================================
                    MIS TALLERES
                ========================================== */}

                {vistaActual === "talleres" && (

                    <section className="seccion-operario">

                        <h1>
                            Mis talleres
                        </h1>

                        <p>
                            Aquí puedes consultar los talleres
                            en los que estás inscrito.
                        </p>


                        {/* CARGANDO */}

                        {cargandoTalleres && (

                            <p>
                                Cargando talleres...
                            </p>

                        )}


                        {/* ERROR */}

                        {errorTalleres && (

                            <p className="mensaje-error">
                                {errorTalleres}
                            </p>

                        )}


                        {/* SIN TALLERES */}

                        {!cargandoTalleres &&
                            !errorTalleres &&
                            talleres.length === 0 && (

                                <p>
                                    No tienes talleres
                                    programados actualmente.
                                </p>

                            )}


                        {/* TARJETAS */}

                        {!cargandoTalleres &&
                            talleres.length > 0 && (

                                <div className="tarjetas-talleres">

                                    {talleres.map(
                                        (inscripcion) => {

                                            const estadoTaller =
                                                inscripcion.taller.estado;

                                            const inscripcionPendiente =
                                                inscripcion.estado === "PENDIENTE";

                                            const tallerNoDisponible =
                                                estadoTaller === "EN_CURSO" ||
                                                estadoTaller === "FINALIZADO" ||
                                                estadoTaller === "CANCELADO";

                                            const puedeInscribirse =
                                                inscripcionPendiente &&
                                                estadoTaller === "PROGRAMADO";

                                            const aforoCompleto =
                                                talleresAforoCompleto.includes(
                                                    inscripcion.idinscripcion
                                                );

                                            return (

                                                <article
                                                    className={
                                                        estadoTaller === "FINALIZADO"
                                                            ? "taller-card taller-finalizado"
                                                            : estadoTaller === "EN_CURSO"
                                                                ? "taller-card taller-en-curso"
                                                                : "taller-card"
                                                    }
                                                    key={
                                                        inscripcion.idinscripcion
                                                    }
                                                >

                                                    <h3>
                                                        {
                                                            inscripcion
                                                                .taller
                                                                .nombre
                                                        }
                                                    </h3>


                                                    <p>
                                                        {
                                                            inscripcion
                                                                .taller
                                                                .descripcion
                                                        }
                                                    </p>


                                                    <p>
                                                        <strong>
                                                            Fecha:
                                                        </strong>{" "}
                                                        {
                                                            inscripcion
                                                                .taller
                                                                .fecha
                                                        }
                                                    </p>


                                                    <p>
                                                        <strong>
                                                            Horario:
                                                        </strong>{" "}
                                                        {
                                                            inscripcion
                                                                .taller
                                                                .horaInicio
                                                        }
                                                        {" - "}
                                                        {
                                                            inscripcion
                                                                .taller
                                                                .horaFin
                                                        }
                                                    </p>


                                                    <p>
                                                        <strong>
                                                            Certificación:
                                                        </strong>{" "}
                                                        {
                                                            inscripcion
                                                                .taller
                                                                .tipoCertificacion
                                                                .nombre
                                                        }
                                                    </p>


                                                    {/* ==========================================
                                                        ESTADO DEL TALLER
                                                    ========================================== */}

                                                    <p>
                                                        <strong>
                                                            Estado del taller:
                                                        </strong>{" "}

                                                        <span
                                                            className={
                                                                estadoTaller === "FINALIZADO"
                                                                    ? "estado-taller-finalizado"
                                                                    : estadoTaller === "EN_CURSO"
                                                                        ? "estado-taller-en-curso"
                                                                        : estadoTaller === "CANCELADO"
                                                                            ? "estado-taller-cancelado"
                                                                            : "estado-taller-programado"
                                                            }
                                                        >
                                                            {estadoTaller}
                                                        </span>

                                                    </p>


                                                    {/* ==========================================
                                                        ESTADO DE LA INSCRIPCIÓN
                                                    ========================================== */}

                                                    <p>
                                                        <strong>
                                                            Mi inscripción:
                                                        </strong>{" "}

                                                        <span
                                                            className={
                                                                inscripcion.estado ===
                                                                "CONFIRMADA"
                                                                    ? "estado-confirmada"
                                                                    : "estado-pendiente"
                                                            }
                                                        >
                                                            {
                                                                inscripcion.estado
                                                            }
                                                        </span>

                                                    </p>


                                                    {/* ==========================================
                                                        BOTÓN INSCRIBIRSE
                                                    ========================================== */}

                                                    {puedeInscribirse && (

                                                        <button
                                                            className="boton-inscribirse"
                                                            onClick={() =>
                                                                confirmarInscripcion(
                                                                    inscripcion.idinscripcion
                                                                )
                                                            }
                                                        >
                                                            Inscribirme
                                                        </button>

                                                    )}

                                                    {puedeInscribirse && aforoCompleto && (

                                                        <button
                                                            className="boton-inscribirse boton-deshabilitado"
                                                            disabled
                                                        >
                                                            Aforo Completo
                                                        </button>

                                                    )}


                                                    {/* ==========================================
                                                        TALLER EN CURSO + NO CONFIRMADO
                                                    ========================================== */}

                                                    {estadoTaller === "EN_CURSO" &&
                                                        inscripcionPendiente && (

                                                            <button
                                                                className="boton-inscribirse boton-deshabilitado"
                                                                disabled
                                                            >
                                                                Inscripción cerrada
                                                            </button>

                                                        )}


                                                    {/* ==========================================
                                                        INSCRIPCIÓN CONFIRMADA
                                                    ========================================== */}

                                                    {inscripcion.estado ===
                                                        "CONFIRMADA" && (

                                                            <span className="mensaje-confirmada">

                                                            ✓ Inscripción confirmada

                                                        </span>

                                                        )}


                                                    {/* ==========================================
                                                        TALLER FINALIZADO
                                                    ========================================== */}

                                                    {estadoTaller === "FINALIZADO" && (

                                                        <span className="mensaje-finalizado">

                                                            Taller finalizado

                                                        </span>

                                                    )}


                                                    {/* ==========================================
                                                        TALLER CANCELADO
                                                    ========================================== */}

                                                    {estadoTaller === "CANCELADO" && (

                                                        <span className="mensaje-cancelado">

                                                            Taller cancelado

                                                        </span>

                                                    )}

                                                </article>

                                            );

                                        }
                                    )}

                                </div>

                            )}

                    </section>

                )}


                {/* ==========================================
                    MIS CERTIFICACIONES
                ========================================== */}

                {vistaActual === "certificaciones" && (

                    <section className="seccion-operario">

                        <h1>
                            Mis certificaciones
                        </h1>

                        <p>
                            Aquí puedes consultar las certificaciones
                            obtenidas durante tus capacitaciones.
                        </p>


                        {cargandoCertificaciones && (

                            <p>
                                Cargando certificaciones...
                            </p>

                        )}


                        {errorCertificaciones && (

                            <p className="mensaje-error">
                                {errorCertificaciones}
                            </p>

                        )}


                        {!cargandoCertificaciones &&
                            !errorCertificaciones &&
                            certificaciones.length === 0 && (

                                <div className="sin-certificaciones">

                                    <h3>
                                        No tienes certificaciones
                                    </h3>

                                    <p>
                                        Cuando completes una capacitación
                                        y seas certificado por el capacitador,
                                        aparecerá aquí.
                                    </p>

                                </div>

                            )}


                        {!cargandoCertificaciones &&
                            !errorCertificaciones &&
                            certificaciones.length > 0 && (

                                <div className="tarjetas-certificaciones">

                                    {certificaciones.map(
                                        (certificacion) => (

                                            <article
                                                className="certificacion-card"
                                                key={
                                                    certificacion.idcertificacion
                                                }
                                            >

                                                <div className="certificacion-icono">
                                                </div>


                                                <div className="certificacion-contenido">

                                                    <h2>
                                                        {
                                                            certificacion.nombre
                                                        }
                                                    </h2>


                                                    <span
                                                        className={
                                                            certificacion.estado ===
                                                            "VIGENTE"
                                                                ? "estado-certificacion-vigente"
                                                                : "estado-certificacion"
                                                        }
                                                    >
                                                        ✓{" "}
                                                        {
                                                            certificacion.estado
                                                        }
                                                    </span>


                                                    <p>
                                                        <strong>
                                                            Fecha de expedición:
                                                        </strong>{" "}
                                                        {
                                                            new Date(
                                                                certificacion.fechaExpedicion
                                                            ).toLocaleDateString()
                                                        }
                                                    </p>


                                                    <p>
                                                        <strong>
                                                            Fecha de vigencia:
                                                        </strong>{" "}
                                                        {
                                                            new Date(
                                                                certificacion.fechaVigencia
                                                            ).toLocaleDateString()
                                                        }
                                                    </p>


                                                    {certificacion.asistencia?.taller && (

                                                        <p>
                                                            <strong>
                                                                Taller:
                                                            </strong>{" "}
                                                            {
                                                                certificacion
                                                                    .asistencia
                                                                    .taller
                                                                    .nombre
                                                            }
                                                        </p>

                                                    )}


                                                    {certificacion.tipoCertificacion && (

                                                        <p>
                                                            <strong>
                                                                Tipo:
                                                            </strong>{" "}
                                                            {
                                                                certificacion
                                                                    .tipoCertificacion
                                                                    .nombre
                                                            }
                                                        </p>

                                                    )}

                                                </div>

                                            </article>

                                        )
                                    )}

                                </div>

                            )}

                    </section>

                )}


                {/* ==========================================
                    INGRESO A PRODUCCIÓN
                ========================================== */}

                {/* ==========================================
                    INGRESO A PRODUCCIÓN
                ========================================== */}

                {vistaActual === "produccion" && (

                    <SolicitudOperario
                        usuario={usuario}
                    />

                )}


                {/* ==========================================
                    MI PERFIL
                ========================================== */}

                {vistaActual === "perfil" && (

                    <PerfilUsuario
                        usuario={usuario}
                        actualizarUsuario={actualizarUsuario}
                    />

                )}

            </main>

        </div>
    );
}

export default VistaOperario;