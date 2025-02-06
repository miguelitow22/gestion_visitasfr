import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="nav">
      <ul className="nav-list">
        <li><Link to="/programar" className="nav-link" aria-label="Programar visita">PROGRAMAR</Link></li>
        <li><Link to="/reportar" className="nav-link" aria-label="Reportar incidente">REPORTAR</Link></li>
        <li><Link to="/consultas" className="nav-link" aria-label="Ver consultas">CONSULTAS</Link></li>
        <li><Link to="/gestion-casos" className="nav-link" aria-label="Gestión de casos">GESTIÓN DE CASOS</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
