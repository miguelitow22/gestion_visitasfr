import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { obtenerCasos, actualizarCaso, subirEvidencia } from '../api';

/**
 * Estados permitidos para cambio manual de un caso.
 */
const ESTADOS_MANUALES = [
  'programada',
  'terminada',
  'cancelada por evaluado',
  'cancelada por VerifiK',
  'cancelada por Atlas',
  'subida al Drive',
  'reprogramada',
];

/**
 * GestionCasos component handles listing, filtering, pagination,
 * selection, updating, and evidence upload for case records.
 *
 * @component
 * @param {{ pageSize?: number }} props
 * @param {number} [props.pageSize] - Number of cases per page.
 * @returns {JSX.Element}
 */
const GestionCasos = React.memo(function GestionCasos({ pageSize }) {
  // Estados de la lista de casos
  const [casos, setCasos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);

  // Estados del caso seleccionado
  const [casoSeleccionado, setCasoSeleccionado] = useState(null);
  const [estado, setEstado] = useState(ESTADOS_MANUALES[0]);
  const [intentosContacto, setIntentosContacto] = useState(1);
  const [observaciones, setObservaciones] = useState('');
  const [fechaReprogramacion, setFechaReprogramacion] = useState('');
  const [horaReprogramacion, setHoraReprogramacion] = useState('');

  // Feedback UI
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const detallesRef = useRef(null);
  const evidenciaRef = useRef(null);

  // Carga inicial de casos
  useEffect(() => {
    (async () => {
      try {
        const data = await obtenerCasos();
        setCasos(data);
      } catch (err) {
        console.error('Error al cargar casos:', err);
      } finally {
        setCargando(false);
      }
    })();
  }, []);

  // Memo: filtrar y paginar casos
  const casosFiltrados = useMemo(
    () =>
      casos.filter(c =>
        [c.nombre, c.cliente, c.estado, c.solicitud]
          .some(field => field?.toLowerCase().includes(busqueda.toLowerCase()))
      ),
    [casos, busqueda]
  );
  const totalPaginas = Math.ceil(casosFiltrados.length / pageSize);
  const casosPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * pageSize;
    return casosFiltrados.slice(inicio, inicio + pageSize);
  }, [casosFiltrados, paginaActual, pageSize]);

  // Seleccionar un caso y preparar el formulario
  const handleSeleccionarCaso = useCallback(caso => {
    setCasoSeleccionado(caso);
    setEstado(caso.estado || ESTADOS_MANUALES[0]);
    setIntentosContacto(caso.intentos_contacto || 1);
    setObservaciones(caso.observaciones || '');
    setFechaReprogramacion(caso.fecha_visita || '');
    setHoraReprogramacion(caso.hora_visita || '');

    // Scroll al detalle
    setTimeout(() => {
      detallesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  // Actualizar datos del caso
  const handleActualizarCaso = useCallback(
    async e => {
      e.preventDefault();
      setUpdateError('');
      if (!casoSeleccionado) return;
      if (!ESTADOS_MANUALES.includes(estado)) {
        setUpdateError('Este estado solo puede cambiarse manualmente.');
        return;
      }
      const datos = {
        estado,
        intentos_contacto: intentosContacto,
        observaciones,
        ...(estado === 'reprogramada' && {
          fecha_visita: fechaReprogramacion,
          hora_visita: horaReprogramacion,
        }),
      };
      setIsUpdating(true);
      try {
        await actualizarCaso(casoSeleccionado.id, datos);
        // Sincronizar localmente
        setCasos(prev =>
          prev.map(c => (c.id === casoSeleccionado.id ? { ...c, ...datos } : c))
        );
        setCasoSeleccionado(prev => ({ ...prev, ...datos }));
      } catch (err) {
        console.error('Error al actualizar caso:', err);
        setUpdateError('Hubo un error al actualizar el caso.');
      } finally {
        setIsUpdating(false);
      }
    },
    [casoSeleccionado, estado, intentosContacto, observaciones, fechaReprogramacion, horaReprogramacion]
  );

  // Subir evidencia
  const handleEvidenciaUpload = useCallback(async () => {
    setUploadError('');
    if (!casoSeleccionado || !evidenciaRef.current) return;
    const file = evidenciaRef.current.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await subirEvidencia(casoSeleccionado.id, file);
      if (res.url) {
        setCasos(prev =>
          prev.map(c =>
            c.id === casoSeleccionado.id ? { ...c, evidencia_url: res.url } : c
          )
        );
        setCasoSeleccionado(prev => ({ ...prev, evidencia_url: res.url }));
      } else {
        setUploadError('Error al subir la evidencia.');
      }
    } catch (err) {
      console.error('Error en la subida:', err);
      setUploadError('Error en la subida.');
    } finally {
      setIsUploading(false);
    }
  }, [casoSeleccionado]);

  return (
    <div
      className="container gestion-casos-container"
      role="region"
      aria-labelledby="gestion-casos-title"
    >
      <h2 id="gestion-casos-title">Gestión de Casos</h2>

      {/* Buscador */}
      <input
        type="search"
        placeholder="Buscar caso..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
        aria-label="Buscar caso"
        className="buscador-casos"
      />

      <div className="panel-casos">
        {/* Lista de Casos */}
        <aside
          className="casos-lista"
          role="complementary"
          aria-labelledby="casos-lista-title"
        >
          <h3 id="casos-lista-title">Casos Registrados</h3>
          {cargando ? (
            <p>Cargando casos...</p>
          ) : (
            casosPaginados.map(caso => (
              <div
                key={caso.id}
                className={`caso-item ${
                  casoSeleccionado?.id === caso.id ? 'seleccionado' : ''
                }`}
                onClick={() => handleSeleccionarCaso(caso)}
                role="button"
                tabIndex={0}
                onKeyPress={e => {
                  if (e.key === 'Enter') handleSeleccionarCaso(caso);
                }}
                aria-pressed={casoSeleccionado?.id === caso.id}
              >
                <p>
                  <strong>{caso.solicitud}</strong> — {caso.nombre}
                </p>
                <small>
                  {caso.cliente} | {caso.estado}
                </small>
              </div>
            ))
          )}
          {/* Paginación */}
          <div className="paginacion">
            <button
              type="button"
              onClick={() => setPaginaActual(p => Math.max(p - 1, 1))}
              disabled={paginaActual === 1}
              aria-label="Página anterior"
            >
              «
            </button>
            <span aria-live="polite">
              {paginaActual} / {totalPaginas}
            </span>
            <button
              type="button"
              onClick={() => setPaginaActual(p => Math.min(p + 1, totalPaginas))}
              disabled={paginaActual === totalPaginas}
              aria-label="Página siguiente"
            >
              »
            </button>
          </div>
        </aside>

        {/* Detalles y Acciones */}
        {casoSeleccionado && (
          <main
            className="panel-detalles-actualizacion"
            ref={detallesRef}
            role="main"
            aria-labelledby="detalle-caso-title"
          >
            <h3 id="detalle-caso-title">
              Caso {casoSeleccionado.solicitud}: {casoSeleccionado.nombre}
            </h3>

            {/* Secciones de detalles (Información General, Contacto, etc.) */}
            {/* ... puedes mantener tu estructura original aquí ... */}

            {/* Evidencia */}
            <section className="detalle-seccion" aria-labelledby="evidencia-title">
              <h4 id="evidencia-title">Evidencia</h4>
              <input
                type="file"
                ref={evidenciaRef}
                aria-label="Seleccionar archivo de evidencia"
              />
              <button
                type="button"
                onClick={handleEvidenciaUpload}
                disabled={isUploading}
              >
                {isUploading ? 'Subiendo...' : 'Subir Evidencia'}
              </button>
              {uploadError && (
                <p role="alert" className="error-message">
                  {uploadError}
                </p>
              )}
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

            {/* Actualizar Caso */}
            <section className="detalle-seccion" aria-labelledby="actualizar-caso-title">
              <h4 id="actualizar-caso-title">Actualizar Caso</h4>
              <form onSubmit={handleActualizarCaso} noValidate>
                <label htmlFor="select-estado">Estado</label>
                <select
                  id="select-estado"
                  value={estado}
                  onChange={e => setEstado(e.target.value)}
                >
                  {ESTADOS_MANUALES.map(est => (
                    <option key={est} value={est}>
                      {est}
                    </option>
                  ))}
                </select>

                {estado === 'reprogramada' && (
                  <>
                    <label htmlFor="fecha-repro">Fecha de Reprogramación</label>
                    <input
                      id="fecha-repro"
                      type="date"
                      value={fechaReprogramacion}
                      onChange={e => setFechaReprogramacion(e.target.value)}
                      required
                    />
                    <label htmlFor="hora-repro">Hora de Reprogramación</label>
                    <input
                      id="hora-repro"
                      type="time"
                      value={horaReprogramacion}
                      onChange={e => setHoraReprogramacion(e.target.value)}
                      required
                    />
                  </>
                )}

                <label htmlFor="obs-textarea">Observaciones</label>
                <textarea
                  id="obs-textarea"
                  value={observaciones}
                  onChange={e => setObservaciones(e.target.value)}
                />

                {updateError && (
                  <p role="alert" className="error-message">
                    {updateError}
                  </p>
                )}
                <button type="submit" disabled={isUpdating}>
                  {isUpdating ? 'Actualizando...' : 'Actualizar Caso'}
                </button>
              </form>
            </section>
          </main>
        )}
      </div>
    </div>
  );
});

GestionCasos.propTypes = {
  pageSize: PropTypes.number,
};
GestionCasos.defaultProps = {
  pageSize: 12,
};

export default GestionCasos;