import { useEffect, useState } from "react";
import "./CapacitadorCertificaciones.css";

function CapacitadorCertificaciones({ usuario, cerrarSesion }) {

    const [talleres, setTalleres] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [mensaje, setMensaje] = useState("");

    const [asistencias, setAsistencias] = useState([]);
    const [tallerSeleccionado, setTallerSeleccionado] = useState(null);
    const [cargandoAsistencias, setCargandoAsistencias] = useState(false);


    // =========================================================
    // CARGAR TALLERES FINALIZADOS DEL CAPACITADOR
    // =========================================================

    useEffect(() => {

        const cargarTalleres = async () => {

            try {

                console.log(
                    "USUARIO RECIBIDO:",
                    usuario
                );

                console.log(
                    "ID CAPACITADOR:",
                    usuario.idUsuario
                );

                const url =
                    `http://localhost:8080/api/talleres/capacitador/${usuario.idUsuario}/finalizados`;

                console.log("URL:", url);

                const respuesta = await fetch(url);

                console.log(
                    "STATUS:",
                    respuesta.status
                );

                if (!respuesta.ok) {

                    throw new Error(
                        "No fue posible cargar los talleres"
                    );
                }

                const datos =
                    await respuesta.json();

                console.log(
                    "TALLERES:",
                    datos
                );

                setTalleres(datos);

            } catch (error) {

                console.error(
                    "ERROR CARGANDO TALLERES:",
                    error
                );

                setMensaje(
                    "No fue posible cargar los talleres finalizados."
                );

            } finally {

                setCargando(false);
            }
        };

        cargarTalleres();

    }, [usuario.idUsuario]);


    // =========================================================
    // CARGAR OPERARIOS PRESENTES
    // =========================================================

    const cargarAsistencias = async (idTaller) => {

        try {

            setCargandoAsistencias(true);
            setMensaje("");

            const respuesta = await fetch(
                `http://localhost:8080/api/asistencias/taller/${idTaller}/presentes`
            );

            if (!respuesta.ok) {

                throw new Error(
                    "No fue posible cargar los operarios"
                );
            }

            const datos = await respuesta.json();

            console.log(
                "ASISTENCIAS PRESENTES:",
                datos
            );

            const tipoCertificacion =
                talleres.find(
                    (taller) => taller.idtaller === idTaller
                )?.tipoCertificacion?.idTipoCertificacion;

            const asistenciasConCertificacion =
                await Promise.all(
                    datos.map(async (asistencia) => {

                        const respuestaCertificacion =
                            await fetch(
                                `http://localhost:8080/api/certificaciones/verificar/${asistencia.usuario.idusuario}/${tipoCertificacion}`
                            );

                        if (!respuestaCertificacion.ok) {
                            return {
                                ...asistencia,
                                estadoCertificacion: "NO_CERTIFICADO"
                            };
                        }

                        const certificado =
                            await respuestaCertificacion.json();

                        return {
                            ...asistencia,
                            estadoCertificacion:
                                certificado
                                    ? "CERTIFICADO"
                                    : "NO_CERTIFICADO"
                        };
                    })
                );

            setAsistencias(asistenciasConCertificacion);

            setTallerSeleccionado(
                idTaller
            );

        } catch (error) {

            console.error(
                "ERROR CARGANDO ASISTENCIAS:",
                error
            );

            setMensaje(
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
                asistencia.taller.idtaller;

            const idAsistencia =
                asistencia.idasistencia;

            const idCapacitador =
                usuario.idUsuario;

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


            // Cambiar el estado visual del operario
            setAsistencias(
                asistencias.map((item) =>
                    item.idasistencia ===
                    asistencia.idasistencia
                        ? {
                            ...item,
                            estadoCertificacion:
                                "CERTIFICADO"
                        }
                        : item
                )
            );


            setMensaje(
                `${asistencia.usuario.nombre} ${asistencia.usuario.apellido} fue certificado correctamente.`
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
    // CARGANDO TALLERES
    // =========================================================

    if (cargando) {

        return (

            <section className="capacitador-certificaciones">

                <header className="capacitador-navbar">

                    <div className="certisafe-logo">
                        CERTISAFE
                    </div>

                    <div className="capacitador-navbar-derecha">

                        <span className="capacitador-nombre">
                            {usuario.nombre}{" "}
                            {usuario.apellido}
                        </span>

                        <button
                            className="btn-cerrar-sesion"
                            onClick={cerrarSesion}
                        >
                            Cerrar sesión
                        </button>

                    </div>

                </header>


                <div className="capacitador-header">

                    <h1>
                        Certificaciones
                    </h1>

                    <p>
                        Cargando talleres...
                    </p>

                </div>

            </section>
        );
    }


    // =========================================================
    // VISTA PRINCIPAL
    // =========================================================

    return (

        <section className="capacitador-certificaciones">


            {/* =====================================================
                BANNER CERTISAFE
            ===================================================== */}

            <header className="capacitador-navbar">

                <div className="certisafe-logo">
                    CERTISAFE
                </div>


                <div className="capacitador-navbar-derecha">

                    <span className="capacitador-nombre">

                        {usuario.nombre}{" "}
                        {usuario.apellido}

                    </span>


                    <button
                        className="btn-cerrar-sesion"
                        onClick={cerrarSesion}
                    >
                        Cerrar sesión
                    </button>

                </div>

            </header>


            {/* =====================================================
                ENCABEZADO
            ===================================================== */}

            <div className="capacitador-header">

                <h1>
                    Certificaciones
                </h1>

                <p>
                    Bienvenido,{" "}
                    {usuario.nombre}{" "}
                    {usuario.apellido}
                </p>

            </div>


            {/* =====================================================
                TÍTULO
            ===================================================== */}

            <h2>
                Talleres finalizados
            </h2>


            {/* =====================================================
                MENSAJES
            ===================================================== */}

            {mensaje && (

                <p className="mensaje-certificacion">
                    {mensaje}
                </p>

            )}


            {/* =====================================================
                SIN TALLERES
            ===================================================== */}

            {talleres.length === 0 ? (

                <p className="sin-talleres">

                    No tienes talleres finalizados
                    pendientes de certificación.

                </p>

            ) : (


                /* =================================================
                   LISTA DE TALLERES
                ================================================= */

                <div className="talleres-container">

                    {talleres.map((taller) => (

                        <article
                            className="taller-card"
                            key={taller.idtaller}
                        >


                            {/* =====================================
                                INFORMACIÓN DEL TALLER
                            ===================================== */}

                            <h3>
                                {taller.nombre}
                            </h3>


                            <p className="taller-descripcion">
                                {taller.descripcion}
                            </p>


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
                                {taller.tipoCertificacion?.nombre}
                            </p>


                            <p>
                                <strong>
                                    Estado:
                                </strong>{" "}

                                <span className="estado-finalizado">
                                    {taller.estado}
                                </span>

                            </p>


                            {/* =====================================
                                BOTÓN MOSTRAR OPERARIOS
                            ===================================== */}

                            <button
                                className="btn-certificar-operarios"
                                onClick={() =>
                                    cargarAsistencias(
                                        taller.idtaller
                                    )
                                }
                            >
                                Certificar operarios
                            </button>


                            {/* =====================================
                                OPERARIOS PRESENTES
                            ===================================== */}

                            {tallerSeleccionado ===
                                taller.idtaller && (

                                    <div className="operarios-container">

                                        <h4>
                                            Operarios presentes
                                        </h4>


                                        {cargandoAsistencias ? (

                                            <p>
                                                Cargando operarios...
                                            </p>

                                        ) : asistencias.length === 0 ? (

                                            <p>
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


                                                        {/* ==================
                                                            NOMBRE
                                                        ================== */}

                                                        <p className="operario-nombre">

                                                            <strong>

                                                                {
                                                                    asistencia
                                                                        .usuario
                                                                        .nombre
                                                                }{" "}

                                                                {
                                                                    asistencia
                                                                        .usuario
                                                                        .apellido
                                                                }

                                                            </strong>

                                                        </p>


                                                        {/* ==================
                                                            DOCUMENTO
                                                        ================== */}

                                                        <p>

                                                            <strong>
                                                                Documento:
                                                            </strong>{" "}

                                                            {
                                                                asistencia
                                                                    .usuario
                                                                    .documento
                                                            }

                                                        </p>


                                                        {/* ==================
                                                            ESTADO ASISTENCIA
                                                        ================== */}

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


                                                        {/* ==================
                                                            ESTADO CERTIFICACIÓN
                                                        ================== */}

                                                        {asistencia.estadoCertificacion ===
                                                        "CERTIFICADO" ? (

                                                            <p className="operario-certificado">

                                                                ✓ Certificado

                                                            </p>

                                                        ) : (

                                                            <button
                                                                className="btn-certificar"
                                                                onClick={() =>
                                                                    certificarOperario(
                                                                        asistencia
                                                                    )
                                                                }
                                                            >
                                                                Certificar
                                                            </button>

                                                        )}

                                                    </div>

                                                )
                                            )

                                        )}

                                    </div>

                                )}

                        </article>

                    ))}

                </div>

            )}

        </section>
    );
}

export default CapacitadorCertificaciones;