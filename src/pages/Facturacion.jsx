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
            `${import.meta.env.VITE_API_URL}/api/facturacion?startDate=${startDate}&endDate=${endDate}`
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
    <div id="facturacion-section" className="container facturacion-container">
      <h2 className="facturacion-title">Generar Reporte de Facturación</h2>
      <form onSubmit={handleGenerate} className="facturacion-form">
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
