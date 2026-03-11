import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import styles from './Auth.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  function extrairErro(data) {
    if (!data.detail) return 'Erro ao fazer login.';
    if (typeof data.detail === 'string') return data.detail;
    if (Array.isArray(data.detail)) return data.detail.map(e => e.msg).join(', ');
    return 'Erro desconhecido.';
  }

  async function handleLogin(e) {
    e.preventDefault();
    setErro('');
    const data = await api.post('/auth/login', { email, senha });
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
      navigate('/agendamento');
    } else {
      setErro(extrairErro(data));
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>💈 Barber Booking</h1>
        <h2>Entrar</h2>
        <form onSubmit={handleLogin}>
          <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input placeholder="Senha" type="password" value={senha} onChange={e => setSenha(e.target.value)} required />
          {erro && <p className={styles.erro}>{erro}</p>}
          <button type="submit">Entrar</button>
        </form>
        <p>Não tem conta? <Link to="/cadastro">Cadastre-se</Link></p>
      </div>
    </div>
  );
}
