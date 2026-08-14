import "./VistaOperario.css";
import { useEffect, useState } from "react";

function VistaOperario({ usuario, cerrarSesion }) {

    const [vistaActual, setVistaActual] = useState("inicio");

    const [talleres, setTalleres] = useState([]);
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
                            vistaActual === "inicio"
                                ? "menu-activo"
                                : ""
                        }
                        onClick={() => setVistaActual("inicio")}
                    >
                        🏠
                        <span>Inicio</span>
                    </button>


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


                {/* ==========================================
                    OPCIONES INFERIORES
                ========================================== */}

                <div className="menu-inferior">

                    <button
                        onClick={() =>
                            setVistaActual("perfil")
                        }
                    >
                        ⚙
                        <span>Mi perfil</span>
                    </button>


                    <button
                        className="btn-cerrar-sesion"
                        onClick={cerrarSesion}
                    >
                        Cerrar sesión
                    </button>

                </div>

            </aside>


            {/* ==========================================
                CONTENIDO PRINCIPAL
            ========================================== */}

            <main className="contenido-operario">

                {/* ==========================================
                    HEADER
                ========================================== */}

                <header className="header-operario">

                    <div className="usuario-header">

                        <div className="avatar">

                            {usuario.nombre
                                ? usuario.nombre.charAt(0).toUpperCase()
                                : "U"}

                        </div>


                        <div>

                            <strong>
                                {usuario.nombre} {usuario.apellido}
                            </strong>

                            <span>
                                Operario
                            </span>

                        </div>

                    </div>

                </header>


                {/* ==========================================
                    INICIO
                ========================================== */}

                {vistaActual === "inicio" && (

                    <section className="inicio-operario">

                        <h1>
                            Bienvenido, {usuario.nombre}
                        </h1>

                        <p>
                            Consulta tus talleres,
                            certificaciones y estado
                            para ingreso a producción.
                        </p>


                        <div className="tarjetas-resumen">

                            <article className="resumen-card">

                                <h3>
                                    Mis talleres
                                </h3>

                                <p>
                                    Consulta los talleres
                                    programados y tus
                                    próximas capacitaciones.
                                </p>

                                <button
                                    onClick={() =>
                                        setVistaActual("talleres")
                                    }
                                >
                                    Ver talleres
                                </button>

                            </article>


                            <article className="resumen-card">

                                <h3>
                                    Mis certificaciones
                                </h3>

                                <p>
                                    Consulta tus certificaciones
                                    y su estado actual.
                                </p>

                                <button
                                    onClick={() =>
                                        setVistaActual(
                                            "certificaciones"
                                        )
                                    }
                                >
                                    Ver certificaciones
                                </button>

                            </article>


                            <article className="resumen-card">

                                <h3>
                                    Ingreso a producción
                                </h3>

                                <p>
                                    Consulta si cumples
                                    los requisitos para
                                    ingresar a producción.
                                </p>

                                <button
                                    onClick={() =>
                                        setVistaActual(
                                            "produccion"
                                        )
                                    }
                                >
                                    Consultar estado
                                </button>

                            </article>

                        </div>

                    </section>

                )}


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

                {vistaActual === "produccion" && (

                    <section className="seccion-operario">

                        <h1>
                            Ingreso a producción
                        </h1>

                        <p>
                            Aquí podrás consultar si cumples
                            los requisitos para ingresar
                            a producción.
                        </p>

                    </section>

                )}


                {/* ==========================================
                    MI PERFIL
                ========================================== */}

                {vistaActual === "perfil" && (

                    <section className="seccion-operario">

                        <h1>
                            Mi perfil
                        </h1>

                        <p>
                            Aquí podrás consultar y actualizar
                            tu información personal.
                        </p>

                    </section>

                )}

            </main>

        </div>
    );
}

export default VistaOperario;