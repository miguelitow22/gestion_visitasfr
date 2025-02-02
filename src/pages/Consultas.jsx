import React from "react";

function Consultas() {
  return (
    <div className="container consultas-container">
      <h2>En esta página encontrarás los documentos y archivos de la operación</h2>
      
      <section className="consulta-section">
        <h3>Formato para visitas de ingreso físico y Formato digital</h3>
        <p>Se aplica a personas que van a ingresar a empresas clientes de Atlas Seguridad (Cliente Externo).</p>
        <a href="https://docs.google.com/spreadsheets/d/1Ybn_mzAlE_n_jyP-AvIA2Ul3NFS_uHq0/edit?usp=drive_link" className="btn-link" target="_blank" rel="noopener noreferrer">Formato digital</a>
      </section>
      
      <section className="consulta-section">
        <h3>Formato para visita de rutina</h3>
        <p>Se aplica a personas que ya están trabajando en empresas clientes de Atlas Seguridad (Cliente Externo).</p>
        <a href="https://docs.google.com/spreadsheets/d/EXAMPLE" className="btn-link" target="_blank" rel="noopener noreferrer">Ver Formato</a>
      </section>

      <section className="consulta-section">
        <h3>Formato para visita de Atlas Seguridad</h3>
        <p>Se aplica a personas que van a ingresar o estén trabajando en Atlas Seguridad (Cliente Interno).</p>
        <a href="https://docs.google.com/spreadsheets/d/EXAMPLE2" className="btn-link" target="_blank" rel="noopener noreferrer">Ver Formato</a>
      </section>

      <section className="consulta-section">
        <h3>Guía para la elaboración de ampliaciones y conclusiones</h3>
        <p>Documento guía para la elaboración de informes de visitas domiciliarias.</p>
        <a href="https://docs.google.com/spreadsheets/d/EXAMPLE3" className="btn-link" target="_blank" rel="noopener noreferrer">Descargar Guía</a>
      </section>
    </div>
  );
}

export default Consultas;