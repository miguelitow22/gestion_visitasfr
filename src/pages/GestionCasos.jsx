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
    
    // ✅ Estado para paginación
    const [paginaActual, setPaginaActual] = useState(1);
    const casosPorPagina = 6;

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

        const nuevoCaso = {
            id: idCaso,
            nombre,
            telefono,
            email,
            estado,
            intentos_contacto: 0,
            evaluador_email: "evaluador@example.com"
        };

        try {
            await crearCaso(nuevoCaso);
            alert("Caso creado con éxito");
            setIdCaso("");
            setNombre("");
            setTelefono("");
            setEmail("");
            setEstado("pendiente");
        } catch (error) {
            alert("Hubo un error al guardar el caso.");
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

    // ✅ Subir evidencia
    const handleEvidenciaUpload = async () => {
        if (!casoSeleccionado || !evidencia) {
            alert("Debe seleccionar un caso y un archivo antes de subir la evidencia.");
            return;
        }

        try {
            const response = await subirEvidencia(casoSeleccionado.id, evidencia);
            if (response && response.url) {
                alert("Evidencia subida con éxito");
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
                        <button onClick={() => setPaginaActual(paginaActual - 1)} disabled={paginaActual === 1}>Anterior</button>
                        <span>Página {paginaActual}</span>
                        <button onClick={() => setPaginaActual(paginaActual + 1)} disabled={indiceFinal >= casos.length}>Siguiente</button>
                    </div>
                </div>

                {/* ✅ Panel del Caso Seleccionado con Actualización y Evidencia */}
                {casoSeleccionado && (
                    <div className="panel-seleccionado">
                        <h3>Detalles del Caso Seleccionado</h3>
                        <p><strong>ID:</strong> {casoSeleccionado.id}</p>
                        <p><strong>Nombre:</strong> {casoSeleccionado.nombre}</p>
                        <p><strong>Teléfono:</strong> {casoSeleccionado.telefono}</p>
                        <p><strong>Email:</strong> {casoSeleccionado.email}</p>
                        <p><strong>Estado:</strong> {casoSeleccionado.estado}</p>
                        <p><strong>Intentos de Contacto:</strong> {casoSeleccionado.intentos_contacto}</p>

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
    );
}

export default GestionCasos;
