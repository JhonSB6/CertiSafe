import { useState } from "react";

function Inicio() {

    const [mostrarLogin, setMostrarLogin] = useState(false);
    const [mostrarCambioContrasena, setMostrarCambioContrasena] = useState(false);
    const [documentoCambio, setDocumentoCambio] = useState("");

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

                {/* BANNER */}

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

                        {/* BOTÓN CERRAR */}

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


                        {/* DOCUMENTO */}

                        <div className="campo">

                            <label>
                                Documento
                            </label>

                            <input
                                type="text"
                                placeholder="Número de documento"
                            />

                        </div>


                        {/* CONTRASEÑA */}

                        <div className="campo">

                            <label>
                                Contraseña
                            </label>

                            <input
                                type="password"
                                placeholder="Contraseña"
                            />

                        </div>


                        {/* INGRESAR */}

                        <button className="boton-ingresar">
                            Ingresar
                        </button>


                        {/* CAMBIAR CONTRASEÑA */}

                        <button
                            className="boton-cambiar"
                            onClick={() => {
                                setMostrarLogin(false);
                                setMostrarCambioContrasena(true);
                            }}
                        >
                            Cambiar contraseña
                        </button>

                    </div>

                </div>

            )}
        {mostrarCambioContrasena && (

            <div className="modal-overlay">

                <div className="modal-login">

                    <button
                        className="modal-cerrar"
                        onClick={() => setMostrarCambioContrasena(false)}
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
                            onChange={(e) => setDocumentoCambio(e.target.value)}
                        />

                    </div>

                    <button
                        className="boton-ingresar"
                        disabled={documentoCambio.trim() === ""}
                    >
                        Solicitar nueva contraseña
                    </button>

                </div>

            </div>

        )}

        </div>
    );
}

export default Inicio;