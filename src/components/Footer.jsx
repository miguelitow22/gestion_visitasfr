import React from 'react';
import PropTypes from 'prop-types';

/**
 * Footer component displays the footer section with copyright information.
 *
 * @component
 * @param {{ companyName?: string, year?: number }} props
 * @param {string} props.companyName - Name of the company to display.
 * @param {number} [props.year] - Year to display. Defaults to the current year.
 * @returns {JSX.Element}
 */
const Footer = React.memo(function Footer({ companyName, year }) {
  // Use provided year or fallback to the current year
  const displayYear = year || new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo" aria-label="Footer">
      <p>© {displayYear} {companyName}</p>
    </footer>
  );
});

Footer.propTypes = {
  companyName: PropTypes.string,
  year: PropTypes.number,
};

Footer.defaultProps = {
  companyName: 'VerifiKhm',
  year: null,
};

export default Footer;
