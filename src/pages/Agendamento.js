import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import styles from './Agendamento.module.css';

const HORARIOS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

export default function Agendamento() {
  const [data, setData] = useState('');
  const [disponiveis, setDisponiveis] = useState([]);
  const [horario, setHorario] = useState('');
  const [servico, setServico] = useState('Corte');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  async function buscarHorarios() {
    if (!data) return;
    const result = await api.get(`/agendamentos/disponiveis?data=${data}`);
    setDisponiveis(result.horarios_disponiveis || []);
    setHorario('');
    setMensagem('');
    setErro('');
  }

  async function handleAgendar(e) {
    e.preventDefault();
    setMensagem('');
    setErro('');
    if (!horario) { setErro('Selecione um horário.'); return; }
    const data_hora = `${data}T${horario}:00`;
    const result = await api.post('/agendamentos/', { data_hora, servico }, token);
    if (result.id) {
      setMensagem(`Agendamento confirmado para ${data} às ${horario}!`);
      buscarHorarios();
    } else {
      setErro(result.detail || 'Erro ao agendar.');
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>💈 Novo Agendamento</h1>
          <div className={styles.links}>
            <Link to="/meus">Meus agendamentos</Link>
            <button onClick={handleLogout} className={styles.logout}>Sair</button>
          </div>
        </div>

        <div className={styles.grupo}>
          <label>Data</label>
          <div className={styles.row}>
            <input type="date" value={data} onChange={e => setData(e.target.value)} />
            <button type="button" onClick={buscarHorarios}>Buscar</button>
          </div>
        </div>

        {disponiveis.length > 0 && (
          <form onSubmit={handleAgendar}>
            <div className={styles.grupo}>
              <label>Horário disponível</label>
              <div className={styles.horarios}>
                {HORARIOS.map(h => (
                  <button
                    key={h}
                    type="button"
                    className={`${styles.horario} ${!disponiveis.includes(h) ? styles.ocupado : ''} ${horario === h ? styles.selecionado : ''}`}
                    onClick={() => disponiveis.includes(h) && setHorario(h)}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.grupo}>
              <label>Serviço</label>
              <select value={servico} onChange={e => setServico(e.target.value)}>
                <option>Corte</option>
                <option>Barba</option>
                <option>Corte + Barba</option>
                <option>Sobrancelha</option>
              </select>
            </div>

            {mensagem && <p className={styles.sucesso}>{mensagem}</p>}
            {erro && <p className={styles.erro}>{erro}</p>}
            <button type="submit" className={styles.btnAgendar}>Confirmar Agendamento</button>
          </form>
        )}

        {disponiveis.length === 0 && data && (
          <p className={styles.info}>Nenhum horário disponível para esta data.</p>
        )}
      </div>
    </div>
  );
}
