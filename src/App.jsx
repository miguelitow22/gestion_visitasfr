// src/App.jsx

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy loading de páginas para mejorar performance
const Home = lazy(() => import('./pages/Home'));
const Consultas = lazy(() => import('./pages/Consultas'));
const Programar = lazy(() => import('./pages/Programar'));
const Reportar = lazy(() => import('./pages/Reportar'));
const GestionCasos = lazy(() => import('./pages/GestionCasos'));
const Facturacion = lazy(() => import('./pages/Facturacion'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <Router>
      <Header />
      <Navbar />
      <Suspense fallback={<div className="loading">Cargando...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/consultas" element={<Consultas />} />
          <Route path="/programar" element={<Programar />} />
          <Route path="/reportar" element={<Reportar />} />
          <Route path="/gestion-casos" element={<GestionCasos />} />
          <Route path="/facturacion" element={<Facturacion />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
    </Router>
  );
}

export default App;