import "./VistaOperario.css";
import { useEffect, useState } from "react";

function VistaOperario({ usuario, cerrarSesion }) {

    const [vistaActual, setVistaActual] = useState("inicio");

    const [talleres, setTalleres] = useState([]);
    const [cargandoTalleres, setCargandoTalleres] = useState(false);
    const [errorTalleres, setErrorTalleres] = useState("");

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

            // Volvemos a cargar los talleres
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


                            {/* MIS TALLERES */}

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


                            {/* CERTIFICACIONES */}

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


                            {/* PRODUCCIÓN */}

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
                                        (inscripcion) => (

                                            <article
                                                className="taller-card"
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


                                                <p>
                                                    <strong>
                                                        Estado:
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


                                                {/* BOTÓN INSCRIBIRSE */}

                                                {inscripcion.estado ===
                                                    "PENDIENTE" && (

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


                                                {/* CONFIRMADA */}

                                                {inscripcion.estado ===
                                                    "CONFIRMADA" && (

                                                    <span className="mensaje-confirmada">
                                                        ✓ Inscripción
                                                        confirmada
                                                    </span>

                                                )}

                                            </article>

                                        )
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
                            Aquí podrás consultar tus
                            certificaciones y su estado.
                        </p>

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