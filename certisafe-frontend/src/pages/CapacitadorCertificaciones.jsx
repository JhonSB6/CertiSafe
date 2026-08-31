import { useEffect, useState } from "react";
import "./CapacitadorCertificaciones.css";
import PerfilUsuario from "../components/PerfilUsuario";
import MenuUsuario from "../components/MenuUsuario";

function CapacitadorCertificaciones({
    usuario,
    cerrarSesion,
    actualizarUsuario
}) {

    const [vistaActual, setVistaActual] = useState("inicio");

    const [talleresActivos, setTalleresActivos] = useState([]);
    const [talleresFinalizados, setTalleresFinalizados] = useState([]);

    const [cargando, setCargando] = useState(true);
    const [mensaje, setMensaje] = useState("");

    const [asistencias, setAsistencias] = useState([]);
    const [tallerSeleccionado, setTallerSeleccionado] = useState(null);
    const [cargandoAsistencias, setCargandoAsistencias] = useState(false);

    // =========================================================
    // MODAL NO CERTIFICAR
    // =========================================================

    const [modalNoCertificar, setModalNoCertificar] = useState(false);
    const [asistenciaNoCertificar, setAsistenciaNoCertificar] =
        useState(null);

    const [motivoNoCertificacion, setMotivoNoCertificacion] =
        useState("");

    const [procesandoDecision, setProcesandoDecision] =
        useState(false);


    // =========================================================
    // CARGAR TALLERES DEL CAPACITADOR
    // =========================================================

    useEffect(() => {

        const cargarTalleres = async () => {

            try {

                setCargando(true);
                setMensaje("");

                const idCapacitador =
                    usuario?.idUsuario ?? usuario?.idusuario;

                if (!idCapacitador) {
                    throw new Error(
                        "No se encontró el ID del capacitador."
                    );
                }


                // =================================================
                // TALLERES ACTIVOS
                // PROGRAMADO + EN_CURSO
                // =================================================

                const respuestaActivos = await fetch(
                    `http://localhost:8080/api/talleres/capacitador/${idCapacitador}/activos`
                );

                if (!respuestaActivos.ok) {

                    throw new Error(
                        "No fue posible cargar los talleres activos."
                    );
                }

                const datosActivos =
                    await respuestaActivos.json();

                console.log(
                    "TALLERES ACTIVOS DEL CAPACITADOR:",
                    datosActivos
                );

                setTalleresActivos(datosActivos);


                // =================================================
                // TALLERES FINALIZADOS
                // =================================================

                const respuestaFinalizados = await fetch(
                    `http://localhost:8080/api/talleres/capacitador/${idCapacitador}/finalizados`
                );

                if (!respuestaFinalizados.ok) {

                    throw new Error(
                        "No fue posible cargar los talleres finalizados."
                    );
                }

                const datosFinalizados =
                    await respuestaFinalizados.json();

                console.log(
                    "TALLERES FINALIZADOS:",
                    datosFinalizados
                );

                setTalleresFinalizados(
                    datosFinalizados
                );

            } catch (error) {

                console.error(
                    "ERROR CARGANDO TALLERES:",
                    error
                );

                setMensaje(
                    error.message ||
                    "No fue posible cargar los talleres."
                );

            } finally {

                setCargando(false);
            }
        };


        if (
            usuario?.idUsuario ||
            usuario?.idusuario
        ) {
            cargarTalleres();
        }

    }, [
        usuario?.idUsuario,
        usuario?.idusuario
    ]);


    // =========================================================
    // RECARGAR TALLERES
    // =========================================================

    const recargarTalleres = async () => {

        try {

            const idCapacitador =
                usuario?.idUsuario ?? usuario?.idusuario;

            if (!idCapacitador) {
                return;
            }


            const respuestaActivos = await fetch(
                `http://localhost:8080/api/talleres/capacitador/${idCapacitador}/activos`
            );

            if (respuestaActivos.ok) {

                const datosActivos =
                    await respuestaActivos.json();

                setTalleresActivos(datosActivos);
            }


            const respuestaFinalizados = await fetch(
                `http://localhost:8080/api/talleres/capacitador/${idCapacitador}/finalizados`
            );

            if (respuestaFinalizados.ok) {

                const datosFinalizados =
                    await respuestaFinalizados.json();

                setTalleresFinalizados(
                    datosFinalizados
                );
            }

        } catch (error) {

            console.error(
                "ERROR ACTUALIZANDO TALLERES:",
                error
            );
        }
    };


    // =========================================================
    // INICIAR TALLER
    // =========================================================

    const iniciarTaller = async (taller) => {

        try {

            setMensaje("");

            const respuesta = await fetch(
                `http://localhost:8080/api/talleres/${taller.idtaller}/iniciar?forzarInicio=false`,
                {
                    method: "POST"
                }
            );

            // =====================================================
            // RESPUESTA CON ERROR DE NEGOCIO
            // =====================================================

            if (!respuesta.ok) {

                let mensajeError =
                    "No fue posible iniciar el taller. Falta aforo para completar";

                try {

                    const datosError =
                        await respuesta.json();

                    if (datosError?.mensaje) {

                        mensajeError =
                            datosError.mensaje;

                    }

                } catch {

                    const textoError =
                        await respuesta.text();

                    if (textoError) {
                        mensajeError = textoError;
                    }
                }

                throw new Error(mensajeError);
            }


            // =====================================================
            // INICIO CORRECTO
            // =====================================================

            setMensaje(
                `El taller "${taller.nombre}" fue iniciado correctamente.`
            );

            await recargarTalleres();

        } catch (error) {

            console.error(
                "ERROR INICIANDO TALLER:",
                error
            );

            setMensaje(
                error.message ||
                "No fue posible iniciar el taller."
            );
        }
    };

    // =========================================================
    // FINALIZAR TALLER
    // =========================================================

    const finalizarTaller = async (taller) => {

        try {

            setMensaje("");

            const respuesta = await fetch(
                `http://localhost:8080/api/talleres/${taller.idtaller}/finalizar`,
                {
                    method: "PUT"
                }
            );

            // =====================================================
            // RESPUESTA CON ERROR DE NEGOCIO
            // =====================================================

            if (!respuesta.ok) {

                let mensajeError =
                    "No fue posible finalizar el taller.";

                try {

                    const datosError =
                        await respuesta.json();

                    if (datosError?.mensaje) {

                        mensajeError =
                            datosError.mensaje;

                    }

                } catch {

                    const textoError =
                        await respuesta.text();

                    if (textoError) {
                        mensajeError = textoError;
                    }
                }

                throw new Error(mensajeError);
            }


            // =====================================================
            // FINALIZACIÓN CORRECTA
            // =====================================================

            setMensaje(
                `El taller "${taller.nombre}" fue finalizado correctamente.`
            );

            await recargarTalleres();

        } catch (error) {

            console.error(
                "ERROR FINALIZANDO TALLER:",
                error
            );

            setMensaje(
                error.message ||
                "No fue posible finalizar el taller."
            );
        }
    };


    // =========================================================
    // CARGAR OPERARIOS PRESENTES
    // =========================================================

    const cargarAsistencias = async (taller) => {

        try {

            setCargandoAsistencias(true);
            setMensaje("");

            const respuesta = await fetch(
                `http://localhost:8080/api/asistencias/taller/${taller.idtaller}/presentes`
            );

            if (!respuesta.ok) {

                throw new Error(
                    "No fue posible cargar los operarios."
                );
            }

            const datos = await respuesta.json();

            console.log(
                "ASISTENCIA COMPLETA:",
                JSON.stringify(datos, null, 2)
            );


            // =================================================
            // ID TIPO CERTIFICACIÓN
            // =================================================

            const tipoCertificacion =
                taller
                    ?.tipoCertificacion
                    ?.idTipoCertificacion;


            // =================================================
            // VERIFICAR CERTIFICACIÓN
            // =================================================

            const asistenciasConCertificacion =
                await Promise.all(

                    datos.map(async (asistencia) => {

                        const idUsuario =
                            asistencia?.usuario?.idUsuario ??
                            asistencia?.usuario?.idusuario;


                        // =================================================
                        // SI NO VIENE USUARIO
                        // =================================================

                        if (!idUsuario) {

                            console.error(
                                "ASISTENCIA SIN ID DE USUARIO:",
                                asistencia
                            );

                            return {
                                ...asistencia,
                                estadoCertificacion:
                                    "NO_CERTIFICADO",
                                decisionCertificacion:
                                    asistencia.decisionCertificacion ??
                                    null
                            };
                        }


                        // =================================================
                        // VERIFICAR CERTIFICACIÓN EXISTENTE
                        // =================================================

                        try {

                            const respuestaCertificacion =
                                await fetch(
                                    `http://localhost:8080/api/certificaciones/verificar/${idUsuario}/${tipoCertificacion}`
                                );


                            if (!respuestaCertificacion.ok) {

                                return {
                                    ...asistencia,
                                    estadoCertificacion:
                                        "NO_CERTIFICADO",
                                    decisionCertificacion:
                                        asistencia.decisionCertificacion ??
                                        null
                                };
                            }


                            const certificado =
                                await respuestaCertificacion.json();


                            return {

                                ...asistencia,

                                estadoCertificacion:
                                    certificado
                                        ? "CERTIFICADO"
                                        : "NO_CERTIFICADO",

                                decisionCertificacion:
                                    asistencia.decisionCertificacion ??
                                    null
                            };

                        } catch (error) {

                            console.error(
                                "ERROR VERIFICANDO CERTIFICACIÓN:",
                                error
                            );

                            return {

                                ...asistencia,

                                estadoCertificacion:
                                    "NO_CERTIFICADO",

                                decisionCertificacion:
                                    asistencia.decisionCertificacion ??
                                    null
                            };
                        }

                    })

                );


            setAsistencias(
                asistenciasConCertificacion
            );

            setTallerSeleccionado(
                taller.idtaller
            );

        } catch (error) {

            console.error(
                "ERROR CARGANDO ASISTENCIAS:",
                error
            );

            setMensaje(
                error.message ||
                "No fue posible cargar los operarios presentes."
            );

        } finally {

            setCargandoAsistencias(false);
        }
    };


    // =========================================================
    // CERTIFICAR OPERARIO
    // =========================================================

    const certificarOperario = async (asistencia) => {

        try {

            const idTaller =
                asistencia.taller?.idtaller ??
                asistencia.idtaller;

            const idAsistencia =
                asistencia.idasistencia;

            const idCapacitador =
                usuario?.idUsuario ??
                usuario?.idusuario;


            // =================================================
            // REGISTRAR DECISIÓN
            // =================================================

            const respuestaDecision = await fetch(
                `http://localhost:8080/api/asistencias/${idAsistencia}/decision-certificacion?decision=CERTIFICADO`,
                {
                    method: "PATCH"
                }
            );

            if (!respuestaDecision.ok) {

                const mensajeError =
                    await respuestaDecision.text();

                throw new Error(
                    mensajeError ||
                    "No fue posible registrar la decisión."
                );
            }


            // =================================================
            // CREAR CERTIFICACIÓN
            // =================================================

            const url =
                `http://localhost:8080/api/certificaciones/certificar/${idTaller}/${idAsistencia}/${idCapacitador}`;

            console.log(
                "CERTIFICANDO:",
                url
            );


            const respuesta = await fetch(
                url,
                {
                    method: "POST"
                }
            );


            if (!respuesta.ok) {

                const mensajeError =
                    await respuesta.text();

                throw new Error(
                    mensajeError ||
                    "No fue posible certificar al operario."
                );
            }


            const certificacion =
                await respuesta.json();

            console.log(
                "CERTIFICACIÓN CREADA:",
                certificacion
            );


            // =================================================
            // ACTUALIZAR VISUALMENTE
            // =================================================

            setAsistencias(
                (asistenciasActuales) =>
                    asistenciasActuales.map(
                        (item) =>

                            item.idasistencia ===
                            asistencia.idasistencia

                                ? {
                                    ...item,

                                    estadoCertificacion:
                                        "CERTIFICADO",

                                    decisionCertificacion:
                                        "CERTIFICADO"
                                }

                                : item
                    )
            );


            const nombre =
                asistencia.usuario?.nombre ?? "";

            const apellido =
                asistencia.usuario?.apellido ?? "";


            setMensaje(
                `${nombre} ${apellido} fue certificado correctamente.`
            );

        } catch (error) {

            console.error(
                "ERROR CERTIFICANDO:",
                error
            );

            setMensaje(
                error.message ||
                "No fue posible certificar al operario."
            );
        }
    };


    // =========================================================
    // ABRIR MODAL NO CERTIFICAR
    // =========================================================

    const abrirModalNoCertificar = (asistencia) => {

        setAsistenciaNoCertificar(
            asistencia
        );

        setMotivoNoCertificacion("");

        setModalNoCertificar(true);

        setMensaje("");
    };


    // =========================================================
    // CERRAR MODAL
    // =========================================================

    const cerrarModalNoCertificar = () => {

        if (procesandoDecision) {
            return;
        }

        setModalNoCertificar(false);

        setAsistenciaNoCertificar(null);

        setMotivoNoCertificacion("");
    };


    // =========================================================
    // REGISTRAR NO CERTIFICACIÓN
    // =========================================================

    const confirmarNoCertificar = async () => {

        if (
            !asistenciaNoCertificar
        ) {
            return;
        }


        const motivo =
            motivoNoCertificacion.trim();


        if (!motivo) {

            setMensaje(
                "Debe ingresar el motivo de la no certificación."
            );

            return;
        }


        try {

            setProcesandoDecision(true);

            const idAsistencia =
                asistenciaNoCertificar.idasistencia;


            /*
             * El motivo se envía junto con la decisión.
             * Se utiliza encodeURIComponent para evitar
             * problemas con espacios y caracteres especiales.
             */

            const respuesta = await fetch(
                `http://localhost:8080/api/asistencias/${idAsistencia}/decision-certificacion?decision=NO_CERTIFICADO&motivo=${encodeURIComponent(motivo)}`,
                {
                    method: "PATCH"
                }
            );


            if (!respuesta.ok) {

                const mensajeError =
                    await respuesta.text();

                throw new Error(
                    mensajeError ||
                    "No fue posible registrar la no certificación."
                );
            }


            // =================================================
            // ACTUALIZAR ESTADO VISUAL
            // =================================================

            setAsistencias(
                (asistenciasActuales) =>
                    asistenciasActuales.map(
                        (item) =>

                            item.idasistencia ===
                            idAsistencia

                                ? {
                                    ...item,

                                    estadoCertificacion:
                                        "NO_CERTIFICADO",

                                    decisionCertificacion:
                                        "NO_CERTIFICADO",

                                    motivoNoCertificacion:
                                        motivo
                                }

                                : item
                    )
            );


            const nombre =
                asistenciaNoCertificar.usuario?.nombre ??
                "";

            const apellido =
                asistenciaNoCertificar.usuario?.apellido ??
                "";


            setModalNoCertificar(false);

            setAsistenciaNoCertificar(null);

            setMotivoNoCertificacion("");


            setMensaje(
                `${nombre} ${apellido} no fue certificado.`
            );

        } catch (error) {

            console.error(
                "ERROR NO CERTIFICANDO:",
                error
            );

            setMensaje(
                error.message ||
                "No fue posible registrar la no certificación."
            );

        } finally {

            setProcesandoDecision(false);
        }
    };


    // =========================================================
    // CERRAR OPERARIOS
    // =========================================================

    const cerrarOperarios = () => {

        setTallerSeleccionado(null);

        setAsistencias([]);

        setMensaje("");
    };


    // =========================================================
    // CARGANDO
    // =========================================================

    if (cargando) {

        return (

            <div className="dashboard-capacitador">

                <aside className="menu-capacitador">

                    <div className="logo-capacitador">
                        CERTISAFE
                    </div>

                    <nav>

                        <button
                            className={
                                vistaActual === "talleres"
                                    ? "menu-capacitador-activo"
                                    : ""
                            }
                            onClick={() =>
                                setVistaActual("talleres")
                            }
                        >
                            📚
                            <span>
                                Mis talleres
                            </span>
                        </button>


                        <button
                            className={
                                vistaActual === "certificaciones"
                                    ? "menu-capacitador-activo"
                                    : ""
                            }
                            onClick={() =>
                                setVistaActual(
                                    "certificaciones"
                                )
                            }
                        >
                            🏆
                            <span>
                                Certificaciones
                            </span>
                        </button>

                    </nav>

                </aside>


                <main className="contenido-capacitador">

                    <header className="header-capacitador">

                        <MenuUsuario
                            usuario={usuario}
                            onPerfil={() =>
                                setVistaActual("perfil")
                            }
                            onCerrarSesion={cerrarSesion}
                        />

                    </header>


                    <section className="seccion-capacitador">

                        <h1>
                            Cargando...
                        </h1>

                        <p>
                            Cargando información del capacitador...
                        </p>

                    </section>

                </main>

            </div>
        );
    }


    // =========================================================
    // VISTA PRINCIPAL
    // =========================================================

    return (

        <div className="dashboard-capacitador">


            {/* =================================================
                MENÚ LATERAL
            ================================================= */}

            <aside className="menu-capacitador">

                <div className="logo-capacitador">
                    CERTISAFE
                </div>


                <nav>

                    <button
                        className={
                            vistaActual === "talleres"
                                ? "menu-capacitador-activo"
                                : ""
                        }
                        onClick={() =>
                            setVistaActual("talleres")
                        }
                    >
                        📚
                        <span>
                            Mis talleres
                        </span>
                    </button>


                    <button
                        className={
                            vistaActual === "certificaciones"
                                ? "menu-capacitador-activo"
                                : ""
                        }
                        onClick={() =>
                            setVistaActual(
                                "certificaciones"
                            )
                        }
                    >
                        🏆
                        <span>
                            Certificaciones
                        </span>
                    </button>

                </nav>

            </aside>


            {/* =================================================
                CONTENIDO
            ================================================= */}

            <main className="contenido-capacitador">

                <header className="header-capacitador">

                    <MenuUsuario
                        usuario={usuario}
                        onPerfil={() =>
                            setVistaActual("perfil")
                        }
                        onCerrarSesion={cerrarSesion}
                    />

                </header>


                {/* =================================================
                    INICIO
                ================================================= */}

                {vistaActual === "inicio" && (

                    <section className="seccion-capacitador">

                        <h1>
                            Bienvenido,{" "}
                            {usuario?.nombre}
                        </h1>

                        <p>
                            Desde aquí puedes administrar tus
                            talleres y certificar a los operarios
                            que asistieron.
                        </p>


                        <div className="tarjetas-resumen-capacitador">

                            <article className="resumen-capacitador-card">

                                <h3>
                                    Mis talleres
                                </h3>

                                <p>
                                    Consulta tus talleres programados
                                    y en curso.
                                </p>

                                <button
                                    onClick={() =>
                                        setVistaActual(
                                            "talleres"
                                        )
                                    }
                                >
                                    Ver mis talleres
                                </button>

                            </article>


                            <article className="resumen-capacitador-card">

                                <h3>
                                    Certificaciones
                                </h3>

                                <p>
                                    Certifica a los operarios
                                    presentes en tus talleres
                                    finalizados.
                                </p>

                                <button
                                    onClick={() =>
                                        setVistaActual(
                                            "certificaciones"
                                        )
                                    }
                                >
                                    Ver certificaciones
                                </button>

                            </article>

                        </div>

                    </section>

                )}


                {/* =================================================
                    MIS TALLERES
                ================================================= */}

                {vistaActual === "talleres" && (

                    <section className="seccion-capacitador">

                        <h1>
                            Mis talleres
                        </h1>

                        <p>
                            Administra tus talleres programados
                            y en curso.
                        </p>


                        {mensaje && (

                            <p className="mensaje-certificacion">
                                {mensaje}
                            </p>

                        )}


                        {talleresActivos.length === 0 ? (

                            <div className="capacitador-vacio">

                                No tienes talleres programados
                                o en curso actualmente.

                            </div>

                        ) : (

                            <div className="talleres-container">

                                {talleresActivos.map(
                                    (taller) => (

                                        <article
                                            className="taller-card"
                                            key={
                                                taller.idtaller
                                            }
                                        >

                                            <h3>
                                                {taller.nombre}
                                            </h3>


                                            <p className="taller-descripcion">
                                                {taller.descripcion}
                                            </p>


                                            <div className="taller-info">

                                                <p>
                                                    <strong>
                                                        Fecha:
                                                    </strong>{" "}
                                                    {taller.fecha}
                                                </p>


                                                <p>
                                                    <strong>
                                                        Horario:
                                                    </strong>{" "}
                                                    {taller.horaInicio}
                                                    {" - "}
                                                    {taller.horaFin}
                                                </p>


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


                                                <p>
                                                    <strong>
                                                        Estado:
                                                    </strong>{" "}

                                                    <span
                                                        className={
                                                            taller.estado ===
                                                            "EN_CURSO"
                                                                ? "taller-estado-en-curso"
                                                                : "taller-estado-programado"
                                                        }
                                                    >
                                                        {taller.estado}
                                                    </span>

                                                </p>

                                            </div>


                                            {/* =================================================
                                                BOTÓN INICIAR
                                            ================================================= */}

                                            {taller.estado ===
                                                "PROGRAMADO" && (

                                                    <button
                                                        className="btn-iniciar-taller"
                                                        onClick={() =>
                                                            iniciarTaller(
                                                                taller
                                                            )
                                                        }
                                                    >
                                                        ▶ Iniciar taller
                                                    </button>

                                                )}


                                            {/* =================================================
                                                BOTÓN FINALIZAR
                                            ================================================= */}

                                            {taller.estado ===
                                                "EN_CURSO" && (

                                                    <button
                                                        className="btn-finalizar-taller"
                                                        onClick={() =>
                                                            finalizarTaller(
                                                                taller
                                                            )
                                                        }
                                                    >
                                                        ■ Finalizar taller
                                                    </button>

                                                )}

                                        </article>

                                    )
                                )}

                            </div>

                        )}

                    </section>

                )}


                {/* =================================================
                    CERTIFICACIONES
                ================================================= */}

                {vistaActual === "certificaciones" && (

                    <section className="seccion-capacitador">

                        <div className="capacitador-header">

                            <h1>
                                Certificaciones
                            </h1>

                            <p>
                                Aquí puedes certificar a los
                                operarios que estuvieron presentes
                                en tus talleres finalizados.
                            </p>

                        </div>


                        <h2>
                            Talleres finalizados
                        </h2>


                        {mensaje && (

                            <p className="mensaje-certificacion">
                                {mensaje}
                            </p>

                        )}


                        {talleresFinalizados.length === 0 ? (

                            <div className="capacitador-vacio">

                                No tienes talleres finalizados
                                pendientes de certificación.

                            </div>

                        ) : (

                            <div className="talleres-container">

                                {talleresFinalizados.map(
                                    (taller) => (

                                        <article
                                            className="taller-card"
                                            key={
                                                taller.idtaller
                                            }
                                        >

                                            <h3>
                                                {taller.nombre}
                                            </h3>


                                            <p className="taller-descripcion">
                                                {taller.descripcion}
                                            </p>


                                            <div className="taller-info">

                                                <p>
                                                    <strong>
                                                        Fecha:
                                                    </strong>{" "}
                                                    {taller.fecha}
                                                </p>


                                                <p>
                                                    <strong>
                                                        Horario:
                                                    </strong>{" "}
                                                    {taller.horaInicio}
                                                    {" - "}
                                                    {taller.horaFin}
                                                </p>


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


                                                <p>
                                                    <strong>
                                                        Estado:
                                                    </strong>{" "}

                                                    <span className="taller-estado-finalizado">
                                                        {taller.estado}
                                                    </span>

                                                </p>

                                            </div>


                                            {/* =================================================
                                                BOTÓN OPERARIOS
                                            ================================================= */}

                                            <button
                                                className="btn-certificar-operarios"
                                                onClick={() =>
                                                    cargarAsistencias(
                                                        taller
                                                    )
                                                }
                                            >
                                                Certificar operarios
                                            </button>


                                            {/* =================================================
                                                OPERARIOS
                                            ================================================= */}

                                            {tallerSeleccionado ===
                                                taller.idtaller && (

                                                    <div className="operarios-container">

                                                        <div className="operarios-header">

                                                            <h4>
                                                                Operarios presentes
                                                            </h4>


                                                            <button
                                                                className="btn-cerrar-operarios"
                                                                onClick={
                                                                    cerrarOperarios
                                                                }
                                                            >
                                                                Cerrar
                                                            </button>

                                                        </div>


                                                        {cargandoAsistencias ? (

                                                            <p className="mensaje-cargando">
                                                                Cargando operarios...
                                                            </p>

                                                        ) : asistencias.length ===
                                                        0 ? (

                                                            <p className="mensaje-vacio">
                                                                No hay operarios presentes.
                                                            </p>

                                                        ) : (

                                                            asistencias.map(
                                                                (asistencia) => (

                                                                    <div
                                                                        className="operario-card"
                                                                        key={
                                                                            asistencia.idasistencia
                                                                        }
                                                                    >

                                                                        <p className="operario-nombre">

                                                                            <strong>

                                                                                {
                                                                                    asistencia
                                                                                        .usuario
                                                                                        ?.nombre
                                                                                }{" "}

                                                                                {
                                                                                    asistencia
                                                                                        .usuario
                                                                                        ?.apellido
                                                                                }

                                                                            </strong>

                                                                        </p>


                                                                        <p>

                                                                            <strong>
                                                                                Documento:
                                                                            </strong>{" "}

                                                                            {
                                                                                asistencia
                                                                                    .usuario
                                                                                    ?.documento
                                                                            }

                                                                        </p>


                                                                        <p>

                                                                            <strong>
                                                                                Estado:
                                                                            </strong>{" "}

                                                                            <span className="estado-presente">

                                                                                {
                                                                                    asistencia
                                                                                        .estado
                                                                                }

                                                                            </span>

                                                                        </p>


                                                                        {/* =================================================
                                                                            CERTIFICADO
                                                                        ================================================= */}

                                                                        {asistencia.decisionCertificacion ===
                                                                            "CERTIFICADO" ? (

                                                                            <p className="operario-certificado">
                                                                                ✓ Certificado
                                                                            </p>

                                                                        ) : asistencia.decisionCertificacion ===
                                                                            "NO_CERTIFICADO" ? (

                                                                            <div>

                                                                                <p className="operario-no-certificado">
                                                                                    ✕ No certificado
                                                                                </p>

                                                                                {asistencia.motivoNoCertificacion && (

                                                                                    <p className="motivo-no-certificacion">

                                                                                        <strong>
                                                                                            Motivo:
                                                                                        </strong>{" "}

                                                                                        {
                                                                                            asistencia.motivoNoCertificacion
                                                                                        }

                                                                                    </p>

                                                                                )}

                                                                            </div>

                                                                        ) : (

                                                                            <div className="botones-certificacion">

                                                                                <button
                                                                                    className="btn-certificar"
                                                                                    onClick={() =>
                                                                                        certificarOperario(
                                                                                            asistencia
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    ✓ Certificar
                                                                                </button>


                                                                                <button
                                                                                    className="btn-no-certificar"
                                                                                    onClick={() =>
                                                                                        abrirModalNoCertificar(
                                                                                            asistencia
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    ✕ No certificar
                                                                                </button>

                                                                            </div>

                                                                        )}

                                                                    </div>

                                                                )
                                                            )

                                                        )}

                                                    </div>

                                                )}

                                        </article>

                                    )
                                )}

                            </div>

                        )}

                    </section>

                )}


                {/* =================================================
                    PERFIL
                ================================================= */}

                {vistaActual === "perfil" && (

                    <PerfilUsuario
                        usuario={usuario}
                        actualizarUsuario={actualizarUsuario}
                    />

                )}


                {/* =================================================
                    MODAL NO CERTIFICAR
                ================================================= */}

                {modalNoCertificar && (

                    <div
                        className="modal-overlay-certificacion"
                        onClick={
                            cerrarModalNoCertificar
                        }
                    >

                        <div
                            className="modal-no-certificar"
                            onClick={(evento) =>
                                evento.stopPropagation()
                            }
                        >

                            <div className="modal-no-certificar-header">

                                <h3>
                                    No certificar operario
                                </h3>

                                <button
                                    className="modal-cerrar-x"
                                    onClick={
                                        cerrarModalNoCertificar
                                    }
                                    disabled={
                                        procesandoDecision
                                    }
                                >
                                    ×
                                </button>

                            </div>


                            <p className="modal-operario-nombre">

                                <strong>
                                    Operario:
                                </strong>{" "}

                                {
                                    asistenciaNoCertificar
                                        ?.usuario
                                        ?.nombre
                                }{" "}

                                {
                                    asistenciaNoCertificar
                                        ?.usuario
                                        ?.apellido
                                }

                            </p>


                            <label
                                htmlFor="motivoNoCertificacion"
                                className="modal-label"
                            >
                                Motivo de no certificación
                            </label>


                            <textarea
                                id="motivoNoCertificacion"
                                className="modal-textarea"
                                value={
                                    motivoNoCertificacion
                                }
                                onChange={(evento) =>
                                    setMotivoNoCertificacion(
                                        evento.target.value
                                    )
                                }
                                placeholder="Ingrese el motivo por el cual el operario no será certificado..."
                                rows={5}
                                disabled={
                                    procesandoDecision
                                }
                            />


                            <div className="modal-botones">

                                <button
                                    className="modal-btn-cancelar"
                                    onClick={
                                        cerrarModalNoCertificar
                                    }
                                    disabled={
                                        procesandoDecision
                                    }
                                >
                                    Cancelar
                                </button>


                                <button
                                    className="modal-btn-confirmar"
                                    onClick={
                                        confirmarNoCertificar
                                    }
                                    disabled={
                                        procesandoDecision ||
                                        !motivoNoCertificacion.trim()
                                    }
                                >
                                    {procesandoDecision
                                        ? "Guardando..."
                                        : "Confirmar no certificación"}
                                </button>

                            </div>

                        </div>

                    </div>

                )}

            </main>

        </div>
    );
}

export default CapacitadorCertificaciones;