import { useEffect, useState } from "react";
import AdministradorCrearTaller from "./AdministradorCrearTaller";
import AdministradorEditarTaller from "./AdministradorEditarTaller";
import AdministradorProgramarOperarios from "./AdministradorProgramarOperarios";


function AdministradorTalleres() {

    const [talleres, setTalleres] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    const [mostrarCrear, setMostrarCrear] = useState(false);

    const [mostrarEditar, setMostrarEditar] = useState(false);
    const [tallerEditar, setTallerEditar] = useState(null);

    const [tallerSeleccionado, setTallerSeleccionado] = useState(null);

    const [resumenes, setResumenes] = useState({});


    // =========================================================
    // CARGAR TALLERES
    // =========================================================

    const cargarTalleres = async () => {

        setCargando(true);
        setError("");

        try {

            const respuesta = await fetch(
                "http://localhost:8080/api/talleres"
            );

            if (!respuesta.ok) {

                throw new Error(
                    "No fue posible cargar los talleres"
                );

            }

            const datos = await respuesta.json();

            setTalleres(datos);


            // =================================================
            // CARGAR RESUMEN DE CADA TALLER
            // =================================================

            const nuevosResumenes = {};

            for (const taller of datos) {

                try {

                    const respuestaResumen = await fetch(
                        `http://localhost:8080/api/talleres/${taller.idtaller}/resumen`
                    );

                    if (respuestaResumen.ok) {

                        const resumen =
                            await respuestaResumen.json();

                        nuevosResumenes[
                            taller.idtaller
                            ] = resumen;

                    }

                } catch (error) {

                    console.error(
                        `Error cargando resumen del taller ${taller.idtaller}:`,
                        error
                    );

                }

            }

            setResumenes(nuevosResumenes);

        } catch (error) {

            console.error(error);

            setError(
                "No fue posible cargar los talleres."
            );

        } finally {

            setCargando(false);

        }
    };


    // =========================================================
    // CARGAR AL ENTRAR
    // =========================================================

    useEffect(() => {

        cargarTalleres();

    }, []);


    // =========================================================
    // VISTA CREAR TALLER
    // =========================================================

    if (mostrarCrear) {

        return (
            <AdministradorCrearTaller
                volver={() => {

                    setMostrarCrear(false);

                    cargarTalleres();

                }}
            />
        );

    }


    // =========================================================
    // VISTA EDITAR TALLER
    // =========================================================

    if (mostrarEditar && tallerEditar) {

        return (
            <AdministradorEditarTaller
                taller={tallerEditar}
                volver={() => {

                    setMostrarEditar(false);

                    setTallerEditar(null);

                    cargarTalleres();

                }}
            />
        );

    }


    // =========================================================
    // VISTA PROGRAMAR OPERARIOS
    // =========================================================

    if (tallerSeleccionado) {

        return (
            <AdministradorProgramarOperarios
                taller={tallerSeleccionado}
                volver={() => {

                    setTallerSeleccionado(null);

                    cargarTalleres();

                }}
            />
        );

    }


    // =========================================================
    // VISTA PRINCIPAL
    // =========================================================

    return (

        <section className="seccion-administrador">

            <h1>
                Talleres
            </h1>


            {/* =================================================
                CREAR TALLER
            ================================================= */}

            <button
                className="boton-crear-taller"
                onClick={() =>
                    setMostrarCrear(true)
                }
            >
                + Crear nuevo taller
            </button>


            <p>
                Gestiona los talleres de capacitación
                disponibles en CertiSafe.
            </p>


            {/* =================================================
                CARGANDO
            ================================================= */}

            {cargando && (

                <p>
                    Cargando talleres...
                </p>

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
                SIN TALLERES
            ================================================= */}

            {!cargando &&
                !error &&
                talleres.length === 0 && (

                    <p>
                        No hay talleres registrados.
                    </p>

                )}


            {/* =================================================
                TARJETAS DE TALLERES
            ================================================= */}

            {!cargando &&
                talleres.length > 0 && (

                    <div className="tarjetas-talleres-admin">

                        {talleres.map((taller) => (

                            <article
                                className="taller-admin-card"
                                key={taller.idtaller}
                            >

                                {/* =================================================
                                    NOMBRE
                                ================================================= */}

                                <h2>
                                    {taller.nombre}
                                </h2>


                                {/* =================================================
                                    DESCRIPCIÓN
                                ================================================= */}

                                <p>
                                    {taller.descripcion}
                                </p>


                                {/* =================================================
                                    FECHA
                                ================================================= */}

                                <p>

                                    <strong>
                                        Fecha:
                                    </strong>{" "}

                                    {taller.fecha}

                                </p>


                                {/* =================================================
                                    HORARIO
                                ================================================= */}

                                <p>

                                    <strong>
                                        Horario:
                                    </strong>{" "}

                                    {taller.horaInicio}

                                    {" - "}

                                    {taller.horaFin}

                                </p>


                                {/* =================================================
                                    AFORO
                                ================================================= */}

                                <p>

                                    <strong>
                                        Aforo:
                                    </strong>{" "}

                                    {taller.aforo}

                                </p>


                                {/* =================================================
                                    CERTIFICACIÓN
                                ================================================= */}

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


                                {/* =================================================
                                    ESTADO
                                ================================================= */}

                                <p>

                                    <strong>
                                        Estado:
                                    </strong>{" "}

                                    <span
                                        className={
                                            taller.estado ===
                                            "PROGRAMADO"

                                                ? "estado-taller-programado"

                                                : taller.estado ===
                                                "EN_CURSO"

                                                    ? "estado-taller-en-curso"

                                                    : taller.estado ===
                                                    "FINALIZADO"

                                                        ? "estado-taller-finalizado"

                                                        : "estado-taller"
                                        }
                                    >
                                        {taller.estado}
                                    </span>

                                </p>


                                {/* =================================================
                                    CAPACITADOR
                                ================================================= */}

                                <p>

                                    <strong>
                                        Capacitador:
                                    </strong>{" "}

                                    {taller.capacitador

                                        ? `${taller.capacitador.nombre} ${taller.capacitador.apellido}`

                                        : "Sin asignar"

                                    }

                                </p>


                                {/* =================================================
                                    RESUMEN AFORO
                                ================================================= */}

                                {resumenes[taller.idtaller] && (

                                    <div className="resumen-aforo">

                                        <p>

                                            <strong>
                                                Aforo:
                                            </strong>{" "}

                                            {
                                                resumenes[
                                                    taller.idtaller
                                                    ].aforo
                                            }

                                        </p>


                                        <p>

                                            <strong>
                                                Programados:
                                            </strong>{" "}

                                            {
                                                resumenes[
                                                    taller.idtaller
                                                    ].programados
                                            }

                                            {" / "}

                                            {
                                                resumenes[
                                                    taller.idtaller
                                                    ].aforo
                                            }

                                        </p>


                                        <p>

                                            <strong>
                                                Confirmados:
                                            </strong>{" "}

                                            {
                                                resumenes[
                                                    taller.idtaller
                                                    ].confirmados
                                            }

                                            {" / "}

                                            {
                                                resumenes[
                                                    taller.idtaller
                                                    ].aforo
                                            }

                                        </p>


                                        <p>

                                            <strong>
                                                Pendientes:
                                            </strong>{" "}

                                            {
                                                resumenes[
                                                    taller.idtaller
                                                    ].pendientes
                                            }

                                        </p>

                                    </div>

                                )}


                                {/* =================================================
                                    EDITAR TALLER
                                ================================================= */}

                                {taller.estado ===
                                "PROGRAMADO" ? (

                                    <button
                                        className="boton-editar-taller"
                                        onClick={() => {

                                            setTallerEditar(
                                                taller
                                            );

                                            setMostrarEditar(
                                                true
                                            );

                                        }}
                                    >
                                        ✏ Editar taller
                                    </button>

                                ) : (

                                    <button
                                        className="boton-editar-taller boton-deshabilitado"
                                        disabled
                                        title="El taller ya está en curso o finalizado"
                                    >

                                    </button>

                                )}


                                {/* =================================================
                                    PROGRAMAR OPERARIOS
                                ================================================= */}

                                {taller.estado ===
                                "FINALIZADO" ? (

                                    <button
                                        className="boton-programar-taller boton-deshabilitado"
                                        disabled
                                        title="No se pueden programar operarios en un taller finalizado"
                                    >
                                        👥 Programación cerrada
                                    </button>

                                ) : (

                                    <button
                                        className="boton-programar-taller"
                                        onClick={() =>
                                            setTallerSeleccionado(
                                                taller
                                            )
                                        }
                                    >
                                        👥 Programar operarios
                                    </button>

                                )}

                            </article>

                        ))}

                    </div>

                )}

        </section>
    );
}

export default AdministradorTalleres;