import { useEffect, useState } from "react";
import "./VistaAdministrador.css";
import BotonCerrarSesion from "../components/BotonCerrarSesion";
import AdministradorTalleres from "./admin/AdministradorTalleres";
import AdministradorNotificaciones from "./admin/AdministradorNotificaciones";
import AdministradorHistorial from "./admin/AdministradorHistorial";
import AdministradorSolicitudesUsuario from "./admin/AdministradorSolicitudesUsuario";

function VistaAdministrador({ usuario, cerrarSesion }) {

    const [vistaActual, setVistaActual] = useState("inicio");
    const [notificacionesNoLeidas, setNotificacionesNoLeidas] =  useState(0);

    useEffect(() => {

        if (!usuario?.idUsuario) {
            return;
        }

        const cargarContador = async () => {

            try {

                const respuesta = await fetch(
                    `http://localhost:8080/api/notificaciones/usuario/${usuario.idUsuario}/no-leidas/count`
                );

                if (!respuesta.ok) {
                    return;
                }

                const cantidad = await respuesta.json();

                setNotificacionesNoLeidas(cantidad);

            } catch (error) {

                console.error(
                    "Error consultando notificaciones:",
                    error
                );
            }
        };

        cargarContador();

        const intervalo = setInterval(
            cargarContador,
            10000
        );

        return () => clearInterval(intervalo);

    }, [usuario]);

    return (

        <div className="dashboard-administrador">

            {/* =========================
                MENÚ LATERAL
            ========================== */}

            <aside className="menu-administrador">

                <div className="logo-administrador">
                    CERTISAFE
                </div>

                <nav>

                    <button
                        className={
                            vistaActual === "inicio"
                                ? "menu-admin-activo"
                                : ""
                        }
                        onClick={() => setVistaActual("inicio")}
                    >
                        🏠
                        <span>Inicio</span>
                    </button>


                    <button
                        className={
                            vistaActual === "talleres"
                                ? "menu-admin-activo"
                                : ""
                        }
                        onClick={() => setVistaActual("talleres")}
                    >
                        📚
                        <span>Talleres</span>
                    </button>

                    <button
                        className={
                            vistaActual === "solicitudes-usuario"
                                ? "menu-admin-activo"
                                : ""
                        }
                        onClick={() =>
                            setVistaActual("solicitudes-usuario")
                        }
                    >
                        📋
                        <span>Solicitudes usuarios</span>
                    </button>

                    <button
                        className={
                            vistaActual === "historial"
                                ? "menu-admin-activo"
                                : ""
                        }
                        onClick={() => setVistaActual("historial")}
                    >
                        📜
                        <span>Historial certificaciones</span>
                    </button>


                    <button
                        className={
                            vistaActual === "notificaciones"
                                ? "menu-admin-activo"
                                : ""
                        }
                        onClick={() =>
                            setVistaActual("notificaciones")
                        }
                    >

    <span className="icono-notificacion">
        🔔

        {notificacionesNoLeidas > 0 && (
            <span className="contador-notificaciones">
                {notificacionesNoLeidas}
            </span>
        )}

    </span>

                        <span>
        Notificaciones
    </span>

                    </button>

                </nav>


                {/* =========================
                    OPCIONES INFERIORES
                ========================== */}

                <div className="menu-admin-inferior">

                    <button
                        onClick={() =>
                            setVistaActual("perfil")
                        }
                    >
                        ⚙
                        <span>Mi perfil</span>
                    </button>

                    <button
                        className="btn-cerrar-sesion"
                        onClick={cerrarSesion}
                    >
                        Cerrar sesión
                    </button>

                </div>

            </aside>


            {/* =========================
                CONTENIDO PRINCIPAL
            ========================== */}

            <main className="contenido-administrador">

                {/* =========================
                    HEADER
                ========================== */}

                <header className="header-administrador">

                    <div className="usuario-administrador">

                        <div className="avatar-administrador">

                            {usuario.nombre
                                ? usuario.nombre
                                    .charAt(0)
                                    .toUpperCase()
                                : "A"}

                        </div>


                        <div>

                            <strong>
                                {usuario.nombre} {usuario.apellido}
                            </strong>

                            <span>
                                Administrador
                            </span>

                        </div>

                    </div>

                </header>


                {/* =========================
                    CONTENIDO TEMPORAL
                ========================== */}

                {vistaActual === "inicio" && (

                    <section className="seccion-administrador">

                        <h1>
                            Bienvenido, {usuario.nombre}
                        </h1>

                        <p>
                            Desde aquí puedes gestionar los
                            talleres, operarios, certificaciones
                            y notificaciones de CertiSafe.
                        </p>

                    </section>

                )}


                {vistaActual === "talleres" && (
                    <AdministradorTalleres />
                )}


                {vistaActual === "solicitudes-usuario" && (
                    <AdministradorSolicitudesUsuario />
                )}


                {vistaActual === "historial" && (
                    <AdministradorHistorial />
                )}


                {vistaActual === "notificaciones" && (
                    <AdministradorNotificaciones
                        usuario={usuario}
                    />
                )}


                {vistaActual === "perfil" && (

                    <section className="seccion-administrador">

                        <h1>
                            Mi perfil
                        </h1>

                        <p>
                            Aquí podrás consultar y actualizar
                            tu información personal.
                        </p>

                    </section>

                )}

            </main>

        </div>
    );
}

export default VistaAdministrador;