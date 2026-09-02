import { useEffect, useState } from "react";

function AdministradorCrearTaller({ volver }) {

    const [tiposCertificacion, setTiposCertificacion] = useState([]);
    const [capacitadores, setCapacitadores] = useState([]);
    const [capacitador, setCapacitador] = useState("");

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [fecha, setFecha] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFin, setHoraFin] = useState("");
    const [aforo, setAforo] = useState("");
    const [tipoCertificacion, setTipoCertificacion] = useState("");

    const [nuevaCertificacion, setNuevaCertificacion] = useState("");
    const [mostrarNuevaCertificacion, setMostrarNuevaCertificacion] = useState(false);

    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const [guardando, setGuardando] = useState(false);
    const [cargandoCapacitadores, setCargandoCapacitadores] = useState(false);

    // ==========================================
    // CARGAR TIPOS DE CERTIFICACIÓN
    // ==========================================

    useEffect(() => {

        const cargarTiposCertificacion = async () => {
            try {
                const respuesta = await fetch(
                    "http://localhost:8080/api/tipos-certificacion"
                );

                if (!respuesta.ok) {
                    throw new Error(
                        "No fue posible cargar las certificaciones"
                    );
                }

                const datos = await respuesta.json();

                setTiposCertificacion(datos);

            } catch (error) {
                console.error(error);

                setError(
                    "No fue posible cargar los tipos de certificación."
                );
            }
        };

        cargarTiposCertificacion();

    }, []);
    // ==========================================
// CARGAR CAPACITADORES DISPONIBLES
// ==========================================

    const cargarCapacitadoresDisponibles = async () => {

        // =========================================================
        // VALIDAR DATOS NECESARIOS
        // =========================================================

        if (!fecha || !horaInicio || !horaFin) {
            setCapacitadores([]);
            setCapacitador("");
            setCargandoCapacitadores(false);
            return;
        }

        // =========================================================
        // VALIDAR HORARIO
        // =========================================================

        if (horaFin <= horaInicio) {
            setCapacitadores([]);
            setCapacitador("");
            setCargandoCapacitadores(false);
            return;
        }

        setCargandoCapacitadores(true);

        try {

            const respuesta = await fetch(
                `http://localhost:8080/usuarios/capacitadores/disponibles` +
                `?fecha=${fecha}` +
                `&horaInicio=${horaInicio}` +
                `&horaFin=${horaFin}`
            );

            if (!respuesta.ok) {
                throw new Error(
                    "No fue posible consultar los capacitadores disponibles."
                );
            }

            const datos = await respuesta.json();

            setCapacitadores(datos);

            // Si el capacitador seleccionado anteriormente
            // ya no está disponible, se elimina la selección.
            if (
                capacitador &&
                !datos.some(
                    (usuario) =>
                        String(usuario.idusuario) ===
                        String(capacitador)
                )
            ) {
                setCapacitador("");
            }

        } catch (error) {

            console.error(
                "Error al consultar capacitadores disponibles:",
                error
            );

            setCapacitadores([]);
            setCapacitador("");

            setError(
                "No fue posible consultar los capacitadores disponibles."
            );

        } finally {

            setCargandoCapacitadores(false);
        }
    };


// ==========================================
// ACTUALIZAR CAPACITADORES AL CAMBIAR HORARIO
// ==========================================

    useEffect(() => {

        cargarCapacitadoresDisponibles();

    }, [fecha, horaInicio, horaFin]);

    // ==========================================
    // CREAR NUEVA CERTIFICACIÓN
    // ==========================================

    const crearCertificacion = async () => {

        if (!nuevaCertificacion.trim()) {
            setError("Escribe el nombre de la certificación.");
            return;
        }

        try {

            setError("");

            const respuesta = await fetch(
                "http://localhost:8080/api/tipos-certificacion",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        nombre: nuevaCertificacion.trim()
                    })
                }
            );

            if (!respuesta.ok) {
                throw new Error(
                    "No fue posible crear la certificación"
                );
            }

            const nueva = await respuesta.json();

            setTiposCertificacion((anteriores) => [
                ...anteriores,
                nueva
            ]);

            setTipoCertificacion(
                String(nueva.idTipoCertificacion)
            );

            setNuevaCertificacion("");
            setMostrarNuevaCertificacion(false);

            setMensaje(
                "Certificación creada correctamente."
            );

        } catch (error) {

            console.error(error);

            setError(
                "No fue posible crear la certificación."
            );
        }
    };


    // ==========================================
    // CREAR TALLER
    // ==========================================

    const guardarTaller = async (e) => {

        e.preventDefault();

        setMensaje("");
        setError("");

        if (!tipoCertificacion) {
            setError(
                "Selecciona un tipo de certificación."
            );
            return;
        }

        if (!capacitador) {
            setError(
                "Selecciona un capacitador."
            );
            return;
        }

        if (horaFin <= horaInicio) {
            setError(
                "La hora de finalización debe ser posterior a la hora de inicio."
            );
            return;
        }

        setGuardando(true);

        try {

            const respuesta = await fetch(
                "http://localhost:8080/api/talleres",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({

                        nombre: nombre,
                        descripcion: descripcion,
                        fecha: fecha,
                        horaInicio: horaInicio,
                        horaFin: horaFin,
                        aforo: Number(aforo),

                        estado: "PROGRAMADO",

                        tipoCertificacion: {
                            idTipoCertificacion:
                                Number(tipoCertificacion)
                        },

                        capacitador: {
                            idusuario: Number(capacitador)
                        }

                    })
                }
            );

            // =====================================================
            // RESPUESTA CON ERROR DEL BACKEND
            // =====================================================

            if (!respuesta.ok) {

                let mensajeError =
                    "No fue posible crear el taller.";

                try {

                    const datosError =
                        await respuesta.json();

                    if (datosError?.mensaje) {

                        mensajeError =
                            datosError.mensaje;

                    }

                } catch (errorLectura) {

                    console.error(
                        "Error al leer la respuesta del servidor:",
                        errorLectura
                    );
                }

                throw new Error(mensajeError);
            }

            // =====================================================
            // TALLER CREADO CORRECTAMENTE
            // =====================================================

            await respuesta.json();

            setMensaje(
                "Taller creado correctamente."
            );

            setNombre("");
            setDescripcion("");
            setFecha("");
            setHoraInicio("");
            setHoraFin("");
            setAforo("");
            setTipoCertificacion("");
            setCapacitador("");
            setCapacitadores([]);

        } catch (error) {

            console.error(
                "Error al crear taller:",
                error
            );

            setError(
                error.message ||
                "No fue posible crear el taller."
            );

        } finally {

            setGuardando(false);
        }
    };


    return (

        <section className="seccion-administrador">

            <div className="encabezado-formulario">

                <div>

                    <h1>
                        Crear nuevo taller
                    </h1>

                    <p>
                        Registra un nuevo taller de capacitación.
                    </p>

                </div>

                <button
                    type="button"
                    onClick={volver}
                >
                    ← Volver
                </button>

            </div>


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


            <form
                className="formulario-taller"
                onSubmit={guardarTaller}
            >

                <div className="campo-formulario">

                    <label>
                        Nombre del taller
                    </label>

                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) =>
                            setNombre(e.target.value)
                        }
                        maxLength={100}
                        required
                    />

                </div>


                <div className="campo-formulario">

                    <label>
                        Descripción
                    </label>

                    <textarea
                        value={descripcion}
                        onChange={(e) =>
                            setDescripcion(e.target.value)
                        }
                        maxLength={300}
                        rows={4}
                    />

                </div>


                <div className="fila-formulario">

                    <div className="campo-formulario">

                        <label>
                            Fecha
                        </label>

                        <input
                            type="date"
                            value={fecha}
                            onChange={(e) =>
                                setFecha(e.target.value)
                            }
                            required
                        />

                    </div>


                    <div className="campo-formulario">

                        <label>
                            Hora de inicio
                        </label>

                        <input
                            type="time"
                            value={horaInicio}
                            onChange={(e) =>
                                setHoraInicio(e.target.value)
                            }
                            required
                        />

                    </div>


                    <div className="campo-formulario">

                        <label>
                            Hora de finalización
                        </label>

                        <input
                            type="time"
                            value={horaFin}
                            onChange={(e) =>
                                setHoraFin(e.target.value)
                            }
                            required
                        />

                    </div>

                </div>


                <div className="campo-formulario">

                    <label>
                        Aforo
                    </label>

                    <input
                        type="number"
                        min="1"
                        value={aforo}
                        onChange={(e) =>
                            setAforo(e.target.value)
                        }
                        required
                    />

                </div>


                <div className="campo-formulario">

                    <label>
                        Tipo de certificación
                    </label>

                    <select
                        value={tipoCertificacion}
                        onChange={(e) =>
                            setTipoCertificacion(e.target.value)
                        }
                        required
                    >

                        <option value="">
                            Selecciona una certificación
                        </option>

                        {tiposCertificacion.map((tipo) => (

                            <option
                                key={tipo.idTipoCertificacion}
                                value={tipo.idTipoCertificacion}
                            >
                                {tipo.nombre}
                            </option>

                        ))}

                    </select>

                </div>
                <div className="campo-formulario">

                    <label>
                        Capacitador
                    </label>

                    <select
                        value={capacitador}
                        onChange={(e) => setCapacitador(e.target.value)}
                        required
                        disabled={
                            !fecha ||
                            !horaInicio ||
                            !horaFin ||
                            horaFin <= horaInicio ||
                            cargandoCapacitadores
                        }
                    >

                        <option value="">
                            {!fecha || !horaInicio || !horaFin
                                ? "Primero selecciona fecha y horario"
                                : horaFin <= horaInicio
                                    ? "Corrige el horario"
                                    : cargandoCapacitadores
                                        ? "Consultando disponibilidad..."
                                        : capacitadores.length === 0
                                            ? "No hay capacitadores disponibles"
                                            : "Selecciona un capacitador"
                            }
                        </option>

                        {capacitadores.map((usuario) => (

                            <option
                                key={usuario.idusuario}
                                value={usuario.idusuario}
                            >
                                {usuario.nombre} {usuario.apellido}
                            </option>

                        ))}

                    </select>

                    {!cargandoCapacitadores &&
                        fecha &&
                        horaInicio &&
                        horaFin &&
                        horaFin > horaInicio &&
                        capacitadores.length === 0 && (
                            <small>
                                No hay capacitadores disponibles para la fecha y horario seleccionados.
                            </small>
                        )
                    }

                </div>


                {!mostrarNuevaCertificacion && (

                    <button
                        type="button"
                        className="boton-nueva-certificacion"
                        onClick={() =>
                            setMostrarNuevaCertificacion(true)
                        }
                    >
                        + Nueva certificación
                    </button>

                )}


                {mostrarNuevaCertificacion && (

                    <div className="nueva-certificacion">

                        <label>
                            Nueva certificación
                        </label>

                        <input
                            type="text"
                            value={nuevaCertificacion}
                            onChange={(e) =>
                                setNuevaCertificacion(
                                    e.target.value
                                )
                            }
                            placeholder="Ej. Seguridad eléctrica"
                            maxLength={100}
                        />

                        <div>

                            <button
                                type="button"
                                onClick={crearCertificacion}
                            >
                                Guardar certificación
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setMostrarNuevaCertificacion(false);
                                    setNuevaCertificacion("");
                                }}
                            >
                                Cancelar
                            </button>

                        </div>

                    </div>

                )}


                <button
                    type="submit"
                    className="boton-guardar-taller"
                    disabled={guardando}
                >
                    {guardando
                        ? "Guardando..."
                        : "Crear taller"}
                </button>

            </form>

        </section>
    );
}

export default AdministradorCrearTaller;