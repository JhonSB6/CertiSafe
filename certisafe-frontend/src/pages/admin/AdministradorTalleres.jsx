import { useEffect, useState } from "react";
import AdministradorCrearTaller from "./AdministradorCrearTaller";
import AdministradorProgramarOperarios from "./AdministradorProgramarOperarios";

function AdministradorTalleres() {

    const [talleres, setTalleres] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [mostrarCrear, setMostrarCrear] = useState(false);
    const [tallerSeleccionado, setTallerSeleccionado] = useState(null);
    const [resumenes, setResumenes] = useState({});

    const cargarTalleres = async () => {

        setCargando(true);
        setError("");

        try {

            const respuesta = await fetch(
                "http://localhost:8080/api/talleres"
            );

            if (!respuesta.ok) {
                throw new Error(
                    "No fue posible cargar los talleres"
                );
            }

            const datos = await respuesta.json();

            setTalleres(datos);

            const nuevosResumenes = {};

            for (const taller of datos) {

                try {

                    const respuestaResumen = await fetch(
                        `http://localhost:8080/api/talleres/${taller.idtaller}/resumen`
                    );

                    if (respuestaResumen.ok) {

                        const resumen = await respuestaResumen.json();

                        nuevosResumenes[taller.idtaller] = resumen;
                    }

                } catch (error) {

                    console.error(
                        `Error cargando resumen del taller ${taller.idtaller}:`,
                        error
                    );
                }
            }

            setResumenes(nuevosResumenes);

        } catch (error) {

            console.error(error);

            setError(
                "No fue posible cargar los talleres."
            );

        } finally {

            setCargando(false);
        }
    };


    useEffect(() => {
        cargarTalleres();
    }, []);

    if (mostrarCrear) {
                return (
                    <AdministradorCrearTaller
                        volver={() => {
                            setMostrarCrear(false);
                            cargarTalleres();
                        }}
                    />
                );
            }
    if (tallerSeleccionado) {
        return (
            <AdministradorProgramarOperarios
                taller={tallerSeleccionado}
                volver={() => {
                    setTallerSeleccionado(null);
                    cargarTalleres();
                }}
            />
        );
    }

    return (

        <section className="seccion-administrador">

            <h1>
                Talleres
            </h1>
            <button
                className="boton-crear-taller"
                onClick={() => setMostrarCrear(true)}
            >
                + Crear nuevo taller
            </button>

            <p>
                Gestiona los talleres de capacitación
                disponibles en CertiSafe.
            </p>


            {cargando && (
                <p>
                    Cargando talleres...
                </p>
            )}


            {error && (
                <p className="mensaje-error">
                    {error}
                </p>
            )}


            {!cargando &&
                !error &&
                talleres.length === 0 && (

                    <p>
                        No hay talleres registrados.
                    </p>
                )}


            {!cargando &&
                talleres.length > 0 && (

                    <div className="tarjetas-talleres-admin">

                        {talleres.map((taller) => (

                            <article
                                className="taller-admin-card"
                                key={taller.idtaller}
                            >

                                <h2>
                                    {taller.nombre}
                                </h2>

                                <p>
                                    {taller.descripcion}
                                </p>

                                <p>
                                    <strong>Fecha:</strong>{" "}
                                    {taller.fecha}
                                </p>

                                <p>
                                    <strong>Horario:</strong>{" "}
                                    {taller.horaInicio}
                                    {" - "}
                                    {taller.horaFin}
                                </p>

                                <p>
                                    <strong>Aforo:</strong>{" "}
                                    {taller.aforo}
                                </p>

                                <p>
                                    <strong>Certificación:</strong>{" "}
                                    {taller.tipoCertificacion?.nombre}
                                </p>

                                <p>
                                    <strong>Estado:</strong>{" "}
                                    {taller.estado}
                                </p>
                                <p>
                                    <strong>Capacitador:</strong>{" "}
                                    {taller.capacitador
                                        ? `${taller.capacitador.nombre} ${taller.capacitador.apellido}`
                                        : "Sin asignar"}
                                </p>
                        {resumenes[taller.idtaller] && (

                                                        <div className="resumen-aforo">

                                                            <p>
                                                                <strong>Aforo:</strong>{" "}
                                                                {resumenes[taller.idtaller].aforo}
                                                            </p>

                                                            <p>
                                                                <strong>Programados:</strong>{" "}
                                                                {resumenes[taller.idtaller].programados}
                                                                {" / "}
                                                                {resumenes[taller.idtaller].aforo}
                                                            </p>

                                                            <p>
                                                                <strong>Confirmados:</strong>{" "}
                                                                {resumenes[taller.idtaller].confirmados}
                                                                {" / "}
                                                                {resumenes[taller.idtaller].aforo}
                                                            </p>

                                                            <p>
                                                                <strong>Pendientes:</strong>{" "}
                                                                {resumenes[taller.idtaller].pendientes}
                                                            </p>

                                                        </div>
                                                    )}

                                <button
                                    className="boton-programar-taller"
                                    onClick={() => setTallerSeleccionado(taller)}
                                >
                                    👥 Programar operarios
                                </button>

                            </article>

                        ))}

                    </div>
                )}

        </section>
    );
}

export default AdministradorTalleres;