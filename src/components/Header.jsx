import React from 'react';
import PropTypes from 'prop-types';

/**
 * Header component displays the logo and a description for the application.
 *
 * @component
 * @param {{ logoSrc?: string, logoAlt?: string, logoWidth?: string|number, logoHeight?: string|number, description?: string }} props
 * @param {string} props.logoSrc - URL of the logo image.
 * @param {string} props.logoAlt - Alt text for the logo image.
 * @param {string|number} props.logoWidth - Width of the logo image (px or string).
 * @param {string|number} props.logoHeight - Height of the logo image (px or string).
 * @param {string} props.description - Description text displayed next to the logo.
 * @returns {JSX.Element}
 */
const Header = React.memo(function Header({ logoSrc, logoAlt, logoWidth, logoHeight, description }) {
  return (
    <header className="header" role="banner" aria-label="App header">
      <div className="logo-container">
        <img
          src={logoSrc}
          alt={logoAlt}
          className="logo"
          width={logoWidth}
          height={logoHeight}
        />
        <p className="description">
          {description}
        </p>
      </div>
    </header>
  );
});

Header.propTypes = {
  logoSrc: PropTypes.string,
  logoAlt: PropTypes.string,
  logoWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  logoHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  description: PropTypes.string,
};

Header.defaultProps = {
  logoSrc: 'https://blogger.googleusercontent.com/img/a/AVvXsEjzbjsuMrL91t0ic663D42xsPxj37DIYwj_RWwIX26JLdh7_X6iHdZmrFwSV6GaLOPC3iG-HXWLRh3fPMN9BsrXWlc8LK7JxMRF_F0oy8IgFWcSZ4sH3EWL5m4rXlHLrxsknKqOFHUrrBkLf54FwonX7NwY-HgfbMhLG3ff6SMMklkqbjd3k21zmxUTMLea=s150',
  logoAlt: 'Logo de VerifiK',
  logoWidth: 150,
  logoHeight: 150,
  description: 'Esta página es para la gestión de visitas domiciliarias',
};

export default Header;
