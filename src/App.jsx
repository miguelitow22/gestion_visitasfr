import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Consultas from './Consultas';
import Programar from './Programar';
import Reportar from './Reportar';
import Navbar from './Navbar';
import Footer from './Footer';
import './styles.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/consultas" element={<Consultas />} />
        <Route path="/programar" element={<Programar />} />
        <Route path="/reportar" element={<Reportar />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
