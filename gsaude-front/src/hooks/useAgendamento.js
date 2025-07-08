import { useState, useEffect } from 'react';
import { agendamentoService } from '../services/agendamentoService';

export function useAgendamento() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filiais, setFiliais] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [tiposExame, setTiposExame] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [convenios, setConvenios] = useState([]);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);

  // Carregar dados iniciais
  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  async function carregarDadosIniciais() {
    setLoading(true);
    setError(null);

    try {
      const [filiaisData, conveniosData, especialidadesData, tiposExameData] = await Promise.all([
        agendamentoService.getFiliais(),
        agendamentoService.getConvenios(),
        agendamentoService.getEspecialidades(),
        agendamentoService.getTiposExame(),
      ]);

      setFiliais(filiaisData);
      setConvenios(conveniosData);
      setEspecialidades(especialidadesData);
      setTiposExame(tiposExameData);
    } catch (err) {
      setError('Erro ao carregar dados iniciais');
      console.error('Erro ao carregar dados iniciais:', err);
    } finally {
      setLoading(false);
    }
  }

  async function carregarMedicosPorEspecialidade(especialidadeId) {
    if (!especialidadeId) {
      setMedicos([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const medicosData = await agendamentoService.getMedicosPorEspecialidade(especialidadeId);
      setMedicos(medicosData);
    } catch (err) {
      setError('Erro ao carregar médicos');
      console.error('Erro ao carregar médicos:', err);
    } finally {
      setLoading(false);
    }
  }

  async function carregarMedicosPorTipoExame(tipoExameId) {
    if (!tipoExameId) {
      setMedicos([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const medicosData = await agendamentoService.getMedicosPorTipoExame(tipoExameId);
      setMedicos(medicosData);
    } catch (err) {
      setError('Erro ao carregar médicos');
      console.error('Erro ao carregar médicos:', err);
    } finally {
      setLoading(false);
    }
  }

  async function carregarHorarios(medicoId, dataInicial = null) {
    if (!medicoId) {
      setHorariosDisponiveis([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const horariosData = await agendamentoService.getHorariosDisponiveis(medicoId, dataInicial);
      setHorariosDisponiveis(horariosData);
    } catch (err) {
      setError('Erro ao carregar horários');
      console.error('Erro ao carregar horários:', err);
    } finally {
      setLoading(false);
    }
  }

  async function criarAgendamento(dadosAgendamento) {
    setLoading(true);
    setError(null);

    try {
      const resultado = await agendamentoService.criarAgendamento(dadosAgendamento);
      return resultado;
    } catch (err) {
      setError('Erro ao criar agendamento');
      console.error('Erro ao criar agendamento:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function verificarDisponibilidade(medicoId, data, hora) {
    try {
      const resultado = await agendamentoService.verificarDisponibilidade(medicoId, data, hora);
      return resultado.disponivel;
    } catch (err) {
      console.error('Erro ao verificar disponibilidade:', err);
      return false;
    }
  }

  return {
    loading,
    error,
    filiais,
    especialidades,
    tiposExame,
    medicos,
    convenios,
    horariosDisponiveis,
    carregarMedicosPorEspecialidade,
    carregarMedicosPorTipoExame,
    carregarHorarios,
    criarAgendamento,
    verificarDisponibilidade,
    setError,
  };
}
