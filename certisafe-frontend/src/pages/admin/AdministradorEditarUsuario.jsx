import { useEffect, useState } from "react";
import "./AdministradorEditarUsuario.css";

function AdministradorEditarUsuario({
                                        usuario,
                                        volver,
                                        guardarCambios
                                    }) {

    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [correo, setCorreo] = useState("");
    const [idRol, setIdRol] = useState("");

    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");


    // =========================================================
    // CARGAR DATOS DEL USUARIO
    // =========================================================

    useEffect(() => {

        if (!usuario) {
            return;
        }

        setNombre(usuario.nombre || "");
        setApellido(usuario.apellido || "");
        setCorreo(usuario.correo || "");

        // El UsuarioResponse devuelve el nombre del rol.
        // Convertimos ese nombre al ID utilizado por el backend.
        const roles = {
            OPERARIO: 2,
            CAPACITADOR: 3
        };

        setIdRol(
            roles[usuario.rol] || ""
        );

    }, [usuario]);


    // =========================================================
    // GUARDAR
    // =========================================================

    const handleGuardar = async (e) => {

        e.preventDefault();

        setError("");


        // =====================================================
        // VALIDACIONES FRONTEND
        // =====================================================

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


        if (!idRol) {

            setError(
                "Debe seleccionar un rol."
            );

            return;
        }


        setGuardando(true);


        try {

            const respuesta = await fetch(
                `http://localhost:8080/usuarios/${usuario.idUsuario}/admin`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        nombre: nombre.trim(),
                        apellido: apellido.trim(),
                        correo: correo.trim(),
                        idRol: Number(idRol)
                    })
                }
            );


            if (!respuesta.ok) {

                const mensaje =
                    await respuesta.text();

                throw new Error(
                    mensaje ||
                    "No fue posible actualizar el usuario."
                );
            }


            const usuarioActualizado =
                await respuesta.json();


            // =================================================
            // DEVOLVER USUARIO ACTUALIZADO
            // =================================================

            guardarCambios(
                usuarioActualizado
            );


        } catch (error) {

            console.error(
                "ERROR ACTUALIZANDO USUARIO:",
                error
            );

            setError(
                error.message ||
                "No fue posible actualizar el usuario."
            );

        } finally {

            setGuardando(false);

        }
    };


    // =========================================================
    // CERRAR MODAL
    // =========================================================

    const cerrarModal = () => {

        if (guardando) {
            return;
        }

        volver();
    };


    if (!usuario) {
        return null;
    }


    return (

        <div
            className="modal-editar-usuario-overlay"
            onMouseDown={(e) => {

                if (
                    e.target === e.currentTarget &&
                    !guardando
                ) {
                    cerrarModal();
                }

            }}
        >

            <div
                className="modal-editar-usuario"
                onMouseDown={(e) =>
                    e.stopPropagation()
                }
            >

                {/* =================================================
                    ENCABEZADO
                ================================================= */}

                <div className="modal-editar-usuario-header">

                    <div>

                        <span className="modal-editar-usuario-icono">
                            👤
                        </span>

                        <div>

                            <h2>
                                Editar usuario
                            </h2>

                            <p>
                                Actualiza la información del usuario.
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        className="modal-editar-usuario-cerrar"
                        onClick={cerrarModal}
                        disabled={guardando}
                        aria-label="Cerrar"
                    >
                        ×
                    </button>

                </div>


                {/* =================================================
                    INFORMACIÓN
                ================================================= */}

                <div className="modal-editar-usuario-contenido">

                    <div className="modal-editar-usuario-documento">

                        <label>
                            Número de documento
                        </label>

                        <div className="campo-documento-bloqueado">

                            <span>
                                🔒
                            </span>

                            <strong>
                                {usuario.documento}
                            </strong>

                        </div>

                        <small>
                            El número de documento no puede modificarse.
                        </small>

                    </div>


                    {/* =================================================
                        NOMBRE
                    ================================================= */}

                    <div className="modal-campo">

                        <label htmlFor="editarNombre">
                            Nombre
                        </label>

                        <input
                            id="editarNombre"
                            type="text"
                            value={nombre}
                            onChange={(e) =>
                                setNombre(e.target.value)
                            }
                            disabled={guardando}
                            maxLength={100}
                        />

                    </div>


                    {/* =================================================
                        APELLIDO
                    ================================================= */}

                    <div className="modal-campo">

                        <label htmlFor="editarApellido">
                            Apellido
                        </label>

                        <input
                            id="editarApellido"
                            type="text"
                            value={apellido}
                            onChange={(e) =>
                                setApellido(e.target.value)
                            }
                            disabled={guardando}
                            maxLength={100}
                        />

                    </div>


                    {/* =================================================
                        CORREO
                    ================================================= */}

                    <div className="modal-campo">

                        <label htmlFor="editarCorreo">
                            Correo electrónico
                        </label>

                        <input
                            id="editarCorreo"
                            type="email"
                            value={correo}
                            onChange={(e) =>
                                setCorreo(e.target.value)
                            }
                            disabled={guardando}
                            maxLength={150}
                        />

                    </div>


                    {/* =================================================
                        ROL
                    ================================================= */}

                    <div className="modal-campo">

                        <label htmlFor="editarRol">
                            Rol
                        </label>

                        <select
                            id="editarRol"
                            value={idRol}
                            onChange={(e) =>
                                setIdRol(e.target.value)
                            }
                            disabled={guardando}
                        >

                            <option value="">
                                Seleccionar rol
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
                        ESTADO
                    ================================================= */}

                    <div className="modal-estado-info">

                        <span>
                            Estado actual
                        </span>

                        <strong
                            className={
                                usuario.estado === "ACTIVO"
                                    ? "modal-estado-activo"
                                    : "modal-estado-inactivo"
                            }
                        >
                            {usuario.estado}
                        </strong>

                        <small>
                            El estado se administra desde el botón
                            de activar/desactivar de la tarjeta.
                        </small>

                    </div>


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (

                        <div className="modal-editar-usuario-error">

                            <span>
                                ⚠
                            </span>

                            <p>
                                {error}
                            </p>

                        </div>

                    )}

                </div>


                {/* =================================================
                    ACCIONES
                ================================================= */}

                <div className="modal-editar-usuario-footer">

                    <button
                        type="button"
                        className="modal-boton-cancelar"
                        onClick={cerrarModal}
                        disabled={guardando}
                    >
                        Cancelar
                    </button>


                    <button
                        type="button"
                        className="modal-boton-guardar"
                        onClick={handleGuardar}
                        disabled={guardando}
                    >

                        {guardando

                            ? "Guardando..."

                            : "✓ Guardar cambios"

                        }

                    </button>

                </div>

            </div>

        </div>
    );
}

export default AdministradorEditarUsuario;