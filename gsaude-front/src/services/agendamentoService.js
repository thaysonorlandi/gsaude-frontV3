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
    console.error('API Error:', error);
    // Se for erro de resposta do axios, extrair a mensagem
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || `HTTP error! status: ${error.response.status}`);
    }
    throw error;
  }
}

// Dados de fallback para desenvolvimento
const FALLBACK_DATA = {
  filiais: [
    { id: 1, nome: 'Filial Centro', endereco: 'Rua Principal, 123', telefone: '(11) 1234-5678' },
    { id: 2, nome: 'Filial Norte', endereco: 'Av. Norte, 456', telefone: '(11) 8765-4321' }
  ],
  especialidades: [
    { id: 1, nome: 'Cardiologia', descricao: 'Especialidade do coração' },
    { id: 2, nome: 'Neurologia', descricao: 'Especialidade do sistema nervoso' }
  ],
  procedimentos: [
    { 
      id: 1, 
      nome: 'Eletrocardiograma', 
      descricao: 'Exame do coração', 
      valor: 80.00,
      duracao_minutos: 30 
    },
    { 
      id: 2, 
      nome: 'Raio-X Tórax', 
      descricao: 'Exame de imagem do tórax', 
      valor: 60.00,
      duracao_minutos: 15
    }
  ],
  convenios: [
    { id: 1, nome: 'Unimed', telefone: '(11) 2222-3333' },
    { id: 2, nome: 'Bradesco Saúde', telefone: '(11) 4444-5555' }
  ],
  medicos: [
    { 
      id: 1, 
      nome: 'Dr. João Silva', 
      tipo_agenda: 'fixa',
      especialidades: [1]
    },
    { 
      id: 2, 
      nome: 'Dra. Maria Santos', 
      tipo_agenda: 'flexivel',
      especialidades: [2]
    }
  ]
};

// Serviços específicos para agendamento
export const agendamentoService = {
  // Buscar dados iniciais consolidados
  async getDadosIniciais() {
    try {
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
    } catch (error) {
      console.warn('Erro ao carregar dados da API, usando dados de fallback:', error);
      return FALLBACK_DATA;
    }
  },

  // Buscar filiais
  async getFiliais() {
    try {
      const response = await apiRequest('/filiais');
      return response.data || response;
    } catch (error) {
      console.warn('Erro ao carregar filiais, usando fallback:', error);
      return FALLBACK_DATA.filiais;
    }
  },

  // Buscar especialidades (para consultas)
  async getEspecialidades() {
    try {
      const response = await apiRequest('/especialidades');
      return response.data || response;
    } catch (error) {
      console.warn('Erro ao carregar especialidades, usando fallback:', error);
      return FALLBACK_DATA.especialidades;
    }
  },

  // Buscar procedimentos (para exames)
  async getProcedimentos() {
    try {
      const response = await apiRequest('/procedimentos');
      return response.data || response;
    } catch (error) {
      console.warn('Erro ao carregar procedimentos, usando fallback:', error);
      return FALLBACK_DATA.procedimentos;
    }
  },

  // Buscar convênios
  async getConvenios() {
    try {
      const response = await apiRequest('/convenios');
      return response.data || response;
    } catch (error) {
      console.warn('Erro ao carregar convênios, usando fallback:', error);
      return FALLBACK_DATA.convenios;
    }
  },

  // Buscar médicos por especialidade (para consultas)
  async getMedicosPorEspecialidade(especialidadeId) {
    try {
      const response = await apiRequest(`/medicos/especialidade/${especialidadeId}`);
      return response.data || response;
    } catch (error) {
      console.warn('Erro ao carregar médicos por especialidade:', error);
      return [];
    }
  },

  // Buscar médicos por procedimento (para exames)
  async getMedicosPorProcedimento(procedimentoId) {
    try {
      const response = await apiRequest(`/medicos/procedimento/${procedimentoId}`);
      // Verificar se a resposta tem a estrutura esperada
      if (response.success && response.data) {
        return response.data;
      }
      return response.data || response;
    } catch (error) {
      console.error('Erro ao carregar médicos por procedimento:', error);
      // Retornar array vazio em caso de erro
      return [];
    }
  },

  // Buscar exames por especialidade (para vinculação)
  async getExamesPorEspecialidade(especialidadeId) {
    try {
      const response = await apiRequest(`/especialidades/${especialidadeId}/exames`);
      return response.data || response;
    } catch (error) {
      console.warn('Erro ao carregar exames por especialidade:', error);
      return [];
    }
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
      console.error('Erro ao carregar horários:', error);
      return [];
    }
  },

  // Criar agendamento
  async criarAgendamento(dadosAgendamento) {
    try {
      const response = await apiRequest('/agendamentos', {
        method: 'POST',
        body: JSON.stringify(dadosAgendamento),
      });
      return response.data || response;
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      throw error;
    }
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
      console.warn('Erro ao carregar agendamentos:', error);
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
      console.error('Erro ao carregar disponibilidade do médico:', error);
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
      console.error('Erro ao carregar agendas específicas:', error);
      return [];
    }
  },

  // Criar uma agenda específica para um médico
  async criarAgendaEspecifica(medicoId, dadosAgenda) {
    try {
      const endpoint = `/medicos/${medicoId}/agendas-especificas`;
      const response = await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(dadosAgenda)
      });
      return response.data || response;
    } catch (error) {
      console.error('Erro ao criar agenda específica:', error);
      throw error;
    }
  },

  // Atualizar uma agenda específica
  async atualizarAgendaEspecifica(medicoId, agendaId, dadosAgenda) {
    try {
      const endpoint = `/medicos/${medicoId}/agendas-especificas/${agendaId}`;
      const response = await apiRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(dadosAgenda)
      });
      return response.data || response;
    } catch (error) {
      console.error('Erro ao atualizar agenda específica:', error);
      throw error;
    }
  },

  // Excluir uma agenda específica
  async excluirAgendaEspecifica(medicoId, agendaId) {
    try {
      const endpoint = `/medicos/${medicoId}/agendas-especificas/${agendaId}`;
      await apiRequest(endpoint, {
        method: 'DELETE'
      });
      return true;
    } catch (error) {
      console.error('Erro ao excluir agenda específica:', error);
      throw error;
    }
  },

  // Buscar agenda fixa do médico
  async getAgendaFixa(medicoId) {
    try {
      const endpoint = `/medicos/${medicoId}/agenda-fixa`;
      const response = await apiRequest(endpoint);
      return response.data || response;
    } catch (error) {
      console.error('Erro ao carregar agenda fixa:', error);
      return null;
    }
  },

  // Atualizar agenda fixa do médico
  async atualizarAgendaFixa(medicoId, dadosAgenda) {
    try {
      const endpoint = `/medicos/${medicoId}/agenda-fixa`;
      const response = await apiRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(dadosAgenda)
      });
      return response.data || response;
    } catch (error) {
      console.error('Erro ao atualizar agenda fixa:', error);
      throw error;
    }
  },

  // Atualizar tipo de agenda do médico
  async atualizarTipoAgenda(medicoId, tipoAgenda) {
    try {
      const endpoint = `/medicos/${medicoId}/tipo-agenda`;
      const response = await apiRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify({ tipo_agenda: tipoAgenda })
      });
      return response.data || response;
    } catch (error) {
      console.error('Erro ao atualizar tipo de agenda:', error);
      throw error;
    }
  }
};
