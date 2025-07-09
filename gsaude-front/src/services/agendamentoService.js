// Serviços para integração com a API do backend
const API_BASE_URL = 'http://localhost:8000/api/v1';

// Função auxiliar para obter token de autenticação
function getAuthToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

// Função auxiliar para fazer requisições HTTP
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    ...options,
  };

  try {
    console.log('API Request:', url);
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro de conexão' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API Response:', data);
    return data;
  } catch (error) {
    console.error('API Error:', error);
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
      return response.data || response;
    } catch (error) {
      console.warn('Erro ao carregar médicos por procedimento:', error);
      return [];
    }
  },

  // Buscar horários disponíveis
  async getHorariosDisponiveis(medicoId, data = null) {
    try {
      const endpoint = data 
        ? `/medicos/${medicoId}/horarios-disponiveis?data=${data}`
        : `/medicos/${medicoId}/horarios-disponiveis`;
      const response = await apiRequest(endpoint);
      return response.data || response;
    } catch (error) {
      console.warn('Erro ao carregar horários:', error);
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
      
      const endpoint = params.toString() ? `/agendamentos?${params}` : '/agendamentos';
      const response = await apiRequest(endpoint);
      return response.data || response;
    } catch (error) {
      console.warn('Erro ao carregar agendamentos:', error);
      return [];
    }
  }
};
