import { useEffect, useMemo, useState } from "react";
import AdministradorEditarUsuario from "./AdministradorEditarUsuario";

function AdministradorUsuarios() {

    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    const [busqueda, setBusqueda] = useState("");
    const [filtroRol, setFiltroRol] = useState("TODOS");
    const [filtroEstado, setFiltroEstado] = useState("TODOS");

    const [cambiandoEstado, setCambiandoEstado] = useState(null);
    const [mostrarEditar, setMostrarEditar] = useState(false);
    const [usuarioEditar, setUsuarioEditar] = useState(null);


    // =========================================================
    // CARGAR USUARIOS
    // =========================================================

    const cargarUsuarios = async () => {

        setCargando(true);
        setError("");

        try {

            const respuesta = await fetch(
                "http://localhost:8080/usuarios/admin"
            );

            if (!respuesta.ok) {

                const mensaje =
                    await respuesta.text();

                throw new Error(
                    mensaje ||
                    "No fue posible cargar los usuarios."
                );
            }

            const datos =
                await respuesta.json();

            setUsuarios(datos);

        } catch (error) {

            console.error(
                "ERROR CARGANDO USUARIOS:",
                error
            );

            setError(
                error.message ||
                "No fue posible cargar los usuarios."
            );

        } finally {

            setCargando(false);

        }
    };


    // =========================================================
    // CARGAR AL ENTRAR
    // =========================================================

    useEffect(() => {

        cargarUsuarios();

    }, []);


    // =========================================================
    // CAMBIAR ESTADO
    // =========================================================

    const cambiarEstado = async (usuario) => {

        const nuevoEstado =
            usuario.estado === "ACTIVO"
                ? "INACTIVO"
                : "ACTIVO";


        const accion =
            nuevoEstado === "ACTIVO"
                ? "activar"
                : "desactivar";


        const confirmar = window.confirm(
            `¿Deseas ${accion} a ${usuario.nombre} ${usuario.apellido}?`
        );


        if (!confirmar) {
            return;
        }


        setCambiandoEstado(
            usuario.idUsuario
        );


        try {

            const respuesta = await fetch(
                `http://localhost:8080/usuarios/${usuario.idUsuario}/estado`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        estado: nuevoEstado
                    })
                }
            );


            if (!respuesta.ok) {

                const mensaje =
                    await respuesta.text();

                throw new Error(
                    mensaje ||
                    "No fue posible actualizar el estado."
                );
            }


            const usuarioActualizado =
                await respuesta.json();


            setUsuarios(
                (usuariosActuales) =>
                    usuariosActuales.map((item) =>
                        item.idUsuario ===
                        usuarioActualizado.idUsuario
                            ? usuarioActualizado
                            : item
                    )
            );


        } catch (error) {

            console.error(
                "ERROR CAMBIANDO ESTADO:",
                error
            );

            alert(
                error.message ||
                "No fue posible cambiar el estado."
            );

        } finally {

            setCambiandoEstado(null);

        }
    };


    // =========================================================
// ABRIR EDICIÓN DE USUARIO
// =========================================================

    const abrirEditarUsuario = (usuario) => {

        // El ADMIN se administra desde Perfil.
        if (usuario.rol === "ADMIN") {

            return;
        }

        setUsuarioEditar(usuario);

        setMostrarEditar(true);
    };


// =========================================================
// CERRAR EDICIÓN
// =========================================================

    const cerrarEditarUsuario = () => {

        setMostrarEditar(false);

        setUsuarioEditar(null);
    };


// =========================================================
// ACTUALIZAR USUARIO EN LA LISTA
// =========================================================

    const actualizarUsuarioEnLista = (usuarioActualizado) => {

        setUsuarios(
            (usuariosActuales) =>
                usuariosActuales.map((usuario) =>
                    usuario.idUsuario ===
                    usuarioActualizado.idUsuario
                        ? usuarioActualizado
                        : usuario
                )
        );

        cerrarEditarUsuario();
    };

    // =========================================================
    // FILTRAR USUARIOS
    // =========================================================

    const usuariosFiltrados = useMemo(() => {

        const texto =
            busqueda
                .trim()
                .toLowerCase();


        return usuarios.filter((usuario) => {

            const coincideBusqueda =
                texto === "" ||
                `${usuario.nombre} ${usuario.apellido}`
                    .toLowerCase()
                    .includes(texto) ||
                usuario.documento
                    .toLowerCase()
                    .includes(texto) ||
                usuario.correo
                    .toLowerCase()
                    .includes(texto);


            const coincideRol =
                filtroRol === "TODOS" ||
                usuario.rol === filtroRol;


            const coincideEstado =
                filtroEstado === "TODOS" ||
                usuario.estado === filtroEstado;


            return (
                coincideBusqueda &&
                coincideRol &&
                coincideEstado
            );

        });

    }, [
        usuarios,
        busqueda,
        filtroRol,
        filtroEstado
    ]);


    return (

        <section className="seccion-administrador">

            {/* =================================================
                ENCABEZADO
            ================================================= */}

            <div className="usuarios-header">

                <div>

                    <h1>
                        Gestión de usuarios
                    </h1>

                    <p>
                        Consulta la información de los usuarios
                        y administra su estado en CertiSafe.
                    </p>

                </div>

                <div className="usuarios-total">

                    <strong>
                        {usuarios.length}
                    </strong>

                    <span>
                        usuarios
                    </span>

                </div>

            </div>


            {/* =================================================
                FILTROS
            ================================================= */}

            <div className="usuarios-filtros">

                <div className="campo-filtro">

                    <label>
                        Buscar
                    </label>

                    <input
                        type="text"
                        value={busqueda}
                        onChange={(e) =>
                            setBusqueda(
                                e.target.value
                            )
                        }
                        placeholder="Nombre, documento o correo"
                    />

                </div>


                <div className="campo-filtro">

                    <label>
                        Rol
                    </label>

                    <select
                        value={filtroRol}
                        onChange={(e) =>
                            setFiltroRol(
                                e.target.value
                            )
                        }
                    >

                        <option value="TODOS">
                            Todos los roles
                        </option>

                        <option value="ADMIN">
                            Administrador
                        </option>

                        <option value="OPERARIO">
                            Operario
                        </option>

                        <option value="CAPACITADOR">
                            Capacitador
                        </option>

                    </select>

                </div>


                <div className="campo-filtro">

                    <label>
                        Estado
                    </label>

                    <select
                        value={filtroEstado}
                        onChange={(e) =>
                            setFiltroEstado(
                                e.target.value
                            )
                        }
                    >

                        <option value="TODOS">
                            Todos los estados
                        </option>

                        <option value="ACTIVO">
                            Activos
                        </option>

                        <option value="INACTIVO">
                            Inactivos
                        </option>

                    </select>

                </div>

            </div>


            {/* =================================================
                CARGANDO
            ================================================= */}

            {cargando && (

                <div className="usuarios-mensaje">

                    <div className="usuarios-spinner"></div>

                    <p>
                        Cargando usuarios...
                    </p>

                </div>

            )}


            {/* =================================================
                ERROR
            ================================================= */}

            {error && !cargando && (

                <div className="usuarios-mensaje usuarios-mensaje-error">

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={cargarUsuarios}
                    >
                        Reintentar
                    </button>

                </div>

            )}


            {/* =================================================
                SIN RESULTADOS
            ================================================= */}

            {!cargando &&
                !error &&
                usuariosFiltrados.length === 0 && (

                    <div className="usuarios-mensaje">

                        <div className="usuarios-vacio-icono">
                            👥
                        </div>

                        <h3>
                            No encontramos usuarios
                        </h3>

                        <p>
                            Intenta cambiar los filtros
                            o el texto de búsqueda.
                        </p>

                    </div>

                )}


            {/* =================================================
                CARDS
            ================================================= */}

            {!cargando &&
                !error &&
                usuariosFiltrados.length > 0 && (

                    <div className="tarjetas-usuarios">

                        {usuariosFiltrados.map(
                            (usuario) => {

                                const estaCambiando =
                                    cambiandoEstado ===
                                    usuario.idUsuario;

                                const esActivo =
                                    usuario.estado ===
                                    "ACTIVO";


                                return (

                                    <article
                                        className={
                                            esActivo
                                                ? "usuario-card usuario-card-activo"
                                                : "usuario-card usuario-card-inactivo"
                                        }
                                        key={usuario.idUsuario}
                                        onClick={() => abrirEditarUsuario(usuario)}
                                    >

                                        {/* =================================================
                                            IDENTIDAD
                                        ================================================= */}

                                        <div className="usuario-card-identidad">

                                            <div className="usuario-avatar">

                                                {usuario.nombre
                                                    ? usuario.nombre
                                                        .charAt(0)
                                                        .toUpperCase()
                                                    : "U"}

                                            </div>


                                            <div className="usuario-identidad-texto">

                                                <h3>
                                                    {
                                                        usuario.nombre
                                                    }{" "}
                                                    {
                                                        usuario.apellido
                                                    }
                                                </h3>

                                                <span className="usuario-rol">
                                                    {
                                                        usuario.rol
                                                    }
                                                </span>

                                            </div>

                                        </div>


                                        {/* =================================================
                                            INFORMACIÓN
                                        ================================================= */}

                                        <div className="usuario-card-datos">

                                            <div>

                                                <span>
                                                    Documento
                                                </span>

                                                <strong>
                                                    {
                                                        usuario.documento
                                                    }
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    Correo
                                                </span>

                                                <strong>
                                                    {
                                                        usuario.correo
                                                    }
                                                </strong>

                                            </div>

                                        </div>


                                        {/* =================================================
                                            ESTADO
                                        ================================================= */}

                                        <div className="usuario-card-accion">

                                            <div
                                                className={
                                                    esActivo
                                                        ? "usuario-estado usuario-estado-activo"
                                                        : "usuario-estado usuario-estado-inactivo"
                                                }
                                            >

                                                <span className="estado-punto">
                                                    ●
                                                </span>

                                                <span>
                                                    {usuario.estado}
                                                </span>

                                            </div>


                                            <button
                                                className={
                                                    esActivo
                                                        ? "boton-estado-usuario boton-desactivar"
                                                        : "boton-estado-usuario boton-activar"
                                                }
                                                onClick={(e) => {

                                                    e.stopPropagation();

                                                    cambiarEstado(usuario);

                                                }}
                                                disabled={
                                                    estaCambiando
                                                }
                                            >

                                                {estaCambiando

                                                    ? "Actualizando..."

                                                    : esActivo

                                                        ? "✓ Usuario activo"

                                                        : "↻ Activar usuario"

                                                }

                                            </button>

                                        </div>

                                    </article>

                                );

                            }
                        )}

                    </div>

                )}

            {/* =========================================================
    MODAL EDITAR USUARIO
========================================================= */}

            {mostrarEditar &&
                usuarioEditar && (

                    <AdministradorEditarUsuario
                        usuario={usuarioEditar}

                        volver={
                            cerrarEditarUsuario
                        }

                        guardarCambios={
                            actualizarUsuarioEnLista
                        }
                    />

                )}

        </section>
    );
}

export default AdministradorUsuarios;