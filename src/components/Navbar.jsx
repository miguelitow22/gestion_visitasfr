import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation(); // Obtiene la URL actual

  useEffect(() => {
    const scrollToSection = () => {
      let sectionId = "";
      switch (location.pathname) {
        case "/programar":
          sectionId = "programar-section";
          break;
        case "/reportar":
          sectionId = "reportar-section";
          break;
        case "/consultas":
          sectionId = "consultas-section";
          break;
        case "/gestion-casos":
          sectionId = "gestion-casos-section";
          break;
        default:
          sectionId = "";
      }

      if (sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };

    scrollToSection();
  }, [location.pathname]);

  return (
    <nav className="nav">
      <ul className="nav-list">
        <li>
          <Link 
            to="/programar" 
            className="nav-link"
            aria-label="Programar visita"
          >
            PROGRAMAR
          </Link>
        </li>
        <li>
          <Link 
            to="/reportar" 
            className="nav-link"
            aria-label="Reportar incidente"
          >
            REPORTAR
          </Link>
        </li>
        <li>
          <Link 
            to="/consultas" 
            className="nav-link"
            aria-label="Ver consultas"
          >
            CONSULTAS
          </Link>
        </li>
        <li>
          <Link 
            to="/gestion-casos" 
            className="nav-link"
            aria-label="Gestión de casos"
          >
            GESTIÓN DE CASOS
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
