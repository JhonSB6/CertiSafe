import { useState } from "react";
import "./RegistroUsuario.css";

function RegistroUsuario({ volverInicio }) {

    const [formulario, setFormulario] = useState({
        documento: "",
        nombre: "",
        apellido: "",
        correo: "",
        contrasena: "",
        idRol: ""
    });

    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);


    // =========================================================
    // MANEJAR CAMBIOS DEL FORMULARIO
    // =========================================================

    const manejarCambio = (e) => {

        const { name, value } = e.target;

        setFormulario((anterior) => ({
            ...anterior,
            [name]: value
        }));

        setMensaje("");
        setError("");
    };


    // =========================================================
    // ENVIAR SOLICITUD
    // =========================================================

    const enviarSolicitud = async (e) => {

        e.preventDefault();

        setMensaje("");
        setError("");


        // -----------------------------------------------------
        // VALIDACIONES
        // -----------------------------------------------------

        if (!formulario.documento.trim()) {

            setError(
                "Ingresa tu número de documento."
            );

            return;
        }

        if (!formulario.nombre.trim()) {

            setError(
                "Ingresa tu nombre."
            );

            return;
        }

        if (!formulario.apellido.trim()) {

            setError(
                "Ingresa tu apellido."
            );

            return;
        }

        if (!formulario.correo.trim()) {

            setError(
                "Ingresa tu correo electrónico."
            );

            return;
        }

        if (!formulario.contrasena) {

            setError(
                "Ingresa una contraseña."
            );

            return;
        }

        if (!formulario.idRol) {

            setError(
                "Debes seleccionar un tipo de usuario."
            );

            return;
        }


        // -----------------------------------------------------
        // CORREO
        // -----------------------------------------------------

        const correoValido =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            !correoValido.test(
                formulario.correo.trim()
            )
        ) {

            setError(
                "Ingresa un correo electrónico válido."
            );

            return;
        }


        setCargando(true);


        try {

            const respuesta = await fetch(
                "http://localhost:8080/api/solicitudes-registro",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        documento:
                            formulario.documento.trim(),

                        nombre:
                            formulario.nombre.trim(),

                        apellido:
                            formulario.apellido.trim(),

                        correo:
                            formulario.correo.trim(),

                        contrasena:
                        formulario.contrasena,

                        idRol:
                            Number(
                                formulario.idRol
                            )
                    })
                }
            );


            // -------------------------------------------------
            // RESPUESTA
            // -------------------------------------------------

            let datos;

            try {

                datos =
                    await respuesta.json();

            } catch {

                datos = null;

            }


            if (!respuesta.ok) {

                let mensajeError =
                    "No fue posible enviar la solicitud.";

                if (typeof datos === "string") {

                    mensajeError =
                        datos;

                } else if (
                    datos &&
                    typeof datos.message === "string"
                ) {

                    mensajeError =
                        datos.message;

                }

                throw new Error(
                    mensajeError
                );
            }


            // -------------------------------------------------
            // ÉXITO
            // -------------------------------------------------

            setMensaje(
                "Solicitud enviada correctamente. " +
                "Un administrador debe validar tus datos " +
                "antes de permitirte ingresar al sistema."
            );


            setFormulario({
                documento: "",
                nombre: "",
                apellido: "",
                correo: "",
                contrasena: "",
                idRol: ""
            });


        } catch (error) {

            console.error(
                "ERROR ENVIANDO SOLICITUD:",
                error
            );

            setError(
                error.message ||
                "No fue posible enviar la solicitud."
            );

        } finally {

            setCargando(false);
        }
    };


    // =========================================================
    // VISTA
    // =========================================================

    return (

        <div className="registro-modal-contenido">


            {/* =================================================
                ENCABEZADO
            ================================================= */}

            <div className="registro-encabezado">

                <div>

                    <h1>
                        Solicitud de registro
                    </h1>

                    <p>
                        Completa tus datos para solicitar
                        acceso a CertiSafe.
                    </p>

                </div>

            </div>


            {/* =================================================
                MENSAJE DE ÉXITO
            ================================================= */}

            {mensaje && (

                <div className="registro-mensaje-exito">

                    <strong>
                        Solicitud enviada
                    </strong>

                    <p>
                        {mensaje}
                    </p>

                </div>

            )}


            {/* =================================================
                MENSAJE DE ERROR
            ================================================= */}

            {error && (

                <div className="registro-mensaje-error">

                    {error}

                </div>

            )}


            {/* =================================================
                FORMULARIO
            ================================================= */}

            {!mensaje && (

                <form
                    className="formulario-registro"
                    onSubmit={enviarSolicitud}
                >


                    {/* =================================================
                        DOCUMENTO
                    ================================================= */}

                    <div className="campo-registro">

                        <label>
                            Documento
                        </label>

                        <input
                            type="text"
                            name="documento"
                            value={
                                formulario.documento
                            }
                            onChange={
                                manejarCambio
                            }
                            placeholder="Número de documento"
                            autoComplete="off"
                            required
                        />

                    </div>


                    {/* =================================================
                        NOMBRE / APELLIDO
                    ================================================= */}

                    <div className="fila-registro">

                        <div className="campo-registro">

                            <label>
                                Nombre
                            </label>

                            <input
                                type="text"
                                name="nombre"
                                value={
                                    formulario.nombre
                                }
                                onChange={
                                    manejarCambio
                                }
                                placeholder="Nombre"
                                required
                            />

                        </div>


                        <div className="campo-registro">

                            <label>
                                Apellido
                            </label>

                            <input
                                type="text"
                                name="apellido"
                                value={
                                    formulario.apellido
                                }
                                onChange={
                                    manejarCambio
                                }
                                placeholder="Apellido"
                                required
                            />

                        </div>

                    </div>


                    {/* =================================================
                        CORREO
                    ================================================= */}

                    <div className="campo-registro">

                        <label>
                            Correo electrónico
                        </label>

                        <input
                            type="email"
                            name="correo"
                            value={
                                formulario.correo
                            }
                            onChange={
                                manejarCambio
                            }
                            placeholder="correo@ejemplo.com"
                            autoComplete="email"
                            required
                        />

                    </div>


                    {/* =================================================
                        CONTRASEÑA
                    ================================================= */}

                    <div className="campo-registro">

                        <label>
                            Contraseña
                        </label>

                        <input
                            type="password"
                            name="contrasena"
                            value={
                                formulario.contrasena
                            }
                            onChange={
                                manejarCambio
                            }
                            placeholder="Crea una contraseña"
                            autoComplete="new-password"
                            required
                        />

                    </div>


                    {/* =================================================
                        TIPO DE USUARIO
                    ================================================= */}

                    <div className="campo-registro">

                        <label>
                            Tipo de usuario
                        </label>

                        <select
                            name="idRol"
                            value={
                                formulario.idRol
                            }
                            onChange={
                                manejarCambio
                            }
                            required
                        >

                            <option value="">
                                Selecciona un rol
                            </option>

                            <option value="2">
                                Operario
                            </option>

                            <option value="3">
                                Capacitador
                            </option>

                        </select>

                    </div>


                    {/* =================================================
                        BOTÓN
                    ================================================= */}

                    <button
                        type="submit"
                        className="boton-enviar-registro"
                        disabled={cargando}
                    >

                        {cargando
                            ? "Enviando solicitud..."
                            : "Enviar solicitud"}

                    </button>

                </form>

            )}


            {/* =================================================
                DESPUÉS DEL REGISTRO
            ================================================= */}

            {mensaje && (

                <button
                    type="button"
                    className="boton-cerrar-registro"
                    onClick={volverInicio}
                >
                    Cerrar
                </button>

            )}

        </div>
    );
}

export default RegistroUsuario;