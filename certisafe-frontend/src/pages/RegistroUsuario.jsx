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

    const manejarCambio = (e) => {

        const { name, value } = e.target;

        setFormulario({
            ...formulario,
            [name]: value
        });

    };

    const enviarSolicitud = async (e) => {

        e.preventDefault();

        setMensaje("");
        setError("");

        if (!formulario.idRol) {
            setError("Debes seleccionar un tipo de usuario.");
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
                        documento: formulario.documento,
                        nombre: formulario.nombre,
                        apellido: formulario.apellido,
                        correo: formulario.correo,
                        contrasena: formulario.contrasena,
                        idRol: Number(formulario.idRol)
                    })
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    typeof datos === "string"
                        ? datos
                        : "No fue posible enviar la solicitud."
                );
            }

            setMensaje(
                "Solicitud enviada correctamente. Un administrador debe validar tus datos antes de permitirte ingresar al sistema."
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

            setError(error.message);

        } finally {

            setCargando(false);

        }
    };

    return (

        <div className="pagina-registro">

            <div className="registro-contenedor">

                <div className="registro-encabezado">

                    <h1>
                        Solicitud de registro
                    </h1>

                    <p>
                        Completa tus datos para solicitar acceso a CertiSafe.
                    </p>

                </div>


                {mensaje && (

                    <div className="registro-mensaje-exito">
                        {mensaje}
                    </div>

                )}


                {error && (

                    <div className="registro-mensaje-error">
                        {error}
                    </div>

                )}


                {!mensaje && (

                    <form
                        className="formulario-registro"
                        onSubmit={enviarSolicitud}
                    >

                        <div className="campo-registro">

                            <label>
                                Documento
                            </label>

                            <input
                                type="text"
                                name="documento"
                                value={formulario.documento}
                                onChange={manejarCambio}
                                placeholder="Número de documento"
                                required
                            />

                        </div>


                        <div className="fila-registro">

                            <div className="campo-registro">

                                <label>
                                    Nombre
                                </label>

                                <input
                                    type="text"
                                    name="nombre"
                                    value={formulario.nombre}
                                    onChange={manejarCambio}
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
                                    value={formulario.apellido}
                                    onChange={manejarCambio}
                                    placeholder="Apellido"
                                    required
                                />

                            </div>

                        </div>


                        <div className="campo-registro">

                            <label>
                                Correo electrónico
                            </label>

                            <input
                                type="email"
                                name="correo"
                                value={formulario.correo}
                                onChange={manejarCambio}
                                placeholder="correo@ejemplo.com"
                                required
                            />

                        </div>


                        <div className="campo-registro">

                            <label>
                                Contraseña
                            </label>

                            <input
                                type="password"
                                name="contrasena"
                                value={formulario.contrasena}
                                onChange={manejarCambio}
                                placeholder="Crea una contraseña"
                                required
                            />

                        </div>


                        <div className="campo-registro">

                            <label>
                                Tipo de usuario
                            </label>

                            <select
                                name="idRol"
                                value={formulario.idRol}
                                onChange={manejarCambio}
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


                <button
                    className="boton-volver-registro"
                    onClick={volverInicio}
                >
                    ← Volver al inicio
                </button>

            </div>

        </div>

    );
}

export default RegistroUsuario;