import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import styles from './MeusAgendamentos.module.css';

export default function MeusAgendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  async function carregarAgendamentos() {
    const data = await api.get('/agendamentos/meus', token);
    setAgendamentos(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function cancelar(id) {
    if (!window.confirm('Cancelar este agendamento?')) return;
    await api.delete(`/agendamentos/${id}`, token);
    carregarAgendamentos();
  }

  function formatarData(dt) {
    const d = new Date(dt);
    return d.toLocaleDateString('pt-BR') + ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>🗓️ Meus Agendamentos</h1>
          <Link to="/agendamento">← Novo agendamento</Link>
        </div>

        {loading && <p className={styles.info}>Carregando...</p>}

        {!loading && agendamentos.length === 0 && (
          <p className={styles.info}>Nenhum agendamento encontrado.</p>
        )}

        <div className={styles.lista}>
          {agendamentos.map(ag => (
            <div key={ag.id} className={`${styles.item} ${ag.status === 'cancelado' ? styles.cancelado : ''}`}>
              <div>
                <p className={styles.servico}>{ag.servico}</p>
                <p className={styles.data}>{formatarData(ag.data_hora)}</p>
                <span className={`${styles.status} ${ag.status === 'cancelado' ? styles.tagCancelado : styles.tagConfirmado}`}>
                  {ag.status}
                </span>
              </div>
              {ag.status === 'confirmado' && (
                <button onClick={() => cancelar(ag.id)} className={styles.btnCancelar}>Cancelar</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
