import api from './api';

class RelatoriosService {
  // Relatórios de agendamentos
  async getRelatorioAgendamentos(filtros) {
    try {
      const response = await api.get('/relatorios/agendamentos', {
        params: filtros
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar relatório de agendamentos:', error);
      throw error;
    }
  }

  // Relatórios por médicos
  async getRelatorioMedicos(filtros) {
    try {
      const response = await api.get('/relatorios/medicos', {
        params: filtros
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar relatório de médicos:', error);
      throw error;
    }
  }

  // Relatórios por especialidades
  async getRelatorioEspecialidades(filtros) {
    try {
      const response = await api.get('/relatorios/especialidades', {
        params: filtros
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar relatório de especialidades:', error);
      throw error;
    }
  }

  // Relatórios financeiros
  async getRelatorioFinanceiro(filtros) {
    try {
      const response = await api.get('/relatorios/financeiro', {
        params: filtros
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar relatório financeiro:', error);
      throw error;
    }
  }

  // Relatório consolidado por período
  async getRelatorioConsolidado(filtros) {
    try {
      const response = await api.get('/relatorios/consolidado', {
        params: filtros
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar relatório consolidado:', error);
      throw error;
    }
  }

  // Relatório de consultas por dia
  async getRelatorioConsultasPorDia(filtros) {
    try {
      const response = await api.get('/relatorios/consultas-dia', {
        params: filtros
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar relatório de consultas por dia:', error);
      throw error;
    }
  }

  // Relatório de exames por dia
  async getRelatorioExamesPorDia(filtros) {
    try {
      const response = await api.get('/relatorios/exames-dia', {
        params: filtros
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar relatório de exames por dia:', error);
      throw error;
    }
  }
}

export default new RelatoriosService();
