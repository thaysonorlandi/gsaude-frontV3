// Serviços para integração com a API do backend
import api from './api.js';

// Função auxiliar para fazer requisições HTTP
async function apiRequest(endpoint, options = {}) {
  try {
    const response = await api({
      url: endpoint,
      method: options.method || 'GET',
      data: options.body ? JSON.parse(options.body) : undefined,
      ...options
    });
    
    return response.data;
  } catch (error) {
    // Se for erro de resposta do axios, extrair a mensagem
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || `HTTP error! status: ${error.response.status}`);
    }
    throw error;
  }
}

// Serviços específicos para agendamento
export const agendamentoService = {
  // Buscar dados iniciais consolidados
  async getDadosIniciais() {
    const response = await apiRequest('/agendamento/dados-iniciais');

    // Garantir que todos os médicos tenham tipo_agenda
    if (response.medicos) {
      response.medicos = response.medicos.map(medico => ({
        ...medico,
        tipo_agenda: medico.tipo_agenda || 'fixa'
      }));
    }

    // Garantir que todos os procedimentos tenham duracao_minutos
    if (response.procedimentos) {
      response.procedimentos = response.procedimentos.map(proc => ({
        ...proc,
        duracao_minutos: proc.duracao_minutos || 30
      }));
    }
    return response.data || response;
  },

  // Buscar filiais
  async getFiliais() {
    const response = await apiRequest('/filiais');
    return response.data || response;
  },

  // Buscar especialidades (para consultas)
  async getEspecialidades() {
    const response = await apiRequest('/especialidades');
    return response.data || response;
  },

  // Buscar procedimentos (para exames)
  async getProcedimentos() {
    const response = await apiRequest('/procedimentos');
    return response.data || response;
  },

  // Buscar convênios
  async getConvenios() {
    const response = await apiRequest('/convenios');
    return response.data || response;
  },

  // Buscar médicos por especialidade (para consultas)
  async getMedicosPorEspecialidade(especialidadeId) {
    const response = await apiRequest(`/medicos/especialidade/${especialidadeId}`);
    return response.data || response;
  },

  // Buscar médicos por procedimento (para exames)
  async getMedicosPorProcedimento(procedimentoId) {
    const response = await apiRequest(`/medicos/procedimento/${procedimentoId}`);
    // Verificar se a resposta tem a estrutura esperada
    if (response.success && response.data) {
      return response.data;
    }
    return response.data || response;
  },

  // Buscar exames por especialidade (para vinculação)
  async getExamesPorEspecialidade(especialidadeId) {
    const response = await apiRequest(`/especialidades/${especialidadeId}/exames`);
    // A nova API retorna { success: true, data: [...] }
    if (response.success && response.data) {
      return response.data;
    }
    return response.data || response;
  },

  // Buscar horários disponíveis
  async getHorariosDisponiveis(medicoId, data = null, periodo = 'semana') {
    try {
      let endpoint = `/medicos/${medicoId}/horarios-disponiveis?periodo=${periodo}`;
      if (data) {
        endpoint += `&data=${data}`;
      }
      
      const response = await apiRequest(endpoint);
      
      // Verificar se a resposta tem a estrutura esperada
      if (response.success && response.data) {
        return response.data;
      }
      return response.data || response;
    } catch (error) {
      return [];
    }
  },

  // Criar agendamento
  async criarAgendamento(dadosAgendamento) {
    const response = await apiRequest('/agendamentos', {
      method: 'POST',
      body: JSON.stringify(dadosAgendamento),
    });
    return response.data || response;
  },

  // Buscar agendamentos
  async getAgendamentos(filtros = {}) {
    try {
      const params = new URLSearchParams();
      Object.keys(filtros).forEach(key => {
        if (filtros[key]) {
          params.append(key, filtros[key]);
        }
      });
      
      const endpoint = params.toString() ? `/agendados?${params}` : '/agendados';
      const response = await apiRequest(endpoint);
      return response.data || response;
    } catch (error) {
      return [];
    }
  },

  // Buscar disponibilidade de um médico em uma data específica
  async getDisponibilidadeMedico(medicoId, data) {
    try {
      const endpoint = `/medicos/${medicoId}/disponibilidade?data=${data}`;
      const response = await apiRequest(endpoint);
      return response.data || response;
    } catch (error) {
      return null;
    }
  },

  // Buscar agendas específicas de um médico
  async getAgendasEspecificas(medicoId, inicio, fim) {
    try {
      const endpoint = `/medicos/${medicoId}/agendas-especificas?inicio=${inicio}&fim=${fim}`;
      const response = await apiRequest(endpoint);
      return response.data || response;
    } catch (error) {
      return [];
    }
  },

  // Criar uma agenda específica para um médico
  async criarAgendaEspecifica(medicoId, dadosAgenda) {
    const endpoint = `/medicos/${medicoId}/agendas-especificas`;
    const response = await apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(dadosAgenda)
    });
    return response.data || response;
  },

  // Atualizar uma agenda específica
  async atualizarAgendaEspecifica(medicoId, agendaId, dadosAgenda) {
    const endpoint = `/medicos/${medicoId}/agendas-especificas/${agendaId}`;
    const response = await apiRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(dadosAgenda)
    });
    return response.data || response;
  },

  // Excluir uma agenda específica
  async excluirAgendaEspecifica(medicoId, agendaId) {
    const endpoint = `/medicos/${medicoId}/agendas-especificas/${agendaId}`;
    await apiRequest(endpoint, {
      method: 'DELETE'
    });
    return true;
  },

  // Buscar agenda fixa do médico
  async getAgendaFixa(medicoId) {
    try {
      const endpoint = `/medicos/${medicoId}/agenda-fixa`;
      const response = await apiRequest(endpoint);
      return response.data || response;
    } catch (error) {
      return null;
    }
  },

  // Atualizar agenda fixa do médico
  async atualizarAgendaFixa(medicoId, dadosAgenda) {
    const endpoint = `/medicos/${medicoId}/agenda-fixa`;
    const response = await apiRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(dadosAgenda)
    });
    return response.data || response;
  },

  // Atualizar tipo de agenda do médico
  async atualizarTipoAgenda(medicoId, tipoAgenda) {
    const endpoint = `/medicos/${medicoId}/tipo-agenda`;
    const response = await apiRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify({ tipo_agenda: tipoAgenda })
    });
    return response.data || response;
  }
};
