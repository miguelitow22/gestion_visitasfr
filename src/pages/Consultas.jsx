import React from "react";

function Consultas() {
  // ✅ Función para abrir enlaces en una nueva pestaña
  const abrirEnlace = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="container consultas-container">
      <h2>En esta página encontrarás los documentos y archivos de la operación</h2>
      
      <section className="consulta-section">
        <h3>Formato para visitas de ingreso físico y Formato digital</h3>
        <p>Se aplica a personas que van a ingresar a empresas clientes de Atlas Seguridad (Cliente Externo).</p>
        <button className="btn-consulta" onClick={() => abrirEnlace("https://docs.google.com/spreadsheets/d/1Ybn_mzAlE_n_jyP-AvIA2Ul3NFS_uHq0/edit?usp=drive_link")}>
          Formato digital
        </button>
      </section>
      
      <section className="consulta-section">
        <h3>Formato para visita de rutina</h3>
        <p>Se aplica a personas que ya están trabajando en empresas clientes de Atlas Seguridad (Cliente Externo).</p>
        <button className="btn-consulta" onClick={() => abrirEnlace("https://docs.google.com/spreadsheets/d/EXAMPLE")}>
          Ver Formato
        </button>
      </section>

      <section className="consulta-section">
        <h3>Formato para visita de Atlas Seguridad</h3>
        <p>Se aplica a personas que van a ingresar o estén trabajando en Atlas Seguridad (Cliente Interno).</p>
        <button className="btn-consulta" onClick={() => abrirEnlace("https://docs.google.com/spreadsheets/d/EXAMPLE2")}>
          Ver Formato
        </button>
      </section>

      <section className="consulta-section">
        <h3>Guía para la elaboración de ampliaciones y conclusiones</h3>
        <p>Documento guía para la elaboración de informes de visitas domiciliarias.</p>
        <button className="btn-consulta" onClick={() => abrirEnlace("https://docs.google.com/spreadsheets/d/EXAMPLE3")}>
          Descargar Guía
        </button>
      </section>
    </div>
  );
}

export default Consultas;