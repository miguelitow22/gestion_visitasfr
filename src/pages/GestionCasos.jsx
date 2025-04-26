import React, { useState, useEffect, useRef } from "react";
import { obtenerCasos, actualizarCaso, subirEvidencia } from "../api";

export default function GestionCasos() {
  const [casos, setCasos] = useState([]);
  const [casoSeleccionado, setCasoSeleccionado] = useState(null);
  const [estado, setEstado] = useState("pendiente");
  const [intentosContacto, setIntentosContacto] = useState(1);
  const [observaciones, setObservaciones] = useState("");
  const [evidencia, setEvidencia] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const detallesRef = useRef(null);
  const [fechaReprogramacion, setFechaReprogramacion] = useState("");
  const [horaReprogramacion, setHoraReprogramacion] = useState("");

  // Carga inicial de casos
  useEffect(() => {
    (async () => {
      try {
        const data = await obtenerCasos();
        setCasos(data);
      } catch (err) {
        console.error("Error al cargar casos:", err);
      }
    })();
  }, []);

  // Selección de caso
  const handleSeleccionarCaso = (caso) => {
    setCasoSeleccionado(caso);
    setEstado(caso.estado);
    setIntentosContacto(caso.intentos_contacto || 1);
    setObservaciones(caso.observaciones || "");
    setFechaReprogramacion(caso.fecha_visita || "");
    setHoraReprogramacion(caso.hora_visita || "");
    setTimeout(() => detallesRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  // Actualizar caso
  const handleActualizarCaso = async (e) => {
    e.preventDefault();
    if (!casoSeleccionado) return alert("Seleccione un caso primero.");
    const manual = [
      "terminada",
      "cancelada por evaluado",
      "cancelada por VerifiK",
      "cancelada por Atlas",
      "subida al Drive",
      "reprogramada"
    ];
    if (!manual.includes(estado)) return alert("Estado solo manual.");

    const datos = {
      estado,
      intentos_contacto: intentosContacto,
      observaciones,
      ...(estado === "reprogramada" && {
        fecha_visita: fechaReprogramacion,
        hora_visita: horaReprogramacion
      })
    };
    try {
      await actualizarCaso(casoSeleccionado.id, datos);
      alert("Caso actualizado");
      setCasos(prev =>
        prev.map(c => (c.id === casoSeleccionado.id ? { ...c, ...datos } : c))
      );
      setCasoSeleccionado(prev => ({ ...prev, ...datos }));
    } catch {
      alert("Error al actualizar.");
    }
  };

  // Subir evidencia
  const handleEvidenciaUpload = async () => {
    if (!casoSeleccionado || !evidencia) return alert("Seleccione caso y archivo.");
    try {
      const res = await subirEvidencia(casoSeleccionado.id, evidencia);
      if (res.url) {
        alert("Evidencia subida");
        setCasos(prev =>
          prev.map(c =>
            c.id === casoSeleccionado.id ? { ...c, evidencia_url: res.url } : c
          )
        );
        setCasoSeleccionado(prev => ({ ...prev, evidencia_url: res.url }));
      } else {
        alert("Fallo al subir.");
      }
    } catch {
      alert("Error en subida.");
    }
  };

  // Filtrado y paginación
  const filtrados = casos.filter(c =>
    [c.nombre, c.cliente, c.estado, c.solicitud].some(field =>
      field?.toLowerCase().includes(busqueda.toLowerCase())
    )
  );
  const start = (paginaActual - 1) * 12;
  const paginados = filtrados.slice(start, start + 12);

  return (
    <div className="gestion-casos-container">
      <h2>Gestión de Casos</h2>
      <input
        className="buscador-casos"
        placeholder="Buscar…"
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
      />

      <div className="lista-y-detalle">
        <aside className="lista-casos">
          {paginados.map(caso => (
            <div
              key={caso.id}
              className={"caso-item " + (casoSeleccionado?.id === caso.id ? "sel" : "")}
              onClick={() => handleSeleccionarCaso(caso)}
            >
              <p>
                <strong>{caso.solicitud}</strong> - {caso.nombre}
              </p>
              <small>
                {caso.cliente} | {caso.estado}
              </small>
            </div>
          ))}
          <div className="paginacion">
            <button disabled={paginaActual === 1} onClick={() => setPaginaActual(p => p - 1)}>
              «
            </button>
            <span>
              {paginaActual}/{Math.ceil(filtrados.length / 12)}
            </span>
            <button
              disabled={start + 12 >= filtrados.length}
              onClick={() => setPaginaActual(p => p + 1)}
            >
              »
            </button>
          </div>
        </aside>

        {casoSeleccionado && (
          <main className="detalle-caso" ref={detallesRef}>
            <h3>
              #{casoSeleccionado.solicitud} - {casoSeleccionado.nombre}
            </h3>

            <section className="detalle-seccion">
              <h4>Información General</h4>
              <p>
                <strong>Cliente:</strong> {casoSeleccionado.cliente}
              </p>
              <p>
                <strong>Estado:</strong> {casoSeleccionado.estado}
              </p>
            </section>

            <section className="detalle-seccion">
              <h4>Datos de Contacto</h4>
              <p>
                <strong>Intentos:</strong> {casoSeleccionado.intentos_contacto}
              </p>
              <p>
                <strong>Observaciones:</strong> {casoSeleccionado.observaciones || "-"}
              </p>
            </section>

            <section className="detalle-seccion">
              <h4>Analista Asignado</h4>
              <p>
                <strong>Nombre:</strong> {casoSeleccionado.analista_asignado || "-"}
              </p>
              <p>
                <strong>Email:</strong> {casoSeleccionado.analista_email || "-"}
              </p>
              <p>
                <strong>Teléfono:</strong> {casoSeleccionado.analista_telefono || "-"}
              </p>
            </section>

            <section className="detalle-seccion">
              <h4>Dirección y Ubicación</h4>
              <p>
                <strong>Dirección:</strong> {casoSeleccionado.direccion || "-"}
              </p>
              <p>
                <strong>Barrio:</strong> {casoSeleccionado.barrio || "-"}
              </p>
              <p>
                <strong>Punto Ref.:</strong> {casoSeleccionado.punto_referencia || "-"}
              </p>
            </section>

            <section className="detalle-seccion">
              <h4>Viáticos y Gastos</h4>
              <p>
                <strong>Viáticos:</strong> $
                {casoSeleccionado.viaticos?.toLocaleString() || 0}
              </p>
              <p>
                <strong>Gastos Ad.:</strong> $
                {casoSeleccionado.gastos_adicionales?.toLocaleString() || 0}
              </p>
            </section>

            <section className="detalle-seccion">
              <h4>Visita Programada</h4>
              <p>
                <strong>Fecha:</strong> {casoSeleccionado.fecha_visita || "-"}
              </p>
              <p>
                <strong>Hora:</strong> {casoSeleccionado.hora_visita || "-"}
              </p>
            </section>

            <section className="detalle-seccion">
              <h4>Evidencia</h4>
              <input
                type="file"
                onChange={e => setEvidencia(e.target.files[0])}
              />
              <button onClick={handleEvidenciaUpload}>Subir</button>
              {casoSeleccionado.evidencia_url && (
                <p>
                  <a
                    href={casoSeleccionado.evidencia_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver Evidencia
                  </a>
                </p>
              )}
            </section>

            <section className="detalle-seccion">
              <h4>Actualizar Caso</h4>
              <form onSubmit={handleActualizarCaso}>
                <label>Estado</label>
                <select
                  value={estado}
                  onChange={e => setEstado(e.target.value)}
                >
                  <option>programada</option>
                  <option>cancelada por evaluado</option>
                  <option>cancelada por VerifiK</option>
                  <option>cancelada por Atlas</option>
                  <option>terminada</option>
                  <option>subida al Drive</option>
                  <option>reprogramada</option>
                </select>
                {estado === "reprogramada" && (
                  <>
                    <label>Fecha</label>
                    <input
                      type="date"
                      value={fechaReprogramacion}
                      onChange={e => setFechaReprogramacion(e.target.value)}
                      required
                    />
                    <label>Hora</label>
                    <input
                      type="time"
                      value={horaReprogramacion}
                      onChange={e => setHoraReprogramacion(e.target.value)}
                      required
                    />
                  </>
                )}
                <label>Observaciones</label>
                <textarea
                  value={observaciones}
                  onChange={e => setObservaciones(e.target.value)}
                />
                <button type="submit">Actualizar</button>
              </form>
            </section>
          </main>
        )}
      </div>
    </div>
  );
}