import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reportar component displays sections for reporting incidents, novedades, and incumplimientos.
 *
 * @component
 * @param {{ items?: Array<{ id: string, title: string, description: string, url: string, buttonLabel?: string }> }} props
 * @param {Array} props.items - Configuration for each report section.
 * @returns {JSX.Element}
 */
const Reportar = React.memo(function Reportar({ items }) {
  return (
    <div id="reportar-section" className="container reportar-container" role="region" aria-labelledby="reportar-title">
      <h2 id="reportar-title" className="reportar-title">
        En esta página podrás reportar incidencias y eventos de la operación
      </h2>
      {items.map(({ id, title, description, url, buttonLabel }) => (
        <section key={id} id={`${id}-section`} className="reportar-section" role="region" aria-labelledby={`${id}-title`}>
          <h3 id={`${id}-title`}>{title}</h3>
          <p>{description}</p>
          <a
            href={url}
            className="btn btn-primary"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={buttonLabel || 'Abrir formulario'}
          >
            {buttonLabel || 'Formato digital'}
          </a>
        </section>
      ))}
    </div>
  );
});

Reportar.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      buttonLabel: PropTypes.string,
    })
  ),
};

Reportar.defaultProps = {
  items: [
    {
      id: 'incidentes',
      title: 'Reporte de incidentes',
      description: 'Formulario para reportar incidentes ocurridos en las visitas domiciliarias.',
      url: 'https://docs.google.com/spreadsheets/d/1Ybn_mzAlE_n_jyP-AvIA2Ul3NFS_uHq0/edit?usp=drive_link',
      buttonLabel: 'Formato digital',
    },
    {
      id: 'novedades',
      title: 'Reporte de novedades',
      description: 'Formulario para documentar novedades y hallazgos durante la operación.',
      url: 'https://docs.google.com/spreadsheets/d/1Ybn_mzAlE_n_jyP-AvIA2Ul3NFS_uHq0/edit?usp=drive_link',
      buttonLabel: 'Formato digital',
    },
    {
      id: 'incumplimientos',
      title: 'Reporte de incumplimientos',
      description: 'Formulario para registrar incumplimientos en las visitas domiciliarias.',
      url: 'https://docs.google.com/spreadsheets/d/1Ybn_mzAlE_n_jyP-AvIA2Ul3NFS_uHq0/edit?usp=drive_link',
      buttonLabel: 'Formato digital',
    },
  ],
};

export default Reportar;