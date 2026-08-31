import VistaOperario from "./VistaOperario";
import VistaAdministrador from "./VistaAdministrador";
import CapacitadorCertificaciones from "./CapacitadorCertificaciones";
import RegistroUsuario from "./RegistroUsuario";
import { useEffect, useState } from "react";
import "./Inicio.css";

function Inicio() {

    const [mostrarLogin, setMostrarLogin] = useState(false);

    const [mostrarRegistro, setMostrarRegistro] = useState(false);

    const [mostrarCambioContrasena, setMostrarCambioContrasena] = useState(false);

    const [documentoCambio, setDocumentoCambio] = useState("");

    const [mensajeCambio, setMensajeCambio] = useState("");

    const [solicitandoRecuperacion, setSolicitandoRecuperacion] = useState(false);

    const [documentoLogin, setDocumentoLogin] = useState("");

    const [contrasenaLogin, setContrasenaLogin] = useState("");

    const [mensajeLogin, setMensajeLogin] = useState("");

    const [ingresando, setIngresando] = useState(false);

    const [usuario, setUsuario] = useState(null);

    const [slideActual, setSlideActual] = useState(0);

// =========================================================
// CONTENIDO DEL SLIDER
// =========================================================

    const slides = [

        {
            imagen:
                "https://guiadoepi.com.br/wp-content/uploads/2023/11/treinamento-de-epi.jpg",

            etiqueta:
                "SEGURIDAD Y PREVENCIÓN",

            titulo:
                "La seguridad comienza con la capacitación",

            descripcion:
                "Fortalecemos el conocimiento de los trabajadores para promover prácticas seguras y responsables en el entorno laboral.",

            boton:
                "Conoce CertiSafe"
        },

        {
            imagen:
                "https://storage.safeon.id/public/index/industry/industry-3.png",

            etiqueta:
                "CAPACITACIÓN INDUSTRIAL",

            titulo:
                "Preparación para enfrentar los riesgos",

            descripcion:
                "La formación adecuada permite identificar peligros, conocer los procedimientos y utilizar correctamente los elementos de protección.",

            boton:
                "Nuestra plataforma"
        },

        {
            imagen:
                "https://www.previnnova.com.ar/_astro/semana-seguridad-higiene-argentina-actividades.D981wxWJ.webp",

            etiqueta:
                "CULTURA DE SEGURIDAD",

            titulo:
                "Prevenir es parte del trabajo",

            descripcion:
                "Una cultura de prevención ayuda a mantener ambientes laborales más seguros y facilita el seguimiento de las competencias de cada trabajador.",

            boton:
                "Conoce más"
        },

        {
            imagen:
                "https://cdn.shopify.com/s/files/1/2532/3934/files/the-complete-guide-to-industrial-safety-building-a-culture-of-zero-accidents.png?v=1770265692",

            etiqueta:
                "CERTIFICACIÓN Y SEGUIMIENTO",

            titulo:
                "Certificaciones que respaldan la seguridad",

            descripcion:
                "CertiSafe permite gestionar talleres, capacitaciones y certificaciones para mantener actualizada la información de los operarios.",

            boton:
                "Empezar"
        }

    ];

    // =========================================================
// CAMBIO AUTOMÁTICO DEL SLIDER
// =========================================================

    useEffect(() => {

        const intervalo = setInterval(() => {

            setSlideActual((actual) =>
                (actual + 1) % slides.length
            );

        }, 6000);

        return () => {
            clearInterval(intervalo);
        };

    }, []);

    // =========================================================
// SLIDER - ANTERIOR
// =========================================================

    const slideAnterior = () => {

        setSlideActual((actual) =>
            actual === 0
                ? slides.length - 1
                : actual - 1
        );
    };


// =========================================================
// SLIDER - SIGUIENTE
// =========================================================

    const slideSiguiente = () => {

        setSlideActual((actual) =>
            (actual + 1) % slides.length
        );
    };

    // =========================================================
    // RECUPERAR SESIÓN
    // =========================================================

    useEffect(() => {

        const usuarioGuardado =
            localStorage.getItem("certisafe_usuario");

        if (!usuarioGuardado) {
            return;
        }

        try {

            const datosUsuario =
                JSON.parse(usuarioGuardado);

            if (
                !datosUsuario ||
                !datosUsuario.idUsuario ||
                !datosUsuario.rol
            ) {

                localStorage.removeItem(
                    "certisafe_usuario"
                );

                return;
            }

            setUsuario(datosUsuario);

        } catch (error) {

            console.error(
                "Error recuperando la sesión:",
                error
            );

            localStorage.removeItem(
                "certisafe_usuario"
            );

            setUsuario(null);
        }

    }, []);


    // =========================================================
    // CERRAR SESIÓN
    // =========================================================

    const cerrarSesion = () => {

        setUsuario(null);

        localStorage.removeItem(
            "certisafe_usuario"
        );

        setDocumentoLogin("");
        setContrasenaLogin("");
        setMensajeLogin("");

        setDocumentoCambio("");
        setMensajeCambio("");
        setSolicitandoRecuperacion(false);

        setMostrarLogin(false);
        setMostrarRegistro(false);
        setMostrarCambioContrasena(false);

        window.history.replaceState(
            null,
            "",
            window.location.href
        );
    };


    // =========================================================
    // ACTUALIZAR USUARIO
    // =========================================================

    const actualizarUsuario = (
        usuarioActualizado
    ) => {

        setUsuario(usuarioActualizado);

        localStorage.setItem(
            "certisafe_usuario",
            JSON.stringify(usuarioActualizado)
        );
    };


    // =========================================================
    // INICIAR SESIÓN
    // =========================================================

    const iniciarSesion = async () => {

        if (
            documentoLogin.trim() === "" ||
            contrasenaLogin === ""
        ) {

            setMensajeLogin(
                "Ingresa documento y contraseña."
            );

            return;
        }

        setIngresando(true);
        setMensajeLogin("");

        try {

            const respuesta = await fetch(
                "http://localhost:8080/usuarios/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        documento:
                            documentoLogin.trim(),

                        contrasena:
                        contrasenaLogin
                    })
                }
            );

            if (respuesta.ok) {

                const datos =
                    await respuesta.json();

                console.log(
                    "Usuario autenticado:",
                    datos
                );

                setUsuario(datos);

                localStorage.setItem(
                    "certisafe_usuario",
                    JSON.stringify(datos)
                );

                setMostrarLogin(false);
                setMostrarRegistro(false);

            } else {

                const mensaje =
                    await respuesta.text();

                setMensajeLogin(
                    mensaje ||
                    "Documento o contraseña incorrectos"
                );
            }

        } catch (error) {

            console.error(
                "Error de conexión:",
                error
            );

            setMensajeLogin(
                "No fue posible conectar con el servidor."
            );

        } finally {

            setIngresando(false);
        }
    };


    // =========================================================
    // SOLICITAR RECUPERACIÓN DE CONTRASEÑA
    // =========================================================

    const solicitarNuevaContrasena = async () => {

        if (documentoCambio.trim() === "") {

            setMensajeCambio(
                "Ingresa tu número de documento."
            );

            return;
        }

        setSolicitandoRecuperacion(true);
        setMensajeCambio("");

        try {

            const respuesta = await fetch(
                "http://localhost:8080/api/auth/forgot-password",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        documento:
                            documentoCambio.trim()
                    })
                }
            );

            if (respuesta.ok) {

                const mensaje =
                    await respuesta.text();

                setMensajeCambio(
                    mensaje ||
                    "Si el documento está registrado, recibirás un correo con las instrucciones para restablecer tu contraseña."
                );

                setDocumentoCambio("");

            } else {

                const mensaje =
                    await respuesta.text();

                setMensajeCambio(
                    mensaje ||
                    "No fue posible procesar la solicitud."
                );
            }

        } catch (error) {

            console.error(
                "Error solicitando recuperación:",
                error
            );

            setMensajeCambio(
                "No fue posible conectar con el servidor."
            );

        } finally {

            setSolicitandoRecuperacion(false);
        }
    };


    // =========================================================
    // VISTAS SEGÚN ROL
    // =========================================================

    if (
        usuario &&
        usuario.rol === "OPERARIO"
    ) {

        return (
            <VistaOperario
                usuario={usuario}
                cerrarSesion={cerrarSesion}
                actualizarUsuario={actualizarUsuario}
            />
        );
    }


    if (
        usuario &&
        usuario.rol === "ADMIN"
    ) {

        return (
            <VistaAdministrador
                usuario={usuario}
                cerrarSesion={cerrarSesion}
                actualizarUsuario={actualizarUsuario}
            />
        );
    }


    if (
        usuario &&
        usuario.rol === "CAPACITADOR"
    ) {

        return (
            <CapacitadorCertificaciones
                usuario={usuario}
                cerrarSesion={cerrarSesion}
                actualizarUsuario={actualizarUsuario}
            />
        );
    }


    // =========================================================
    // PÁGINA PÚBLICA
    // =========================================================

    return (

        <div className="pagina-inicio">


            {/* =====================================================
                HEADER
            ===================================================== */}

            <header className="encabezado">

                <div
                    className="logo"
                    onClick={() => {

                        setMostrarLogin(false);
                        setMostrarRegistro(false);
                        setMostrarCambioContrasena(false);

                        window.scrollTo({
                            top: 0,
                            behavior: "smooth"
                        });

                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {

                        if (
                            e.key === "Enter" ||
                            e.key === " "
                        ) {

                            window.scrollTo({
                                top: 0,
                                behavior: "smooth"
                            });

                        }

                    }}
                >

                    <span className="logo-icono">
                        ✓
                    </span>

                    <span>
                        CERTISAFE
                    </span>

                </div>


                <nav className="menu">

                    <a href="#inicio">
                        Inicio
                    </a>

                    <a href="#nosotros">
                        Nosotros
                    </a>

                    <a href="#certificaciones">
                        Certificaciones
                    </a>

                    <a href="#contacto">
                        Contacto
                    </a>


                    <button
                        className="menu-ingresar"
                        onClick={() => {

                            setMostrarLogin(true);

                            setMostrarRegistro(false);

                            setMostrarCambioContrasena(false);

                            setDocumentoLogin("");

                            setContrasenaLogin("");

                            setMensajeLogin("");

                        }}
                    >
                        Ingresar
                    </button>

              {/* =====================================================
               funcionalidad de registro de ususario individual
            ===================================================== */}


                    {/*
                    <button
                        className="menu-registro"
                        onClick={() => {

                            setMostrarRegistro(true);

                            setMostrarLogin(false);

                            setMostrarCambioContrasena(false);

                        }}
                    >
                        Registrarse
                    </button> */}

                </nav>

            </header>


            {/* =====================================================
                HERO / BANNER
            ===================================================== */}

            <main id="inicio">

                <section className="hero">

                    <div className="hero-overlay"></div>

                    <div className="hero-contenido">

                        <span className="hero-etiqueta">
                            SEGURIDAD • CAPACITACIÓN • CERTIFICACIÓN
                        </span>

                        <h1>
                            La seguridad comienza
                            <span> con la preparación.</span>
                        </h1>

                        <p>
                            CertiSafe facilita la gestión de
                            capacitación y certificaciones de
                            seguridad para los operarios.
                        </p>


                        <div className="hero-botones">

                            <button
                                onClick={() => {

                                    document
                                        .getElementById(
                                            "certificaciones"
                                        )
                                        ?.scrollIntoView({
                                            behavior: "smooth"
                                        });

                                }}
                            >
                                Conocer certificaciones
                            </button>


                            <button
                                className="hero-boton-secundario"
                                onClick={() => {

                                    setMostrarRegistro(true);

                                }}
                            >
                                Crear cuenta
                            </button>

                        </div>

                    </div>

                </section>


                {/* =====================================================
                    INDICADORES
                ===================================================== */}

                <section className="indicadores">

                    <div className="indicador">

                        <strong>
                            03
                        </strong>

                        <span>
                            Áreas de certificación
                        </span>

                    </div>


                    <div className="indicador">

                        <strong>
                            ✓
                        </strong>

                        <span>
                            Seguimiento digital
                        </span>

                    </div>


                    <div className="indicador">

                        <strong>
                            24/7
                        </strong>

                        <span>
                            Acceso a la plataforma
                        </span>

                    </div>


                    <div className="indicador">

                        <strong>
                            SST
                        </strong>

                        <span>
                            Enfoque en seguridad laboral
                        </span>

                    </div>

                </section>



                {/* =====================================================
                    NOSOTROS
                ===================================================== */}

                <section
                    className="seccion nosotros"
                    id="nosotros"
                >

                    <div className="seccion-etiqueta">
                        SOBRE CERTISAFE
                    </div>


                    <div className="nosotros-grid">

                        <div>

                            <h2>
                                Tecnología al servicio
                                de la seguridad laboral.
                            </h2>

                        </div>


                        <div>

                            <p>
                                CertiSafe es una plataforma
                                orientada a la gestión de
                                capacitación y certificaciones
                                relacionadas con la seguridad
                                laboral.
                            </p>

                            <p>
                                Nuestro objetivo es facilitar el
                                seguimiento de talleres,
                                participantes y certificaciones,
                                permitiendo mantener organizada
                                la información necesaria para el
                                desarrollo seguro de las
                                actividades laborales.
                            </p>

                        </div>

                    </div>

                </section>

                {/* =================================================
    SLIDER PRINCIPAL
================================================= */}

                <section className="slider">

                    <div className="slider-contenedor">

                        {slides.map((slide, indice) => (

                            <div
                                key={indice}
                                className={`slide ${
                                    indice === slideActual
                                        ? "slide-activo"
                                        : ""
                                }`}
                                style={{
                                    backgroundImage:
                                        `url("${slide.imagen}")`
                                }}
                            >

                                {/* Capa oscura para mejorar la lectura */}
                                <div className="slide-overlay"></div>


                                {/* Contenido */}
                                <div className="slide-contenido">

                    <span className="slide-etiqueta">
                        {slide.etiqueta}
                    </span>


                                    <h1>
                                        {slide.titulo}
                                    </h1>


                                    <p>
                                        {slide.descripcion}
                                    </p>


                                    <button
                                        className="slide-boton"
                                        onClick={() => {

                                            document
                                                .getElementById("certificaciones")
                                                ?.scrollIntoView({
                                                    behavior: "smooth"
                                                });

                                        }}
                                    >
                                        {slide.boton}

                                        <span>
                            →
                        </span>

                                    </button>

                                </div>

                            </div>

                        ))}


                        {/* =================================================
            BOTÓN ANTERIOR
        ================================================= */}

                        <button
                            className="slider-flecha slider-anterior"
                            onClick={slideAnterior}
                            aria-label="Imagen anterior"
                        >
                            ‹
                        </button>


                        {/* =================================================
            BOTÓN SIGUIENTE
        ================================================= */}

                        <button
                            className="slider-flecha slider-siguiente"
                            onClick={slideSiguiente}
                            aria-label="Imagen siguiente"
                        >
                            ›
                        </button>


                        {/* =================================================
            INDICADORES
        ================================================= */}

                        <div className="slider-indicadores">

                            {slides.map((_, indice) => (

                                <button
                                    key={indice}
                                    className={
                                        `slider-indicador ${
                                            indice === slideActual
                                                ? "indicador-activo"
                                                : ""
                                        }`
                                    }
                                    onClick={() =>
                                        setSlideActual(indice)
                                    }
                                    aria-label={
                                        `Ir a la diapositiva ${indice + 1}`
                                    }
                                />

                            ))}

                        </div>

                    </div>

                </section>

                {/* =====================================================
                    PILARES
                ===================================================== */}

                <section className="seccion pilares">

                    <div className="seccion-cabecera">

                        <div>

                            <span className="seccion-etiqueta">
                                NUESTRO ENFOQUE
                            </span>

                            <h2>
                                Una gestión integral
                                de la seguridad.
                            </h2>

                        </div>

                        <p>
                            CertiSafe integra diferentes
                            procesos para facilitar la
                            administración de la capacitación
                            y certificación de los operarios.
                        </p>

                    </div>


                    <div className="pilares-grid">

                        <article className="pilar">

                            <div className="pilar-icono">
                                01
                            </div>

                            <h3>
                                Capacitación
                            </h3>

                            <p>
                                Gestión de talleres y procesos
                                de formación orientados a la
                                seguridad laboral.
                            </p>

                        </article>


                        <article className="pilar">

                            <div className="pilar-icono">
                                02
                            </div>

                            <h3>
                                Certificación
                            </h3>

                            <p>
                                Seguimiento del estado de las
                                certificaciones de cada
                                operario.
                            </p>

                        </article>


                        <article className="pilar">

                            <div className="pilar-icono">
                                03
                            </div>

                            <h3>
                                Seguimiento
                            </h3>

                            <p>
                                Información organizada para
                                facilitar la consulta y control
                                de los procesos de seguridad.
                            </p>

                        </article>

                    </div>

                </section>


                {/* =====================================================
                    CERTIFICACIONES
                ===================================================== */}

                <section
                    className="seccion certificaciones"
                    id="certificaciones"
                >

                    <div className="seccion-cabecera">

                        <div>

                            <span className="seccion-etiqueta">
                                ÁREAS DE FORMACIÓN
                            </span>

                            <h2>
                                Certificaciones de seguridad
                            </h2>

                        </div>

                        <p>
                            Formación enfocada en algunos de
                            los principales escenarios de riesgo
                            dentro de las actividades laborales.
                        </p>

                    </div>


                    <div className="certificaciones-grid">


                        <article className="certificacion-card alturas">

                            <div className="certificacion-numero">
                                01
                            </div>

                            <div className="certificacion-contenido">

                                <span>
                                    CERTIFICACIÓN
                                </span>

                                <h3>
                                    Trabajo seguro
                                    en alturas
                                </h3>

                                <p>
                                    Formación orientada a la
                                    prevención y gestión segura
                                    de actividades realizadas
                                    en alturas.
                                </p>

                            </div>

                        </article>


                        <article className="certificacion-card quimicos">

                            <div className="certificacion-numero">
                                02
                            </div>

                            <div className="certificacion-contenido">

                                <span>
                                    CERTIFICACIÓN
                                </span>

                                <h3>
                                    Manejo seguro
                                    de productos quimicos
                                </h3>

                                <p>
                                    Conocimientos para el manejo
                                    responsable y seguro de
                                    productos químicos.
                                </p>

                            </div>

                        </article>


                        <article className="certificacion-card confinados">

                            <div className="certificacion-numero">
                                03
                            </div>

                            <div className="certificacion-contenido">

                                <span>
                                    CERTIFICACIÓN
                                </span>

                                <h3>
                                    Seguridad en espacios
                                    confinados
                                </h3>

                                <p>
                                    Formación para reconocer
                                    riesgos y aplicar medidas
                                    de seguridad en espacios
                                    confinados.
                                </p>

                            </div>

                        </article>


                    </div>

                </section>



                {/* =====================================================
                    LLAMADA A LA ACCIÓN
                ===================================================== */}

                <section className="cta">

                    <div>

                        <span>
                            CERTISAFE
                        </span>

                        <h2>
                            Construyamos juntos
                            una cultura de seguridad.
                        </h2>

                        <p>
                            Gestiona tus procesos de
                            capacitación y certificación
                            desde una sola plataforma.
                        </p>

                    </div>


                    <button
                        onClick={() => {

                            setMostrarRegistro(true);

                            setMostrarLogin(false);

                            setMostrarCambioContrasena(false);

                        }}
                    >
                        Crear una cuenta
                    </button>

                </section>

            </main>


            {/* =====================================================
                FOOTER
            ===================================================== */}

            <footer
                className="pie"
                id="contacto"
            >

                <div className="footer-contenido">


                    <div className="footer-marca">

                        <div className="footer-logo">

                            <span>
                                ✓
                            </span>

                            CERTISAFE

                        </div>

                        <p>
                            Plataforma para la gestión de
                            capacitación y certificaciones
                            de seguridad laboral.
                        </p>

                    </div>


                    <div className="footer-columna">

                        <h3>
                            Plataforma
                        </h3>

                        <a href="#inicio">
                            Inicio
                        </a>

                        <a href="#nosotros">
                            Nosotros
                        </a>

                        <a href="#certificaciones">
                            Certificaciones
                        </a>

                    </div>


                    <div className="footer-columna">

                        <h3>
                            Servicios
                        </h3>

                        <span>
                            Capacitación
                        </span>

                        <span>
                            Certificación
                        </span>

                        <span>
                            Seguimiento
                        </span>

                    </div>


                    <div className="footer-columna">

                        <h3>
                            Contacto
                        </h3>

                        <span>
                            Bogotá, Colombia
                        </span>

                        <span>
                            contacto@certisafe.com
                        </span>

                        <span>
                            +57 300 000 0000
                        </span>

                    </div>

                </div>


                <div className="footer-inferior">

                    <span>
                        © 2026 CertiSafe. Todos los derechos
                        reservados.
                    </span>

                    <span>
                        Seguridad • Capacitación • Certificación
                    </span>

                </div>

            </footer>


            {/* =====================================================
                MODAL LOGIN
            ===================================================== */}

            {mostrarLogin && (

                <div className="modal-overlay">

                    <div className="modal-login">

                        <button
                            className="modal-cerrar"
                            onClick={() => {

                                setMostrarLogin(false);
                                setMensajeLogin("");

                            }}
                        >
                            ×
                        </button>


                        <h2>
                            Iniciar sesión
                        </h2>

                        <p>
                            Ingresa tus datos para acceder
                            a CertiSafe.
                        </p>


                        <div className="campo">

                            <label>
                                Documento
                            </label>

                            <input
                                type="text"
                                placeholder="Número de documento"
                                value={documentoLogin}
                                onChange={(e) => {

                                    setDocumentoLogin(
                                        e.target.value
                                    );

                                    setMensajeLogin("");

                                }}
                            />

                        </div>


                        <div className="campo">

                            <label>
                                Contraseña
                            </label>

                            <input
                                type="password"
                                placeholder="Contraseña"
                                value={contrasenaLogin}
                                onChange={(e) => {

                                    setContrasenaLogin(
                                        e.target.value
                                    );

                                    setMensajeLogin("");

                                }}
                            />

                        </div>


                        <button
                            className="boton-ingresar"
                            disabled={
                                documentoLogin.trim() === "" ||
                                contrasenaLogin === "" ||
                                ingresando
                            }
                            onClick={iniciarSesion}
                        >

                            {ingresando
                                ? "Ingresando..."
                                : "Ingresar"}

                        </button>


                        {mensajeLogin && (

                            <p className="mensaje-login">
                                {mensajeLogin}
                            </p>

                        )}


                        <button
                            className="boton-cambiar"
                            onClick={() => {

                                setMostrarLogin(false);

                                setMostrarCambioContrasena(true);

                                setDocumentoCambio("");

                                setMensajeCambio("");

                            }}
                        >
                            Cambiar contraseña
                        </button>

                    </div>

                </div>

            )}


            {/* =====================================================
                MODAL REGISTRO
            ===================================================== */}

            {mostrarRegistro && (

                <div
                    className="modal-overlay"
                    onClick={(e) => {

                        if (
                            e.target === e.currentTarget
                        ) {

                            setMostrarRegistro(false);

                        }

                    }}
                >

                    <div className="modal-login modal-registro">

                        <button
                            className="modal-cerrar"
                            onClick={() =>
                                setMostrarRegistro(false)
                            }
                        >
                            ×
                        </button>


                        <RegistroUsuario
                            volverInicio={() =>
                                setMostrarRegistro(false)
                            }
                        />

                    </div>

                </div>

            )}


            {/* =====================================================
                MODAL RECUPERACIÓN
            ===================================================== */}

            {mostrarCambioContrasena && (

                <div
                    className="modal-overlay"
                    onClick={(e) => {

                        if (
                            e.target === e.currentTarget
                        ) {

                            setMostrarCambioContrasena(false);

                            setDocumentoCambio("");

                            setMensajeCambio("");

                            setSolicitandoRecuperacion(false);

                        }

                    }}
                >

                    <div className="modal-login">

                        <button
                            className="modal-cerrar"
                            onClick={() => {

                                setMostrarCambioContrasena(false);

                                setDocumentoCambio("");

                                setMensajeCambio("");

                                setSolicitandoRecuperacion(false);

                            }}
                        >
                            ×
                        </button>


                        <h2>
                            Recuperar contraseña
                        </h2>


                        <p>
                            Ingresa tu número de documento
                            para solicitar la recuperación
                            de tu contraseña.
                        </p>


                        <div className="campo">

                            <label>
                                Documento
                            </label>

                            <input
                                type="text"
                                placeholder="Número de documento"
                                value={documentoCambio}
                                onChange={(e) => {

                                    setDocumentoCambio(
                                        e.target.value
                                    );

                                    setMensajeCambio("");

                                }}
                                disabled={
                                    solicitandoRecuperacion
                                }
                            />

                        </div>


                        <button
                            className="boton-ingresar"
                            disabled={
                                documentoCambio.trim() === "" ||
                                solicitandoRecuperacion
                            }
                            onClick={
                                solicitarNuevaContrasena
                            }
                        >

                            {solicitandoRecuperacion
                                ? "Enviando..."
                                : "Solicitar nueva contraseña"}

                        </button>


                        {mensajeCambio && (

                            <p className="mensaje-cambio">
                                {mensajeCambio}
                            </p>

                        )}

                    </div>

                </div>

            )}

        </div>
    );
}

export default Inicio;
