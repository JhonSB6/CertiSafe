import { useEffect, useState } from "react";

function AdministradorEditarTaller({ taller, volver }) {

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [fecha, setFecha] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFin, setHoraFin] = useState("");
    const [aforo, setAforo] = useState("");
    const [tipoCertificacion, setTipoCertificacion] = useState("");

    const [tiposCertificacion, setTiposCertificacion] = useState([]);

    const [cargandoTipos, setCargandoTipos] = useState(true);
    const [guardando, setGuardando] = useState(false);

    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");


    // =========================================================
    // CARGAR DATOS DEL TALLER
    // =========================================================

    useEffect(() => {

        if (!taller) {
            return;
        }

        setNombre(taller.nombre || "");
        setDescripcion(taller.descripcion || "");
        setFecha(taller.fecha || "");
        setHoraInicio(taller.horaInicio || "");
        setHoraFin(taller.horaFin || "");
        setAforo(
            taller.aforo !== undefined &&
            taller.aforo !== null
                ? taller.aforo
                : ""
        );

        setTipoCertificacion(
            taller.tipoCertificacion?.idTipoCertificacion
                ? String(
                    taller.tipoCertificacion.idTipoCertificacion
                )
                : ""
        );

    }, [taller]);


    // =========================================================
    // CARGAR TIPOS DE CERTIFICACIÓN
    // =========================================================

    useEffect(() => {

        const cargarTiposCertificacion = async () => {

            try {

                setCargandoTipos(true);
                setError("");

                /*
                 * Ajusta esta URL solamente si tu backend
                 * utiliza otro endpoint para los tipos.
                 */
                const respuesta = await fetch(
                    "http://localhost:8080/api/tipos-certificacion"
                );

                if (!respuesta.ok) {

                    throw new Error(
                        "No fue posible cargar los tipos de certificación."
                    );

                }

                const datos = await respuesta.json();

                setTiposCertificacion(datos);

            } catch (error) {

                console.error(
                    "Error cargando tipos de certificación:",
                    error
                );

                setError(
                    error.message ||
                    "No fue posible cargar los tipos de certificación."
                );

            } finally {

                setCargandoTipos(false);

            }

        };

        cargarTiposCertificacion();

    }, []);


    // =========================================================
    // VALIDAR FORMULARIO
    // =========================================================

    const validarFormulario = () => {

        if (!nombre.trim()) {

            setError(
                "Ingresa el nombre del taller."
            );

            return false;
        }

        if (!descripcion.trim()) {

            setError(
                "Ingresa la descripción del taller."
            );

            return false;
        }

        if (!fecha) {

            setError(
                "Selecciona una fecha."
            );

            return false;
        }

        if (!horaInicio) {

            setError(
                "Selecciona la hora de inicio."
            );

            return false;
        }

        if (!horaFin) {

            setError(
                "Selecciona la hora de finalización."
            );

            return false;
        }

        if (horaInicio >= horaFin) {

            setError(
                "La hora de inicio debe ser menor que la hora de finalización."
            );

            return false;
        }

        if (
            aforo === "" ||
            Number(aforo) <= 0
        ) {

            setError(
                "El aforo debe ser mayor que cero."
            );

            return false;
        }

        if (!tipoCertificacion) {

            setError(
                "Selecciona un tipo de certificación."
            );

            return false;
        }

        return true;
    };


    // =========================================================
    // GUARDAR CAMBIOS
    // =========================================================

    const guardarCambios = async () => {

        setMensaje("");
        setError("");

        if (!validarFormulario()) {
            return;
        }

        setGuardando(true);

        try {

            const respuesta = await fetch(
                `http://localhost:8080/api/talleres/${taller.idtaller}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        idtaller: taller.idtaller,

                        nombre: nombre.trim(),

                        descripcion: descripcion.trim(),

                        fecha: fecha,

                        horaInicio: horaInicio,

                        horaFin: horaFin,

                        aforo: Number(aforo),

                        /*
                         * No permitimos cambiar el estado
                         * desde esta pantalla.
                         *
                         * El backend conservará el estado
                         * real del taller.
                         */
                        tipoCertificacion: {
                            idTipoCertificacion:
                                Number(tipoCertificacion)
                        }

                    })
                }
            );


            if (!respuesta.ok) {

                const textoError =
                    await respuesta.text();

                throw new Error(
                    textoError ||
                    "No fue posible actualizar el taller."
                );

            }


            const tallerActualizado =
                await respuesta.json();

            console.log(
                "TALLER ACTUALIZADO:",
                tallerActualizado
            );


            setMensaje(
                "Taller actualizado correctamente."
            );


            /*
             * Volvemos a la lista después de mostrar
             * brevemente el mensaje de éxito.
             */
            setTimeout(() => {

                volver();

            }, 800);


        } catch (error) {

            console.error(
                "ERROR ACTUALIZANDO TALLER:",
                error
            );

            setError(
                error.message ||
                "No fue posible actualizar el taller."
            );

        } finally {

            setGuardando(false);

        }

    };


    // =========================================================
    // SI NO EXISTE TALLER
    // =========================================================

    if (!taller) {

        return (

            <section className="seccion-administrador">

                <h1>
                    Editar taller
                </h1>

                <p className="mensaje-error">
                    No fue posible cargar la información del taller.
                </p>

                <button
                    className="boton-volver"
                    onClick={volver}
                >
                    ← Volver
                </button>

            </section>

        );

    }


    // =========================================================
    // VISTA
    // =========================================================

    return (

        <section className="seccion-administrador">

            {/* =================================================
                ENCABEZADO
            ================================================= */}

            <div className="encabezado-editar-taller">

                <button
                    className="boton-volver"
                    onClick={volver}
                    disabled={guardando}
                >
                    ← Volver
                </button>

                <div>

                    <h1>
                        Editar taller
                    </h1>

                    <p>
                        Actualiza la información del taller
                        mientras permanezca en estado PROGRAMADO.
                    </p>

                </div>

            </div>


            {/* =================================================
                ESTADO ACTUAL
            ================================================= */}

            <div className="estado-edicion-taller">

                <strong>
                    Estado actual:
                </strong>

                <span>
                    {taller.estado}
                </span>

            </div>


            {/* =================================================
                MENSAJE ÉXITO
            ================================================= */}

            {mensaje && (

                <div className="mensaje-exito">
                    {mensaje}
                </div>

            )}


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="mensaje-error">
                    {error}
                </div>

            )}


            {/* =================================================
                FORMULARIO
            ================================================= */}

            <div className="formulario-taller">


                {/* =================================================
                    NOMBRE
                ================================================= */}

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
                        placeholder="Nombre del taller"
                        disabled={guardando}
                    />

                </div>


                {/* =================================================
                    DESCRIPCIÓN
                ================================================= */}

                <div className="campo-formulario">

                    <label>
                        Descripción
                    </label>

                    <textarea
                        rows="5"
                        value={descripcion}
                        onChange={(e) =>
                            setDescripcion(e.target.value)
                        }
                        placeholder="Descripción del taller"
                        disabled={guardando}
                    />

                </div>


                {/* =================================================
                    FECHA
                ================================================= */}

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
                        disabled={guardando}
                    />

                </div>


                {/* =================================================
                    HORARIOS
                ================================================= */}

                <div className="fila-formulario">

                    <div className="campo-formulario">

                        <label>
                            Hora de inicio
                        </label>

                        <input
                            type="time"
                            value={horaInicio}
                            onChange={(e) =>
                                setHoraInicio(
                                    e.target.value
                                )
                            }
                            disabled={guardando}
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
                                setHoraFin(
                                    e.target.value
                                )
                            }
                            disabled={guardando}
                        />

                    </div>

                </div>


                {/* =================================================
                    AFORO
                ================================================= */}

                <div className="campo-formulario">

                    <label>
                        Aforo
                    </label>

                    <input
                        type="number"
                        min="1"
                        value={aforo}
                        onChange={(e) =>
                            setAforo(
                                e.target.value
                            )
                        }
                        placeholder="Cantidad de operarios"
                        disabled={guardando}
                    />

                </div>


                {/* =================================================
                    TIPO CERTIFICACIÓN
                ================================================= */}

                <div className="campo-formulario">

                    <label>
                        Tipo de certificación
                    </label>


                    {cargandoTipos ? (

                        <p>
                            Cargando tipos de certificación...
                        </p>

                    ) : (

                        <select
                            value={tipoCertificacion}
                            onChange={(e) =>
                                setTipoCertificacion(
                                    e.target.value
                                )
                            }
                            disabled={guardando}
                        >

                            <option value="">
                                Selecciona un tipo
                            </option>


                            {tiposCertificacion.map(
                                (tipo) => (

                                    <option
                                        key={
                                            tipo.idTipoCertificacion
                                        }
                                        value={
                                            tipo.idTipoCertificacion
                                        }
                                    >
                                        {tipo.nombre}
                                    </option>

                                )
                            )}

                        </select>

                    )}

                </div>


                {/* =================================================
                    CAPACITADOR
                ================================================= */}

                <div className="campo-formulario">

                    <label>
                        Capacitador asignado
                    </label>

                    <input
                        type="text"
                        value={
                            taller.capacitador
                                ? `${taller.capacitador.nombre} ${taller.capacitador.apellido}`
                                : "Sin asignar"
                        }
                        disabled
                    />

                    <small>
                        El capacitador asignado no se modifica
                        desde esta pantalla.
                    </small>

                </div>


                {/* =================================================
                    ESTADO
                ================================================= */}

                <div className="campo-formulario">

                    <label>
                        Estado
                    </label>

                    <input
                        type="text"
                        value={taller.estado}
                        disabled
                    />

                    <small>
                        El estado es administrado automáticamente por el sistema.
                    </small>

                </div>


                {/* =================================================
                    BOTONES
                ================================================= */}

                <div className="acciones-formulario">

                    <button
                        type="button"
                        className="boton-cancelar"
                        onClick={volver}
                        disabled={guardando}
                    >
                        Cancelar
                    </button>


                    <button
                        type="button"
                        className="boton-guardar"
                        onClick={guardarCambios}
                        disabled={
                            guardando ||
                            cargandoTipos
                        }
                    >
                        {guardando
                            ? "Guardando..."
                            : "Guardar cambios"}
                    </button>

                </div>

            </div>

        </section>
    );
}

export default AdministradorEditarTaller;