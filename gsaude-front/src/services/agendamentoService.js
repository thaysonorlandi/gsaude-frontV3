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
    { id: 1, nome: 'Eletrocardiograma', descricao: 'Exame do coração', valor: 80.00 },
    { id: 2, nome: 'Raio-X Tórax', descricao: 'Exame de imagem do tórax', valor: 60.00 }
  ],
  convenios: [
    { id: 1, nome: 'Unimed', telefone: '(11) 2222-3333' },
    { id: 2, nome: 'Bradesco Saúde', telefone: '(11) 4444-5555' }
  ]
};

// Serviços específicos para agendamento
export const agendamentoService = {
  // Buscar dados iniciais consolidados
  async getDadosIniciais() {
    try {
      const response = await apiRequest('/agendamento/dados-iniciais');
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
  }
};
