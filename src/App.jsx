import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Consultas from './pages/Consultas';
import Programar from './pages/Programar';
import Reportar from './pages/Reportar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Header from './components/Header';



function App() {
  return (
    <Router>
      <Header />
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
