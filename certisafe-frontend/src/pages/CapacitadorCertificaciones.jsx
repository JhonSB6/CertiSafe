import { useEffect, useState } from "react";
import "./CapacitadorCertificaciones.css";
import PerfilUsuario from "../components/PerfilUsuario";

function CapacitadorCertificaciones({ usuario, cerrarSesion, actualizarUsuario }) {

    const [vistaActual, setVistaActual] = useState("inicio");

    const [talleres, setTalleres] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [mensaje, setMensaje] = useState("");

    const [asistencias, setAsistencias] = useState([]);
    const [tallerSeleccionado, setTallerSeleccionado] = useState(null);
    const [cargandoAsistencias, setCargandoAsistencias] = useState(false);


    // =========================================================
    // CARGAR TALLERES FINALIZADOS DEL CAPACITADOR
    // =========================================================

    useEffect(() => {

        const cargarTalleres = async () => {

            try {

                const url =
                    `http://localhost:8080/api/talleres/capacitador/${usuario.idUsuario}/finalizados`;

                const respuesta = await fetch(url);

                if (!respuesta.ok) {

                    throw new Error(
                        "No fue posible cargar los talleres"
                    );
                }

                const datos = await respuesta.json();

                console.log(
                    "TALLERES FINALIZADOS:",
                    datos
                );

                setTalleres(datos);

            } catch (error) {

                console.error(
                    "ERROR CARGANDO TALLERES:",
                    error
                );

                setMensaje(
                    "No fue posible cargar los talleres finalizados."
                );

            } finally {

                setCargando(false);
            }
        };

        if (usuario?.idUsuario) {
            cargarTalleres();
        }

    }, [usuario?.idUsuario]);


    // =========================================================
    // CARGAR OPERARIOS PRESENTES
    // =========================================================

    const cargarAsistencias = async (idTaller) => {

        try {

            setCargandoAsistencias(true);
            setMensaje("");

            const respuesta = await fetch(
                `http://localhost:8080/api/asistencias/taller/${idTaller}/presentes`
            );

            if (!respuesta.ok) {

                throw new Error(
                    "No fue posible cargar los operarios"
                );
            }

            const datos = await respuesta.json();

            console.log(
                "ASISTENCIAS PRESENTES:",
                datos
            );


            // =================================================
            // OBTENER TIPO DE CERTIFICACIÓN DEL TALLER
            // =================================================

            const tipoCertificacion =
                talleres.find(
                    (taller) =>
                        taller.idtaller === idTaller
                )?.tipoCertificacion?.idTipoCertificacion;


            // =================================================
            // VERIFICAR CERTIFICACIÓN DE CADA OPERARIO
            // =================================================

            const asistenciasConCertificacion =
                await Promise.all(

                    datos.map(async (asistencia) => {

                        const respuestaCertificacion =
                            await fetch(
                                `http://localhost:8080/api/certificaciones/verificar/${asistencia.usuario.idUsuario}/${tipoCertificacion}`
                            );

                        if (!respuestaCertificacion.ok) {

                            return {
                                ...asistencia,
                                estadoCertificacion:
                                    "NO_CERTIFICADO"
                            };
                        }

                        const certificado =
                            await respuestaCertificacion.json();

                        return {
                            ...asistencia,
                            estadoCertificacion:
                                certificado
                                    ? "CERTIFICADO"
                                    : "NO_CERTIFICADO",
                            decisionCertificacion:
                                asistencia.decisionCertificacion ||
                                null
                        };

                    })

                );


            setAsistencias(
                asistenciasConCertificacion
            );

            setTallerSeleccionado(
                idTaller
            );

        } catch (error) {

            console.error(
                "ERROR CARGANDO ASISTENCIAS:",
                error
            );

            setMensaje(
                "No fue posible cargar los operarios presentes."
            );

        } finally {

            setCargandoAsistencias(false);
        }
    };


    // =========================================================
    // CERTIFICAR OPERARIO
    // =========================================================

    const certificarOperario = async (asistencia) => {

        try {

            const idTaller =
                asistencia.taller.idtaller;

            const idAsistencia =
                asistencia.idasistencia;

            const idCapacitador =
                usuario.idUsuario;

            const respuestaDecision = await fetch(
                `http://localhost:8080/api/asistencias/${idAsistencia}/decision-certificacion?decision=CERTIFICADO`,
                {
                    method: "PATCH"
                }
            );

            if (!respuestaDecision.ok) {

                const mensajeError =
                    await respuestaDecision.text();

                throw new Error(
                    mensajeError ||
                    "No fue posible registrar la decisión."
                );
            }


            const url =
                `http://localhost:8080/api/certificaciones/certificar/${idTaller}/${idAsistencia}/${idCapacitador}`;


            console.log(
                "CERTIFICANDO:",
                url
            );


            const respuesta = await fetch(
                url,
                {
                    method: "POST"
                }
            );


            if (!respuesta.ok) {

                const mensajeError =
                    await respuesta.text();

                throw new Error(
                    mensajeError ||
                    "No fue posible certificar al operario."
                );
            }


            const certificacion =
                await respuesta.json();


            console.log(
                "CERTIFICACIÓN CREADA:",
                certificacion
            );


            // =================================================
            // ACTUALIZAR ESTADO VISUAL
            // =================================================

            setAsistencias(
                asistencias.map((item) =>

                    item.idasistencia ===
                    asistencia.idasistencia

                        ? {
                            ...item,
                            estadoCertificacion:
                                "CERTIFICADO"
                        }

                        : item

                )
            );


            setMensaje(
                `${asistencia.usuario.nombre} ${asistencia.usuario.apellido} fue certificado correctamente.`
            );

        } catch (error) {

            console.error(
                "ERROR CERTIFICANDO:",
                error
            );

            setMensaje(
                error.message ||
                "No fue posible certificar al operario."
            );
        }
    };
    const decidirNoCertificar = async (asistencia) => {

        try {

            const respuesta = await fetch(
                `http://localhost:8080/api/asistencias/${asistencia.idasistencia}/decision-certificacion?decision=NO_CERTIFICADO`,
                {
                    method: "PATCH"
                }
            );

            if (!respuesta.ok) {

                const mensajeError =
                    await respuesta.text();

                throw new Error(
                    mensajeError ||
                    "No fue posible registrar la decisión."
                );
            }

            setAsistencias(
                asistencias.map((item) =>

                    item.idasistencia === asistencia.idasistencia

                        ? {
                            ...item,
                            estadoCertificacion:
                                "NO_CERTIFICADO",
                            decisionCertificacion:
                                "NO_CERTIFICADO"
                        }

                        : item
                )
            );

            setMensaje(
                `${asistencia.usuario.nombre} ${asistencia.usuario.apellido} no fue certificado.`
            );

        } catch (error) {

            console.error(
                "ERROR NO CERTIFICANDO:",
                error
            );

            setMensaje(
                error.message ||
                "No fue posible registrar la decisión."
            );
        }
    };


    // =========================================================
    // CERRAR OPERARIOS DEL TALLER SELECCIONADO
    // =========================================================

    const cerrarOperarios = () => {

        setTallerSeleccionado(null);
        setAsistencias([]);

        setMensaje("");
    };


    // =========================================================
    // CARGANDO
    // =========================================================

    if (cargando) {

        return (

            <div className="dashboard-capacitador">

                {/* =========================================
                    MENÚ LATERAL
                ========================================== */}

                <aside className="menu-capacitador">

                    <div className="logo-capacitador">
                        CERTISAFE
                    </div>


                    <nav>

                        <button
                            className="menu-capacitador-activo"
                        >
                            🏠
                            <span>
                                Inicio
                            </span>
                        </button>


                        <button>
                            📚
                            <span>
                                Mis talleres
                            </span>
                        </button>


                        <button
                            className="menu-capacitador-activo"
                        >
                            🏆
                            <span>
                                Certificaciones
                            </span>
                        </button>

                    </nav>


                    <div className="menu-capacitador-inferior">

                        <button>
                            ⚙
                            <span>
                                Mi perfil
                            </span>
                        </button>


                        <button
                            className="boton-cerrar-sesion-capacitador"
                            onClick={cerrarSesion}
                        >
                            Cerrar sesión
                        </button>

                    </div>

                </aside>


                {/* =========================================
                    CONTENIDO
                ========================================== */}

                <main className="contenido-capacitador">

                    <header className="header-capacitador">

                        <div className="usuario-capacitador">

                            <div className="avatar-capacitador">

                                {usuario?.nombre
                                    ? usuario.nombre
                                        .charAt(0)
                                        .toUpperCase()
                                    : "C"}

                            </div>


                            <div>

                                <strong>
                                    {usuario?.nombre}{" "}
                                    {usuario?.apellido}
                                </strong>

                                <span>
                                    Capacitador
                                </span>

                            </div>

                        </div>

                    </header>


                    <section className="seccion-capacitador">

                        <h1>
                            Certificaciones
                        </h1>

                        <p>
                            Cargando talleres finalizados...
                        </p>

                    </section>

                </main>

            </div>
        );
    }


    // =========================================================
    // VISTA PRINCIPAL
    // =========================================================

    return (

        <div className="dashboard-capacitador">


            {/* =================================================
                MENÚ LATERAL
            ================================================= */}

            <aside className="menu-capacitador">


                {/* LOGO */}

                <div className="logo-capacitador">
                    CERTISAFE
                </div>


                {/* NAVEGACIÓN */}

                <nav>


                    {/* INICIO */}

                    <button
                        className={
                            vistaActual === "inicio"
                                ? "menu-capacitador-activo"
                                : ""
                        }
                        onClick={() =>
                            setVistaActual("inicio")
                        }
                    >
                        🏠
                        <span>
                            Inicio
                        </span>
                    </button>


                    {/* TALLERES */}

                    <button
                        className={
                            vistaActual === "talleres"
                                ? "menu-capacitador-activo"
                                : ""
                        }
                        onClick={() =>
                            setVistaActual("talleres")
                        }
                    >
                        📚
                        <span>
                            Mis talleres
                        </span>
                    </button>


                    {/* CERTIFICACIONES */}

                    <button
                        className={
                            vistaActual === "certificaciones"
                                ? "menu-capacitador-activo"
                                : ""
                        }
                        onClick={() =>
                            setVistaActual(
                                "certificaciones"
                            )
                        }
                    >
                        🏆
                        <span>
                            Certificaciones
                        </span>
                    </button>

                </nav>


                {/* =================================================
                    OPCIONES INFERIORES
                ================================================= */}

                <div className="menu-capacitador-inferior">


                    {/* PERFIL */}

                    <button
                        onClick={() =>
                            setVistaActual("perfil")
                        }
                    >
                        ⚙
                        <span>
                            Mi perfil
                        </span>
                    </button>


                    {/* CERRAR SESIÓN */}

                    <button
                        className="boton-cerrar-sesion-capacitador"
                        onClick={cerrarSesion}
                    >
                        Cerrar sesión
                    </button>

                </div>

            </aside>


            {/* =================================================
                CONTENIDO PRINCIPAL
            ================================================= */}

            <main className="contenido-capacitador">


                {/* =================================================
                    HEADER
                ================================================= */}

                <header className="header-capacitador">

                    <div className="usuario-capacitador">

                        <div className="avatar-capacitador">

                            {usuario?.nombre
                                ? usuario.nombre
                                    .charAt(0)
                                    .toUpperCase()
                                : "C"}

                        </div>


                        <div>

                            <strong>
                                {usuario?.nombre}{" "}
                                {usuario?.apellido}
                            </strong>

                            <span>
                                Capacitador
                            </span>

                        </div>

                    </div>

                </header>


                {/* =================================================
                    INICIO
                ================================================= */}

                {vistaActual === "inicio" && (

                    <section className="seccion-capacitador">

                        <h1>
                            Bienvenido,{" "}
                            {usuario?.nombre}
                        </h1>

                        <p>
                            Desde aquí puedes consultar tus
                            talleres finalizados y certificar
                            a los operarios que asistieron.
                        </p>


                        <div className="tarjetas-resumen-capacitador">

                            <article className="resumen-capacitador-card">

                                <h3>
                                    Certificaciones
                                </h3>

                                <p>
                                    Consulta tus talleres finalizados
                                    y certifica a los operarios presentes.
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

                        </div>

                    </section>

                )}


                {/* =================================================
                    MIS TALLERES
                ================================================= */}

                {vistaActual === "talleres" && (

                    <section className="seccion-capacitador">

                        <h1>
                            Mis talleres
                        </h1>

                        <p>
                            Consulta los talleres finalizados
                            asociados a tu usuario.
                        </p>


                        {talleres.length === 0 ? (

                            <div className="capacitador-vacio">

                                No tienes talleres finalizados
                                actualmente.

                            </div>

                        ) : (

                            <div className="talleres-container">

                                {talleres.map((taller) => (

                                    <article
                                        className="taller-card"
                                        key={
                                            taller.idtaller
                                        }
                                    >

                                        <h3>
                                            {taller.nombre}
                                        </h3>

                                        <p className="taller-descripcion">
                                            {taller.descripcion}
                                        </p>

                                        <p>
                                            <strong>
                                                Fecha:
                                            </strong>{" "}
                                            {taller.fecha}
                                        </p>

                                        <p>
                                            <strong>
                                                Horario:
                                            </strong>{" "}
                                            {taller.horaInicio}
                                            {" - "}
                                            {taller.horaFin}
                                        </p>

                                        <p>
                                            <strong>
                                                Certificación:
                                            </strong>{" "}
                                            {
                                                taller
                                                    .tipoCertificacion
                                                    ?.nombre
                                            }
                                        </p>

                                        <p>
                                            <strong>
                                                Estado:
                                            </strong>{" "}

                                            <span className="taller-estado-finalizado">
                                                {taller.estado}
                                            </span>

                                        </p>

                                    </article>

                                ))}

                            </div>

                        )}

                    </section>

                )}


                {/* =================================================
                    CERTIFICACIONES
                ================================================= */}

                {vistaActual === "certificaciones" && (

                    <section className="seccion-capacitador">


                        <div className="capacitador-header">

                            <h1>
                                Certificaciones
                            </h1>

                            <p>
                                Aquí puedes certificar a los
                                operarios que estuvieron presentes
                                en tus talleres finalizados.
                            </p>

                        </div>


                        <h2>
                            Talleres finalizados
                        </h2>


                        {/* =================================================
                            MENSAJE
                        ================================================= */}

                        {mensaje && (

                            <p className="mensaje-certificacion">
                                {mensaje}
                            </p>

                        )}


                        {/* =================================================
                            SIN TALLERES
                        ================================================= */}

                        {talleres.length === 0 ? (

                            <div className="capacitador-vacio">

                                No tienes talleres finalizados
                                pendientes de certificación.

                            </div>

                        ) : (


                            /* =================================================
                               TALLERES
                            ================================================= */

                            <div className="talleres-container">

                                {talleres.map((taller) => (

                                    <article
                                        className="taller-card"
                                        key={
                                            taller.idtaller
                                        }
                                    >


                                        {/* INFORMACIÓN */}

                                        <h3>
                                            {taller.nombre}
                                        </h3>


                                        <p className="taller-descripcion">
                                            {taller.descripcion}
                                        </p>


                                        <div className="taller-info">

                                            <p>
                                                <strong>
                                                    Fecha:
                                                </strong>{" "}
                                                {taller.fecha}
                                            </p>


                                            <p>
                                                <strong>
                                                    Horario:
                                                </strong>{" "}
                                                {taller.horaInicio}
                                                {" - "}
                                                {taller.horaFin}
                                            </p>


                                            <p>
                                                <strong>
                                                    Certificación:
                                                </strong>{" "}
                                                {
                                                    taller
                                                        .tipoCertificacion
                                                        ?.nombre
                                                }
                                            </p>


                                            <p>
                                                <strong>
                                                    Estado:
                                                </strong>{" "}

                                                <span className="taller-estado-finalizado">
                                                    {taller.estado}
                                                </span>

                                            </p>

                                        </div>


                                        {/* =================================================
                                            BOTÓN MOSTRAR OPERARIOS
                                        ================================================= */}

                                        <button
                                            className="btn-certificar-operarios"
                                            onClick={() =>
                                                cargarAsistencias(
                                                    taller.idtaller
                                                )
                                            }
                                        >
                                            Certificar operarios
                                        </button>


                                        {/* =================================================
                                            OPERARIOS PRESENTES
                                        ================================================= */}

                                        {tallerSeleccionado ===
                                            taller.idtaller && (

                                                <div className="operarios-container">


                                                    <div className="operarios-header">

                                                        <h4>
                                                            Operarios presentes
                                                        </h4>


                                                        <button
                                                            className="btn-cerrar-operarios"
                                                            onClick={
                                                                cerrarOperarios
                                                            }
                                                        >
                                                            Cerrar
                                                        </button>

                                                    </div>


                                                    {cargandoAsistencias ? (

                                                        <p className="mensaje-cargando">
                                                            Cargando operarios...
                                                        </p>

                                                    ) : asistencias.length ===
                                                    0 ? (

                                                        <p className="mensaje-vacio">
                                                            No hay operarios presentes.
                                                        </p>

                                                    ) : (

                                                        asistencias.map(
                                                            (asistencia) => (

                                                                <div
                                                                    className="operario-card"
                                                                    key={
                                                                        asistencia.idasistencia
                                                                    }
                                                                >


                                                                    {/* NOMBRE */}

                                                                    <p className="operario-nombre">

                                                                        <strong>

                                                                            {
                                                                                asistencia
                                                                                    .usuario
                                                                                    .nombre
                                                                            }{" "}

                                                                            {
                                                                                asistencia
                                                                                    .usuario
                                                                                    .apellido
                                                                            }

                                                                        </strong>

                                                                    </p>


                                                                    {/* DOCUMENTO */}

                                                                    <p>

                                                                        <strong>
                                                                            Documento:
                                                                        </strong>{" "}

                                                                        {
                                                                            asistencia
                                                                                .usuario
                                                                                .documento
                                                                        }

                                                                    </p>


                                                                    {/* ESTADO ASISTENCIA */}

                                                                    <p>

                                                                        <strong>
                                                                            Estado:
                                                                        </strong>{" "}

                                                                        <span className="estado-presente">

                                                                        {
                                                                            asistencia
                                                                                .estado
                                                                        }

                                                                    </span>

                                                                    </p>


                                                                    {/* ESTADO CERTIFICACIÓN */}

                                                                    {asistencia.decisionCertificacion === "CERTIFICADO" ? (

                                                                        <p className="operario-certificado">
                                                                            ✓ Certificado
                                                                        </p>

                                                                    ) : asistencia.decisionCertificacion === "NO_CERTIFICADO" ? (

                                                                        <p className="operario-no-certificado">
                                                                            ✕ No certificado
                                                                        </p>

                                                                    ) : (

                                                                        <div className="botones-certificacion">

                                                                            <button
                                                                                className="btn-certificar"
                                                                                onClick={() =>
                                                                                    certificarOperario(
                                                                                        asistencia
                                                                                    )
                                                                                }
                                                                            >
                                                                                ✓ Certificar
                                                                            </button>

                                                                            <button
                                                                                className="btn-no-certificar"
                                                                                onClick={() =>
                                                                                    decidirNoCertificar(
                                                                                        asistencia
                                                                                    )
                                                                                }
                                                                            >
                                                                                ✕ No certificar
                                                                            </button>

                                                                        </div>

                                                                    )}

                                                                </div>

                                                            )
                                                        )

                                                    )}

                                                </div>

                                            )}

                                    </article>

                                ))}

                            </div>

                        )}

                    </section>

                )}


                {/* =================================================
                    PERFIL
                ================================================= */}

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

export default CapacitadorCertificaciones;