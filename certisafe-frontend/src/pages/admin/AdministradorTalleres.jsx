import { useEffect, useState } from "react";

function AdministradorTalleres() {

    const [talleres, setTalleres] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

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


    return (

        <section className="seccion-administrador">

            <h1>
                Talleres
            </h1>

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

                            </article>

                        ))}

                    </div>
                )}

        </section>
    );
}

export default AdministradorTalleres;