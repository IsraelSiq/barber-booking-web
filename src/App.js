import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Inicio from './pages/Inicio';
import Agendamento from './pages/Agendamento';
import MeusAgendamentos from './pages/MeusAgendamentos';
import Enderecos from './pages/Enderecos';
import Perfil from './pages/Perfil';

function App() {
  const token = localStorage.getItem('token');
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/inicio" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/inicio" element={token ? <Inicio /> : <Navigate to="/login" />} />
        <Route path="/agendamento" element={token ? <Agendamento /> : <Navigate to="/login" />} />
        <Route path="/meus" element={token ? <MeusAgendamentos /> : <Navigate to="/login" />} />
        <Route path="/enderecos" element={token ? <Enderecos /> : <Navigate to="/login" />} />
        <Route path="/perfil" element={token ? <Perfil /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
