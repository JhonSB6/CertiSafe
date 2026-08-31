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

    // =========================================================
    // TIPOS OBLIGATORIOS DE CERTISAFE
    // =========================================================

    const tiposCertificacion = [
        "Trabajo seguro en alturas",
        "Manejo seguro de productos quimicos",
        "Seguridad en espacios confinados"
    ];


    // =========================================================
    // CARGAR HISTORIAL
    // =========================================================

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


    // =========================================================
    // FILTRAR HISTORIAL
    // =========================================================

    const historialFiltrado = historial.filter((registro) => {

        const textoBusqueda =
            `${registro.operario || ""} ${registro.documento || ""}`
                .toLowerCase();

        const coincideOperario =
            textoBusqueda.includes(
                filtroOperario.toLowerCase()
            );

        const coincideCertificacion =
            filtroCertificacion === "" ||
            registro.certificacion === filtroCertificacion;

        const estadoRegistro =
            registro.decision === "NO_CERTIFICADO"
                ? "NO_CERTIFICADO"
                : registro.estado;

        const coincideEstado =
            filtroEstado === "" ||
            estadoRegistro === filtroEstado;

        return (
            coincideOperario &&
            coincideCertificacion &&
            coincideEstado
        );
    });


    // =========================================================
    // CERTIFICACIONES DISPONIBLES
    // =========================================================

    const certificacionesDisponibles = [
        ...new Set(
            historial
                .map((registro) => registro.certificacion)
                .filter(Boolean)
        )
    ];


    // =========================================================
    // OBTENER ESTADO REAL DEL REGISTRO
    // =========================================================

    const obtenerEstado = (registro) => {

        if (
            registro.decision ===
            "NO_CERTIFICADO"
        ) {
            return "NO_CERTIFICADO";
        }

        return registro.estado || "PENDIENTE";
    };


    // =========================================================
    // OBTENER RESPONSABLE
    // =========================================================

    const obtenerResponsable = () => {

        try {

            const usuarioGuardado =
                localStorage.getItem("usuario");

            if (!usuarioGuardado) {
                return "Administrador";
            }

            const usuario =
                JSON.parse(usuarioGuardado);

            const nombre =
                usuario.nombre || "";

            const apellido =
                usuario.apellido || "";

            const nombreCompleto =
                `${nombre} ${apellido}`.trim();

            return nombreCompleto ||
                "Administrador";

        } catch (error) {

            console.error(
                "No fue posible obtener el usuario:",
                error
            );

            return "Administrador";
        }
    };


    // =========================================================
    // FORMATEAR FECHA
    // =========================================================

    const formatearFecha = (fecha) => {

        if (!fecha) {
            return "—";
        }

        const fechaObjeto =
            new Date(fecha);

        if (Number.isNaN(
            fechaObjeto.getTime()
        )) {
            return "—";
        }

        return fechaObjeto.toLocaleDateString(
            "es-CO"
        );
    };


    // =========================================================
    // FORMATEAR FECHA Y HORA
    // =========================================================

    const formatearFechaHora = (fecha) => {

        if (!fecha) {
            return "—";
        }

        const fechaObjeto =
            new Date(fecha);

        if (Number.isNaN(
            fechaObjeto.getTime()
        )) {
            return "—";
        }

        return fechaObjeto.toLocaleString(
            "es-CO"
        );

    };


    // =========================================================
    // OBTENER PERÍODO
    // =========================================================

    const obtenerPeriodo = () => {

        const fechas = historialFiltrado
            .map((registro) =>
                registro.fechaExpedicion
                    ? new Date(
                        registro.fechaExpedicion
                    )
                    : null
            )
            .filter(
                (fecha) =>
                    fecha &&
                    !Number.isNaN(
                        fecha.getTime()
                    )
            );

        if (fechas.length === 0) {
            return "No disponible";
        }

        const fechaInicial =
            new Date(
                Math.min(
                    ...fechas.map(
                        (fecha) =>
                            fecha.getTime()
                    )
                )
            );

        const fechaFinal =
            new Date(
                Math.max(
                    ...fechas.map(
                        (fecha) =>
                            fecha.getTime()
                    )
                )
            );

        return `${formatearFecha(
    fechaInicial
)} - ${formatearFecha(
    fechaFinal
)}`;
    };


    // =========================================================
    // OPERARIOS ÚNICOS
    // =========================================================

    const obtenerOperariosUnicos = () => {

        const mapa =
            new Map();

        historialFiltrado.forEach(
            (registro) => {

                const documento =
                    registro.documento;

                if (!documento) {
                    return;
                }

                if (!mapa.has(documento)) {

                    mapa.set(
                        documento,
                        {
                            documento,
                            operario:
                                registro.operario ||
                                "Sin nombre"
                        }
                    );

                }

            }
        );

        return [
            ...mapa.values()
        ];

    };


    // =========================================================
    // OBTENER REGISTRO MÁS RECIENTE
    // =========================================================

    const obtenerRegistroPorTipo = (
        documento,
        tipo
    ) => {

        const registros =
            historialFiltrado
                .filter(
                    (registro) =>
                        registro.documento ===
                            documento &&
                        registro.certificacion ===
                            tipo
                );

        if (registros.length === 0) {
            return null;
        }

        return registros.sort(
            (a, b) => {

                const fechaA =
                    a.fechaExpedicion
                        ? new Date(
                            a.fechaExpedicion
                        ).getTime()
                        : 0;

                const fechaB =
                    b.fechaExpedicion
                        ? new Date(
                            b.fechaExpedicion
                        ).getTime()
                        : 0;

                return fechaB - fechaA;

            }
        )[0];

    };


    // =========================================================
    // RESUMEN EJECUTIVO
    // =========================================================

    const obtenerResumenEjecutivo = () => {

        const operarios =
            obtenerOperariosUnicos();

        const totalOperarios =
            operarios.length;

        let vigentes = 0;
        let noCertificados = 0;
        let vencidas = 0;

        operarios.forEach(
            (operario) => {

                const registros =
                    historialFiltrado.filter(
                        (registro) =>
                            registro.documento ===
                            operario.documento
                    );

                const tieneVigente =
                    registros.some(
                        (registro) =>
                            obtenerEstado(
                                registro
                            ) === "VIGENTE"
                    );

                const tieneVencida =
                    registros.some(
                        (registro) =>
                            obtenerEstado(
                                registro
                            ) === "VENCIDA"
                    );

                const tieneNoCertificado =
                    registros.some(
                        (registro) =>
                            obtenerEstado(
                                registro
                            ) === "NO_CERTIFICADO"
                    );

                if (tieneVigente) {
                    vigentes++;
                }

                if (tieneVencida) {
                    vencidas++;
                }

                if (tieneNoCertificado) {
                    noCertificados++;
                }

            }
        );

        const tiposEvaluados =
            filtroCertificacion
                ? [filtroCertificacion]
                : tiposCertificacion;

        let cumplen = 0;

        operarios.forEach(
            (operario) => {

                const cumpleTodos =
                    tiposEvaluados.every(
                        (tipo) => {

                            const registro =
                                obtenerRegistroPorTipo(
                                    operario.documento,
                                    tipo
                                );

                            return registro &&
                                obtenerEstado(
                                    registro
                                ) === "VIGENTE";

                        }
                    );

                if (cumpleTodos) {
                    cumplen++;
                }

            }
        );

        const cumplimiento =
            totalOperarios > 0
                ? Math.round(
                    (cumplen /
                        totalOperarios) *
                    100
                )
                : 0;

        return {
            totalOperarios,
            vigentes,
            noCertificados,
            vencidas,
            cumplimiento
        };

    };


    // =========================================================
    // CUMPLIMIENTO POR TIPO
    // =========================================================

    const obtenerCumplimientoPorTipo = () => {

        const operarios =
            obtenerOperariosUnicos();

        const tipos =
            filtroCertificacion
                ? [filtroCertificacion]
                : tiposCertificacion;

        return tipos.map(
            (tipo) => {

                let vigentes = 0;
                let noCertificados = 0;
                let vencidas = 0;

                operarios.forEach(
                    (operario) => {

                        const registro =
                            obtenerRegistroPorTipo(
                                operario.documento,
                                tipo
                            );

                        if (!registro) {

                            noCertificados++;

                            return;
                        }

                        const estado =
                            obtenerEstado(
                                registro
                            );

                        if (
                            estado === "VIGENTE"
                        ) {

                            vigentes++;

                        } else if (
                            estado === "VENCIDA"
                        ) {

                            vencidas++;

                        } else {

                            noCertificados++;

                        }

                    }
                );

                const total =
                    operarios.length;

                const cumplimiento =
                    total > 0
                        ? Math.round(
                            (vigentes /
                                total) *
                            100
                        )
                        : 0;

                return {
                    tipo,
                    vigentes,
                    noCertificados,
                    vencidas,
                    cumplimiento
                };

            }
        );

    };


    // =========================================================
    // HALLAZGOS
    // =========================================================

    const obtenerHallazgos = () => {

        const resumen =
            obtenerResumenEjecutivo();

        const cumplimientoTipos =
            obtenerCumplimientoPorTipo();

        const hallazgos = [];

        hallazgos.push(
            `${resumen.vigentes} operarios presentan al menos una certificación vigente registrada.`
        );

        hallazgos.push(
            `${resumen.noCertificados} operarios presentan registros con decisión NO_CERTIFICADO.`
        );

        if (resumen.vencidas > 0) {

            hallazgos.push(
                `${resumen.vencidas} operarios presentan certificaciones vencidas.`
            );

        }

        if (
            cumplimientoTipos.length > 0
        ) {

            const menor =
                [...cumplimientoTipos]
                    .sort(
                        (a, b) =>
                            a.cumplimiento -
                            b.cumplimiento
                    )[0];

            hallazgos.push(
                `El menor porcentaje de cumplimiento corresponde a ${menor.tipo}, con ${menor.cumplimiento}%.`
            );

        }

        hallazgos.push(
            `El cumplimiento general calculado para el período consultado es del ${resumen.cumplimiento}%.`
        );

        return hallazgos;

    };


    // =========================================================
    // DIBUJAR GRÁFICA
    // =========================================================

    const dibujarGraficaCumplimiento = (
        documento,
        x,
        y,
        ancho,
        alto,
        resumen
    ) => {

        const total =
            resumen.vigentes +
            resumen.noCertificados +
            resumen.vencidas;

        const centroX =
            x + ancho / 2;

        const centroY =
            y + alto / 2;

        const radio = 25;

        if (total === 0) {

            documento.setDrawColor(
                180,
                180,
                180
            );

            documento.circle(
                centroX,
                centroY,
                radio
            );

            documento.setFontSize(9);

            documento.setTextColor(
                100,
                100,
                100
            );

            documento.text(
                "Sin datos",
                centroX,
                centroY + 3,
                {
                    align: "center"
                }
            );

            return;
        }

        const datos = [
            {
                nombre: "Vigentes",
                valor: resumen.vigentes
            },
            {
                nombre: "No certificados",
                valor: resumen.noCertificados
            },
            {
                nombre: "Vencidas",
                valor: resumen.vencidas
            }
        ].filter(
            (item) =>
                item.valor > 0
        );

        let inicio =
            -Math.PI / 2;

        const colores = [
            [34, 197, 94],
            [239, 68, 68],
            [245, 158, 11]
        ];

        datos.forEach(
            (dato, index) => {

                const porcentaje =
                    dato.valor /
                    total;

                const fin =
                    inicio +
                    porcentaje *
                    Math.PI *
                    2;

                const color =
                    colores[index];

                documento.setFillColor(
                    color[0],
                    color[1],
                    color[2]
                );

                documento.setDrawColor(
                    255,
                    255,
                    255
                );

                documento.setLineWidth(
                    0.5
                );

                const pasos = 40;

                const puntos = [
                    [
                        centroX,
                        centroY
                    ]
                ];

                for (
                    let i = 0;
                    i <= pasos;
                    i++
                ) {

                    const angulo =
                        inicio +
                        ((fin - inicio) *
                            i) /
                        pasos;

                    puntos.push([
                        centroX +
                        radio *
                        Math.cos(
                            angulo
                        ),
                        centroY +
                        radio *
                        Math.sin(
                            angulo
                        )
                    ]);

                }

                documento.lines(
                    puntos.slice(1).map(
                        (punto, i) => {

                            if (i === 0) {

                                return [
                                    punto[0] -
                                        centroX,
                                    punto[1] -
                                        centroY
                                ];

                            }

                            const anterior =
                                puntos[i];

                            return [
                                punto[0] -
                                    anterior[0],
                                punto[1] -
                                    anterior[1]
                            ];

                        }
                    ),
                    centroX,
                    centroY,
                    [1, 1],
                    "F",
                    true
                );

                inicio = fin;

            }
        );


        // Centro blanco para efecto tipo donut

        documento.setFillColor(
            255,
            255,
            255
        );

        documento.circle(
            centroX,
            centroY,
            13,
            "F"
        );


        documento.setFontSize(
            16
        );

        documento.setTextColor(
            30,
            41,
            59
        );

        documento.text(
            `${resumen.cumplimiento}%`,
            centroX,
            centroY + 3,
            {
                align: "center"
            }
        );


        // Leyenda

        let leyendaY =
            y + 12;

        datos.forEach(
            (dato, index) => {

                const color =
                    colores[index];

                documento.setFillColor(
                    color[0],
                    color[1],
                    color[2]
                );

                documento.rect(
                    x + ancho - 65,
                    leyendaY - 3,
                    4,
                    4,
                    "F"
                );

                documento.setFontSize(
                    8
                );

                documento.setTextColor(
                    60,
                    60,
                    60
                );

                const porcentaje =
                    Math.round(
                        (dato.valor /
                            total) *
                        100
                    );

                documento.text(
                    `${dato.nombre}: ${dato.valor} (${porcentaje}%)`,
                    x + ancho - 59,
                    leyendaY
                );

                leyendaY += 7;

            }
        );

    };


    // =========================================================
    // GENERAR PDF
    // =========================================================

    const descargarPDF = () => {

        if (
            historialFiltrado.length === 0
        ) {

            alert(
                "No hay registros para generar el PDF."
            );

            return;
        }


        const documento =
            new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: "a4"
            });


        const resumen =
            obtenerResumenEjecutivo();

        const cumplimientoTipos =
            obtenerCumplimientoPorTipo();

        const responsable =
            obtenerResponsable();

        const fechaGeneracion =
            new Date();

        const margen =
            14;


        // =====================================================
        // PORTADA / ENCABEZADO
        // =====================================================

        documento.setFontSize(
            21
        );

        documento.setTextColor(
            18,
            63,
            104
        );

        documento.text(
            "CERTISAFE",
            margen,
            17
        );


        documento.setFontSize(
            16
        );

        documento.setTextColor(
            30,
            41,
            59
        );

        documento.text(
            "REPORTE TÉCNICO DE CUMPLIMIENTO DE CERTIFICACIONES",
            margen,
            27
        );


        documento.setFontSize(
            9
        );

        documento.setTextColor(
            100,
            116,
            139
        );

        documento.text(
            `Nombre del sistema: CertiSafe`,
            margen,
            36
        );

        documento.text(
            `Fecha y hora de generación: ${formatearFechaHora(
    fechaGeneracion
)}`,
            margen,
            42
        );

        documento.text(
            `Período consultado: ${obtenerPeriodo()}`,
            margen,
            48
        );

        documento.text(
            `Responsable de generación: ${responsable}`,
            margen,
            54
        );

        documento.text(
            `Total de operarios evaluados: ${resumen.totalOperarios}`,
            margen,
            60
        );


        // =====================================================
        // DESCRIPCIÓN
        // =====================================================

        documento.setFontSize(
            10
        );

        documento.setTextColor(
            30,
            41,
            59
        );

        documento.text(
            "Descripción del módulo",
            margen,
            72
        );

        documento.setFontSize(
            8.5
        );

        documento.setTextColor(
            71,
            85,
            105
        );

        const descripcion =
            "Historial de certificaciones: módulo encargado de registrar, " +
            "consultar y consolidar la información relacionada con las " +
            "certificaciones de seguridad de los operarios, permitiendo " +
            "identificar el estado de cumplimiento de los requisitos de " +
            "capacitación y facilitar la trazabilidad documental para " +
            "procesos de auditoría y control interno.";

        const descripcionLineas =
            documento.splitTextToSize(
                descripcion,
                265
            );

        documento.text(
            descripcionLineas,
            margen,
            79
        );


        // =====================================================
        // RESUMEN EJECUTIVO
        // =====================================================

        const inicioResumen =
            101;

        documento.setFontSize(
            13
        );

        documento.setTextColor(
            30,
            41,
            59
        );

        documento.text(
            "1. Resumen ejecutivo",
            margen,
            inicioResumen
        );


        const tarjetas = [
            {
                titulo:
                    "Operarios evaluados",
                valor:
                    resumen.totalOperarios
            },
            {
                titulo:
                    "Certificaciones vigentes",
                valor:
                    resumen.vigentes
            },
            {
                titulo:
                    "No certificados",
                valor:
                    resumen.noCertificados
            },
            {
                titulo:
                    "Certificaciones vencidas",
                valor:
                    resumen.vencidas
            },
            {
                titulo:
                    "Cumplimiento",
                valor:
                    `${resumen.cumplimiento}%`
            }
        ];


        const anchoTarjeta =
            50;

        const espacioTarjeta =
            4;

        tarjetas.forEach(
            (tarjeta, index) => {

                const x =
                    margen +
                    index *
                    (
                        anchoTarjeta +
                        espacioTarjeta
                    );

                const y =
                    inicioResumen +
                    8;

                documento.setFillColor(
                    245,
                    247,
                    250
                );

                documento.roundedRect(
                    x,
                    y,
                    anchoTarjeta,
                    25,
                    2,
                    2,
                    "F"
                );

                documento.setFontSize(
                    8
                );

                documento.setTextColor(
                    100,
                    116,
                    139
                );

                documento.text(
                    tarjeta.titulo,
                    x + 4,
                    y + 7
                );

                documento.setFontSize(
                    17
                );

                documento.setTextColor(
                    18,
                    63,
                    104
                );

                documento.text(
                    String(tarjeta.valor),
                    x + 4,
                    y + 19
                );

            }
        );


        // =====================================================
        // GRÁFICA
        // =====================================================

        documento.setFontSize(
            13
        );

        documento.setTextColor(
            30,
            41,
            59
        );

        documento.text(
            "2. Estado general de certificaciones",
            margen,
            151
        );

        documento.setFontSize(
            8
        );

        documento.setTextColor(
            100,
            116,
            139
        );

        documento.text(
            "Distribución porcentual del estado de certificación de los operarios evaluados.",
            margen,
            157
        );


        dibujarGraficaCumplimiento(
            documento,
            margen,
            162,
            265,
            55,
            resumen
        );


        // =====================================================
        // PIE DE PÁGINA
        // =====================================================

        documento.setFontSize(
            8
        );

        documento.setTextColor(
            100,
            116,
            139
        );

        documento.text(
            "CertiSafe - Reporte técnico de cumplimiento de certificaciones",
            margen,
            202
        );


        // =====================================================
        // PÁGINA 2
        // =====================================================

        documento.addPage();


        documento.setFontSize(
            15
        );

        documento.setTextColor(
            18,
            63,
            104
        );

        documento.text(
            "3. Cumplimiento por tipo de certificación",
            margen,
            18
        );


        documento.setFontSize(
            8.5
        );

        documento.setTextColor(
            100,
            116,
            139
        );

        documento.text(
            "Distribución del cumplimiento de los requisitos obligatorios registrados en CertiSafe.",
            margen,
            25
        );


        const filasTipos =
            cumplimientoTipos.map(
                (item) => [

                    item.tipo,

                    item.vigentes,

                    item.noCertificados,

                    item.vencidas,

                    `${item.cumplimiento}%`

                ]
            );


        autoTable(
            documento,
            {

                startY: 32,

                head: [[
                    "Tipo de certificación",
                    "Vigentes",
                    "No certificados",
                    "Vencidas",
                    "Cumplimiento"
                ]],

                body: filasTipos,

                theme: "grid",

                styles: {
                    fontSize: 8,
                    cellPadding: 4
                },

                headStyles: {
                    fillColor: [
                        18,
                        63,
                        104
                    ],
                    textColor: 255,
                    fontStyle: "bold"
                },

                alternateRowStyles: {
                    fillColor: [
                        244,
                        247,
                        251
                    ]
                },

                margin: {
                    left: margen,
                    right: margen
                }

            }
        );


        // =====================================================
        // HALLAZGOS
        // =====================================================

        let posicionHallazgos =
            documento.lastAutoTable.finalY +
            15;


        documento.setFontSize(
            14
        );

        documento.setTextColor(
            30,
            41,
            59
        );

        documento.text(
            "4. Hallazgos de cumplimiento",
            margen,
            posicionHallazgos
        );


        posicionHallazgos +=
            8;


        documento.setFontSize(
            9
        );

        documento.setTextColor(
            71,
            85,
            105
        );


        const hallazgos =
            obtenerHallazgos();


        hallazgos.forEach(
            (hallazgo) => {

                const lineas =
                    documento.splitTextToSize(
                        hallazgo,
                        255
                    );

                documento.text(
                    `• ${lineas[0]}`,
                    margen + 2,
                    posicionHallazgos
                );

                posicionHallazgos +=
                    6;

            }
        );


        // =====================================================
        // PIE
        // =====================================================

        documento.setFontSize(
            8
        );

        documento.setTextColor(
            100,
            116,
            139
        );

        documento.text(
            "CertiSafe - Reporte técnico de cumplimiento de certificaciones",
            margen,
            202
        );


        // =====================================================
        // PÁGINA 3 - MATRIZ DE OPERARIOS
        // =====================================================

        documento.addPage();


        documento.setFontSize(
            15
        );

        documento.setTextColor(
            18,
            63,
            104
        );

        documento.text(
            "5. Matriz detallada de cumplimiento por operario",
            margen,
            18
        );


        documento.setFontSize(
            8.5
        );

        documento.setTextColor(
            100,
            116,
            139
        );

        documento.text(
            "La matriz permite identificar los requisitos de certificación registrados para cada operario.",
            margen,
            25
        );


        const operarios =
            obtenerOperariosUnicos();


        const tipos =
            filtroCertificacion
                ? [filtroCertificacion]
                : tiposCertificacion;


        const encabezados =
            [
                "Documento",
                "Operario",
                ...tipos,
                "Estado general"
            ];


        const filasOperarios =
            operarios.map(
                (operario) => {

                    const estados =
                        tipos.map(
                            (tipo) => {

                                const registro =
                                    obtenerRegistroPorTipo(
                                        operario.documento,
                                        tipo
                                    );

                                if (!registro) {
                                    return "NO CERTIFICADO";
                                }

                                return obtenerEstado(
                                    registro
                                );

                            }
                        );


                    let estadoGeneral =
                        "CUMPLE";


                    if (
                        estados.some(
                            (estado) =>
                                estado ===
                                "NO CERTIFICADO"
                        )
                    ) {

                        estadoGeneral =
                            "NO CUMPLE";

                    } else if (
                        estados.some(
                            (estado) =>
                                estado ===
                                "VENCIDA"
                        )
                    ) {

                        estadoGeneral =
                            "PARCIAL";

                    }


                    return [
                        operario.documento,
                        operario.operario,
                        ...estados,
                        estadoGeneral
                    ];

                }
            );


        autoTable(
            documento,
            {

                startY: 32,

                head: [
                    encabezados
                ],

                body:
                    filasOperarios,

                theme: "grid",

                styles: {
                    fontSize: 7,
                    cellPadding: 3
                },

                headStyles: {
                    fillColor: [
                        18,
                        63,
                        104
                    ],
                    textColor: 255,
                    fontStyle: "bold"
                },

                alternateRowStyles: {
                    fillColor: [
                        244,
                        247,
                        251
                    ]
                },

                margin: {
                    left: margen,
                    right: margen
                },

                didParseCell: (
                    data
                ) => {

                    if (
                        data.section !==
                        "body"
                    ) {
                        return;
                    }

                    const texto =
                        String(
                            data.cell.raw
                        );


                    if (
                        texto ===
                        "VIGENTE"
                    ) {

                        data.cell.styles.textColor =
                            [
                                22,
                                101,
                                52
                            ];

                    }


                    if (
                        texto ===
                        "NO CERTIFICADO"
                    ) {

                        data.cell.styles.textColor =
                            [
                                185,
                                28,
                                28
                            ];

                    }


                    if (
                        texto ===
                        "VENCIDA"
                    ) {

                        data.cell.styles.textColor =
                            [
                                180,
                                83,
                                9
                            ];

                    }


                    if (
                        texto ===
                        "CUMPLE"
                    ) {

                        data.cell.styles.fontStyle =
                            "bold";

                    }


                    if (
                        texto ===
                        "NO CUMPLE"
                    ) {

                        data.cell.styles.fontStyle =
                            "bold";

                    }

                }

            }
        );


        // =====================================================
        // PÁGINA FINAL - DETALLE DE HISTORIAL
        // =====================================================

        documento.addPage();


        documento.setFontSize(
            15
        );

        documento.setTextColor(
            18,
            63,
            104
        );

        documento.text(
            "6. Detalle del historial de certificaciones",
            margen,
            18
        );


        documento.setFontSize(
            8.5
        );

        documento.setTextColor(
            100,
            116,
            139
        );

        documento.text(
            "Registro detallado utilizado como soporte del reporte.",
            margen,
            25
        );


        const filasHistorial =
            historialFiltrado.map(
                (registro) => [

                    registro.operario ||
                        "—",

                    registro.documento ||
                        "—",

                    registro.certificacion ||
                        "—",

                    formatearFecha(
                        registro.fechaExpedicion
                    ),

                    formatearFecha(
                        registro.fechaVigencia
                    ),

                    obtenerEstado(
                        registro
                    ),

                    registro.taller ||
                        "—",

                    registro.motivoNoCertificacion ||
                        "—"

                ]
            );


        autoTable(
            documento,
            {

                startY: 32,

                head: [[
                    "Operario",
                    "Documento",
                    "Certificación",
                    "Expedición",
                    "Vigencia",
                    "Estado",
                    "Taller",
                    "Motivo"
                ]],

                body:
                    filasHistorial,

                theme: "grid",

                styles: {
                    fontSize: 6.5,
                    cellPadding: 2.5
                },

                headStyles: {
                    fillColor: [
                        18,
                        63,
                        104
                    ],
                    textColor: 255,
                    fontStyle: "bold"
                },

                alternateRowStyles: {
                    fillColor: [
                        244,
                        247,
                        251
                    ]
                },

                margin: {
                    left: margen,
                    right: margen
                }

            }
        );


        // =====================================================
        // PIE DE TODAS LAS PÁGINAS
        // =====================================================

        const totalPaginas =
            documento.internal
                .getNumberOfPages();


        for (
            let pagina = 1;
            pagina <= totalPaginas;
            pagina++
        ) {

            documento.setPage(
                pagina
            );

            documento.setFontSize(
                7.5
            );

            documento.setTextColor(
                100,
                116,
                139
            );

            documento.text(
                `CertiSafe | Reporte técnico de cumplimiento | Página ${pagina} de ${totalPaginas}`,
                margen,
                202
            );

        }


        // =====================================================
        // DESCARGAR
        // =====================================================

        documento.save(
            "reporte-tecnico-cumplimiento-certificaciones.pdf"
        );

    };


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <section className="seccion-administrador historial-administrador">

            {/* =====================================================
                ENCABEZADO
            ===================================================== */}

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


                <button
                    className="boton-descargar-pdf"
                    onClick={descargarPDF}
                    disabled={
                        historialFiltrado.length === 0
                    }
                >
                    📄 Descargar reporte técnico
                </button>

            </div>


            {/* =====================================================
                FILTROS
            ===================================================== */}

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

                        <option value="NO_CERTIFICADO">
                            NO_CERTIFICADO
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


            {/* =====================================================
                CARGANDO
            ===================================================== */}

            {cargando && (

                <div className="mensaje-historial">
                    Cargando historial...
                </div>

            )}


            {/* =====================================================
                ERROR
            ===================================================== */}

            {error && (

                <div className="mensaje-error">
                    {error}
                </div>

            )}


            {/* =====================================================
                TABLA
            ===================================================== */}

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

                                        <th>
                                            Motivo
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

                                                    {registro.fechaExpedicion
                                                        ? formatearFecha(
                                                            registro.fechaExpedicion
                                                        )
                                                        : "—"}

                                                </td>

                                                <td>

                                                    {registro.fechaVigencia
                                                        ? formatearFecha(
                                                            registro.fechaVigencia
                                                        )
                                                        : "—"}

                                                </td>


                                                {/* =================================================
                                                    ESTADO
                                                ================================================= */}

                                                <td>

                                                    {obtenerEstado(
                                                        registro
                                                    ) ===
                                                    "VIGENTE" ? (

                                                        <span className="estado-historial estado-vigente">
                                                            VIGENTE
                                                        </span>

                                                    ) : obtenerEstado(
                                                        registro
                                                    ) ===
                                                    "NO_CERTIFICADO" ? (

                                                        <span className="estado-historial estado-no-certificado">
                                                            NO_CERTIFICADO
                                                        </span>

                                                    ) : obtenerEstado(
                                                        registro
                                                    ) ===
                                                    "VENCIDA" ? (

                                                        <span className="estado-historial estado-vencida">
                                                            VENCIDA
                                                        </span>

                                                    ) : (

                                                        <span className="estado-historial estado-pendiente">
                                                            {obtenerEstado(
                                                                registro
                                                            )}
                                                        </span>

                                                    )}

                                                </td>


                                                <td>
                                                    {
                                                        registro.taller
                                                    }
                                                </td>

                                                <td>

                                                    {
                                                        registro.motivoNoCertificacion ||
                                                        "—"
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