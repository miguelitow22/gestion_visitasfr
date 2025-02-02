import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="nav">
      <ul className="nav-list">
        <li><Link to="/programar" className="nav-link">PROGRAMAR</Link></li>
        <li><Link to="/reportar" className="nav-link">REPORTAR</Link></li>
        <li><Link to="/consultas" className="nav-link">CONSULTAS</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;