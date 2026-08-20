import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./VistaAdministrador.css";

function AdministradorHistorial() {

    const [historial, setHistorial] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    const [filtroOperario, setFiltroOperario] = useState("");
    const [filtroCertificacion, setFiltroCertificacion] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("");

    useEffect(() => {

        const cargarHistorial = async () => {

            setCargando(true);
            setError("");

            try {

                const respuesta = await fetch(
                    "http://localhost:8080/api/historial-certificaciones"
                );

                if (!respuesta.ok) {
                    throw new Error(
                        "No se pudo obtener el historial."
                    );
                }

                const datos = await respuesta.json();

                setHistorial(datos);

            } catch (error) {

                console.error(
                    "Error cargando historial:",
                    error
                );

                setError(
                    "No fue posible cargar el historial de certificaciones."
                );

            } finally {

                setCargando(false);
            }
        };

        cargarHistorial();

    }, []);


    // =========================================
    // FILTRAR HISTORIAL
    // =========================================

    const historialFiltrado = historial.filter((registro) => {

        const textoBusqueda =
            `${registro.operario} ${registro.documento}`.toLowerCase();

        const coincideOperario =
            textoBusqueda.includes(
                filtroOperario.toLowerCase()
            );

        const coincideCertificacion =
            filtroCertificacion === "" ||
            registro.certificacion === filtroCertificacion;

        const coincideEstado =
            filtroEstado === "" ||
            registro.estado === filtroEstado;

        return (
            coincideOperario &&
            coincideCertificacion &&
            coincideEstado
        );
    });


    // =========================================
    // CERTIFICACIONES DISPONIBLES
    // =========================================

    const certificacionesDisponibles = [
        ...new Set(
            historial.map(
                (registro) => registro.certificacion
            )
        )
    ];


    // =========================================
    // GENERAR PDF
    // =========================================

    const descargarPDF = () => {

        if (historialFiltrado.length === 0) {

            alert(
                "No hay registros para generar el PDF."
            );

            return;
        }


        const documento = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4"
        });


        // =========================================
        // TÍTULO
        // =========================================

        documento.setFontSize(20);

        documento.setTextColor(18, 63, 104);

        documento.text(
            "CERTISAFE",
            14,
            15
        );


        documento.setFontSize(15);

        documento.setTextColor(30, 41, 59);

        documento.text(
            "Historial de certificaciones",
            14,
            25
        );


        // =========================================
        // INFORMACIÓN DEL REPORTE
        // =========================================

        documento.setFontSize(9);

        documento.setTextColor(100, 116, 139);

        documento.text(
            `Registros: ${historialFiltrado.length}`,
            14,
            33
        );

        documento.text(
            `Fecha de generación: ${new Date().toLocaleDateString("es-CO")}`,
            14,
            39
        );


        // =========================================
        // FILTROS APLICADOS
        // =========================================

        let posicionFiltro = 45;

        if (filtroOperario) {

            documento.text(
                `Operario / Documento: ${filtroOperario}`,
                14,
                posicionFiltro
            );

            posicionFiltro += 5;
        }

        if (filtroCertificacion) {

            documento.text(
                `Certificación: ${filtroCertificacion}`,
                14,
                posicionFiltro
            );

            posicionFiltro += 5;
        }

        if (filtroEstado) {

            documento.text(
                `Estado: ${filtroEstado}`,
                14,
                posicionFiltro
            );

            posicionFiltro += 5;
        }


        // =========================================
        // DATOS DE LA TABLA
        // =========================================

        const filas = historialFiltrado.map(
            (registro) => [

                registro.operario,

                registro.documento,

                registro.certificacion,

                new Date(
                    registro.fechaExpedicion
                ).toLocaleDateString("es-CO"),

                new Date(
                    registro.fechaVigencia
                ).toLocaleDateString("es-CO"),

                registro.estado,

                registro.taller

            ]
        );


        // =========================================
        // TABLA PDF
        // =========================================

        autoTable(documento, {

            startY: posicionFiltro + 5,

            head: [[
                "Operario",
                "Documento",
                "Certificación",
                "Fecha expedición",
                "Fecha vigencia",
                "Estado",
                "Taller"
            ]],

            body: filas,

            theme: "grid",

            styles: {
                fontSize: 8,
                cellPadding: 3
            },

            headStyles: {
                fillColor: [18, 63, 104],
                textColor: 255,
                fontStyle: "bold"
            },

            alternateRowStyles: {
                fillColor: [244, 247, 251]
            },

            margin: {
                left: 14,
                right: 14
            }
        });


        // =========================================
        // PIE DE PÁGINA
        // =========================================

        const totalPaginas =
            documento.internal.getNumberOfPages();

        for (
            let pagina = 1;
            pagina <= totalPaginas;
            pagina++
        ) {

            documento.setPage(pagina);

            documento.setFontSize(8);

            documento.setTextColor(100, 116, 139);

            documento.text(
                `CertiSafe - Historial de certificaciones | Página ${pagina} de ${totalPaginas}`,
                14,
                202
            );
        }


        // =========================================
        // DESCARGAR
        // =========================================

        documento.save(
            "historial-certificaciones.pdf"
        );
    };


    return (

        <section className="seccion-administrador historial-administrador">

            {/* =========================================
                ENCABEZADO
            ========================================= */}

            <div className="encabezado-historial">

                <div>

                    <h1>
                        Historial de certificaciones
                    </h1>

                    <p>
                        Consulta las certificaciones
                        obtenidas por los operarios.
                    </p>

                </div>


                {/* BOTÓN PDF */}

                <button
                    className="boton-descargar-pdf"
                    onClick={descargarPDF}
                    disabled={historialFiltrado.length === 0}
                >
                    📄 Descargar PDF
                </button>

            </div>


            {/* =========================================
                FILTROS
            ========================================= */}

            <div className="filtros-historial">

                <div className="campo-filtro">

                    <label>
                        Operario / Documento
                    </label>

                    <input
                        type="text"
                        placeholder="Buscar operario o documento..."
                        value={filtroOperario}
                        onChange={(e) =>
                            setFiltroOperario(
                                e.target.value
                            )
                        }
                    />

                </div>


                <div className="campo-filtro">

                    <label>
                        Certificación
                    </label>

                    <select
                        value={filtroCertificacion}
                        onChange={(e) =>
                            setFiltroCertificacion(
                                e.target.value
                            )
                        }
                    >

                        <option value="">
                            Todas
                        </option>

                        {certificacionesDisponibles.map(
                            (certificacion) => (

                                <option
                                    key={certificacion}
                                    value={certificacion}
                                >
                                    {certificacion}
                                </option>

                            )
                        )}

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

                        <option value="">
                            Todos
                        </option>

                        <option value="VIGENTE">
                            VIGENTE
                        </option>

                        <option value="PENDIENTE">
                            PENDIENTE
                        </option>

                        <option value="VENCIDA">
                            VENCIDA
                        </option>

                    </select>

                </div>


                <button
                    className="boton-limpiar-filtros"
                    onClick={() => {

                        setFiltroOperario("");
                        setFiltroCertificacion("");
                        setFiltroEstado("");

                    }}
                >
                    Limpiar filtros
                </button>

            </div>


            {/* =========================================
                CARGANDO
            ========================================= */}

            {cargando && (

                <div className="mensaje-historial">
                    Cargando historial...
                </div>

            )}


            {/* =========================================
                ERROR
            ========================================= */}

            {error && (

                <div className="mensaje-error">
                    {error}
                </div>

            )}


            {/* =========================================
                TABLA
            ========================================= */}

            {!cargando && !error && (

                <>

                    <div className="resumen-historial">

                        Mostrando{" "}

                        <strong>
                            {historialFiltrado.length}
                        </strong>

                        {" "}de{" "}

                        <strong>
                            {historial.length}
                        </strong>

                        {" "}registros

                    </div>


                    {historialFiltrado.length === 0 ? (

                        <div className="mensaje-historial">

                            No se encontraron
                            certificaciones con los
                            filtros seleccionados.

                        </div>

                    ) : (

                        <div className="tabla-historial-contenedor">

                            <table className="tabla-historial">

                                <thead>

                                    <tr>

                                        <th>
                                            Operario
                                        </th>

                                        <th>
                                            Documento
                                        </th>

                                        <th>
                                            Certificación
                                        </th>

                                        <th>
                                            Fecha expedición
                                        </th>

                                        <th>
                                            Fecha vigencia
                                        </th>

                                        <th>
                                            Estado
                                        </th>

                                        <th>
                                            Taller relacionado
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {historialFiltrado.map(
                                        (registro) => (

                                            <tr
                                                key={
                                                    registro.idHistorial
                                                }
                                            >

                                                <td>
                                                    {
                                                        registro.operario
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        registro.documento
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        registro.certificacion
                                                    }
                                                </td>

                                                <td>
                                                    {new Date(
                                                        registro.fechaExpedicion
                                                    ).toLocaleDateString(
                                                        "es-CO"
                                                    )}
                                                </td>

                                                <td>
                                                    {new Date(
                                                        registro.fechaVigencia
                                                    ).toLocaleDateString(
                                                        "es-CO"
                                                    )}
                                                </td>

                                                <td>

                                                    <span
                                                        className={`estado-historial estado-${registro.estado?.toLowerCase()}`}
                                                    >
                                                        {
                                                            registro.estado
                                                        }
                                                    </span>

                                                </td>

                                                <td>
                                                    {
                                                        registro.taller
                                                    }
                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </>

            )}

        </section>
    );
}

export default AdministradorHistorial;