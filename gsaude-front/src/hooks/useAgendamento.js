import { useState, useEffect } from 'react';
import { agendamentoService } from '../services/agendamentoService';

export function useAgendamento() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filiais, setFiliais] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [procedimentos, setProcedimentos] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [convenios, setConvenios] = useState([]);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);

  // Carregar dados iniciais
  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  async function carregarDadosIniciais() {
    setLoading(true);
    setError(null);

    try {
      console.log('Carregando dados iniciais...');
      const dados = await agendamentoService.getDadosIniciais();
      
      console.log('Dados iniciais carregados:', dados);
      
      setFiliais(dados.filiais || []);
      setEspecialidades(dados.especialidades || []);
      setProcedimentos(dados.procedimentos || []);
      setConvenios(dados.convenios || []);
      
    } catch (err) {
      console.error('Erro ao carregar dados iniciais:', err);
      setError('Erro ao carregar dados iniciais');
      
      // Dados de fallback em caso de erro
      setFiliais([]);
      setEspecialidades([]);
      setProcedimentos([]);
      setConvenios([]);
    } finally {
      setLoading(false);
    }
  }

  // Carregar médicos por especialidade (para consultas)
  async function carregarMedicosPorEspecialidade(especialidadeId) {
    if (!especialidadeId) {
      setMedicos([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Carregando médicos por especialidade:', especialidadeId);
      const medicosData = await agendamentoService.getMedicosPorEspecialidade(especialidadeId);
      console.log('Médicos carregados:', medicosData);
      setMedicos(medicosData || []);
    } catch (err) {
      console.error('Erro ao carregar médicos por especialidade:', err);
      setError('Erro ao carregar médicos');
      setMedicos([]);
    } finally {
      setLoading(false);
    }
  }

  // Carregar médicos por procedimento (para exames)
  async function carregarMedicosPorProcedimento(procedimentoId) {
    if (!procedimentoId) {
      setMedicos([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Carregando médicos por procedimento:', procedimentoId);
      const medicosData = await agendamentoService.getMedicosPorProcedimento(procedimentoId);
      console.log('Médicos carregados:', medicosData);
      setMedicos(medicosData || []);
    } catch (err) {
      console.error('Erro ao carregar médicos por procedimento:', err);
      setError('Erro ao carregar médicos');
      setMedicos([]);
    } finally {
      setLoading(false);
    }
  }

  // Carregar horários disponíveis
  async function carregarHorarios(medicoId, data = null) {
    if (!medicoId) {
      setHorariosDisponiveis([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Carregando horários para médico:', medicoId, 'data:', data);
      const horariosData = await agendamentoService.getHorariosDisponiveis(medicoId, data);
      console.log('Horários carregados:', horariosData);
      setHorariosDisponiveis(horariosData || []);
    } catch (err) {
      console.error('Erro ao carregar horários:', err);
      setError('Erro ao carregar horários');
      setHorariosDisponiveis([]);
    } finally {
      setLoading(false);
    }
  }

  // Criar agendamento
  async function criarAgendamento(dadosAgendamento) {
    setLoading(true);
    setError(null);

    try {
      const resultado = await agendamentoService.criarAgendamento(dadosAgendamento);
      await carregarAgendamentos();
      return resultado;
    } catch (err) {
      console.error('Erro ao criar agendamento:', err);
      setError('Erro ao criar agendamento');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  // Carregar lista de agendamentos
  async function carregarAgendamentos(filtros = {}) {
    setLoading(true);
    setError(null);

    try {
      const agendamentosData = await agendamentoService.getAgendamentos(filtros);
      setAgendamentos(agendamentosData || []);
    } catch (err) {
      console.error('Erro ao carregar agendamentos:', err);
      setError('Erro ao carregar agendamentos');
      setAgendamentos([]);
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    filiais,
    especialidades,
    procedimentos, // Único array para procedimentos/exames
    medicos,
    convenios,
    horariosDisponiveis,
    agendamentos,
    carregarDadosIniciais,
    carregarMedicosPorEspecialidade,
    carregarMedicosPorProcedimento,
    carregarHorarios,
    criarAgendamento,
    carregarAgendamentos,
    setError,
  };
}
