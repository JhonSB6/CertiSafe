import { useEffect, useState } from "react";
import "./AdministradorTalleres.css";
import AdministradorCrearTaller from "./AdministradorCrearTaller";
import AdministradorEditarTaller from "./AdministradorEditarTaller";
import AdministradorProgramarOperarios from "./AdministradorProgramarOperarios";
import AdministradorDetalleTaller from "./AdministradorDetalleTaller";


function AdministradorTalleres() {

    const [talleres, setTalleres] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    const [mostrarCrear, setMostrarCrear] = useState(false);

    const [mostrarEditar, setMostrarEditar] = useState(false);
    const [tallerEditar, setTallerEditar] = useState(null);

    const [tallerSeleccionado, setTallerSeleccionado] = useState(null);

    const [mostrarDetalle, setMostrarDetalle] = useState(false);
    const [tallerDetalle, setTallerDetalle] = useState(null);

    const [resumenes, setResumenes] = useState({});

    const [eliminando, setEliminando] = useState(null);


    // =========================================================
    // FILTROS
    // =========================================================

    const [filtroTipoTaller, setFiltroTipoTaller] = useState("");
    const [filtroCapacitador, setFiltroCapacitador] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("");


    // =========================================================
    // CARGAR TALLERES
    // =========================================================

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

            const ahora = new Date();


            // =================================================
            // ORDENAR TALLERES
            // =================================================

            const talleresOrdenados = [...datos].sort((a, b) => {

                const fechaA = new Date(
                    `${a.fecha}T${a.horaInicio}`
                );

                const fechaB = new Date(
                    `${b.fecha}T${b.horaInicio}`
                );

                const futuroA = fechaA >= ahora;
                const futuroB = fechaB >= ahora;


                // ==========================================
                // PRIMERO LOS TALLERES FUTUROS
                // ==========================================

                if (futuroA && !futuroB) {
                    return -1;
                }

                if (!futuroA && futuroB) {
                    return 1;
                }


                // ==========================================
                // PRÓXIMOS: MÁS CERCANO PRIMERO
                // ==========================================

                if (futuroA && futuroB) {
                    return fechaA - fechaB;
                }


                // ==========================================
                // PASADOS: MÁS RECIENTE PRIMERO
                // ==========================================

                return fechaB - fechaA;

            });


            // =================================================
            // GUARDAR TALLERES
            // =================================================

            setTalleres(talleresOrdenados);


            // =================================================
            // CARGAR RESUMEN DE CADA TALLER
            // =================================================

            const nuevosResumenes = {};

            for (const taller of talleresOrdenados) {

                try {

                    const respuestaResumen = await fetch(
                        `http://localhost:8080/api/talleres/${taller.idtaller}/resumen`
                    );

                    if (respuestaResumen.ok) {

                        const resumen =
                            await respuestaResumen.json();

                        nuevosResumenes[
                            taller.idtaller
                            ] = resumen;

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


    // =========================================================
    // CARGAR AL ENTRAR
    // =========================================================

    useEffect(() => {

        cargarTalleres();

    }, []);


    // =========================================================
    // OPCIONES DE FILTRO
    // =========================================================

    const tiposTaller = [
        ...new Map(
            talleres
                .filter(
                    (taller) =>
                        taller.tipoCertificacion?.nombre
                )
                .map(
                    (taller) => [
                        taller.tipoCertificacion.nombre,
                        taller.tipoCertificacion.nombre
                    ]
                )
        ).values()
    ].sort((a, b) =>
        a.localeCompare(b)
    );


    const capacitadores = [
        ...new Map(
            talleres
                .filter(
                    (taller) =>
                        taller.capacitador
                )
                .map(
                    (taller) => {

                        const nombreCompleto =
                            `${taller.capacitador.nombre} ${taller.capacitador.apellido}`;

                        return [
                            taller.capacitador.idusuario,
                            {
                                id:
                                taller.capacitador.idusuario,
                                nombre:
                                nombreCompleto
                            }
                        ];

                    }
                )
        ).values()
    ].sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
    );


    const estadosTaller = [
        ...new Set(
            talleres
                .map(
                    (taller) =>
                        taller.estado
                )
                .filter(Boolean)
        )
    ].sort();


    // =========================================================
    // FILTRAR TALLERES
    // =========================================================

    const talleresFiltrados = talleres.filter(
        (taller) => {

            // =================================================
            // FILTRO TIPO DE TALLER
            // =================================================

            const coincideTipo =
                !filtroTipoTaller ||
                taller.tipoCertificacion?.nombre ===
                filtroTipoTaller;


            // =================================================
            // FILTRO CAPACITADOR
            // =================================================

            const coincideCapacitador =
                !filtroCapacitador ||
                String(
                    taller.capacitador?.idusuario
                ) ===
                String(filtroCapacitador);


            // =================================================
            // FILTRO ESTADO
            // =================================================

            const coincideEstado =
                !filtroEstado ||
                taller.estado === filtroEstado;


            return (
                coincideTipo &&
                coincideCapacitador &&
                coincideEstado
            );

        }
    );


    // =========================================================
    // LIMPIAR FILTROS
    // =========================================================

    const limpiarFiltros = () => {

        setFiltroTipoTaller("");
        setFiltroCapacitador("");
        setFiltroEstado("");

    };


    const hayFiltrosActivos =
        filtroTipoTaller ||
        filtroCapacitador ||
        filtroEstado;


    // =========================================================
    // ELIMINAR TALLER
    // =========================================================

    const eliminarTaller = async (taller) => {

        if (taller.estado !== "PROGRAMADO") {

            alert(
                "Solo se pueden eliminar talleres en estado PROGRAMADO."
            );

            return;
        }

        const confirmar = window.confirm(
            `¿Está seguro de eliminar el taller "${taller.nombre}"?\n\nEsta acción no se puede deshacer.`
        );

        if (!confirmar) {
            return;
        }

        setEliminando(taller.idtaller);

        try {

            const respuesta = await fetch(
                `http://localhost:8080/api/talleres/${taller.idtaller}`,
                {
                    method: "DELETE"
                }
            );

            if (!respuesta.ok) {

                let mensaje =
                    "No fue posible eliminar el taller.";

                try {

                    const texto =
                        await respuesta.text();

                    if (texto) {
                        mensaje = texto;
                    }

                } catch (error) {

                    console.error(
                        "No fue posible leer el mensaje del servidor:",
                        error
                    );

                }

                throw new Error(mensaje);

            }

            await cargarTalleres();

        } catch (error) {

            console.error(
                "Error eliminando taller:",
                error
            );

            alert(
                error.message ||
                "No fue posible eliminar el taller."
            );

        } finally {

            setEliminando(null);

        }

    };


    // =========================================================
    // VISTA CREAR TALLER
    // =========================================================

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


    // =========================================================
    // VISTA EDITAR TALLER
    // =========================================================

    if (mostrarEditar && tallerEditar) {

        return (
            <AdministradorEditarTaller
                taller={tallerEditar}
                volver={() => {

                    setMostrarEditar(false);

                    setTallerEditar(null);

                    cargarTalleres();

                }}
            />
        );

    }


    // =========================================================
    // VISTA PROGRAMAR OPERARIOS
    // =========================================================

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


    // =========================================================
    // VISTA DETALLE TALLER
    // =========================================================

    if (mostrarDetalle && tallerDetalle) {

        return (
            <AdministradorDetalleTaller
                taller={tallerDetalle}
                volver={() => {

                    setMostrarDetalle(false);

                    setTallerDetalle(null);

                    cargarTalleres();

                }}
            />
        );

    }


    // =========================================================
    // VISTA PRINCIPAL
    // =========================================================

    return (

        <section className="seccion-administrador">


            {/* =================================================
                ENCABEZADO
            ================================================= */}

            <div className="talleres-header">

                <div>

                    <h1>
                        Talleres
                    </h1>

                    <p>
                        Gestiona los talleres de capacitación
                        disponibles en CertiSafe.
                    </p>

                </div>


                <div className="talleres-total">

                    <strong>
                        {talleres.length}
                    </strong>

                    <span>
                        talleres
                    </span>

                </div>

            </div>


            {/* =================================================
                CREAR TALLER
            ================================================= */}

            <button
                className="boton-crear-taller"
                onClick={() =>
                    setMostrarCrear(true)
                }
            >
                + Crear nuevo taller
            </button>


            {/* =================================================
                FILTROS
            ================================================= */}

            <div className="talleres-filtros">


                {/* =============================================
                    TIPO DE TALLER
                ============================================= */}

                <div className="campo-filtro">

                    <label htmlFor="filtroTipoTaller">
                        Tipo de taller
                    </label>

                    <select
                        id="filtroTipoTaller"
                        value={filtroTipoTaller}
                        onChange={(e) =>
                            setFiltroTipoTaller(
                                e.target.value
                            )
                        }
                    >

                        <option value="">
                            Todos los tipos
                        </option>

                        {tiposTaller.map(
                            (tipo) => (

                                <option
                                    key={tipo}
                                    value={tipo}
                                >
                                    {tipo}
                                </option>

                            )
                        )}

                    </select>

                </div>


                {/* =============================================
                    CAPACITADOR
                ============================================= */}

                <div className="campo-filtro">

                    <label htmlFor="filtroCapacitador">
                        Capacitador
                    </label>

                    <select
                        id="filtroCapacitador"
                        value={filtroCapacitador}
                        onChange={(e) =>
                            setFiltroCapacitador(
                                e.target.value
                            )
                        }
                    >

                        <option value="">
                            Todos los capacitadores
                        </option>

                        {capacitadores.map(
                            (capacitador) => (

                                <option
                                    key={capacitador.id}
                                    value={capacitador.id}
                                >
                                    {capacitador.nombre}
                                </option>

                            )
                        )}

                    </select>

                </div>


                {/* =============================================
                    ESTADO
                ============================================= */}

                <div className="campo-filtro">

                    <label htmlFor="filtroEstado">
                        Estado del taller
                    </label>

                    <select
                        id="filtroEstado"
                        value={filtroEstado}
                        onChange={(e) =>
                            setFiltroEstado(
                                e.target.value
                            )
                        }
                    >

                        <option value="">
                            Todos los estados
                        </option>

                        {estadosTaller.map(
                            (estado) => (

                                <option
                                    key={estado}
                                    value={estado}
                                >
                                    {estado}
                                </option>

                            )
                        )}

                    </select>

                </div>


                {/* =============================================
                    LIMPIAR
                ============================================= */}

                <button
                    className="boton-limpiar-filtro-taller"
                    onClick={limpiarFiltros}
                    disabled={!hayFiltrosActivos}
                >
                    Limpiar filtros
                </button>

            </div>


            {/* =================================================
                RESULTADOS DEL FILTRO
            ================================================= */}

            {!cargando &&
                !error &&
                talleres.length > 0 && (

                    <div className="resultado-filtros-talleres">

                        <span>
                            Mostrando
                        </span>

                        <strong>
                            {talleresFiltrados.length}
                        </strong>

                        <span>
                            de
                        </span>

                        <strong>
                            {talleres.length}
                        </strong>

                        <span>
                            talleres
                        </span>

                    </div>

                )}


            {/* =================================================
                CARGANDO
            ================================================= */}

            {cargando && (

                <p>
                    Cargando talleres...
                </p>

            )}


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <p className="mensaje-error">
                    {error}
                </p>

            )}


            {/* =================================================
                SIN TALLERES
            ================================================= */}

            {!cargando &&
                !error &&
                talleres.length === 0 && (

                    <p>
                        No hay talleres registrados.
                    </p>

                )}


            {/* =================================================
                SIN RESULTADOS DEL FILTRO
            ================================================= */}

            {!cargando &&
                !error &&
                talleres.length > 0 &&
                talleresFiltrados.length === 0 && (

                    <div className="mensaje-talleres-vacio">

                        <h3>
                            No se encontraron talleres
                        </h3>

                        <p>
                            No hay talleres que coincidan
                            con los filtros seleccionados.
                        </p>

                        <button
                            onClick={limpiarFiltros}
                        >
                            Limpiar filtros
                        </button>

                    </div>

                )}


            {/* =================================================
                TARJETAS DE TALLERES
            ================================================= */}

            {!cargando &&
                !error &&
                talleresFiltrados.length > 0 && (

                    <div className="tarjetas-talleres-admin">

                        {talleresFiltrados.map(
                            (taller) => (

                                <article
                                    className="taller-admin-card"
                                    key={taller.idtaller}
                                >


                                    {/* =============================================
                                        NOMBRE
                                    ============================================= */}

                                    <h2>
                                        {taller.nombre}
                                    </h2>


                                    {/* =============================================
                                        DESCRIPCIÓN
                                    ============================================= */}

                                    <p>
                                        {taller.descripcion}
                                    </p>


                                    {/* =============================================
                                        FECHA
                                    ============================================= */}

                                    <p>

                                        <strong>
                                            Fecha:
                                        </strong>{" "}

                                        {taller.fecha}

                                    </p>


                                    {/* =============================================
                                        HORARIO
                                    ============================================= */}

                                    <p>

                                        <strong>
                                            Horario:
                                        </strong>{" "}

                                        {taller.horaInicio}

                                        {" - "}

                                        {taller.horaFin}

                                    </p>


                                    {/* =============================================
                                        AFORO
                                    ============================================= */}

                                    <p>

                                        <strong>
                                            Aforo:
                                        </strong>{" "}

                                        {taller.aforo}

                                    </p>


                                    {/* =============================================
                                        CERTIFICACIÓN
                                    ============================================= */}

                                    <p>

                                        <strong>
                                            Certificación:
                                        </strong>{" "}

                                        {
                                            taller
                                                .tipoCertificacion
                                                ?.nombre
                                        }

                                    </p>


                                    {/* =============================================
                                        ESTADO
                                    ============================================= */}

                                    <p>

                                        <strong>
                                            Estado:
                                        </strong>{" "}

                                        <span
                                            className={
                                                taller.estado ===
                                                "PROGRAMADO"

                                                    ? "estado-taller-programado"

                                                    : taller.estado ===
                                                    "EN_CURSO"

                                                        ? "estado-taller-en-curso"

                                                        : taller.estado ===
                                                        "FINALIZADO"

                                                            ? "estado-taller-finalizado"

                                                            : taller.estado ===
                                                            "CANCELADO"

                                                                ? "estado-taller-cancelado"

                                                                : "estado-taller"
                                            }
                                        >
                                            {taller.estado}
                                        </span>

                                    </p>


                                    {/* =============================================
                                        CAPACITADOR
                                    ============================================= */}

                                    <p>

                                        <strong>
                                            Capacitador:
                                        </strong>{" "}

                                        {taller.capacitador

                                            ? `${taller.capacitador.nombre} ${taller.capacitador.apellido}`

                                            : "Sin asignar"

                                        }

                                    </p>


                                    {/* =============================================
                                        RESUMEN AFORO
                                    ============================================= */}

                                    {resumenes[
                                        taller.idtaller
                                        ] && (

                                        <div className="resumen-aforo">

                                            <p>

                                                <strong>
                                                    Aforo:
                                                </strong>{" "}

                                                {
                                                    resumenes[
                                                        taller.idtaller
                                                        ].aforo
                                                }

                                            </p>


                                            <p>

                                                <strong>
                                                    Programados:
                                                </strong>{" "}

                                                {
                                                    resumenes[
                                                        taller.idtaller
                                                        ].programados
                                                }

                                                {" / "}

                                                {
                                                    resumenes[
                                                        taller.idtaller
                                                        ].aforo
                                                }

                                            </p>


                                            <p>

                                                <strong>
                                                    Confirmados:
                                                </strong>{" "}

                                                {
                                                    resumenes[
                                                        taller.idtaller
                                                        ].confirmados
                                                }

                                                {" / "}

                                                {
                                                    resumenes[
                                                        taller.idtaller
                                                        ].aforo
                                                }

                                            </p>


                                            <p>

                                                <strong>
                                                    Pendientes:
                                                </strong>{" "}

                                                {
                                                    resumenes[
                                                        taller.idtaller
                                                        ].pendientes
                                                }

                                            </p>

                                        </div>

                                    )}


                                    {/* =============================================
                                        ACCIONES
                                    ============================================= */}

                                    <div className="acciones-taller-admin">


                                        {/* =============================================
                                            DETALLE TALLER
                                        ============================================= */}

                                        <button
                                            className="boton-detalle-taller"
                                            onClick={() => {

                                                setTallerDetalle(
                                                    taller
                                                );

                                                setMostrarDetalle(
                                                    true
                                                );

                                            }}
                                        >
                                            Detalle taller
                                        </button>


                                        {/* =============================================
                                            EDITAR TALLER
                                        ============================================= */}

                                        {taller.estado ===
                                        "PROGRAMADO" ? (

                                            <button
                                                className="boton-editar-taller"
                                                onClick={() => {

                                                    setTallerEditar(
                                                        taller
                                                    );

                                                    setMostrarEditar(
                                                        true
                                                    );

                                                }}
                                            >
                                                Editar taller
                                            </button>

                                        ) : (

                                            <button
                                                className="boton-editar-taller boton-deshabilitado"
                                                disabled
                                                title="El taller ya está en curso, finalizado o cancelado"
                                            >
                                                Edición cerrada
                                            </button>

                                        )}


                                        {/* =============================================
                                            PROGRAMAR OPERARIOS
                                        ============================================= */}

                                        {taller.estado ===
                                        "PROGRAMADO" ? (

                                            <button
                                                className="boton-programar-taller"
                                                onClick={() =>
                                                    setTallerSeleccionado(
                                                        taller
                                                    )
                                                }
                                            >
                                                Programar operarios
                                            </button>

                                        ) : (

                                            <button
                                                className="boton-programar-taller boton-deshabilitado"
                                                disabled
                                                title="La programación de operarios está cerrada"
                                            >
                                                🔒 Programación cerrada
                                            </button>

                                        )}


                                        {/* =============================================
                                            ELIMINAR TALLER
                                        ============================================= */}

                                        {taller.estado ===
                                            "PROGRAMADO" && (

                                                <button
                                                    className="boton-eliminar-taller"
                                                    disabled={
                                                        eliminando ===
                                                        taller.idtaller
                                                    }
                                                    onClick={() =>
                                                        eliminarTaller(
                                                            taller
                                                        )
                                                    }
                                                >

                                                    {eliminando ===
                                                    taller.idtaller

                                                        ? "Eliminando..."

                                                        : "Eliminar taller"

                                                    }

                                                </button>

                                            )}

                                    </div>

                                </article>

                            )
                        )}

                    </div>

                )}

        </section>
    );
}

export default AdministradorTalleres;