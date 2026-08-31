import { useEffect, useState } from "react";
import "./AdministradorDetalleTaller.css";

function AdministradorDetalleTaller({ taller, volver }) {

    const [detalle, setDetalle] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    // =========================================================
    // CARGAR DETALLE DEL TALLER
    // =========================================================

    const cargarDetalle = async () => {

        setCargando(true);
        setError("");

        try {

            const respuesta = await fetch(
                `http://localhost:8080/api/talleres/${taller.idtaller}/detalle`
            );

            if (!respuesta.ok) {

                throw new Error(
                    "No fue posible cargar el detalle del taller"
                );

            }

            const datos = await respuesta.json();

            setDetalle(datos);

        } catch (error) {

            console.error(error);

            setError(
                "No fue posible cargar el detalle del taller."
            );

        } finally {

            setCargando(false);

        }
    };


    // =========================================================
    // CARGAR AL ENTRAR
    // =========================================================

    useEffect(() => {

        if (taller?.idtaller) {

            cargarDetalle();

        }

    }, [taller]);


    // =========================================================
    // CARGANDO
    // =========================================================

    if (cargando) {

        return (

            <section className="detalle-taller-administrador">

                <div className="detalle-taller-cargando">

                    <div className="detalle-taller-spinner"></div>

                    <p>
                        Cargando detalle del taller...
                    </p>

                </div>

            </section>

        );

    }


    // =========================================================
    // ERROR
    // =========================================================

    if (error) {

        return (

            <section className="detalle-taller-administrador">

                <div className="detalle-taller-error">

                    <h2>
                        No fue posible cargar el detalle
                    </h2>

                    <p>
                        {error}
                    </p>

                    <div className="detalle-taller-acciones">

                        <button
                            className="detalle-boton-volver"
                            onClick={volver}
                        >
                            ← Volver
                        </button>

                        <button
                            className="detalle-boton-reintentar"
                            onClick={cargarDetalle}
                        >
                            Reintentar
                        </button>

                    </div>

                </div>

            </section>

        );

    }


    // =========================================================
    // SIN INFORMACIÓN
    // =========================================================

    if (!detalle) {

        return (

            <section className="detalle-taller-administrador">

                <div className="detalle-taller-vacio">

                    <p>
                        No se encontró información del taller.
                    </p>

                    <button
                        className="detalle-boton-volver"
                        onClick={volver}
                    >
                        ← Volver
                    </button>

                </div>

            </section>

        );

    }


    // =========================================================
    // FORMATEAR FECHA
    // =========================================================

    const formatearFecha = (fecha) => {

        if (!fecha) {
            return "—";
        }

        const partes = fecha.split("-");

        if (partes.length !== 3) {
            return fecha;
        }

        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    };


    // =========================================================
    // FORMATEAR HORA
    // =========================================================

    const formatearHora = (hora) => {

        if (!hora) {
            return "—";
        }

        return hora.substring(0, 5);
    };


    // =========================================================
    // ESTADO DEL TALLER
    // =========================================================

    const claseEstado = {

        PROGRAMADO: "detalle-estado-programado",

        EN_CURSO: "detalle-estado-en-curso",

        FINALIZADO: "detalle-estado-finalizado",

        CANCELADO: "detalle-estado-cancelado"

    };


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <section className="detalle-taller-administrador">

            {/* =====================================================
                ENCABEZADO
            ===================================================== */}

            <div className="detalle-taller-encabezado">

                <div>

                    <button
                        className="detalle-boton-volver"
                        onClick={volver}
                    >
                        ← Volver a talleres
                    </button>

                    <h1>
                        Detalle del taller
                    </h1>

                    <p>
                        Consulta la información y el estado
                        de los operarios inscritos.
                    </p>

                </div>

            </div>


            {/* =====================================================
                INFORMACIÓN DEL TALLER
            ===================================================== */}

            <div className="detalle-taller-seccion">

                <div className="detalle-taller-seccion-header">

                    <h2>
                        Información del taller
                    </h2>

                </div>


                <div className="detalle-taller-informacion">

                    <div className="detalle-dato">

                        <span>
                            Nombre
                        </span>

                        <strong>
                            {detalle.nombre || "—"}
                        </strong>

                    </div>


                    <div className="detalle-dato detalle-dato-descripcion">

                        <span>
                            Descripción
                        </span>

                        <strong>
                            {detalle.descripcion || "—"}
                        </strong>

                    </div>


                    <div className="detalle-dato">

                        <span>
                            Fecha
                        </span>

                        <strong>
                            {formatearFecha(detalle.fecha)}
                        </strong>

                    </div>


                    <div className="detalle-dato">

                        <span>
                            Horario
                        </span>

                        <strong>
                            {formatearHora(detalle.horaInicio)}
                            {" - "}
                            {formatearHora(detalle.horaFin)}
                        </strong>

                    </div>


                    <div className="detalle-dato">

                        <span>
                            Aforo
                        </span>

                        <strong>
                            {detalle.aforo ?? "—"}
                        </strong>

                    </div>


                    <div className="detalle-dato">

                        <span>
                            Certificación
                        </span>

                        <strong>
                            {detalle.certificacion || "—"}
                        </strong>

                    </div>


                    <div className="detalle-dato">

                        <span>
                            Estado
                        </span>

                        <strong
                            className={
                                claseEstado[detalle.estado]
                                || "detalle-estado"
                            }
                        >
                            {detalle.estado || "—"}
                        </strong>

                    </div>


                    <div className="detalle-dato">

                        <span>
                            Capacitador
                        </span>

                        <strong>
                            {detalle.capacitador || "Sin asignar"}
                        </strong>

                    </div>

                </div>

            </div>


            {/* =====================================================
                RESUMEN
            ===================================================== */}

            <div className="detalle-taller-seccion">

                <div className="detalle-taller-seccion-header">

                    <h2>
                        Resumen
                    </h2>

                </div>


                <div className="detalle-taller-resumen">

                    <div className="detalle-resumen-card">

                        <span>
                            Aforo
                        </span>

                        <strong>
                            {detalle.aforo ?? 0}
                        </strong>

                    </div>


                    <div className="detalle-resumen-card">

                        <span>
                            Programados
                        </span>

                        <strong>
                            {detalle.programados ?? 0}
                        </strong>

                    </div>


                    <div className="detalle-resumen-card">

                        <span>
                            Confirmados
                        </span>

                        <strong>
                            {detalle.confirmados ?? 0}
                        </strong>

                    </div>


                    <div className="detalle-resumen-card">

                        <span>
                            Pendientes
                        </span>

                        <strong>
                            {detalle.pendientes ?? 0}
                        </strong>

                    </div>

                </div>

            </div>


            {/* =====================================================
                DETALLE DE OPERARIOS
            ===================================================== */}

            <div className="detalle-taller-seccion">

                <div className="detalle-taller-seccion-header">

                    <div>

                        <h2>
                            Detalle de operarios
                        </h2>

                        <p>
                            Operarios registrados en este taller.
                        </p>

                    </div>

                    <span className="detalle-total-operarios">

                        {detalle.operarios?.length ?? 0}

                        {" operarios"}

                    </span>

                </div>


                {detalle.operarios &&
                detalle.operarios.length > 0 ? (

                    <div className="detalle-tabla-contenedor">

                        <table className="detalle-tabla-operarios">

                            <thead>

                                <tr>

                                    <th>
                                        Documento
                                    </th>

                                    <th>
                                        Nombre
                                    </th>

                                    <th>
                                        Apellido
                                    </th>

                                    <th>
                                        Inscripción
                                    </th>

                                    <th>
                                        Certificación
                                    </th>

                                    <th>
                                        Motivo
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {detalle.operarios.map(
                                    (operario, index) => (

                                        <tr key={index}>

                                            <td>
                                                {operario.documento || "—"}
                                            </td>

                                            <td>
                                                {operario.nombre || "—"}
                                            </td>

                                            <td>
                                                {operario.apellido || "—"}
                                            </td>

                                            <td>

                                                <span
                                                    className={
                                                        `detalle-inscripcion ${
                                                            operario.inscripcion
                                                                ?.toLowerCase()
                                                        }`
                                                    }
                                                >
                                                    {operario.inscripcion || "—"}
                                                </span>

                                            </td>

                                            <td>

                                                <span
                                                    className={
                                                        `detalle-certificacion ${
                                                            operario.certificacion
                                                                ?.toLowerCase()
                                                                .replace(/\s+/g, "-")
                                                                .replace(/_/g, "-")
                                                        }`
                                                    }
                                                >
                                                         {
                                                            operario.certificacion || "—"
                                                         }
                                                </span>

                                            </td>

                                            <td>

                                                {operario.motivo
                                                    ? operario.motivo
                                                    : "—"}

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                ) : (

                    <div className="detalle-operarios-vacio">

                        <span>
                            👥
                        </span>

                        <h3>
                            No hay operarios registrados
                        </h3>

                        <p>
                            Este taller todavía no tiene
                            operarios inscritos.
                        </p>

                    </div>

                )}

            </div>


            {/* =====================================================
                BOTÓN FINAL
            ===================================================== */}

            <div className="detalle-taller-acciones-finales">

                <button
                    className="detalle-boton-volver"
                    onClick={volver}
                >
                    ← Volver a talleres
                </button>

            </div>

        </section>
    );
}

export default AdministradorDetalleTaller;