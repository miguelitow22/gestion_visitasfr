import React from 'react';
import PropTypes from 'prop-types';

/**
 * Consultas component displays a list of document links for operation files.
 *
 * @component
 * @param {{ items?: Array<{ sectionId: string, title: string, description: string, url: string, buttonLabel: string }> }} props
 * @param {Array} props.items - Configuration for each consulta section.
 * @returns {JSX.Element}
 */
const Consultas = React.memo(function Consultas({ items }) {
  // Open link in a secure new tab
  const abrirEnlace = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div id="consultas-section" className="container consultas-container">
      <h2 id="consultas-title">
        En esta página encontrarás los documentos y archivos de la operación
      </h2>
      {items.map(({ sectionId, title, description, url, buttonLabel }) => (
        <section
          key={sectionId}
          id={sectionId}
          className="consulta-section"
          role="region"
          aria-labelledby={`${sectionId}-title`}
        >
          <h3 id={`${sectionId}-title`}>{title}</h3>
          <p>{description}</p>
          <button
            className="btn-consulta"
            onClick={() => abrirEnlace(url)}
            aria-label={buttonLabel}
          >
            {buttonLabel}
          </button>
        </section>
      ))}
    </div>
  );
});

Consultas.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      sectionId: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      buttonLabel: PropTypes.string.isRequired,
    })
  ),
};

Consultas.defaultProps = {
  items: [
    {
      sectionId: 'consultas-ingreso-section',
      title: 'Formato para visitas de ingreso físico y Formato digital',
      description: 'Se aplica a personas que van a ingresar a empresas clientes de Atlas Seguridad (Cliente Externo).',
      url: 'https://docs.google.com/spreadsheets/d/1Ybn_mzAlE_n_jyP-AvIA2Ul3NFS_uHq0/edit?usp=drive_link',
      buttonLabel: 'Formato digital',
    },
    {
      sectionId: 'consultas-rutina-section',
      title: 'Formato para visita de rutina',
      description: 'Se aplica a personas que ya están trabajando en empresas clientes de Atlas Seguridad (Cliente Externo).',
      url: 'https://docs.google.com/spreadsheets/d/EXAMPLE',
      buttonLabel: 'Ver Formato',
    },
    {
      sectionId: 'consultas-atlas-section',
      title: 'Formato para visita de Atlas Seguridad',
      description: 'Se aplica a personas que van a ingresar o estén trabajando en Atlas Seguridad (Cliente Interno).',
      url: 'https://docs.google.com/spreadsheets/d/EXAMPLE2',
      buttonLabel: 'Ver Formato',
    },
    {
      sectionId: 'consultas-guia-section',
      title: 'Guía para la elaboración de ampliaciones y conclusiones',
      description: 'Documento guía para la elaboración de informes de visitas domiciliarias.',
      url: 'https://docs.google.com/spreadsheets/d/EXAMPLE3',
      buttonLabel: 'Descargar Guía',
    },
  ],
};

export default Consultas;