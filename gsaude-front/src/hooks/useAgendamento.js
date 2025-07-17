import { useState, useEffect, useCallback } from 'react';
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

  // Declarar todas as funções primeiro
  const carregarDadosIniciais = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const dados = await agendamentoService.getDadosIniciais();
      
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
  }, []);

  const carregarMedicosPorEspecialidade = useCallback(async (especialidadeId) => {
    if (!especialidadeId) {
      setMedicos([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const medicosData = await agendamentoService.getMedicosPorEspecialidade(especialidadeId);
      setMedicos(medicosData || []);
    } catch (err) {
      console.error('Erro ao carregar médicos por especialidade:', err);
      setError('Erro ao carregar médicos');
      setMedicos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const carregarMedicosPorProcedimento = useCallback(async (procedimentoId) => {
    try {
      setLoading(true);
      const medicosData = await agendamentoService.getMedicosPorProcedimento(procedimentoId);
      setMedicos(medicosData);
    } catch (error) {
      console.error('Erro ao carregar médicos por procedimento:', error);
      setError('Erro ao carregar médicos');
      setMedicos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const carregarExamesPorEspecialidade = useCallback(async (especialidadeId) => {
    if (!especialidadeId) {
      setProcedimentos([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const examesData = await agendamentoService.getExamesPorEspecialidade(especialidadeId);
      setProcedimentos(examesData || []);
    } catch (err) {
      console.error('Erro ao carregar exames por especialidade:', err);
      setError('Erro ao carregar exames');
      setProcedimentos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const carregarHorarios = useCallback(async (medicoId, data = null, periodo = 'semana') => {
    if (!medicoId) {
      setHorariosDisponiveis([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const horariosData = await agendamentoService.getHorariosDisponiveis(medicoId, data, periodo);
      setHorariosDisponiveis(horariosData || []);
    } catch (err) {
      console.error('Erro ao carregar horários:', err);
      setError('Erro ao carregar horários');
      setHorariosDisponiveis([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const carregarAgendamentos = useCallback(async (filtros = {}) => {
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
  }, []);

  const criarAgendamento = useCallback(async (dadosAgendamento) => {
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
  }, [carregarAgendamentos]);

  // Agora declaram os useEffects
  useEffect(() => {
    carregarDadosIniciais();
  }, [carregarDadosIniciais]);

  return {
    loading,
    error,
    filiais,
    especialidades,
    procedimentos,
    medicos,
    convenios,
    horariosDisponiveis,
    agendamentos,
    carregarDadosIniciais,
    carregarMedicosPorEspecialidade,
    carregarMedicosPorProcedimento,
    carregarExamesPorEspecialidade,
    carregarHorarios,
    criarAgendamento,
    carregarAgendamentos,
    setError,
  };
}
