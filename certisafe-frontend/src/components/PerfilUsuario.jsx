import { useEffect, useState } from "react";
import "./PerfilUsuario.css";

function PerfilUsuario({
                           usuario,
                           actualizarUsuario
                       }) {

    const [perfil, setPerfil] = useState(null);

    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [correo, setCorreo] = useState("");

    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);

    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");


    // =========================================================
    // CARGAR PERFIL
    // =========================================================

    const cargarPerfil = async () => {

        setCargando(true);
        setError("");

        try {

            const respuesta = await fetch(
                `http://localhost:8080/usuarios/${usuario.idUsuario}/perfil`
            );

            if (!respuesta.ok) {

                const mensajeError =
                    await respuesta.text();

                throw new Error(
                    mensajeError ||
                    "No fue posible cargar el perfil."
                );
            }

            const datos =
                await respuesta.json();

            console.log(
                "PERFIL DEL USUARIO:",
                datos
            );

            setPerfil(datos);

            setNombre(
                datos.nombre || ""
            );

            setApellido(
                datos.apellido || ""
            );

            setCorreo(
                datos.correo || ""
            );

        } catch (error) {

            console.error(
                "ERROR CARGANDO PERFIL:",
                error
            );

            setError(
                error.message ||
                "No fue posible cargar la información del perfil."
            );

        } finally {

            setCargando(false);

        }
    };


    // =========================================================
    // CARGAR AL ENTRAR
    // =========================================================

    useEffect(() => {

        if (usuario?.idUsuario) {

            cargarPerfil();

        }

    }, [usuario?.idUsuario]);


    // =========================================================
    // GUARDAR CAMBIOS
    // =========================================================

    const guardarCambios = async () => {

        setMensaje("");
        setError("");


        // -----------------------------------------------------
        // VALIDACIONES
        // -----------------------------------------------------

        if (!nombre.trim()) {

            setError(
                "El nombre es obligatorio."
            );

            return;
        }


        if (!apellido.trim()) {

            setError(
                "El apellido es obligatorio."
            );

            return;
        }


        if (!correo.trim()) {

            setError(
                "El correo es obligatorio."
            );

            return;
        }


        // Validación sencilla de correo
        const correoValido =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!correoValido.test(correo.trim())) {

            setError(
                "Ingresa un correo electrónico válido."
            );

            return;
        }


        setGuardando(true);


        try {

            const respuesta = await fetch(
                `http://localhost:8080/usuarios/${usuario.idUsuario}/perfil`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        nombre: nombre.trim(),
                        apellido: apellido.trim(),
                        correo: correo.trim()
                    })
                }
            );


            if (!respuesta.ok) {

                const mensajeError =
                    await respuesta.text();

                throw new Error(
                    mensajeError ||
                    "No fue posible actualizar el perfil."
                );
            }


            const datosActualizados =
                await respuesta.json();


            console.log(
                "PERFIL ACTUALIZADO:",
                datosActualizados
            );


            setPerfil(
                datosActualizados
            );


            setNombre(
                datosActualizados.nombre || ""
            );

            setApellido(
                datosActualizados.apellido || ""
            );

            setCorreo(
                datosActualizados.correo || ""
            );


            // -------------------------------------------------
            // ACTUALIZAR USUARIO GLOBAL
            // -------------------------------------------------

            actualizarUsuario({
                ...usuario,
                idUsuario:
                datosActualizados.idUsuario,
                documento:
                datosActualizados.documento,
                nombre:
                datosActualizados.nombre,
                apellido:
                datosActualizados.apellido,
                correo:
                datosActualizados.correo,
                rol:
                datosActualizados.rol,
                estado:
                datosActualizados.estado
            });


            setMensaje(
                "Perfil actualizado correctamente."
            );


        } catch (error) {

            console.error(
                "ERROR ACTUALIZANDO PERFIL:",
                error
            );

            setError(
                error.message ||
                "No fue posible actualizar el perfil."
            );

        } finally {

            setGuardando(false);

        }
    };


    // =========================================================
    // CARGANDO
    // =========================================================

    if (cargando) {

        return (

            <section className="seccion-perfil">

                <div className="perfil-cargando">

                    <div className="perfil-spinner"></div>

                    <p>
                        Cargando información del perfil...
                    </p>

                </div>

            </section>

        );

    }


    // =========================================================
    // VISTA
    // =========================================================

    return (

        <section className="seccion-perfil">

            {/* =================================================
                ENCABEZADO
            ================================================= */}

            <div className="perfil-encabezado">

                <div className="perfil-avatar">

                    {nombre
                        ? nombre
                            .charAt(0)
                            .toUpperCase()
                        : "U"}

                </div>


                <div>

                    <h1>
                        Mi perfil
                    </h1>

                    <p>
                        Consulta y actualiza tu información personal.
                    </p>

                </div>

            </div>


            {/* =================================================
                MENSAJES
            ================================================= */}

            {mensaje && (

                <div className="perfil-mensaje perfil-mensaje-exito">
                    ✓ {mensaje}
                </div>

            )}


            {error && (

                <div className="perfil-mensaje perfil-mensaje-error">
                    {error}
                </div>

            )}


            {/* =================================================
                INFORMACIÓN
            ================================================= */}

            <div className="perfil-contenedor">

                <div className="perfil-formulario">


                    {/* =================================================
                        NOMBRE
                    ================================================= */}

                    <div className="campo-perfil">

                        <label>
                            Nombre
                        </label>

                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => {

                                setNombre(
                                    e.target.value
                                );

                                setMensaje("");
                                setError("");

                            }}
                            disabled={guardando}
                            placeholder="Nombre"
                        />

                    </div>


                    {/* =================================================
                        APELLIDO
                    ================================================= */}

                    <div className="campo-perfil">

                        <label>
                            Apellido
                        </label>

                        <input
                            type="text"
                            value={apellido}
                            onChange={(e) => {

                                setApellido(
                                    e.target.value
                                );

                                setMensaje("");
                                setError("");

                            }}
                            disabled={guardando}
                            placeholder="Apellido"
                        />

                    </div>


                    {/* =================================================
                        CORREO
                    ================================================= */}

                    <div className="campo-perfil">

                        <label>
                            Correo electrónico
                        </label>

                        <input
                            type="email"
                            value={correo}
                            onChange={(e) => {

                                setCorreo(
                                    e.target.value
                                );

                                setMensaje("");
                                setError("");

                            }}
                            disabled={guardando}
                            placeholder="correo@ejemplo.com"
                        />

                    </div>


                    {/* =================================================
                        DOCUMENTO
                    ================================================= */}

                    <div className="campo-perfil">

                        <label>
                            Documento
                        </label>

                        <input
                            type="text"
                            value={
                                perfil?.documento || ""
                            }
                            disabled
                        />

                        <small>
                            El documento no puede modificarse.
                        </small>

                    </div>


                    {/* =================================================
                        ROL
                    ================================================= */}

                    <div className="campo-perfil">

                        <label>
                            Rol
                        </label>

                        <input
                            type="text"
                            value={
                                perfil?.rol || ""
                            }
                            disabled
                        />

                    </div>


                    {/* =================================================
                        ESTADO
                    ================================================= */}

                    <div className="campo-perfil">

                        <label>
                            Estado
                        </label>

                        <input
                            type="text"
                            value={
                                perfil?.estado || ""
                            }
                            disabled
                        />

                    </div>


                    {/* =================================================
                        ACCIONES
                    ================================================= */}

                    <div className="acciones-perfil">

                        <button
                            className="boton-guardar-perfil"
                            onClick={guardarCambios}
                            disabled={guardando}
                        >
                            {guardando
                                ? "Guardando..."
                                : "Guardar cambios"}
                        </button>

                    </div>

                </div>

            </div>

        </section>
    );
}

export default PerfilUsuario;