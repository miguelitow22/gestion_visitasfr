// src/pages/Facturacion.jsx
import React, { useState } from "react";

function Facturacion() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      alert("Debes seleccionar ambas fechas.");
      return;
    }
    try {
      const response = await fetch(
        `/api/facturacion?startDate=${startDate}&endDate=${endDate}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        alert("Error: " + errorData.error);
        return;
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "facturacion.docx";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error al generar el documento:", error);
      alert("Ocurrió un error al generar el documento.");
    }
  };

  return (
    <div id="facturacion-section" className="container">
      <h2>Generar Reporte de Facturación</h2>
      <form onSubmit={handleGenerate}>
        <div className="form-group">
          <label>Fecha de Inicio:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Fecha de Fin:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Generar Documento
        </button>
      </form>
    </div>
  );
}

export default Facturacion;
