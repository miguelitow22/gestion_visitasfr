import React from "react";

function Reportar() {
  return (
    <div className="container reportar-container">
      <h2>En esta página podrás reportar incidencias y eventos de la operación</h2>
      
      <section className="reportar-section">
        <h3>Reporte de incidentes</h3>
        <p>Formulario para reportar incidentes ocurridos en las visitas domiciliarias.</p>
        <a href="https://docs.google.com/forms/d/EXAMPLE" className="btn-link" target="_blank" rel="noopener noreferrer">Completar Reporte</a>
      </section>
      
      <section className="reportar-section">
        <h3>Reporte de novedades</h3>
        <p>Formulario para documentar novedades y hallazgos durante la operación.</p>
        <a href="https://docs.google.com/forms/d/EXAMPLE2" className="btn-link" target="_blank" rel="noopener noreferrer">Ver Formulario</a>
      </section>

      <section className="reportar-section">
        <h3>Reporte de incumplimientos</h3>
        <p>Formulario para registrar incumplimientos en las visitas domiciliarias.</p>
        <a href="https://docs.google.com/forms/d/EXAMPLE3" className="btn-link" target="_blank" rel="noopener noreferrer">Registrar Incumplimiento</a>
      </section>
    </div>
  );
}

export default Reportar;