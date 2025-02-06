import { useState, useEffect } from "react";
import { obtenerCasos, crearCaso, actualizarCaso, subirEvidencia } from "../api";

function GestionCasos() {
    const [casos, setCasos] = useState([]);
    const [casoSeleccionado, setCasoSeleccionado] = useState(null);
    const [idCaso, setIdCaso] = useState("");
    const [nombre, setNombre] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");
    const [estado, setEstado] = useState("pendiente");
    const [intentosContacto, setIntentosContacto] = useState(0);
    const [evidencia, setEvidencia] = useState(null);
    const [tipoVisita, setTipoVisita] = useState("visita domiciliaria");
    const [direccion, setDireccion] = useState("");
    const [puntoReferencia, setPuntoReferencia] = useState("");
    const [fechaVisita, setFechaVisita] = useState("");
    const [horaVisita, setHoraVisita] = useState("");
    const [personaVisita, setPersonaVisita] = useState("JAIRO LOPEZ");
    const [motivoNoProgramada, setMotivoNoProgramada] = useState("");
    const [otroMotivo, setOtroMotivo] = useState("");
    const [observaciones, setObservaciones] = useState("");
    const [reprogramar, setReprogramar] = useState("SI");
    const [personaPrograma, setPersonaPrograma] = useState("HENRY MEDINA");
    const [solicitud, setSolicitud] = useState("");
    const [contacto, setContacto] = useState("Primera vez");
    const [cliente, setCliente] = useState("");
    const [cargo, setCargo] = useState("");
    const [documentoEvaluado, setDocumentoEvaluado] = useState("");
    const [regional, setRegional] = useState("Regional Antioquía");
    const [telefonoSecundario, setTelefonoSecundario] = useState("");
    const [telefonoTerciario, setTelefonoTerciario] = useState("");



    // ✅ Estado para paginación
    const [paginaActual, setPaginaActual] = useState(1);
    const casosPorPagina = 3;

    useEffect(() => {
        async function fetchData() {
            const data = await obtenerCasos();
            setCasos(data);
        }
        fetchData();
    }, []);

    // ✅ Cargar datos cuando se selecciona un caso
    const handleSeleccionarCaso = (caso) => {
        setCasoSeleccionado(caso);
        setEstado(caso.estado);
        setIntentosContacto(caso.intentos_contacto || 0);

    };


    // ✅ Crear nuevo caso (Se había olvidado en el código anterior)
    const handleCrearCaso = async (e) => {
        e.preventDefault();
        if (!idCaso || !nombre || !telefono || !email || !estado) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        const evaluadorEmails = {
            "HENRY MEDINA": "henrymedina@empresa.com",
            "MIRLIN ARTEAGA": "mirlinarteaga@empresa.com",
            "NATALIA AGUDELO": "nataliaagudelo@empresa.com",
            "SARAY LOPEZ": "saraylopez@empresa.com"
        };

        const estadosValidos = {
            "Programada": "pendiente", // 🔹 Convertir "Programada" a "pendiente"
            "No Programada": "standby"  // 🔹 Convertir "No Programada" a "standby"
        };



        const nuevoCaso = {
            id: idCaso,
            nombre,
            documento: documentoEvaluado || "",  // 🔹 Corregido (antes "documentoEvaluado")
            telefono,
            email,
            estado: estadosValidos[estado] || estado,
            tipo_visita: tipoVisita || "",  // 🔹 Corregido (antes "tipoVisita")
            direccion: estado === "Programada" ? direccion : "",
            punto_referencia: estado === "Programada" ? puntoReferencia : "",  // 🔹 Corregido (antes "puntoReferencia")
            fecha_visita: estado === "Programada" ? fechaVisita : "",
            hora_visita: estado === "Programada" ? horaVisita : "",
            intentos_contacto: intentosContacto || 0,
            motivo_no_programacion: motivoNoProgramada || "",  // 🔹 Corregido (antes "motivoNoProgramada")
            evaluador_email: evaluadorEmails[personaPrograma] || "",  // 🔹 Corregido (antes "personaPrograma")
            evaluador_asignado: personaVisita || "",  // 🔹 Corregido (antes "personaVisita")
            ultima_interaccion: new Date().toISOString(),  // 🔹 Agregado
            evidencia_url: "",  // 🔹 Placeholder para actualizar después de subir la evidencia
            solicitud,
            contacto,
            cliente,
            cargo,
            regional,
            telefonoSecundario,
            telefonoTerciario,
        };



        // ✅ Validación de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Por favor, ingrese un correo electrónico válido.");
            return;
        }


        try {
            console.log("Enviando datos al backend:", nuevoCaso);
            await crearCaso(nuevoCaso);
            alert("Caso creado con éxito");
            setIdCaso("");
            setNombre("");
            setTelefono("");
            setEmail("");
            setEstado("pendiente");
        } catch (error) {
            console.error("Error al guardar el caso:", error);
            alert(`Hubo un error al guardar el caso: ${error.message}`);
        }

    };

    // ✅ Actualizar caso existente
    const handleActualizarCaso = async (e) => {
        e.preventDefault();
        if (!casoSeleccionado) {
            alert("Seleccione un caso para actualizar.");
            return;
        }

        const datosActualizados = {
            estado,
            intentos_contacto: intentosContacto,
        };

        try {
            await actualizarCaso(casoSeleccionado.id, datosActualizados);
            alert("Caso actualizado con éxito");
        } catch (error) {
            alert("Hubo un error al actualizar el caso.");
        }
    };

    const handleEvidenciaUpload = async () => {
        if (!casoSeleccionado || !evidencia) {
            alert("Debe seleccionar un caso y un archivo antes de subir la evidencia.");
            return;
        }

        try {
            const response = await subirEvidencia(casoSeleccionado.id, evidencia);
            if (response && response.url) {
                alert("Evidencia subida con éxito");
                setCasos(prevCasos =>
                    prevCasos.map(c =>
                        c.id === casoSeleccionado.id ? { ...c, evidencia_url: response.url } : c
                    )
                );
            } else {
                alert("Error al subir la evidencia.");
            }
        } catch (error) {
            alert("Hubo un error al subir la evidencia.");
        }
    };


    // ✅ Paginación
    const indiceFinal = paginaActual * casosPorPagina;
    const indiceInicial = indiceFinal - casosPorPagina;
    const casosPaginados = casos.slice(indiceInicial, indiceFinal);

    return (
        <div className="container">
            <h2>Gestión de Casos</h2>

            <div className="gestion-layout">
                {/* ✅ Panel de Creación de Casos */}
                <div className="panel-creacion">
                    <h3>Crear Nuevo Caso</h3>
                    <form onSubmit={handleCrearCaso} className="form-container">
                        <label>ID del Caso</label>
                        <input type="text" value={idCaso} onChange={(e) => setIdCaso(e.target.value)} required />

                        <label>Nombre</label>
                        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />

                        <label>Teléfono</label>
                        <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />

                        <label>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        {/* ✅ Persona que programa la visita */}
                        <label>Persona que Programa la Visita:</label>
                        <select value={personaPrograma} onChange={(e) => setPersonaPrograma(e.target.value)}>
                            <option value="HENRY MEDINA">HENRY MEDINA</option>
                            <option value="MIRLIN ARTEAGA">MIRLIN ARTEAGA</option>
                            <option value="NATALIA AGUDELO">NATALIA AGUDELO</option>
                            <option value="SARAY LOPEZ">SARAY LOPEZ</option>
                        </select>

                        {/* ✅ Solicitud */}
                        <label>Solicitud:</label>
                        <input type="text" value={solicitud} onChange={(e) => setSolicitud(e.target.value)} required />

                        {/* ✅ Contacto */}
                        <label>¿Primera o Segunda vez que se contacta?</label>
                        <select value={contacto} onChange={(e) => setContacto(e.target.value)}>
                            <option value="Primera vez">Primera vez</option>
                            <option value="Segunda vez">Segunda vez</option>
                        </select>

                        {/* ✅ Cliente */}
                        <label>Cliente:</label>
                        <input type="text" value={cliente} onChange={(e) => setCliente(e.target.value)} required />

                        {/* ✅ Cargo */}
                        <label>Cargo:</label>
                        <input type="text" value={cargo} onChange={(e) => setCargo(e.target.value)} required />

                        {/* ✅ Documento del Evaluado */}
                        <label>Documento del Evaluado:</label>
                        <input type="text" value={documentoEvaluado} onChange={(e) => setDocumentoEvaluado(e.target.value)} required />

                        {/* ✅ Regional */}
                        <label>Regional:</label>
                        <select value={regional} onChange={(e) => setRegional(e.target.value)}>
                            <option value="Regional Antioquía">Regional Antioquía</option>
                            <option value="Regional Caribe">Regional Caribe</option>
                            <option value="Regional Centro">Regional Centro</option>
                            <option value="Regional Eje Cafetero">Regional Eje Cafetero</option>
                            <option value="Regional Nororiente">Regional Nororiente</option>
                            <option value="Regional Occidente">Regional Occidente</option>
                            <option value="Regional Oriente">Regional Oriente</option>
                        </select>

                        {/* ✅ Teléfonos Adicionales */}
                        <label>Teléfono Secundario:</label>
                        <input type="tel" value={telefonoSecundario} onChange={(e) => setTelefonoSecundario(e.target.value)} />

                        <label>Teléfono Terciario:</label>
                        <input type="tel" value={telefonoTerciario} onChange={(e) => setTelefonoTerciario(e.target.value)} />

                        <label>Tipo de Visita:</label>
                        <select value={tipoVisita} onChange={(e) => setTipoVisita(e.target.value)}>
                            <option value="visita domiciliaria">Visita Domiciliaria</option>
                            <option value="visita de rutina">Visita de Rutina</option>
                            <option value="visita de Atlas Seguridad">Visita de Atlas Seguridad</option>
                        </select>


                        <label>Estado de la Visita:</label>
                        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                            <option value="Programada">Programada</option>
                            <option value="No Programada">No Programada</option>
                        </select>

                        {estado === "Programada" && (
                            <>
                                <label>Dirección:</label>
                                <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />

                                <label>Punto de Referencia:</label>
                                <input type="text" value={puntoReferencia} onChange={(e) => setPuntoReferencia(e.target.value)} required />

                                <label>Fecha:</label>
                                <input type="date" value={fechaVisita} onChange={(e) => setFechaVisita(e.target.value)} required />

                                <label>Hora:</label>
                                <input type="time" value={horaVisita} onChange={(e) => setHoraVisita(e.target.value)} required />

                                <label>Persona que Realiza la Visita:</label>
                                <select value={personaVisita} onChange={(e) => setPersonaVisita(e.target.value)}>
                                    <option value="JAIRO LOPEZ">JAIRO LOPEZ</option>
                                </select>
                            </>
                        )}

                        {estado === "No Programada" && (
                            <>
                                <label>Motivo:</label>
                                <select value={motivoNoProgramada} onChange={(e) => setMotivoNoProgramada(e.target.value)}>
                                    <option value="NUMERO ERRADO">NUMERO ERRADO</option>
                                    <option value="NUMERO FUERA DE SERVICIO">NUMERO FUERA DE SERVICIO</option>
                                    <option value="NO CONTESTAN">NO CONTESTAN</option>
                                    <option value="EL EVALUADO NO TIENE TIEMPO">EL EVALUADO NO TIENE TIEMPO</option>
                                    <option value="OTRO">OTRO</option>
                                </select>

                                {motivoNoProgramada === "OTRO" && (
                                    <>
                                        <label>Otro Motivo:</label>
                                        <input type="text" value={otroMotivo} onChange={(e) => setOtroMotivo(e.target.value)} />
                                    </>
                                )}

                                <label>Observaciones:</label>
                                <textarea value={observaciones} onChange={(e) => setObservaciones(e.target.value)}></textarea>

                                <label>¿Se reprogramará?</label>
                                <select value={reprogramar} onChange={(e) => setReprogramar(e.target.value)}>
                                    <option value="SI">SI, VOLVEREMOS A INTENTAR COMUNICACIÓN</option>
                                    <option value="NO">NO, SE RECHAZA</option>
                                </select>
                            </>
                        )}


                        <button type="submit" className="btn btn-primary">Crear Caso</button>
                    </form>
                </div>

                {/* ✅ Panel de Casos Registrados con Paginación */}
                <div className="panel-casos">
                    <h3>Casos Registrados</h3>
                    <div className="casos-lista">
                        {casosPaginados.map((caso) => (
                            <div key={caso.id} className={`caso-item ${casoSeleccionado?.id === caso.id ? "seleccionado" : ""}`}
                                onClick={() => handleSeleccionarCaso(caso)}>
                                <p><strong>ID:</strong> {caso.id}</p>
                                <p><strong>Nombre:</strong> {caso.nombre}</p>
                                <p><strong>Estado:</strong> {caso.estado}</p>

                            </div>

                        ))}
                    </div>
                    {/* ✅ Controles de Paginación */}
                    <div className="paginacion">
                        <button
                            onClick={() => setPaginaActual(paginaActual - 1)}
                            disabled={paginaActual === 1}>
                            Anterior
                        </button>
                        <span>Página {paginaActual}</span>
                        <button
                            onClick={() => setPaginaActual(paginaActual + 1)}
                            disabled={indiceFinal >= casos.length}>
                            Siguiente
                        </button>
                    </div>


                    {/* ✅ Ahora movemos el panel de actualización aquí mismo */}
                    {casoSeleccionado && (
                        <div className="panel-seleccionado">
                            <h3>Detalles del Caso Seleccionado</h3>
                            <p><strong>ID:</strong> {casoSeleccionado.id}</p>
                            <p><strong>Nombre:</strong> {casoSeleccionado.nombre}</p>
                            <p><strong>Teléfono:</strong> {casoSeleccionado.telefono}</p>
                            <p><strong>Email:</strong> {casoSeleccionado.email}</p>
                            <p><strong>Estado:</strong> {casoSeleccionado.estado}</p>
                            <p><strong>Intentos de Contacto:</strong> {casoSeleccionado.intentos_contacto}</p>

                            {/* ✅ Subir Evidencia */}
                            <h3>Subir Evidencia</h3>
                            <input type="file" onChange={(e) => setEvidencia(e.target.files[0])} />
                            <button onClick={handleEvidenciaUpload} className="btn btn-evidencia">Subir Evidencia</button>

                            {/* ✅ Mostrar link si ya hay evidencia */}
                            {casoSeleccionado?.evidencia_url && (
                                <p>
                                    📂 <a href={casoSeleccionado.evidencia_url} target="_blank" rel="noopener noreferrer">
                                        Ver Evidencia
                                    </a>
                                </p>
                            )}


                            {/* ✅ Formulario para actualizar caso */}
                            <h3>Actualizar Caso</h3>
                            <form onSubmit={handleActualizarCaso} className="form-container">
                                <label>Estado</label>
                                <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                                    <option value="pendiente">Pendiente</option>
                                    <option value="en curso">En Curso</option>
                                    <option value="completado">Completado</option>
                                    <option value="standby">Standby</option>
                                </select>
                                <label>Intentos de Contacto</label>
                                <input type="number" value={intentosContacto} onChange={(e) => setIntentosContacto(e.target.value)} />
                                <button type="submit" className="btn btn-primary">Actualizar Caso</button>
                            </form>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default GestionCasos;
