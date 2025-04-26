import React from 'react';
import PropTypes from 'prop-types';

/**
 * Home component displays a welcome message for the VerifiK application.
 *
 * @component
 * @param {{ title?: string, message?: string }} props
 * @param {string} [props.title] - Main heading text.
 * @param {string} [props.message] - Paragraph text under the heading.
 * @returns {JSX.Element}
 */
const Home = React.memo(function Home({ title, message }) {
  return (
    <main className="container home-container" role="main" aria-label="Inicio">
      <h2>{title}</h2>
      <p>{message}</p>
    </main>
  );
});

Home.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
};

Home.defaultProps = {
  title: 'Bienvenido a VerifiK',
  message: 'Selecciona una opción en el menú para continuar.',
};

export default Home;
