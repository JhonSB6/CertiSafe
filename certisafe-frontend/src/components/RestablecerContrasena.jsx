import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function RestablecerContrasena() {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");

    const [nuevaContrasena, setNuevaContrasena] = useState("");
    const [confirmarContrasena, setConfirmarContrasena] = useState("");

    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    const manejarRestablecimiento = async (e) => {
        e.preventDefault();

        setMensaje("");
        setError("");

        if (!token) {
            setError("El enlace de recuperación no es válido.");
            return;
        }

        if (!nuevaContrasena || !confirmarContrasena) {
            setError("Debes completar todos los campos.");
            return;
        }

        if (nuevaContrasena !== confirmarContrasena) {
            setError("Las contraseñas no coinciden.");
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
                        nuevaContrasena: nuevaContrasena
                    })
                }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.message || "No fue posible restablecer la contraseña."
                );
            }

            setMensaje("Contraseña restablecida correctamente.");

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
        <div className="restablecer-contrasena">

            <div className="restablecer-card">

                <h1>Restablecer contraseña</h1>

                <p>
                    Ingresa una nueva contraseña para tu cuenta de CertiSafe.
                </p>

                <form onSubmit={manejarRestablecimiento}>

                    <div>
                        <label>Nueva contraseña</label>

                        <input
                            type="password"
                            value={nuevaContrasena}
                            onChange={(e) =>
                                setNuevaContrasena(e.target.value)
                            }
                            placeholder="Ingresa tu nueva contraseña"
                            disabled={cargando}
                        />
                    </div>

                    <div>
                        <label>Confirmar contraseña</label>

                        <input
                            type="password"
                            value={confirmarContrasena}
                            onChange={(e) =>
                                setConfirmarContrasena(e.target.value)
                            }
                            placeholder="Confirma tu nueva contraseña"
                            disabled={cargando}
                        />
                    </div>

                    {error && (
                        <p className="mensaje-error">
                            {error}
                        </p>
                    )}

                    {mensaje && (
                        <p className="mensaje-exito">
                            {mensaje}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={cargando}
                    >
                        {cargando
                            ? "Restableciendo..."
                            : "Restablecer contraseña"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default RestablecerContrasena;