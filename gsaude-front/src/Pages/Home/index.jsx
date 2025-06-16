import { useState } from 'react';

function Home() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [form, setForm] = useState({
    nome: '',
    tipo: 'consulta',
    data: '',
    horario: '',
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setAgendamentos([...agendamentos, form]);
    setForm({
      nome: '',
      tipo: 'consulta',
      data: '',
      horario: '',
    });
  }

  return (
    <div>
      <h1>Agendamento de Consultas e Exames</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nome"
          placeholder="Nome do paciente"
          value={form.nome}
          onChange={handleChange}
          required
        />
        <select name="tipo" value={form.tipo} onChange={handleChange}>
          <option value="consulta">Consulta</option>
          <option value="exame">Exame</option>
        </select>
        <input
          type="date"
          name="data"
          value={form.data}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="horario"
          value={form.horario}
          onChange={handleChange}
          required
        />
        <button type="submit">Agendar</button>
      </form>

      <h2>Agendamentos</h2>
      <ul>
        {agendamentos.map((item, idx) => (
          <li key={idx}>
            <strong>{item.tipo === 'consulta' ? 'Consulta' : 'Exame'}</strong> - {item.nome} em {item.data} às {item.horario}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;