import React from "react";

function Reportar() {
  return (
    <div className="container reportar-container">
      <h2>En esta página podrás reportar incidencias y eventos de la operación</h2>

      <section className="reportar-section">
        <h3>Reporte de incidentes</h3>
        <p>Formulario para reportar incidentes ocurridos en las visitas domiciliarias.</p>
        <a
          href="https://docs.google.com/spreadsheets/d/1Ybn_mzAlE_n_jyP-AvIA2Ul3NFS_uHq0/edit?usp=drive_link"
          className="btn btn-primary"
          target="_blank"
          rel="noopener noreferrer">
          Formato digital
        </a>

      </section>

      <section className="reportar-section">
        <h3>Reporte de novedades</h3>
        <p>Formulario para documentar novedades y hallazgos durante la operación.</p>
        <a
          href="https://docs.google.com/spreadsheets/d/1Ybn_mzAlE_n_jyP-AvIA2Ul3NFS_uHq0/edit?usp=drive_link"
          className="btn btn-primary"
          target="_blank"
          rel="noopener noreferrer">
          Formato digital
        </a>

      </section>

      <section className="reportar-section">
        <h3>Reporte de incumplimientos</h3>
        <p>Formulario para registrar incumplimientos en las visitas domiciliarias.</p>
        <a
          href="https://docs.google.com/spreadsheets/d/1Ybn_mzAlE_n_jyP-AvIA2Ul3NFS_uHq0/edit?usp=drive_link"
          className="btn btn-primary"
          target="_blank"
          rel="noopener noreferrer">
          Formato digital
        </a>

      </section>
    </div>
  );
}

export default Reportar;