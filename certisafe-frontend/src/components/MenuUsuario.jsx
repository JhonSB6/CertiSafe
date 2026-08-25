import { useEffect, useRef, useState } from "react";
import "./MenuUsuario.css";

function MenuUsuario({
                         usuario,
                         onPerfil,
                         onCerrarSesion
                     }) {

    const [menuAbierto, setMenuAbierto] = useState(false);

    const menuRef = useRef(null);


    // =========================================================
    // CERRAR AL HACER CLICK FUERA
    // =========================================================

    useEffect(() => {

        const cerrarMenuClickFuera = (evento) => {

            if (
                menuRef.current &&
                !menuRef.current.contains(evento.target)
            ) {

                setMenuAbierto(false);

            }
        };


        document.addEventListener(
            "mousedown",
            cerrarMenuClickFuera
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                cerrarMenuClickFuera
            );

        };

    }, []);


    // =========================================================
    // CERRAR CON ESC
    // =========================================================

    useEffect(() => {

        const cerrarConEscape = (evento) => {

            if (evento.key === "Escape") {

                setMenuAbierto(false);

            }

        };


        document.addEventListener(
            "keydown",
            cerrarConEscape
        );


        return () => {

            document.removeEventListener(
                "keydown",
                cerrarConEscape
            );

        };

    }, []);


    // =========================================================
    // PERFIL
    // =========================================================

    const abrirPerfil = () => {

        setMenuAbierto(false);

        onPerfil();

    };


    // =========================================================
    // CERRAR SESIÓN
    // =========================================================

    const cerrarSesion = () => {

        setMenuAbierto(false);

        onCerrarSesion();

    };


    // =========================================================
    // ROL MOSTRADO
    // =========================================================

    const obtenerRol = () => {

        switch (usuario?.rol) {

            case "ADMIN":
                return "Administrador";

            case "OPERARIO":
                return "Operario";

            case "CAPACITADOR":
                return "Capacitador";

            default:
                return "Usuario";

        }

    };


    return (

        <div
            className="menu-usuario-contenedor"
            ref={menuRef}
        >

            {/* =================================================
                BOTÓN DEL USUARIO
            ================================================= */}

            <button
                type="button"
                className="boton-menu-usuario"
                onClick={() =>
                    setMenuAbierto(
                        !menuAbierto
                    )
                }
                aria-expanded={
                    menuAbierto
                }
                aria-haspopup="true"
            >

                <div className="avatar-menu-usuario">

                    {usuario?.nombre
                        ? usuario.nombre
                            .charAt(0)
                            .toUpperCase()
                        : "U"}

                </div>


                <div className="datos-menu-usuario">

                    <strong>
                        {usuario?.nombre}{" "}
                        {usuario?.apellido}
                    </strong>

                    <span>
                        {obtenerRol()}
                    </span>

                </div>


                <span
                    className={
                        menuAbierto
                            ? "flecha-menu-usuario flecha-abierta"
                            : "flecha-menu-usuario"
                    }
                >
                    ▾
                </span>

            </button>


            {/* =================================================
                MENU DESPLEGABLE
            ================================================= */}

            {menuAbierto && (

                <div className="dropdown-menu-usuario">

                    <button
                        type="button"
                        className="opcion-menu-usuario"
                        onClick={abrirPerfil}
                    >

                        <span className="icono-opcion-menu">
                            👤
                        </span>

                        <span>
                            Mi perfil
                        </span>

                    </button>


                    <div className="separador-menu-usuario">
                    </div>


                    <button
                        type="button"
                        className="opcion-menu-usuario opcion-cerrar-sesion"
                        onClick={cerrarSesion}
                    >

                        <span className="icono-opcion-menu">
                            🚪
                        </span>

                        <span>
                            Cerrar sesión
                        </span>

                    </button>

                </div>

            )}

        </div>
    );
}

export default MenuUsuario;