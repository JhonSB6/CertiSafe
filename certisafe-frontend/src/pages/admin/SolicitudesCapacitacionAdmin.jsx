import { useEffect, useState } from "react";
import "./SolicitudesCapacitacionAdmin.css";

function SolicitudesCapacitacionAdmin() {

    const [solicitudes, setSolicitudes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    const cargarSolicitudes = async () => {

        setCargando(true);
        setError("");

        try {

            const respuesta = await fetch(
                "http://localhost:8080/api/solicitudes-capacitacion/estado/PENDIENTE"
            );

            if (!respuesta.ok) {
                throw new Error(
                    "No fue posible consultar las solicitudes."
                );
            }

            const datos = await respuesta.json();

            console.log(
                "SOLICITUDES DE CAPACITACIÓN:",
                datos
            );

            setSolicitudes(datos);

        } catch (error) {

            console.error(error);

            setError(
                "No fue posible cargar las solicitudes de capacitación."
            );

        } finally {

            setCargando(false);
        }
    };

    useEffect(() => {
        cargarSolicitudes();
    }, []);


    if (cargando) {

        return (
            <section className="seccion-solicitudes-admin">

                <div className="encabezado-solicitudes-admin">

                    <h1>
                        Solicitudes de capacitación
                    </h1>

                    <p>
                        Solicitudes pendientes de los operarios.
                    </p>

                </div>

                <div className="cargando-solicitudes-admin">

                    <div className="spinner-solicitudes-admin"></div>

                    <p>
                        Cargando solicitudes...
                    </p>

                </div>

            </section>
        );
    }


    if (error) {

        return (
            <section className="seccion-solicitudes-admin">

                <div className="encabezado-solicitudes-admin">

                    <h1>
                        Solicitudes de capacitación
                    </h1>

                </div>

                <div className="error-solicitudes-admin">

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={cargarSolicitudes}
                        className="boton-recargar-solicitudes"
                    >
                        Reintentar
                    </button>

                </div>

            </section>
        );
    }


    return (
        <section className="seccion-solicitudes-admin">

            <div className="encabezado-solicitudes-admin">

                <div>

                    <h1>
                        Solicitudes de capacitación
                    </h1>

                    <p>
                        Operarios que requieren una certificación
                        para completar los requisitos de ingreso
                        a producción.
                    </p>

                </div>

                <div className="contador-solicitudes">

                    <strong>
                        {solicitudes.length}
                    </strong>

                    <span>
                        pendientes
                    </span>

                </div>

            </div>


            {solicitudes.length === 0 ? (

                <div className="sin-solicitudes-admin">

                    <div className="icono-sin-solicitudes">
                        ✓
                    </div>

                    <h2>
                        No hay solicitudes pendientes
                    </h2>

                    <p>
                        Actualmente no existen solicitudes de
                        capacitación pendientes.
                    </p>

                </div>

            ) : (

                <div className="lista-solicitudes-admin">

                    {solicitudes.map((solicitud) => (

                        <article
                            className="card-solicitud-admin"
                            key={solicitud.idSolicitud}
                        >

                            <div className="cabecera-card-solicitud">

                                <div>

                                    <span className="etiqueta-solicitud">
                                        SOLICITUD #{solicitud.idSolicitud}
                                    </span>

                                    <h2>
                                        {solicitud.usuario?.nombre}{" "}
                                        {solicitud.usuario?.apellido}
                                    </h2>

                                </div>

                                <span className="estado-solicitud-pendiente">
                                    {solicitud.estado}
                                </span>

                            </div>


                            <div className="informacion-solicitud-admin">

                                <div className="dato-solicitud">

                                    <span>
                                        Documento
                                    </span>

                                    <strong>
                                        {solicitud.usuario?.documento}
                                    </strong>

                                </div>


                                <div className="dato-solicitud">

                                    <span>
                                        Certificación requerida
                                    </span>

                                    <strong>
                                        {solicitud.tipoCertificacion?.nombre}
                                    </strong>

                                </div>


                                <div className="dato-solicitud">

                                    <span>
                                        Fecha de solicitud
                                    </span>

                                    <strong>
                                        {solicitud.fechaSolicitud
                                            ? new Date(
                                                solicitud.fechaSolicitud
                                            ).toLocaleString("es-CO")
                                            : "No registrada"
                                        }
                                    </strong>

                                </div>

                            </div>


                            <div className="observacion-solicitud-admin">

                                <span>
                                    Observación
                                </span>

                                <p>
                                    {solicitud.observacion ||
                                        "El operario no agregó una observación."
                                    }
                                </p>

                            </div>


                            <div className="acciones-solicitud-admin">

                                <button
                                    className="boton-gestionar-solicitud"
                                    onClick={() =>
                                        console.log(
                                            "GESTIONAR SOLICITUD:",
                                            solicitud
                                        )
                                    }
                                >
                                    Gestionar solicitud
                                </button>

                            </div>

                        </article>

                    ))}

                </div>

            )}

        </section>
    );
}

export default SolicitudesCapacitacionAdmin;