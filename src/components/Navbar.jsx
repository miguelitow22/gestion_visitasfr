import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';

/**
 * Navbar component displays navigation links and scrolls to corresponding section on route change.
 *
 * @component
 * @param {{ items?: Array<{ path: string, label: string, ariaLabel: string, sectionId?: string }> }} props
 * @param {Array} props.items - Navigation items configuration.
 * @returns {JSX.Element}
 */
const Navbar = React.memo(function Navbar({ items }) {
  const location = useLocation();

  useEffect(() => {
    const current = items.find(item => item.path === location.pathname);
    if (current?.sectionId) {
      const section = document.getElementById(current.sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [location.pathname, items]);

  return (
    <nav className="nav" role="navigation" aria-label="Main navigation">
      <ul className="nav-list">
        {items.map(({ path, label, ariaLabel }) => (
          <li key={path}>
            <Link to={path} className="nav-link" aria-label={ariaLabel}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
});

Navbar.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      ariaLabel: PropTypes.string.isRequired,
      sectionId: PropTypes.string,
    })
  ),
};

Navbar.defaultProps = {
  items: [
    { path: '/programar', label: 'PROGRAMAR', ariaLabel: 'Programar visita', sectionId: 'programar-section' },
    { path: '/reportar', label: 'REPORTAR', ariaLabel: 'Reportar incidente', sectionId: 'reportar-section' },
    { path: '/consultas', label: 'CONSULTAS', ariaLabel: 'Ver consultas', sectionId: 'consultas-section' },
    { path: '/gestion-casos', label: 'GESTIÓN DE CASOS', ariaLabel: 'Gestión de casos', sectionId: 'gestion-casos-section' },
    { path: '/facturacion', label: 'FACTURACIÓN', ariaLabel: 'Reporte de facturación', sectionId: 'facturacion-section' },
  ],
};

export default Navbar;