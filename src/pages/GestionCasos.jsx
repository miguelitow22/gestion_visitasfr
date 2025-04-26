import React, { useState, useEffect, useRef } from "react";
import { obtenerCasos, actualizarCaso, subirEvidencia } from "../api";

export default function GestionCasos() {
  // Estados
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

  // Al seleccionar un caso
  const handleSeleccionarCaso = (caso) => {
    setCasoSeleccionado(caso);
    setEstado(caso.estado);
    setIntentosContacto(caso.intentos_contacto || 1);
    setObservaciones(caso.observaciones || "");
    setFechaReprogramacion(caso.fecha_visita || "");
    setHoraReprogramacion(caso.hora_visita || "");
    // Scroll al panel de detalles
    setTimeout(() => {
      detallesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Actualizar datos del caso
  const handleActualizarCaso = async (e) => {
    e.preventDefault();
    if (!casoSeleccionado) return alert("Seleccione un caso primero.");

    const estadosManuales = [
      "terminada",
      "cancelada por evaluado",
      "cancelada por VerifiK",
      "cancelada por Atlas",
      "subida al Drive",
      "reprogramada",
    ];
    if (!estadosManuales.includes(estado)) {
      return alert("Este estado solo puede cambiarse manualmente.");
    }

    const datosActualizados = {
      estado,
      intentos_contacto: intentosContacto,
      observaciones,
      ...(estado === "reprogramada" && {
        fecha_visita: fechaReprogramacion,
        hora_visita: horaReprogramacion,
      }),
    };

    try {
      await actualizarCaso(casoSeleccionado.id, datosActualizados);
      alert("Caso actualizado con éxito");
      // Reflejar cambios en lista y detalle
      setCasos((prev) =>
        prev.map((c) =>
          c.id === casoSeleccionado.id ? { ...c, ...datosActualizados } : c
        )
      );
      setCasoSeleccionado((prev) => ({ ...prev, ...datosActualizados }));
    } catch (err) {
      console.error(err);
      alert("Hubo un error al actualizar el caso.");
    }
  };

  // Subir evidencia
  const handleEvidenciaUpload = async () => {
    if (!casoSeleccionado || !evidencia) {
      return alert("Seleccione un caso y un archivo.");
    }
    try {
      const res = await subirEvidencia(casoSeleccionado.id, evidencia);
      if (res.url) {
        alert("Evidencia subida con éxito");
        setCasos((prev) =>
          prev.map((c) =>
            c.id === casoSeleccionado.id ? { ...c, evidencia_url: res.url } : c
          )
        );
        setCasoSeleccionado((prev) => ({ ...prev, evidencia_url: res.url }));
      } else {
        alert("Error al subir la evidencia.");
      }
    } catch {
      alert("Error en la subida.");
    }
  };

  // Filtrado y paginación
  const casosFiltrados = casos.filter((c) =>
    [c.nombre, c.cliente, c.estado, c.solicitud].some((campo) =>
      campo?.toLowerCase().includes(busqueda.toLowerCase())
    )
  );
  const inicio = (paginaActual - 1) * 12;
  const casosPaginados = casosFiltrados.slice(inicio, inicio + 12);

  return (
    <div className="container gestion-casos-container">
      <h2>Gestión de Casos</h2>

      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar caso..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="buscador-casos"
      />

      <div className="panel-casos">
        {/* Lista de Casos */}
        <aside className="casos-lista">
          <h3>Casos Registrados</h3>
          {casosPaginados.map((caso) => (
            <div
              key={caso.id}
              className={`caso-item ${casoSeleccionado?.id === caso.id ? "seleccionado" : ""}`}
              onClick={() => handleSeleccionarCaso(caso)}
            >
              <p>
                <strong>{caso.solicitud}</strong> — {caso.nombre}
              </p>
              <small>
                {caso.cliente} | {caso.estado}
              </small>
            </div>
          ))}

          {/* Paginación */}
          <div className="paginacion">
            <button
              onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
              disabled={paginaActual === 1}
            >
              «
            </button>
            <span>
              {paginaActual} / {Math.ceil(casosFiltrados.length / 12)}
            </span>
            <button
              onClick={() => setPaginaActual((p) => p + 1)}
              disabled={inicio + 12 >= casosFiltrados.length}
            >
              »
            </button>
          </div>
        </aside>

        {/* Panel Detalle */}
        {casoSeleccionado && (
          <main className="panel-detalles-actualizacion" ref={detallesRef}>
            <h3>
              Caso {casoSeleccionado.solicitud}: {casoSeleccionado.nombre}
            </h3>

            {/* Información General */}
            <section className="detalle-seccion">
              <h4>Información General</h4>
              <p>
                <strong>Cliente:</strong> {casoSeleccionado.cliente}
              </p>
              <p>
                <strong>Estado:</strong> {casoSeleccionado.estado}
              </p>
            </section>

            {/* Contacto */}
            <section className="detalle-seccion">
              <h4>Contacto</h4>
              <p>
                <strong>Intentos:</strong> {casoSeleccionado.intentos_contacto}
              </p>
              <p>
                <strong>Observaciones:</strong>{" "}
                {casoSeleccionado.observaciones || "—"}
              </p>
            </section>

            {/* Analista Asignado */}
            <section className="detalle-seccion">
              <h4>Analista Asignado</h4>
              <p>
                <strong>Nombre:</strong> {casoSeleccionado.analista_asignado || "—"}
              </p>
              <p>
                <strong>Email:</strong> {casoSeleccionado.analista_email || "—"}
              </p>
              <p>
                <strong>Teléfono:</strong> {casoSeleccionado.analista_telefono || "—"}
              </p>
            </section>

            {/* Ubicación */}
            <section className="detalle-seccion">
              <h4>Ubicación</h4>
              <p>
                <strong>Dirección:</strong> {casoSeleccionado.direccion || "—"}
              </p>
              <p>
                <strong>Barrio:</strong> {casoSeleccionado.barrio || "—"}
              </p>
              <p>
                <strong>Punto Ref.:</strong> {casoSeleccionado.punto_referencia || "—"}
              </p>
            </section>

            {/* Viáticos */}
            <section className="detalle-seccion">
              <h4>Viáticos y Gastos</h4>
              <p>
                <strong>Viáticos:</strong>{" "}
                ${casoSeleccionado.viaticos?.toLocaleString() || 0}
              </p>
              <p>
                <strong>Gastos Ad.:</strong>{" "}
                ${casoSeleccionado.gastos_adicionales?.toLocaleString() || 0}
              </p>
            </section>

            {/* Visita Programada */}
            <section className="detalle-seccion">
              <h4>Visita Programada</h4>
              <p>
                <strong>Fecha:</strong> {casoSeleccionado.fecha_visita || "—"}
              </p>
              <p>
                <strong>Hora:</strong> {casoSeleccionado.hora_visita || "—"}
              </p>
            </section>

            {/* Evidencia */}
            <section className="detalle-seccion">
              <h4>Evidencia</h4>
              <input
                type="file"
                onChange={(e) => setEvidencia(e.target.files[0])}
              />
              <button onClick={handleEvidenciaUpload}>Subir Evidencia</button>
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

            {/* Formulario Actualización */}
            <section className="detalle-seccion">
              <h4>Actualizar Caso</h4>
              <form onSubmit={handleActualizarCaso}>
                <label>Estado</label>
                <select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
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
                    <label>Fecha de Reprogramación</label>
                    <input
                      type="date"
                      value={fechaReprogramacion}
                      onChange={(e) => setFechaReprogramacion(e.target.value)}
                      required
                    />
                    <label>Hora de Reprogramación</label>
                    <input
                      type="time"
                      value={horaReprogramacion}
                      onChange={(e) => setHoraReprogramacion(e.target.value)}
                      required
                    />
                  </>
                )}

                <label>Observaciones</label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                />

                <button type="submit">Actualizar Caso</button>
              </form>
            </section>
          </main>
        )}
      </div>
    </div>
  );
}