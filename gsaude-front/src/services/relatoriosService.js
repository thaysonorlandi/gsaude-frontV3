import api from './api';

const relatoriosService = {
  // Relatórios específicos por tipo
  getExamesPorTipo: async (params) => {
    try {
      const response = await api.get('/relatorios/exames-por-tipo', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar relatório de exames:', error);
      throw error;
    }
  },

  getConsultasPorEspecialidade: async (params) => {
    try {
      const response = await api.get('/relatorios/consultas-por-especialidade', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar relatório de consultas:', error);
      throw error;
    }
  },

  getRelatorioConsolidado: async (params) => {
    try {
      const response = await api.get('/relatorios/consolidado', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar relatório consolidado:', error);
      throw error;
    }
  },

  // Endpoints para dados dos filtros
  getProcedimentos: async () => {
    try {
      const response = await api.get('/relatorios/procedimentos');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar procedimentos:', error);
      throw error;
    }
  },

  getEspecialidades: async () => {
    try {
      const response = await api.get('/relatorios/especialidades');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar especialidades:', error);
      throw error;
    }
  },

  getConvenios: async () => {
    try {
      const response = await api.get('/relatorios/convenios');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar convênios:', error);
      throw error;
    }
  },

  // Métodos legados (mantidos para compatibilidade)
  getRelatorioAgendamentos: async (params) => {
    try {
      const response = await api.get('/relatorios/agendamentos', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar relatório de agendamentos:', error);
      throw error;
    }
  },

  getRelatorioFinanceiro: async (params) => {
    try {
      const response = await api.get('/relatorios/financeiro', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar relatório financeiro:', error);
      throw error;
    }
  },

  getRelatorioPorMedicos: async (params) => {
    try {
      const response = await api.get('/relatorios/medicos', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar relatório de médicos:', error);
      throw error;
    }
  },

  // Novo método para relatório de agendamentos do dia
  getRelatorioAgendamentosDia: async (params) => {
    try {
      const response = await api.get('/relatorios/agendamentos-dia', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar relatório de agendamentos do dia:', error);
      throw error;
    }
  },

  // Método para buscar dados do sistema para relatórios
  getDadosRelatorios: async () => {
    try {
      const response = await api.get('/system-configs/relatorios/dados');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados do sistema:', error);
      throw error;
    }
  }
};

export default relatoriosService;
