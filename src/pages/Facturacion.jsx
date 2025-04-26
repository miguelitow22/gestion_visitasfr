import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * Facturacion component renders a form to select start and end dates
 * and generates an Excel billing report by downloading a file from the API.
 * It handles loading and error states and provides inline feedback.
 *
 * @component
 * @param {{ apiUrl?: string }} props
 * @param {string} [props.apiUrl] - Base API URL for billing endpoint.
 * @returns {JSX.Element}
 */
const Facturacion = React.memo(function Facturacion({ apiUrl }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = useCallback(
    async (e) => {
      e.preventDefault();
      setError('');
      // Validación de fechas
      if (!startDate || !endDate) {
        setError('Debes seleccionar ambas fechas.');
        return;
      }
      if (new Date(startDate) > new Date(endDate)) {
        setError('La fecha de inicio no puede ser posterior a la fecha de fin.');
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `${apiUrl}/api/facturacion?startDate=${startDate}&endDate=${endDate}`
        );
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Error en la respuesta del servidor');
        }
        const blob = await response.blob();
        // Crear enlace para descarga
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'facturacion.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      } catch (err) {
        console.error('Error al generar el documento:', err);
        setError('Ocurrió un error al generar el documento.');
      } finally {
        setLoading(false);
      }
    },
    [startDate, endDate, apiUrl]
  );

  return (
    <div
      id="facturacion-section"
      className="container facturacion-container"
      role="region"
      aria-labelledby="facturacion-title"
    >
      <h2 id="facturacion-title" className="facturacion-title">
        Generar Reporte de Facturación
      </h2>
      <form onSubmit={handleGenerate} className="facturacion-form" noValidate>
        <div className="form-group">
          <label htmlFor="fecha-inicio">Fecha de Inicio:</label>
          <input
            id="fecha-inicio"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="fecha-fin">Fecha de Fin:</label>
          <input
            id="fecha-fin"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        {error && (
          <p role="alert" className="error-message">
            {error}
          </p>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Generando...' : 'Generar Documento'}
        </button>
      </form>
    </div>
  );
});

Facturacion.propTypes = {
  apiUrl: PropTypes.string,
};

Facturacion.defaultProps = {
  apiUrl: import.meta.env.VITE_API_URL,
};

export default Facturacion;