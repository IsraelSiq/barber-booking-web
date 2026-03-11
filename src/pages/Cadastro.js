import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import styles from './Auth.module.css';

export default function Cadastro() {
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', senha: '' });
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  function extrairErro(data) {
    if (!data.detail) return 'Erro ao cadastrar.';
    if (typeof data.detail === 'string') return data.detail;
    if (Array.isArray(data.detail)) return data.detail.map(e => e.msg).join(', ');
    return 'Erro desconhecido.';
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleCadastro(e) {
    e.preventDefault();
    setErro('');
    const data = await api.post('/auth/register', form);
    if (data.id) {
      navigate('/login');
    } else {
      setErro(extrairErro(data));
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>💈 Barber Booking</h1>
        <h2>Criar conta</h2>
        <form onSubmit={handleCadastro}>
          <input placeholder="Nome" name="nome" value={form.nome} onChange={handleChange} required />
          <input placeholder="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
          <input placeholder="Telefone" name="telefone" value={form.telefone} onChange={handleChange} required />
          <input placeholder="Senha" name="senha" type="password" value={form.senha} onChange={handleChange} required />
          {erro && <p className={styles.erro}>{erro}</p>}
          <button type="submit">Cadastrar</button>
        </form>
        <p>Já tem conta? <Link to="/login">Entrar</Link></p>
      </div>
    </div>
  );
}
