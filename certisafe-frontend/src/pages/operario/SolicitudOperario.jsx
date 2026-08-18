import { useEffect, useState } from "react";
import "./SolicitudOperario.css";

function SolicitudOperario({ usuario }) {

    const [resultado, setResultado] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    const [solicitando, setSolicitando] = useState(false);
    const [mensajeSolicitud, setMensajeSolicitud] = useState("");

    const [solicitandoAcceso, setSolicitandoAcceso] = useState(false);


    // ==========================================
    // OBTENER ID DE CERTIFICACIÓN
    // ==========================================

    const obtenerIdCertificacion = (nombre) => {

        if (
            nombre === "Trabajo seguro en alturas"
        ) {
            return 1;
        }

        if (
            nombre === "Manejo seguro de productos químicos" ||
            nombre === "Manejo seguro de productos quimicos"
        ) {
            return 2;
        }

        if (
            nombre === "Seguridad en espacios confinados"
        ) {
            return 3;
        }

        return null;
    };


    // ==========================================
    // SOLICITAR INGRESO A PRODUCCIÓN
    // ==========================================

    const solicitarIngreso = async () => {

        if (!usuario?.idUsuario) {
            return;
        }

        setSolicitandoAcceso(true);
        setError("");

        try {

            const respuesta = await fetch(
                `http://localhost:8080/api/ingreso-produccion/solicitar/${usuario.idUsuario}`,
                {
                    method: "POST"
                }
            );

            if (!respuesta.ok) {

                const texto = await respuesta.text();

                throw new Error(
                    `Error ${respuesta.status}: ${texto}`
                );
            }

            const datos = await respuesta.json();

            console.log(
                "RESPUESTA SOLICITUD DE INGRESO:",
                datos
            );

            setResultado(datos);

        } catch (error) {

            console.error(
                "Error solicitando ingreso:",
                error
            );

            setError(
                "No fue posible generar el código de acceso."
            );

        } finally {

            setSolicitandoAcceso(false);
        }
    };


    // ==========================================
    // CONSULTAR ACCESO A PRODUCCIÓN
    // ==========================================

    const verificarAcceso = async () => {

        if (!usuario?.idUsuario) {

            setError(
                "No se encontró el usuario."
            );

            setCargando(false);

            return;
        }

        setCargando(true);
        setError("");
        setMensajeSolicitud("");

        try {

            const respuesta = await fetch(
                `http://localhost:8080/api/ingreso-produccion/verificar/${usuario.idUsuario}`
            );

            if (!respuesta.ok) {

                throw new Error(
                    "No fue posible consultar el estado de ingreso."
                );
            }

            const datos = await respuesta.json();

            console.log(
                "ESTADO INGRESO PRODUCCIÓN:",
                datos
            );

            setResultado(datos);

            // ==========================================
            // SI YA CUMPLE LAS 3 CERTIFICACIONES
            // SOLICITAMOS EL CÓDIGO DE ACCESO
            // ==========================================

            if (datos.acceso) {

                await solicitarIngreso();

            }

        } catch (error) {

            console.error(error);

            setError(
                "No fue posible consultar tu estado de ingreso a producción."
            );

        } finally {

            setCargando(false);
        }
    };


    // ==========================================
    // CARGAR AL ENTRAR EN LA VISTA
    // ==========================================

    useEffect(() => {

        verificarAcceso();

    }, [usuario]);


    // ==========================================
    // SOLICITAR CAPACITACIÓN
    // ==========================================

    const solicitarCapacitacion = async (
        tipoCertificacion
    ) => {

        if (!usuario?.idUsuario) {
            return;
        }

        setSolicitando(true);
        setMensajeSolicitud("");
        setError("");

        try {

            const idTipoCertificacion =
                obtenerIdCertificacion(
                    tipoCertificacion
                );

            if (!idTipoCertificacion) {

                throw new Error(
                    "No se pudo identificar la certificación."
                );
            }


            // ==========================================
            // CREAR SOLICITUD
            // ==========================================

            const parametros = new URLSearchParams();

            parametros.append(
                "idUsuario",
                usuario.idUsuario
            );

            parametros.append(
                "idTipoCertificacion",
                idTipoCertificacion
            );

            parametros.append(
                "observacion",
                "El operario requiere esta certificación para completar los requisitos de ingreso a producción."
            );


            const respuesta = await fetch(
                "http://localhost:8080/api/solicitudes-capacitacion",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded"
                    },
                    body: parametros
                }
            );


            if (!respuesta.ok) {

                const texto =
                    await respuesta.text();

                throw new Error(
                    `Error ${respuesta.status}: ${texto}`
                );
            }


            const datos =
                await respuesta.json();


            console.log(
                "SOLICITUD DE CAPACITACIÓN CREADA:",
                datos
            );


            setMensajeSolicitud(
                `Solicitud enviada correctamente para: ${tipoCertificacion}`
            );


        } catch (error) {

            console.error(
                "Error solicitando capacitación:",
                error
            );


            // ==========================================
            // SOLICITUD DUPLICADA
            // ==========================================

            if (
                error.message.includes(
                    "Ya existe una solicitud pendiente"
                )
            ) {

                setMensajeSolicitud(
                    `Ya tienes una solicitud pendiente para: ${tipoCertificacion}`
                );

            } else {

                setMensajeSolicitud(
                    "No fue posible enviar la solicitud de capacitación."
                );
            }

        } finally {

            setSolicitando(false);
        }
    };


    // ==========================================
    // CARGANDO
    // ==========================================

    if (cargando || solicitandoAcceso) {

        return (
            <section className="seccion-solicitud-operario">

                <h1>
                    Ingreso a producción
                </h1>

                <div className="estado-cargando-produccion">

                    <div className="spinner-produccion"></div>

                    <p>
                        {solicitandoAcceso
                            ? "Generando código de acceso..."
                            : "Consultando requisitos de ingreso..."
                        }
                    </p>

                </div>

            </section>
        );
    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (
            <section className="seccion-solicitud-operario">

                <h1>
                    Ingreso a producción
                </h1>

                <div className="mensaje-error-produccion">

                    {error}

                </div>

                <button
                    className="boton-reintentar-produccion"
                    onClick={verificarAcceso}
                >
                    Reintentar
                </button>

            </section>
        );
    }


    // ==========================================
    // SIN RESULTADO
    // ==========================================

    if (!resultado) {

        return (
            <section className="seccion-solicitud-operario">

                <h1>
                    Ingreso a producción
                </h1>

                <p>
                    No fue posible obtener información
                    sobre tu estado de ingreso.
                </p>

            </section>
        );
    }


    // ==========================================
    // ACCESO CONCEDIDO
    // ==========================================

    if (resultado.acceso) {

        return (
            <section className="seccion-solicitud-operario">

                <div className="encabezado-produccion">

                    <h1>
                        Ingreso a producción
                    </h1>

                    <p>
                        Verificación de requisitos de seguridad.
                    </p>

                </div>


                <div className="acceso-concedido">

                    <div className="icono-acceso-concedido">
                        ✓
                    </div>


                    <h2>
                        Acceso Concedido
                    </h2>


                    <p>
                        Cumples con las certificaciones obligatorias
                        para ingresar a producción.
                    </p>


                    {resultado.codigoAcceso && (

                        <div className="codigo-acceso">

                            <span>
                                Código de acceso
                            </span>

                            <strong>
                                {resultado.codigoAcceso}
                            </strong>

                        </div>

                    )}

                </div>

            </section>
        );
    }


    // ==========================================
    // ACCESO DENEGADO
    // ==========================================

    return (
        <section className="seccion-solicitud-operario">

            <div className="encabezado-produccion">

                <h1>
                    Ingreso a producción
                </h1>

                <p>
                    Verificación de requisitos de seguridad.
                </p>

            </div>


            <div className="acceso-denegado">

                <div className="icono-acceso-denegado">
                    !
                </div>


                <h2>
                    Acceso Denegado
                </h2>


                <p>
                    Para ingresar a producción debes contar
                    con las tres certificaciones obligatorias
                    vigentes.
                </p>

            </div>


            {/* ==========================================
                CERTIFICACIONES FALTANTES
            ========================================== */}

            {resultado.faltantes &&
                resultado.faltantes.length > 0 && (

                    <div className="certificaciones-faltantes">

                        <h3>
                            Certificaciones faltantes
                        </h3>


                        <p>
                            Debes completar las siguientes
                            capacitaciones:
                        </p>


                        <div className="lista-faltantes">

                            {resultado.faltantes.map(
                                (
                                    certificacion,
                                    index
                                ) => (

                                    <div
                                        className="faltante-card"
                                        key={index}
                                    >

                                        <div className="icono-faltante">
                                            !
                                        </div>


                                        <div className="faltante-info">

                                            <strong>
                                                {certificacion}
                                            </strong>

                                            <span>
                                                Certificación requerida
                                            </span>

                                        </div>


                                        <button
                                            className="boton-solicitar-capacitacion"
                                            disabled={solicitando}
                                            onClick={() =>
                                                solicitarCapacitacion(
                                                    certificacion
                                                )
                                            }
                                        >

                                            {solicitando
                                                ? "Enviando..."
                                                : "Solicitar capacitación"
                                            }

                                        </button>

                                    </div>

                                )
                            )}

                        </div>

                    </div>

                )}


            {/* ==========================================
                MENSAJE SOLICITUD
            ========================================== */}

            {mensajeSolicitud && (

                <div className="mensaje-solicitud">

                    {mensajeSolicitud}

                </div>

            )}

        </section>
    );
}

export default SolicitudOperario;