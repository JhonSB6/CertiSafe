import { useEffect, useState } from "react";
import "./AdministradorProgramarOperarios.css";

function AdministradorProgramarOperarios({ taller, volver }) {

    const [operarios, setOperarios] = useState([]);
    const [seleccionados, setSeleccionados] = useState([]);

    const [programados, setProgramados] = useState(0);

    const [cargando, setCargando] = useState(true);
    const [programando, setProgramando] = useState(false);

    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");


    // ==========================================
    // CUPOS DISPONIBLES
    // ==========================================

    const cuposDisponibles = Math.max(
        0,
        taller.aforo - programados
    );


    // ==========================================
    // CARGAR INFORMACIÓN DEL TALLER
    // ==========================================

    const cargarResumen = async () => {

        try {

            const respuesta = await fetch(
                `http://localhost:8080/api/talleres/${taller.idtaller}/resumen`
    );

if (!respuesta.ok) {

    throw new Error(
        "No fue posible consultar el resumen del taller."
    );
}

const resumen = await respuesta.json();

setProgramados(
    Number(resumen.programados) || 0
);

} catch (error) {

    console.error(
        "Error cargando resumen del taller:",
        error
    );

    throw error;
}
};


// ==========================================
// CARGAR OPERARIOS DISPONIBLES
// ==========================================

const cargarOperarios = async () => {

    setCargando(true);
    setError("");
    setMensaje("");

    try {

        // ==========================================
        // CARGAR RESUMEN
        // ==========================================

        await cargarResumen();


        // ==========================================
        // CARGAR OPERARIOS DISPONIBLES
        // ==========================================

        const respuesta = await fetch(
            `http://localhost:8080/api/talleres/${taller.idtaller}/operarios-disponibles`
        );

        if (!respuesta.ok) {

            throw new Error(
                "No fue posible cargar los operarios disponibles."
            );
        }

        const datos = await respuesta.json();

        setOperarios(datos);
        setSeleccionados([]);

    } catch (error) {

        console.error(error);

        setError(
            error.message ||
            "No fue posible cargar la información del taller."
        );

    } finally {

        setCargando(false);
    }
};


// ==========================================
// CARGAR AL ENTRAR
// ==========================================

useEffect(() => {

    cargarOperarios();

}, [taller.idtaller]);


// ==========================================
// SELECCIONAR / DESELECCIONAR
// ==========================================

const cambiarSeleccion = (idUsuario) => {

    setSeleccionados((anteriores) => {

        // ==========================================
        // DESELECCIONAR
        // ==========================================

        if (anteriores.includes(idUsuario)) {

            setError("");

            return anteriores.filter(
                (id) => id !== idUsuario
            );
        }


        // ==========================================
        // VALIDAR CUPOS DISPONIBLES
        // ==========================================

        if (
            anteriores.length >=
            cuposDisponibles
        ) {

            setError(
                `No puedes seleccionar más de ${cuposDisponibles} operario(s). `
                + `Ya hay ${programados} operario(s) programado(s) `
                + `de un aforo de ${taller.aforo}.`
            );

            return anteriores;
        }


        setError("");

        return [
            ...anteriores,
            idUsuario
        ];
    });
};


// ==========================================
// SELECCIONAR TODOS
// ==========================================

const seleccionarTodos = () => {

    if (seleccionados.length > 0) {

        setSeleccionados([]);
        setError("");

        return;
    }


    // ==========================================
    // VALIDAR SI YA ESTÁ COMPLETO
    // ==========================================

    if (cuposDisponibles === 0) {

        setError(
            "Ya fueron programados todos los operarios para este taller."
        );

        return;
    }


    const cantidadMaxima =
        Math.min(
            operarios.length,
            cuposDisponibles
        );

    const idsSeleccionados =
        operarios
            .slice(0, cantidadMaxima)
            .map(
                (operario) =>
                    operario.idusuario
            );

    setSeleccionados(idsSeleccionados);

    setError("");


    if (operarios.length > cuposDisponibles) {

        setMensaje(
            `Se seleccionaron ${cantidadMaxima} operario(s), `
            + `que corresponde(n) a los cupos disponibles.`
        );

    }

};


// ==========================================
// ESTADO DEL SELECTOR GENERAL
// ==========================================

const todosSeleccionados =
    cuposDisponibles > 0 &&
    operarios.length > 0 &&
    seleccionados.length ===
    Math.min(
        operarios.length,
        cuposDisponibles
    );


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


    // ==========================================
    // VALIDACIÓN FINAL DEL FRONTEND
    // ==========================================

    if (
        seleccionados.length >
        cuposDisponibles
    ) {

        setError(
            `No puedes programar ${seleccionados.length} operarios. `
            + `Solo quedan ${cuposDisponibles} cupo(s) disponibles.`
        );

        return;
    }


    setProgramando(true);
    setError("");
    setMensaje("");


    try {

        for (const idUsuario of seleccionados) {

            const parametros =
                new URLSearchParams();

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


        // ==========================================
        // ACTUALIZAR INFORMACIÓN
        // ==========================================

        await cargarOperarios();

    } catch (error) {

        console.error(error);

        setError(
            error.message ||
            "No fue posible completar la programación de los operarios."
        );

    } finally {

        setProgramando(false);
    }
};


// ==========================================
// RENDER
// ==========================================

return (

    <section className="seccion-administrador programacion-operarios">

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

            <div className="cabecera-info-taller">

                <div>

                        <span className="etiqueta-programacion">
                            TALLER
                        </span>

                    <h2>
                        {taller.nombre}
                    </h2>

                </div>

                <span
                    className={
                        taller.estado === "PROGRAMADO"
                            ? "badge-estado-programado"
                            : "badge-estado-cerrado"
                    }
                >
                        {taller.estado}
                    </span>

            </div>


            {taller.descripcion && (

                <p className="descripcion-taller-programacion">
                    {taller.descripcion}
                </p>

            )}


            <div className="datos-taller">

                <div>
                    <span>Fecha</span>
                    <strong>{taller.fecha}</strong>
                </div>

                <div>
                    <span>Horario</span>
                    <strong>
                        {taller.horaInicio}
                        {" - "}
                        {taller.horaFin}
                    </strong>
                </div>

                <div>
                    <span>Aforo</span>
                    <strong>
                        {taller.aforo}
                    </strong>
                </div>

                <div>
                    <span>Programados</span>
                    <strong>
                        {programados}
                        {" / "}
                        {taller.aforo}
                    </strong>
                </div>

                <div>
                    <span>Cupos disponibles</span>
                    <strong>
                        {cuposDisponibles}
                    </strong>
                </div>

                <div>
                    <span>Certificación</span>
                    <strong>
                        {taller.tipoCertificacion?.nombre}
                    </strong>
                </div>

            </div>

        </article>


        {/* ==========================================
                MENSAJE DE AFORO COMPLETO
            ========================================== */}

        {!cargando &&
            !error &&
            cuposDisponibles === 0 && (

                <div className="mensaje-exito">

                    ✓ Ya fueron programados todos los
                    operarios para este taller.

                </div>

            )}


        {/* ==========================================
                MENSAJES
            ========================================== */}

        {mensaje && (

            <div className="mensaje-exito">

                ✓ {mensaje}

            </div>

        )}


        {error && (

            <div className="mensaje-error">

                ⚠ {error}

            </div>

        )}


        {/* ==========================================
                CARGANDO
            ========================================== */}

        {cargando && (

            <div className="estado-programacion">

                <div className="spinner-programacion"></div>

                <p>
                    Cargando información del taller...
                </p>

            </div>

        )}


        {/* ==========================================
                SIN OPERARIOS
            ========================================== */}

        {!cargando &&
            cuposDisponibles > 0 &&
            !error &&
            operarios.length === 0 && (

                <div className="sin-operarios">

                    <div className="sin-operarios-icono">
                        👥
                    </div>

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
                TABLA
            ========================================== */}

        {!cargando &&
            cuposDisponibles > 0 &&
            operarios.length > 0 && (

                <div className="contenedor-tabla-operarios">

                    <div className="encabezado-tabla-operarios">

                        <div>

                            <h2>
                                Operarios disponibles
                            </h2>

                            <p>
                                Selecciona los participantes
                                que deseas programar.
                            </p>

                        </div>

                        <div className="contador-seleccion">

                                <span>
                                    Seleccionados
                                </span>

                            <strong>
                                {seleccionados.length}
                                {" / "}
                                {cuposDisponibles}
                            </strong>

                        </div>

                    </div>


                    <div className="tabla-responsive">

                        <table className="tabla-operarios">

                            <thead>

                            <tr>

                                <th className="columna-checkbox">

                                    <input
                                        type="checkbox"
                                        checked={
                                            todosSeleccionados
                                        }
                                        onChange={
                                            seleccionarTodos
                                        }
                                        disabled={
                                            programando
                                        }
                                    />

                                </th>

                                <th>
                                    Operario
                                </th>

                                <th>
                                    Documento
                                </th>

                                <th>
                                    Correo
                                </th>

                                <th>
                                    Estado
                                </th>

                            </tr>

                            </thead>


                            <tbody>

                            {operarios.map(
                                (operario) => {

                                    const seleccionado =
                                        seleccionados.includes(
                                            operario.idusuario
                                        );

                                    const bloqueado =
                                        !seleccionado &&
                                        seleccionados.length >=
                                        cuposDisponibles;

                                    return (

                                        <tr
                                            key={
                                                operario.idusuario
                                            }

                                            className={
                                                seleccionado
                                                    ? "fila-operario-seleccionada"
                                                    : ""
                                            }
                                        >

                                            <td className="columna-checkbox">

                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        seleccionado
                                                    }
                                                    disabled={
                                                        bloqueado ||
                                                        programando
                                                    }
                                                    onChange={() =>
                                                        cambiarSeleccion(
                                                            operario.idusuario
                                                        )
                                                    }
                                                />

                                            </td>


                                            <td>

                                                <div className="nombre-operario">

                                                    <div className="avatar-operario">
                                                        {operario.nombre
                                                            ?.charAt(0)
                                                            .toUpperCase()}
                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {operario.nombre}{" "}
                                                            {operario.apellido}
                                                        </strong>

                                                    </div>

                                                </div>

                                            </td>


                                            <td>
                                                {operario.documento}
                                            </td>


                                            <td>
                                                {operario.correo}
                                            </td>


                                            <td>

                                                    <span className="badge-operario-disponible">
                                                        Disponible
                                                    </span>

                                            </td>

                                        </tr>

                                    );
                                }
                            )}

                            </tbody>

                        </table>

                    </div>


                    {/* ==========================================
                            PIE DE TABLA
                        ========================================== */}

                    <div className="pie-tabla-operarios">

                        <div className="seleccionar-todos-info">

                            <button
                                type="button"
                                className="boton-seleccionar-todos"
                                onClick={seleccionarTodos}
                                disabled={programando}
                            >
                                {todosSeleccionados
                                    ? "✓ Deseleccionar todos"
                                    : "☑ Seleccionar disponibles"
                                }
                            </button>

                            <span>
                                    Cupos disponibles:
                                {" "}
                                {cuposDisponibles}
                                </span>

                        </div>


                        <button
                            className="boton-programar-operarios"
                            onClick={
                                programarOperarios
                            }
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

                    </div>

                </div>

            )}

    </section>
);
}

export default AdministradorProgramarOperarios;