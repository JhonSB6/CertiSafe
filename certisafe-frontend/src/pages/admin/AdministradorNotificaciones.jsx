import { useEffect, useState } from "react";

function AdministradorNotificaciones() {

    const [notificaciones, setNotificaciones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const cargarNotificaciones = async () => {

            try {

                const respuesta = await fetch(
                    "http://localhost:8080/api/notificaciones/usuario/1"
                );

                if (!respuesta.ok) {
                    throw new Error(
                        "Error al consultar las notificaciones"
                    );
                }

                const datos = await respuesta.json();

                console.log(
                    "NOTIFICACIONES RECIBIDAS:",
                    datos
                );

                setNotificaciones(datos);

            } catch (error) {

                console.error(error);

                setError(
                    "No fue posible cargar las notificaciones."
                );

            } finally {

                setCargando(false);
            }
        };

        cargarNotificaciones();

    }, []);

    return (

        <section className="seccion-administrador">

            <h1>
                Notificaciones
            </h1>

            <p>
                Notificaciones del sistema CertiSafe.
            </p>

            {cargando && (
                <p>
                    Cargando notificaciones...
                </p>
            )}

            {error && (
                <p className="mensaje-error">
                    {error}
                </p>
            )}

            {!cargando &&
                !error &&
                notificaciones.length === 0 && (

                    <p>
                        No tienes notificaciones.
                    </p>
                )}

            {!cargando &&
                !error &&
                notificaciones.length > 0 && (

                    <div className="lista-notificaciones">

                        {notificaciones.map((notificacion) => (

                            <article
                                key={notificacion.idnotificacion}
                                className="notificacion-card"
                            >

                                <div className="notificacion-icono">
                                    🔔
                                </div>

                                <div className="notificacion-contenido">

                                    <h3>
                                        {notificacion.tipo}
                                    </h3>

                                    <p>
                                        {notificacion.mensaje}
                                    </p>

                                    <small>
                                        {new Date(
                                            notificacion.fecha
                                        ).toLocaleString()}
                                    </small>

                                </div>

                            </article>

                        ))}

                    </div>
                )}

        </section>
    );
}

export default AdministradorNotificaciones;