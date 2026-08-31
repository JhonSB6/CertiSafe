import { useState } from "react";
import "./CargaMasivaUsuarios.css";

function CargaMasivaUsuarios() {

    const [archivo, setArchivo] = useState(null);
    const [validando, setValidando] = useState(false);
    const [confirmando, setConfirmando] = useState(false);

    const [resultado, setResultado] = useState(null);
    const [error, setError] = useState("");


    // =========================================
    // DESCARGAR PLANTILLA
    // =========================================

    const descargarPlantilla = async () => {

        try {

            setError("");

            const respuesta = await fetch(
                "http://localhost:8080/api/carga-masiva-usuarios/plantilla"
            );

            if (!respuesta.ok) {
                throw new Error(
                    "No se pudo descargar la plantilla."
                );
            }

            const blob = await respuesta.blob();

            const url = window.URL.createObjectURL(blob);

            const enlace = document.createElement("a");

            enlace.href = url;

            enlace.download =
                "plantilla_usuarios_certisafe.xlsx";

            document.body.appendChild(enlace);

            enlace.click();

            enlace.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {

            console.error(
                "Error descargando plantilla:",
                error
            );

            setError(
                "No se pudo descargar la plantilla."
            );
        }
    };


    // =========================================
    // SELECCIONAR ARCHIVO
    // =========================================

    const seleccionarArchivo = (event) => {

        const archivoSeleccionado =
            event.target.files[0];

        setError("");
        setResultado(null);

        if (!archivoSeleccionado) {
            return;
        }

        const nombre =
            archivoSeleccionado.name.toLowerCase();

        if (!nombre.endsWith(".xlsx")) {

            setError(
                "Seleccione un archivo Excel en formato .xlsx."
            );

            event.target.value = "";

            return;
        }

        setArchivo(archivoSeleccionado);
    };


    // =========================================
    // VALIDAR ARCHIVO
    // =========================================

    const validarArchivo = async () => {

        if (!archivo) {

            setError(
                "Primero debe seleccionar un archivo Excel."
            );

            return;
        }

        try {

            setValidando(true);
            setError("");
            setResultado(null);

            const formulario = new FormData();

            formulario.append(
                "archivo",
                archivo
            );

            const respuesta = await fetch(
                "http://localhost:8080/api/carga-masiva-usuarios/validar",
                {
                    method: "POST",
                    body: formulario
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {

                throw new Error(
                    typeof datos === "string"
                        ? datos
                        : "No se pudo validar el archivo."
                );
            }

            setResultado(datos);

        } catch (error) {

            console.error(
                "Error validando archivo:",
                error
            );

            setError(
                error.message ||
                "Ocurrió un error al validar el archivo."
            );

        } finally {

            setValidando(false);
        }
    };


    // =========================================
    // CONFIRMAR CARGA
    // =========================================

    const confirmarCarga = async () => {

        if (
            !resultado ||
            !resultado.exitoso ||
            !resultado.usuarios ||
            resultado.usuarios.length === 0
        ) {
            return;
        }

        try {

            setConfirmando(true);
            setError("");

            const respuesta = await fetch(
                "http://localhost:8080/api/carga-masiva-usuarios/confirmar",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(
                        resultado.usuarios
                    )
                }
            );

            const mensaje =
                await respuesta.text();

            if (!respuesta.ok) {

                throw new Error(mensaje);
            }

            alert(mensaje);

            setArchivo(null);
            setResultado(null);

            const input =
                document.getElementById(
                    "archivo-carga-masiva"
                );

            if (input) {
                input.value = "";
            }

        } catch (error) {

            console.error(
                "Error confirmando carga:",
                error
            );

            setError(
                error.message ||
                "No se pudo confirmar la carga."
            );

        } finally {

            setConfirmando(false);
        }
    };


    // =========================================
    // LIMPIAR
    // =========================================

    const limpiar = () => {

        setArchivo(null);
        setResultado(null);
        setError("");

        const input =
            document.getElementById(
                "archivo-carga-masiva"
            );

        if (input) {
            input.value = "";
        }
    };


    return (

        <section className="seccion-carga-masiva">

            {/* =================================
                ENCABEZADO
            ================================== */}

            <div className="encabezado-carga-masiva">

                <div>

                    <h1>
                        Carga masiva de usuarios
                    </h1>

                    <p>
                        Registra solicitudes de usuarios mediante un archivo Excel.
                    </p>

                </div>

            </div>


            {/* =================================
                PLANTILLA
            ================================== */}

            <div className="panel-plantilla-carga">

                <div>

                    <h2>
                        Paso 1. Preparar archivo
                    </h2>

                    <p>
                        Utilice la plantilla oficial de
                        CertiSafe para registrar los usuarios.
                    </p>

                </div>

                <button
                    type="button"
                    className="boton-descargar-plantilla"
                    onClick={descargarPlantilla}
                >
                    Descargar plantilla
                </button>

            </div>


            {/* =================================
                SUBIR ARCHIVO
            ================================== */}

            <div className="panel-subir-carga">

                <h2>
                    Paso 2. Seleccionar archivo
                </h2>

                <div className="zona-archivo">

                    <div className="icono-archivo">
                        📄
                    </div>

                    <h3>
                        Seleccione el archivo Excel
                    </h3>

                    <p>
                        Formato permitido: .xlsx
                    </p>

                    <label
                        htmlFor="archivo-carga-masiva"
                        className="boton-seleccionar-archivo"
                    >
                        Seleccionar archivo
                    </label>

                    <input
                        id="archivo-carga-masiva"
                        type="file"
                        accept=".xlsx"
                        onChange={seleccionarArchivo}
                        hidden
                    />

                </div>


                {/* ARCHIVO SELECCIONADO */}

                {archivo && (

                    <div className="archivo-seleccionado">

                        <span>
                            📎
                        </span>

                        <strong>
                            {archivo.name}
                        </strong>

                    </div>
                )}


                {/* ERROR */}

                {error && (

                    <div className="mensaje-error-carga">

                        {error}

                    </div>
                )}


                <div className="acciones-carga">

                    {archivo && (

                        <button
                            type="button"
                            className="boton-validar-carga"
                            onClick={validarArchivo}
                            disabled={validando}
                        >
                            {validando
                                ? "Validando..."
                                : "Validar archivo"
                            }
                        </button>
                    )}

                </div>

            </div>


            {/* =================================
                RESULTADO
            ================================== */}

            {resultado && (

                <div className="panel-resultado-carga">

                    {resultado.exitoso ? (

                        <>

                            <div className="resultado-exitoso">

                                <span>
                                    ✓
                                </span>

                                <div>

                                    <h2>
                                        Archivo validado correctamente
                                    </h2>

                                    <p>
                                        Todos los registros
                                        cumplen las validaciones.
                                    </p>

                                </div>

                            </div>


                            <div className="resumen-carga">

                                <div>
                                    <span>
                                        Registros
                                    </span>

                                    <strong>
                                        {resultado.totalRegistros}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Válidos
                                    </span>

                                    <strong>
                                        {resultado.registrosValidos}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Errores
                                    </span>

                                    <strong>
                                        {resultado.registrosConError}
                                    </strong>
                                </div>

                            </div>


                            <h3>
                                Usuarios que serán registrados
                            </h3>


                            <div className="tabla-usuarios-carga">

                                <div className="fila encabezado-tabla">

                                    <span>
                                        Documento
                                    </span>

                                    <span>
                                        Nombre
                                    </span>

                                    <span>
                                        Correo
                                    </span>

                                    <span>
                                        Rol
                                    </span>

                                </div>


                                {resultado.usuarios.map(
                                    (usuario, index) => (

                                        <div
                                            className="fila"
                                            key={index}
                                        >

                                            <span>
                                                {usuario.documento}
                                            </span>

                                            <span>
                                                {usuario.nombre}{" "}
                                                {usuario.apellido}
                                            </span>

                                            <span>
                                                {usuario.correo}
                                            </span>

                                            <span>
                                                {usuario.rol}
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>


                            <div className="acciones-confirmacion">

                                <button
                                    type="button"
                                    className="boton-cancelar-carga"
                                    onClick={limpiar}
                                    disabled={confirmando}
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="button"
                                    className="boton-confirmar-carga"
                                    onClick={confirmarCarga}
                                    disabled={confirmando}
                                >
                                    {confirmando
                                        ? "Confirmando..."
                                        : "Confirmar carga"
                                    }
                                </button>

                            </div>

                        </>

                    ) : (

                        <>

                            <div className="resultado-error">

                                <span>
                                    ✕
                                </span>

                                <div>

                                    <h2>
                                        No se puede realizar la carga
                                    </h2>

                                    <p>
                                        Corrija los errores encontrados
                                        y vuelva a cargar el archivo.
                                    </p>

                                </div>

                            </div>


                            <div className="resumen-carga">

                                <div>
                                    <span>
                                        Registros
                                    </span>

                                    <strong>
                                        {resultado.totalRegistros}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Válidos
                                    </span>

                                    <strong>
                                        {resultado.registrosValidos}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Con errores
                                    </span>

                                    <strong>
                                        {resultado.registrosConError}
                                    </strong>
                                </div>

                            </div>


                            <h3>
                                Errores encontrados
                            </h3>


                            <div className="tabla-errores-carga">

                                <div className="fila-error encabezado-error">

                                    <span>
                                        Fila
                                    </span>

                                    <span>
                                        Campo
                                    </span>

                                    <span>
                                        Valor
                                    </span>

                                    <span>
                                        Causa
                                    </span>

                                </div>


                                {resultado.errores.map(
                                    (errorCarga, index) => (

                                        <div
                                            className="fila-error"
                                            key={index}
                                        >

                                            <span>
                                                {errorCarga.fila}
                                            </span>

                                            <span>
                                                {errorCarga.campo}
                                            </span>

                                            <span>
                                                {errorCarga.valor}
                                            </span>

                                            <span>
                                                {errorCarga.mensaje}
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>


                            <div className="acciones-error-carga">

                                <button
                                    type="button"
                                    className="boton-nueva-carga"
                                    onClick={limpiar}
                                >
                                    Corregir archivo y volver a cargar
                                </button>

                            </div>

                        </>
                    )}

                </div>
            )}

        </section>
    );
}

export default CargaMasivaUsuarios;
