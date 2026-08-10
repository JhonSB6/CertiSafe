import { useState } from "react";
import VistaOperario from "./VistaOperario";

function Inicio() {

    const [mostrarLogin, setMostrarLogin] = useState(false);
    const [mostrarCambioContrasena, setMostrarCambioContrasena] = useState(false);
    const [documentoCambio, setDocumentoCambio] = useState("");
    const [validandoDocumento, setValidandoDocumento] = useState(false);
    const [mensajeCambio, setMensajeCambio] = useState("");
    const [usuarioValidado, setUsuarioValidado] = useState(null);
    const [nuevaContrasena, setNuevaContrasena] = useState("");
    const [confirmarContrasena, setConfirmarContrasena] = useState("");
    const [documentoLogin, setDocumentoLogin] = useState("");
    const [contrasenaLogin, setContrasenaLogin] = useState("");
    const [mensajeLogin, setMensajeLogin] = useState("");
    const [ingresando, setIngresando] = useState(false);
    const [usuario, setUsuario] = useState(null);

    const iniciarSesion = async () => {

        if (
            documentoLogin.trim() === "" ||
            contrasenaLogin === ""
        ) {
            setMensajeLogin("Ingresa documento y contraseña.");
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
                        documento: documentoLogin.trim(),
                        contrasena: contrasenaLogin
                    })
                }
            );

            if (respuesta.ok) {

                const datos = await respuesta.json();

                console.log("Usuario autenticado:", datos);

                setUsuario(datos);

                setMostrarLogin(false);
                console.log("Rol:", datos.rol);

            } else if (respuesta.status === 401) {

                const mensaje = await respuesta.text();

                setMensajeLogin(mensaje);

            } else {

                setMensajeLogin(
                    "Ocurrió un error al iniciar sesión."
                );
            }

        } catch (error) {

            console.error("Error de conexión:", error);

            setMensajeLogin(
                "No fue posible conectar con el servidor."
            );

        } finally {

            setIngresando(false);
        }
    };

    const validarDocumento = async () => {

        if (documentoCambio.trim() === "") {
            return;
        }

        setValidandoDocumento(true);
        setMensajeCambio("");

        try {

            const respuesta = await fetch(
                `http://localhost:8080/usuarios/validar-documento?documento=${encodeURIComponent(documentoCambio.trim())}`,
                {
                    method: "POST"
                }
            );

            const datos = await respuesta.json();

            if (datos.valido) {

                setUsuarioValidado(datos.idUsuario);

                setMensajeCambio(
                    "Documento validado correctamente."
                );

            } else {

                setUsuarioValidado(null);

                setMensajeCambio(datos.mensaje);
            }

        } catch (error) {

            console.error("Error al validar documento:", error);

            setUsuarioValidado(null);

            setMensajeCambio(
                "No fue posible conectar con el servidor."
            );

        } finally {

            setValidandoDocumento(false);
        }
    };
    const cambiarContrasena = async () => {

        if (!usuarioValidado) {
            return;
        }

        if (nuevaContrasena === "") {
            setMensajeCambio("Ingresa una nueva contraseña.");
            return;
        }

        if (nuevaContrasena !== confirmarContrasena) {
            setMensajeCambio("Las contraseñas no coinciden.");
            return;
        }

        try {

            const respuesta = await fetch(
                "http://localhost:8080/usuarios/" +
                usuarioValidado +
                "/cambiar-password?nuevaContrasena=" +
                encodeURIComponent(nuevaContrasena),
                {
                    method: "PUT"
                }
            );

            if (respuesta.ok) {

                setMensajeCambio(
                    "Contraseña cambiada correctamente."
                );

                setNuevaContrasena("");
                setConfirmarContrasena("");

            } else {

                setMensajeCambio(
                    "No fue posible cambiar la contraseña."
                );
            }

        } catch (error) {

            console.error("Error al cambiar contraseña:", error);

            setMensajeCambio(
                "No fue posible conectar con el servidor."
            );
        }
    };

    return (
        <div className="pagina-inicio">

            {/* =========================
                ENCABEZADO
            ========================== */}

            <header className="encabezado">

                <div className="logo">
                    CERTISAFE
                </div>

                <nav className="menu">

                    <button
                        onClick={() => setMostrarLogin(true)}
                    >
                        Ingresar
                    </button>

                    <button>
                        Registrarse
                    </button>

                </nav>

            </header>


            {/* =========================
                CONTENIDO PRINCIPAL
            ========================== */}

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


                {/* =========================
                    QUIÉNES SOMOS
                ========================== */}

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


            {/* =========================
                PIE DE PÁGINA
            ========================== */}

            <footer className="pie">

                <p>
                    © 2026 CertiSafe
                </p>

            </footer>


            {/* =========================
                MODAL DE INGRESO
            ========================== */}

            {mostrarLogin && (

                <div className="modal-overlay">

                    <div className="modal-login">

                        <button
                            className="modal-cerrar"
                            onClick={() => setMostrarLogin(false)}
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
                                value={documentoLogin}
                                onChange={(e) => {
                                    setDocumentoLogin(e.target.value);
                                    setMensajeLogin("");
                                }
                            }
                            />

                        </div>


                        <div className="campo">

                            <label>
                                Contraseña
                            </label>

                            <input
                                type="password"
                                placeholder="Contraseña"
                                value={contrasenaLogin}
                                onChange={(e) => {
                                    setContrasenaLogin(e.target.value);
                                    setMensajeLogin("");
                                }
                            }
                            />

                        </div>


                        <button
                            className="boton-ingresar"
                            disabled={
                                documentoLogin.trim() === "" ||
                                contrasenaLogin === "" ||
                                ingresando
                            }
                            onClick={iniciarSesion}
                        >
                            {ingresando ? "Ingresando..." : "Ingresar"}
                        </button>
                        {mensajeLogin && (
                            <p className="mensaje-login">
                                {mensajeLogin}
                            </p>
                        )
                    }


                        <button
                            className="boton-cambiar"
                            onClick={() => {
                                setMostrarLogin(false);
                                setMostrarCambioContrasena(true);
                                setMensajeCambio("");
                                setDocumentoCambio("");
                                setUsuarioValidado(null);
                            }}
                        >
                            Cambiar contraseña
                        </button>

                    </div>

                </div>

            )}


            {/* =========================
                MODAL CAMBIO CONTRASEÑA
            ========================== */}

            {mostrarCambioContrasena && (

                <div className="modal-overlay">

                    <div className="modal-login">

                        <button
                            className="modal-cerrar"
                            onClick={() => {
                                setMostrarCambioContrasena(false);
                                setMensajeCambio("");
                                setDocumentoCambio("");
                                setUsuarioValidado(null);
                            }}
                        >
                            ×
                        </button>


                        <h2>
                            Cambiar contraseña
                        </h2>

                        <p>
                            Ingresa tu número de documento
                            para continuar.
                        </p>


                        <div className="campo">

                            <label>
                                Documento
                            </label>

                            <input
                                type="text"
                                placeholder="Número de documento"
                                value={documentoCambio}
                                onChange={(e) => {
                                    setDocumentoCambio(e.target.value);
                                    setMensajeCambio("");
                                    setUsuarioValidado(null);
                                }}
                            />

                        </div>


                        {!usuarioValidado ? (

                            <button
                                className="boton-ingresar"
                                disabled={
                                    documentoCambio.trim() === "" ||
                                    validandoDocumento
                                }
                                onClick={validarDocumento}
                            >
                                {validandoDocumento
                                    ? "Validando..."
                                    : "Solicitar nueva contraseña"}
                            </button>

                        ) : (

                            <>
                                <div className="campo">

                                    <label>
                                        Nueva contraseña
                                    </label>

                                    <input
                                        type="password"
                                        placeholder="Nueva contraseña"
                                        value={nuevaContrasena}
                                        onChange={(e) => {
                                            setNuevaContrasena(e.target.value);
                                            setMensajeCambio("");
                                        }}
                                    />

                                </div>


                                <div className="campo">

                                    <label>
                                        Confirmar contraseña
                                    </label>

                                    <input
                                        type="password"
                                        placeholder="Confirmar contraseña"
                                        value={confirmarContrasena}
                                        onChange={(e) => {
                                            setConfirmarContrasena(e.target.value);
                                            setMensajeCambio("");
                                        }}
                                    />

                                </div>


                                <button
                                    className="boton-ingresar"
                                    disabled={
                                        nuevaContrasena === "" ||
                                        confirmarContrasena === ""
                                    }
                                    onClick={cambiarContrasena}
                                >
                                    Cambiar contraseña
                                </button>
                            </>

                        )}


                        {mensajeCambio && (

                            <p>
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
