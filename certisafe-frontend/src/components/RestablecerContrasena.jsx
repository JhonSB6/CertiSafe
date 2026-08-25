import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./RestablecerContrasena.css";

function RestablecerContrasena() {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");

    const [nuevaContrasena, setNuevaContrasena] = useState("");
    const [confirmarContrasena, setConfirmarContrasena] = useState("");

    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);


    // =========================================================
    // RESTABLECER CONTRASEÑA
    // =========================================================

    const manejarRestablecimiento = async (e) => {

        e.preventDefault();

        setMensaje("");
        setError("");


        // =====================================================
        // VALIDAR TOKEN
        // =====================================================

        if (!token) {

            setError(
                "El enlace de recuperación no es válido."
            );

            return;
        }


        // =====================================================
        // VALIDAR CAMPOS
        // =====================================================

        if (
            !nuevaContrasena ||
            !confirmarContrasena
        ) {

            setError(
                "Debes completar todos los campos."
            );

            return;
        }


        // =====================================================
        // VALIDAR CONTRASEÑAS
        // =====================================================

        if (
            nuevaContrasena !==
            confirmarContrasena
        ) {

            setError(
                "Las contraseñas no coinciden."
            );

            return;
        }


        setCargando(true);


        try {

            const response = await fetch(
                "http://localhost:8080/api/auth/reset-password",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        token: token,
                        nuevaContrasena:
                            nuevaContrasena
                    })
                }
            );


            const data =
                await response
                    .json()
                    .catch(() => null);


            if (!response.ok) {

                throw new Error(
                    data?.message ||
                    "No fue posible restablecer la contraseña."
                );
            }


            // =================================================
            // ÉXITO
            // =================================================

            setMensaje(
                "Contraseña restablecida correctamente."
            );

            setNuevaContrasena("");
            setConfirmarContrasena("");


            setTimeout(() => {

                navigate("/");

            }, 2500);


        } catch (error) {

            setError(
                error.message ||
                "Ocurrió un error al restablecer la contraseña."
            );

        } finally {

            setCargando(false);
        }
    };


    return (

        <div className="pagina-restablecer">


            {/* =================================================
                ENCABEZADO
            ================================================= */}

            <header className="encabezado-restablecer">

                <div className="logo-restablecer">
                    CERTISAFE
                </div>

            </header>


            {/* =================================================
                CONTENIDO
            ================================================= */}

            <main className="contenedor-restablecer">

                <section className="tarjeta-restablecer">


                    {/* =================================================
                        ICONO
                    ================================================= */}

                    <div className="icono-restablecer">

                        🔐

                    </div>


                    <h1>
                        Restablecer contraseña
                    </h1>


                    <p className="descripcion-restablecer">

                        Ingresa una nueva contraseña para
                        recuperar el acceso a tu cuenta de
                        CertiSafe.

                    </p>


                    {/* =================================================
                        FORMULARIO
                    ================================================= */}

                    <form
                        className="formulario-restablecer"
                        onSubmit={
                            manejarRestablecimiento
                        }
                    >


                        {/* =================================================
                            NUEVA CONTRASEÑA
                        ================================================= */}

                        <div className="campo-restablecer">

                            <label>
                                Nueva contraseña
                            </label>

                            <input
                                type="password"
                                value={
                                    nuevaContrasena
                                }
                                onChange={(e) =>
                                    setNuevaContrasena(
                                        e.target.value
                                    )
                                }
                                placeholder="Ingresa tu nueva contraseña"
                                disabled={
                                    cargando
                                }
                            />

                        </div>


                        {/* =================================================
                            CONFIRMAR CONTRASEÑA
                        ================================================= */}

                        <div className="campo-restablecer">

                            <label>
                                Confirmar contraseña
                            </label>

                            <input
                                type="password"
                                value={
                                    confirmarContrasena
                                }
                                onChange={(e) =>
                                    setConfirmarContrasena(
                                        e.target.value
                                    )
                                }
                                placeholder="Confirma tu nueva contraseña"
                                disabled={
                                    cargando
                                }
                            />

                        </div>


                        {/* =================================================
                            ERROR
                        ================================================= */}

                        {error && (

                            <div className="mensaje-restablecer mensaje-error">

                                <span>
                                    ⚠
                                </span>

                                <p>
                                    {error}
                                </p>

                            </div>

                        )}


                        {/* =================================================
                            ÉXITO
                        ================================================= */}

                        {mensaje && (

                            <div className="mensaje-restablecer mensaje-exito">

                                <span>
                                    ✓
                                </span>

                                <p>
                                    {mensaje}
                                </p>

                            </div>

                        )}


                        {/* =================================================
                            BOTÓN
                        ================================================= */}

                        <button
                            type="submit"
                            className="boton-restablecer"
                            disabled={
                                cargando
                            }
                        >

                            {cargando
                                ? "Restableciendo..."
                                : "Restablecer contraseña"}

                        </button>


                    </form>


                    {/* =================================================
                        INFORMACIÓN
                    ================================================= */}

                    <p className="seguridad-restablecer">

                        Por seguridad, el enlace de recuperación
                        tiene una duración limitada.

                    </p>

                </section>

            </main>


            {/* =================================================
                PIE
            ================================================= */}

            <footer className="pie-restablecer">

                <p>
                    © 2026 CertiSafe
                </p>

            </footer>

        </div>
    );
}

export default RestablecerContrasena;
