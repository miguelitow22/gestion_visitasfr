import { useState, useEffect, useRef } from "react";
import { obtenerCasos, actualizarCaso, subirEvidencia } from "../api";

function GestionCasos() {
  const [casos, setCasos] = useState([]);
  const [casoSeleccionado, setCasoSeleccionado] = useState(null);
  const [estado, setEstado] = useState("pendiente");
  const [intentosContacto, setIntentosContacto] = useState(1);
  const [observaciones, setObservaciones] = useState("");
  const [evidencia, setEvidencia] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const casosPorPagina = 12;
  const detallesRef = useRef(null);
  const [visitaDrive, setVisitaDrive] = useState("");


  useEffect(() => {
    async function fetchData() {
      const data = await obtenerCasos();
      setCasos(data);
    }
    fetchData();
  }, []);

  const handleSeleccionarCaso = (caso) => {
    setCasoSeleccionado(caso);
    setEstado(caso.estado);
    setIntentosContacto(caso.intentos_contacto || 1);
    setObservaciones(caso.observaciones || "");
    
    setTimeout(() => {
      detallesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleActualizarCaso = async (e) => {
    e.preventDefault();
    if (!casoSeleccionado) {
      alert("Seleccione un caso para actualizar.");
      return;
    }

    const estadosManuales = ["cancelada por evaluado", "cancelada por VerifiK", "cancelada por Atlas", "terminada","subida al Drive"];
    if (!estadosManuales.includes(estado)) {
      alert("Este estado solo puede cambiarse automáticamente.");
      return;
    }

    const datosActualizados = { estado, intentos_contacto: intentosContacto, observaciones };
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

  const indiceFinal = paginaActual * casosPorPagina;
  const indiceInicial = indiceFinal - casosPorPagina;
  const casosPaginados = casos.slice(indiceInicial, indiceFinal);

  return (
    <div id="gestion-casos-section" className="container gestion-casos-container">
      <h2>Gestión de Casos</h2>
      <div className="panel-casos">
        <h3>Casos Registrados</h3>
        <div className="casos-lista">
          {casosPaginados.map((caso) => (
            <div key={caso.id} className={`caso-item ${casoSeleccionado?.id === caso.id ? "seleccionado" : ""}`}
              onClick={() => handleSeleccionarCaso(caso)}>
              <p><strong>Solicitud:</strong> {caso.solicitud}</p>
              <p><strong>Nombre:</strong> {caso.nombre}</p>
              <p><strong>Empresa:</strong> {caso.cliente}</p>
              <p><strong>Estado:</strong> {caso.estado}</p>
            </div>
          ))}
        </div>
        <div className="paginacion">
          <button onClick={() => setPaginaActual(paginaActual - 1)} disabled={paginaActual === 1}>Anterior</button>
          <span>Página {paginaActual}</span>
          <button onClick={() => setPaginaActual(paginaActual + 1)} disabled={indiceFinal >= casos.length}>Siguiente</button>
        </div>
        {casoSeleccionado && (
          <div ref={detallesRef} className="panel-detalles-actualizacion">
            <div className="panel-detalles">
              <h3>Detalles del Caso Seleccionado</h3>
              <p><strong>Solicitud:</strong> {casoSeleccionado.solicitud}</p>
              <p><strong>Nombre:</strong> {casoSeleccionado.nombre}</p>
              <p><strong>Empresa:</strong> {casoSeleccionado.cliente}</p>
              <p><strong>Intentos de Contacto:</strong> {casoSeleccionado.intentos_contacto}</p>
              <p><strong>Observaciones:</strong> {casoSeleccionado.observaciones || "Sin observaciones"}</p>
              <h3>Subir Evidencia</h3>
              <input type="file" onChange={(e) => setEvidencia(e.target.files[0])} />
              <button onClick={handleEvidenciaUpload} className="btn btn-evidencia">Subir Evidencia</button>
              {casoSeleccionado?.evidencia_url && (
                <p>📂 <a href={casoSeleccionado.evidencia_url} target="_blank" rel="noopener noreferrer">Ver Evidencia</a></p>
              )}
            </div>
            <div className="panel-actualizacion">
              <h3>Actualizar Caso</h3>
              <form onSubmit={handleActualizarCaso} className="form-container">
                <label>Estado</label>
                <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                  <option value="programada">Programada</option>
                  <option value="cancelada por evaluado">Cancelada por Evaluado</option>
                  <option value="cancelada por VerifiK">Cancelada por VerifiK</option>
                  <option value="cancelada por Atlas">Cancelada por Atlas</option>
                  <option value="terminada">Terminada</option>
                  <option value="subida al Drive">Subida al Drive</option>
                </select>
                <label>Intentos de Contacto</label>
                <select value={intentosContacto} onChange={(e) => setIntentosContacto(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
                <label>Observaciones</label>
                <textarea value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />
                <button type="submit" className="btn btn-primary">Actualizar Caso</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GestionCasos;
