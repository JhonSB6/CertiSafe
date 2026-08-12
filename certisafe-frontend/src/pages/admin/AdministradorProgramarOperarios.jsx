import { useEffect, useState } from "react";

function AdministradorProgramarOperarios({ taller, volver }) {

    const [operarios, setOperarios] = useState([]);
    const [seleccionados, setSeleccionados] = useState([]);

    const [cargando, setCargando] = useState(true);
    const [programando, setProgramando] = useState(false);

    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");


    // ==========================================
    // CARGAR OPERARIOS DISPONIBLES
    // ==========================================

    const cargarOperarios = async () => {

        setCargando(true);
        setError("");
        setMensaje("");

        try {

            const respuesta = await fetch(
                `http://localhost:8080/api/talleres/${taller.idtaller}/operarios-disponibles`
            );

            if (!respuesta.ok) {
                throw new Error(
                    "No fue posible cargar los operarios disponibles"
                );
            }

            const datos = await respuesta.json();

            setOperarios(datos);
            setSeleccionados([]);

        } catch (error) {

            console.error(error);

            setError(
                "No fue posible cargar los operarios disponibles."
            );

        } finally {

            setCargando(false);
        }
    };


    // ==========================================
    // CARGAR AL ENTRAR A LA VISTA
    // ==========================================

    useEffect(() => {

        cargarOperarios();

    }, [taller.idtaller]);


    // ==========================================
    // SELECCIONAR / DESELECCIONAR OPERARIO
    // ==========================================

    const cambiarSeleccion = (idUsuario) => {

        setSeleccionados((anteriores) => {

            // Si ya está seleccionado, lo quitamos
            if (anteriores.includes(idUsuario)) {

                return anteriores.filter(
                    (id) => id !== idUsuario
                );
            }

            // No permitir superar el aforo
            if (anteriores.length >= taller.aforo) {

                return anteriores;
            }

            return [
                ...anteriores,
                idUsuario
            ];
        });
    };


    // ==========================================
    // PROGRAMAR OPERARIOS
    // ==========================================

    const programarOperarios = async () => {

        if (seleccionados.length === 0) {

            setError(
                "Selecciona al menos un operario."
            );

            return;
        }

        setProgramando(true);
        setError("");
        setMensaje("");

        try {

            for (const idUsuario of seleccionados) {

                const parametros = new URLSearchParams();

                parametros.append(
                    "idTaller",
                    taller.idtaller
                );

                parametros.append(
                    "idUsuario",
                    idUsuario
                );

                parametros.append(
                    "estadoTipoProgramacion",
                    "INICIAL"
                );


                const respuesta = await fetch(
                    `http://localhost:8080/api/inscripciones-taller/programar?${parametros.toString()}`,
                    {
                        method: "POST"
                    }
                );


                if (!respuesta.ok) {

                    const textoError =
                        await respuesta.text();

                    throw new Error(
                        textoError ||
                        "No fue posible programar un operario."
                    );
                }
            }


            setMensaje(
                `${seleccionados.length} operario(s) programado(s) correctamente.`
            );

            setSeleccionados([]);

            await cargarOperarios();

        } catch (error) {

            console.error(error);

            setError(
                "No fue posible completar la programación de los operarios."
            );

        } finally {

            setProgramando(false);
        }
    };


    return (

        <section className="seccion-administrador">

            {/* ==========================================
                ENCABEZADO
            ========================================== */}

            <div className="encabezado-programacion">

                <div>

                    <h1>
                        Programar operarios
                    </h1>

                    <p>
                        Selecciona los operarios que deseas
                        programar para este taller.
                    </p>

                </div>


                <button
                    className="boton-volver"
                    onClick={volver}
                >
                    ← Volver
                </button>

            </div>


            {/* ==========================================
                INFORMACIÓN DEL TALLER
            ========================================== */}

            <article className="informacion-taller-programacion">

                <h2>
                    {taller.nombre}
                </h2>

                <p>
                    {taller.descripcion}
                </p>

                <div className="datos-taller">

                    <span>
                        <strong>Fecha:</strong>{" "}
                        {taller.fecha}
                    </span>

                    <span>
                        <strong>Horario:</strong>{" "}
                        {taller.horaInicio}
                        {" - "}
                        {taller.horaFin}
                    </span>

                    <span>
                        <strong>Aforo:</strong>{" "}
                        {taller.aforo}
                    </span>

                    <span>
                        <strong>Certificación:</strong>{" "}
                        {taller.tipoCertificacion?.nombre}
                    </span>

                </div>

            </article>


            {/* ==========================================
                MENSAJES
            ========================================== */}

            {mensaje && (

                <p className="mensaje-exito">
                    {mensaje}
                </p>

            )}


            {error && (

                <p className="mensaje-error">
                    {error}
                </p>

            )}


            {/* ==========================================
                CARGANDO
            ========================================== */}

            {cargando && (

                <p>
                    Cargando operarios disponibles...
                </p>

            )}


            {/* ==========================================
                SIN OPERARIOS
            ========================================== */}

            {!cargando &&
                !error &&
                operarios.length === 0 && (

                    <div className="sin-operarios">

                        <h3>
                            No hay operarios disponibles
                        </h3>

                        <p>
                            Actualmente no existen operarios
                            activos que cumplan los requisitos
                            para este taller.
                        </p>

                    </div>

                )}


            {/* ==========================================
                LISTA DE OPERARIOS
            ========================================== */}

            {!cargando &&
                operarios.length > 0 && (

                    <>

                        <div className="encabezado-operarios">

                            <h2>
                                Operarios disponibles
                            </h2>

                            <span>
                                Seleccionados:{" "}
                                {seleccionados.length} / {taller.aforo}
                            </span>

                        </div>


                        <div className="lista-operarios">

                            {operarios.map((operario) => (

                                <label
                                    className={
                                        seleccionados.includes(
                                            operario.idusuario
                                        )
                                            ? "operario-item operario-seleccionado"
                                            : "operario-item"
                                    }
                                    key={operario.idusuario}
                                >

                                    <input
                                        type="checkbox"
                                        checked={
                                            seleccionados.includes(
                                                operario.idusuario
                                            )
                                        }
                                        disabled={
                                            !seleccionados.includes(
                                                operario.idusuario
                                            ) &&
                                            seleccionados.length >= taller.aforo
                                        }
                                        onChange={() =>
                                            cambiarSeleccion(
                                                operario.idusuario
                                            )
                                        }
                                    />


                                    <div className="operario-info">

                                        <strong>
                                            {operario.nombre}{" "}
                                            {operario.apellido}
                                        </strong>

                                        <span>
                                            Documento:{" "}
                                            {operario.documento}
                                        </span>

                                        <span>
                                            Correo:{" "}
                                            {operario.correo}
                                        </span>

                                    </div>

                                </label>

                            ))}

                        </div>


                        {/* ==========================================
                            BOTÓN PROGRAMAR
                        ========================================== */}

                        <button
                            className="boton-programar-operarios"
                            onClick={programarOperarios}
                            disabled={
                                programando ||
                                seleccionados.length === 0
                            }
                        >

                            {programando
                                ? "Programando..."
                                : `Programar seleccionados (${seleccionados.length})`
                            }

                        </button>

                    </>

                )}

        </section>
    );
}

export default AdministradorProgramarOperarios;