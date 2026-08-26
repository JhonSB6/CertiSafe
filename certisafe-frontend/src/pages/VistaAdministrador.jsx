import { useEffect, useState } from "react";
import "./VistaAdministrador.css";

import AdministradorTalleres from "./admin/AdministradorTalleres";
import AdministradorNotificaciones from "./admin/AdministradorNotificaciones";
import AdministradorHistorial from "./admin/AdministradorHistorial";
import AdministradorSolicitudesUsuario from "./admin/AdministradorSolicitudesUsuario";
import AdministradorUsuarios from "./admin/AdministradorUsuarios";

import PerfilUsuario from "../components/PerfilUsuario";
import MenuUsuario from "../components/MenuUsuario";


function VistaAdministrador({
                                usuario,
                                cerrarSesion,
                                actualizarUsuario
                            }) {

    /*
     * La vista inicial ahora es Talleres.
     * Se elimina completamente la opción "Inicio".
     */
    const [vistaActual, setVistaActual] = useState("talleres");

    const [notificacionesNoLeidas, setNotificacionesNoLeidas] =
        useState(0);


    // ==========================================
    // CONTADOR DE NOTIFICACIONES
    // ==========================================

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

            {/* ==========================================
                MENÚ LATERAL
            ========================================== */}

            <aside className="menu-administrador">

                <div className="logo-administrador">

                    <span className="logo-admin-icono">
                        C
                    </span>

                    <span>
                        CERTISAFE
                    </span>

                </div>


                <nav>

                    {/* TALLERES */}

                    <button
                        className={
                            vistaActual === "talleres"
                                ? "menu-admin-activo"
                                : ""
                        }
                        onClick={() =>
                            setVistaActual("talleres")
                        }
                    >

                        <span className="menu-admin-icono">
                            📚
                        </span>

                        <span>
                            Talleres
                        </span>

                    </button>


                    {/* SOLICITUDES */}

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

                        <span className="menu-admin-icono">
                            📋
                        </span>

                        <span>
                            Solicitudes usuarios
                        </span>

                    </button>


                    {/* USUARIOS */}

                    <button
                        className={
                            vistaActual === "usuarios"
                                ? "menu-admin-activo"
                                : ""
                        }
                        onClick={() =>
                            setVistaActual("usuarios")
                        }
                    >

                        <span className="menu-admin-icono">
                            👥
                        </span>

                        <span>
                            Usuarios
                        </span>

                    </button>


                    {/* HISTORIAL */}

                    <button
                        className={
                            vistaActual === "historial"
                                ? "menu-admin-activo"
                                : ""
                        }
                        onClick={() =>
                            setVistaActual("historial")
                        }
                    >

                        <span className="menu-admin-icono">
                            📜
                        </span>

                        <span>
                            Historial certificaciones
                        </span>

                    </button>


                    {/* NOTIFICACIONES */}

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

            </aside>


            {/* ==========================================
                CONTENIDO PRINCIPAL
            ========================================== */}

            <main className="contenido-administrador">

                {/* ==========================================
                    HEADER
                ========================================== */}

                <header className="header-administrador">

                    <MenuUsuario
                        usuario={usuario}

                        onPerfil={() =>
                            setVistaActual("perfil")
                        }

                        onCerrarSesion={
                            cerrarSesion
                        }
                    />

                </header>


                {/* ==========================================
                    TALLERES
                ========================================== */}

                {vistaActual === "talleres" && (

                    <AdministradorTalleres />

                )}


                {/* ==========================================
                    SOLICITUDES DE USUARIOS
                ========================================== */}

                {vistaActual === "solicitudes-usuario" && (

                    <AdministradorSolicitudesUsuario />

                )}


                {/* ==========================================
                    USUARIOS
                ========================================== */}

                {vistaActual === "usuarios" && (

                    <AdministradorUsuarios />

                )}


                {/* ==========================================
                    HISTORIAL
                ========================================== */}

                {vistaActual === "historial" && (

                    <AdministradorHistorial />

                )}


                {/* ==========================================
                    NOTIFICACIONES
                ========================================== */}

                {vistaActual === "notificaciones" && (

                    <AdministradorNotificaciones
                        usuario={usuario}
                    />

                )}


                {/* ==========================================
                    PERFIL
                ========================================== */}

                {vistaActual === "perfil" && (

                    <PerfilUsuario
                        usuario={usuario}
                        actualizarUsuario={
                            actualizarUsuario
                        }
                    />

                )}

            </main>

        </div>

    );
}


export default VistaAdministrador;