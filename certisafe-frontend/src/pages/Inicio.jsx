import VistaOperario from "./VistaOperario";
import VistaAdministrador from "./VistaAdministrador";
import CapacitadorCertificaciones from "./CapacitadorCertificaciones";
import RegistroUsuario from "./RegistroUsuario";
import { useEffect, useState } from "react";

function Inicio() {

    const [mostrarLogin, setMostrarLogin] = useState(false);

    const [mostrarRegistro, setMostrarRegistro] = useState(false);

    const [mostrarCambioContrasena, setMostrarCambioContrasena] = useState(false);

    const [documentoCambio, setDocumentoCambio] = useState("");

    const [mensajeCambio, setMensajeCambio] = useState("");

    const [solicitandoRecuperacion, setSolicitandoRecuperacion] = useState(false);

    const [documentoLogin, setDocumentoLogin] = useState("");

    const [contrasenaLogin, setContrasenaLogin] = useState("");

    const [mensajeLogin, setMensajeLogin] = useState("");

    const [ingresando, setIngresando] = useState(false);

    const [usuario, setUsuario] = useState(null);


    // =========================================================
    // RECUPERAR SESIÓN
    // =========================================================

    useEffect(() => {

        const usuarioGuardado =
            localStorage.getItem("certisafe_usuario");

        if (!usuarioGuardado) {
            return;
        }

        try {

            const datosUsuario =
                JSON.parse(usuarioGuardado);

            if (
                !datosUsuario ||
                !datosUsuario.idUsuario ||
                !datosUsuario.rol
            ) {

                localStorage.removeItem(
                    "certisafe_usuario"
                );

                return;
            }

            setUsuario(datosUsuario);

        } catch (error) {

            console.error(
                "Error recuperando la sesión:",
                error
            );

            localStorage.removeItem(
                "certisafe_usuario"
            );

            setUsuario(null);
        }

    }, []);


    // =========================================================
    // CERRAR SESIÓN
    // =========================================================

    const cerrarSesion = () => {

        setUsuario(null);

        localStorage.removeItem(
            "certisafe_usuario"
        );

        setDocumentoLogin("");
        setContrasenaLogin("");
        setMensajeLogin("");

        setDocumentoCambio("");
        setMensajeCambio("");
        setSolicitandoRecuperacion(false);

        setMostrarLogin(false);
        setMostrarRegistro(false);
        setMostrarCambioContrasena(false);

        window.history.replaceState(
            null,
            "",
            window.location.href
        );
    };


    // =========================================================
    // ACTUALIZAR USUARIO
    // =========================================================

    const actualizarUsuario = (
        usuarioActualizado
    ) => {

        setUsuario(
            usuarioActualizado
        );

        localStorage.setItem(
            "certisafe_usuario",
            JSON.stringify(
                usuarioActualizado
            )
        );
    };


    // =========================================================
    // INICIAR SESIÓN
    // =========================================================

    const iniciarSesion = async () => {

        if (
            documentoLogin.trim() === "" ||
            contrasenaLogin === ""
        ) {

            setMensajeLogin(
                "Ingresa documento y contraseña."
            );

            return;
        }

        setIngresando(true);

        setMensajeLogin("");

        try {

            const respuesta = await fetch(
                "http://localhost:8080/usuarios/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        documento:
                            documentoLogin.trim(),

                        contrasena:
                            contrasenaLogin
                    })
                }
            );


            // =================================================
            // LOGIN CORRECTO
            // =================================================

            if (respuesta.ok) {

                const datos =
                    await respuesta.json();

                console.log(
                    "Usuario autenticado:",
                    datos
                );

                setUsuario(datos);

                localStorage.setItem(
                    "certisafe_usuario",
                    JSON.stringify(datos)
                );

                setMostrarLogin(false);

                setMostrarRegistro(false);

                console.log(
                    "Rol:",
                    datos.rol
                );

            }

            // =================================================
            // ERROR LOGIN
            // =================================================

            else {

                const mensaje =
                    await respuesta.text();

                setMensajeLogin(
                    mensaje ||
                    "Documento o contraseña incorrectos"
                );
            }

        } catch (error) {

            console.error(
                "Error de conexión:",
                error
            );

            setMensajeLogin(
                "No fue posible conectar con el servidor."
            );

        } finally {

            setIngresando(false);
        }
    };


    // =========================================================
    // SOLICITAR RECUPERACIÓN DE CONTRASEÑA
    // =========================================================

    const solicitarNuevaContrasena = async () => {

        if (
            documentoCambio.trim() === ""
        ) {

            setMensajeCambio(
                "Ingresa tu número de documento."
            );

            return;
        }

        setSolicitandoRecuperacion(true);

        setMensajeCambio("");

        try {

            const respuesta = await fetch(
                "http://localhost:8080/api/auth/forgot-password",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        documento:
                            documentoCambio.trim()
                    })
                }
            );


            // =================================================
            // SOLICITUD CORRECTA
            // =================================================

            if (respuesta.ok) {

                const mensaje =
                    await respuesta.text();

                setMensajeCambio(
                    mensaje ||
                    "Si el documento está registrado, recibirás un correo con las instrucciones para restablecer tu contraseña."
                );

                setDocumentoCambio("");

            }

            // =================================================
            // ERROR DEL SERVIDOR
            // =================================================

            else {

                const mensaje =
                    await respuesta.text();

                setMensajeCambio(
                    mensaje ||
                    "No fue posible procesar la solicitud."
                );
            }

        } catch (error) {

            console.error(
                "Error solicitando recuperación:",
                error
            );

            setMensajeCambio(
                "No fue posible conectar con el servidor."
            );

        } finally {

            setSolicitandoRecuperacion(false);
        }
    };


    // =========================================================
    // VISTA OPERARIO
    // =========================================================

    if (
        usuario &&
        usuario.rol === "OPERARIO"
    ) {

        return (
            <VistaOperario
                usuario={usuario}
                cerrarSesion={cerrarSesion}
                actualizarUsuario={
                    actualizarUsuario
                }
            />
        );
    }


    // =========================================================
    // VISTA ADMINISTRADOR
    // =========================================================

    if (
        usuario &&
        usuario.rol === "ADMIN"
    ) {

        return (
            <VistaAdministrador
                usuario={usuario}
                cerrarSesion={cerrarSesion}
                actualizarUsuario={
                    actualizarUsuario
                }
            />
        );
    }


    // =========================================================
    // VISTA CAPACITADOR
    // =========================================================

    if (
        usuario &&
        usuario.rol === "CAPACITADOR"
    ) {

        return (
            <CapacitadorCertificaciones
                usuario={usuario}
                cerrarSesion={cerrarSesion}
                actualizarUsuario={
                    actualizarUsuario
                }
            />
        );
    }


    // =========================================================
    // PÁGINA PRINCIPAL
    // =========================================================

    return (

        <div className="pagina-inicio">


            {/* =================================================
                ENCABEZADO
            ================================================= */}

            <header className="encabezado">

                <div className="logo">
                    CERTISAFE
                </div>


                <nav className="menu">

                    {/* =================================================
                        INGRESAR
                    ================================================= */}

                    <button
                        onClick={() => {

                            setMostrarLogin(true);

                            setMostrarRegistro(
                                false
                            );

                            setMostrarCambioContrasena(
                                false
                            );

                            setDocumentoLogin("");

                            setContrasenaLogin("");

                            setMensajeLogin("");

                        }}
                    >
                        Ingresar
                    </button>


                    {/* =================================================
                        REGISTRARSE
                    ================================================= */}

                    <button
                        onClick={() => {

                            setMostrarRegistro(true);

                            setMostrarLogin(
                                false
                            );

                            setMostrarCambioContrasena(
                                false
                            );

                        }}
                    >
                        Registrarse
                    </button>

                </nav>

            </header>


            {/* =================================================
                CONTENIDO PRINCIPAL
            ================================================= */}

            <main>

                <section className="banner">

                    <div className="banner-contenido">

                        <h1>
                            Certificaciones de seguridad
                        </h1>

                        <p>
                            Gestión de capacitación y
                            certificaciones para la seguridad
                            de los operarios.
                        </p>

                    </div>

                </section>


                {/* =================================================
                    QUIÉNES SOMOS
                ================================================= */}

                <section className="informacion">

                    <h2>
                        ¿Quiénes somos?
                    </h2>


                    <p className="texto-quienes-somos">

                        CertiSafe es una plataforma orientada a la
                        gestión de la seguridad y capacitación de
                        los operarios. Nuestro objetivo es facilitar
                        el seguimiento de los talleres y
                        certificaciones, permitiendo mantener
                        actualizada la información necesaria para
                        el desarrollo seguro de las actividades
                        laborales.

                    </p>


                    <div className="tarjetas">

                        <article className="tarjeta">

                            <h3>
                                Capacitación
                            </h3>

                            <p>
                                Facilitamos la gestión de talleres
                                y procesos de capacitación
                                relacionados con la seguridad
                                laboral.
                            </p>

                        </article>


                        <article className="tarjeta">

                            <h3>
                                Certificación
                            </h3>

                            <p>
                                Mantenemos un seguimiento del
                                estado de las certificaciones
                                de cada operario.
                            </p>

                        </article>


                        <article className="tarjeta">

                            <h3>
                                Seguimiento
                            </h3>

                            <p>
                                Permitimos consultar la
                                información relacionada con
                                talleres, participantes y
                                certificaciones.
                            </p>

                        </article>

                    </div>

                </section>

            </main>


            {/* =================================================
                PIE
            ================================================= */}

            <footer className="pie">

                <p>
                    © 2026 CertiSafe
                </p>

            </footer>


            {/* =================================================
                MODAL LOGIN
            ================================================= */}

            {mostrarLogin && (

                <div className="modal-overlay">

                    <div className="modal-login">

                        <button
                            className="modal-cerrar"
                            onClick={() => {

                                setMostrarLogin(
                                    false
                                );

                                setMensajeLogin(
                                    ""
                                );

                            }}
                        >
                            ×
                        </button>


                        <h2>
                            Iniciar sesión
                        </h2>


                        <p>
                            Ingresa tus datos para acceder
                            a CertiSafe.
                        </p>


                        <div className="campo">

                            <label>
                                Documento
                            </label>

                            <input
                                type="text"
                                placeholder="Número de documento"
                                value={
                                    documentoLogin
                                }
                                onChange={(e) => {

                                    setDocumentoLogin(
                                        e.target.value
                                    );

                                    setMensajeLogin(
                                        ""
                                    );

                                }}
                            />

                        </div>


                        <div className="campo">

                            <label>
                                Contraseña
                            </label>

                            <input
                                type="password"
                                placeholder="Contraseña"
                                value={
                                    contrasenaLogin
                                }
                                onChange={(e) => {

                                    setContrasenaLogin(
                                        e.target.value
                                    );

                                    setMensajeLogin(
                                        ""
                                    );

                                }}
                            />

                        </div>


                        <button
                            className="boton-ingresar"
                            disabled={
                                documentoLogin.trim() === "" ||
                                contrasenaLogin === "" ||
                                ingresando
                            }
                            onClick={
                                iniciarSesion
                            }
                        >

                            {ingresando
                                ? "Ingresando..."
                                : "Ingresar"}

                        </button>


                        {mensajeLogin && (

                            <p className="mensaje-login">
                                {mensajeLogin}
                            </p>

                        )}


                        {/* =================================================
                            CAMBIAR CONTRASEÑA
                        ================================================= */}

                        <button
                            className="boton-cambiar"
                            onClick={() => {

                                setMostrarLogin(
                                    false
                                );

                                setMostrarCambioContrasena(
                                    true
                                );

                                setDocumentoCambio(
                                    ""
                                );

                                setMensajeCambio(
                                    ""
                                );

                            }}
                        >
                            Cambiar contraseña
                        </button>

                    </div>

                </div>

            )}


            {/* =================================================
                MODAL REGISTRO
            ================================================= */}

            {mostrarRegistro && (

                <div
                    className="modal-overlay"
                    onClick={(e) => {

                        if (
                            e.target === e.currentTarget
                        ) {

                            setMostrarRegistro(
                                false
                            );

                        }

                    }}
                >

                    <div className="modal-login modal-registro">

                        <button
                            className="modal-cerrar"
                            onClick={() =>
                                setMostrarRegistro(
                                    false
                                )
                            }
                        >
                            ×
                        </button>


                        <RegistroUsuario
                            volverInicio={() =>
                                setMostrarRegistro(
                                    false
                                )
                            }
                        />

                    </div>

                </div>

            )}


            {/* =================================================
                MODAL RECUPERACIÓN DE CONTRASEÑA
            ================================================= */}

            {mostrarCambioContrasena && (

                <div
                    className="modal-overlay"
                    onClick={(e) => {

                        if (
                            e.target === e.currentTarget
                        ) {

                            setMostrarCambioContrasena(
                                false
                            );

                            setDocumentoCambio(
                                ""
                            );

                            setMensajeCambio(
                                ""
                            );

                            setSolicitandoRecuperacion(
                                false
                            );

                        }

                    }}
                >

                    <div className="modal-login">

                        <button
                            className="modal-cerrar"
                            onClick={() => {

                                setMostrarCambioContrasena(
                                    false
                                );

                                setDocumentoCambio(
                                    ""
                                );

                                setMensajeCambio(
                                    ""
                                );

                                setSolicitandoRecuperacion(
                                    false
                                );

                            }}
                        >
                            ×
                        </button>


                        <h2>
                            Recuperar contraseña
                        </h2>


                        <p>
                            Ingresa tu número de documento
                            para solicitar la recuperación
                            de tu contraseña.
                        </p>


                        <div className="campo">

                            <label>
                                Documento
                            </label>

                            <input
                                type="text"
                                placeholder="Número de documento"
                                value={
                                    documentoCambio
                                }
                                onChange={(e) => {

                                    setDocumentoCambio(
                                        e.target.value
                                    );

                                    setMensajeCambio(
                                        ""
                                    );

                                }}
                                disabled={
                                    solicitandoRecuperacion
                                }
                            />

                        </div>


                        <button
                            className="boton-ingresar"
                            disabled={
                                documentoCambio.trim() === "" ||
                                solicitandoRecuperacion
                            }
                            onClick={
                                solicitarNuevaContrasena
                            }
                        >

                            {solicitandoRecuperacion
                                ? "Enviando..."
                                : "Solicitar nueva contraseña"}

                        </button>


                        {mensajeCambio && (

                            <p className="mensaje-cambio">
                                {mensajeCambio}
                            </p>

                        )}

                    </div>

                </div>

            )}

        </div>
    );
}

export default Inicio;
