import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Agendamento from './pages/Agendamento';
import MeusAgendamentos from './pages/MeusAgendamentos';

function App() {
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/agendamento" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/agendamento" element={token ? <Agendamento /> : <Navigate to="/login" />} />
        <Route path="/meus" element={token ? <MeusAgendamentos /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
