// Serviços para integração com a API do backend
const API_BASE_URL = 'http://localhost:8000/api'; // URL da API Laravel

// Função auxiliar para fazer requisições HTTP
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Serviços específicos para agendamento
export const agendamentoService = {
  // Buscar todas as filiais
  async getFiliais() {
    return await apiRequest('/filiais');
  },

  // Buscar especialidades/tipos de exame
  async getEspecialidades() {
    return await apiRequest('/especialidades');
  },

  // Buscar tipos de exame
  async getTiposExame() {
    return await apiRequest('/tipos-exame');
  },

  // Buscar médicos por especialidade
  async getMedicosPorEspecialidade(especialidadeId) {
    return await apiRequest(`/medicos/especialidade/${especialidadeId}`);
  },

  // Buscar médicos por tipo de exame
  async getMedicosPorTipoExame(tipoExameId) {
    return await apiRequest(`/medicos/tipo-exame/${tipoExameId}`);
  },

  // Buscar horários disponíveis do médico
  async getHorariosDisponiveis(medicoId, data) {
    return await apiRequest(`/medicos/${medicoId}/horarios?data=${data}`);
  },

  // Buscar convênios
  async getConvenios() {
    return await apiRequest('/convenios');
  },

  // Criar novo agendamento
  async criarAgendamento(dadosAgendamento) {
    return await apiRequest('/agendamentos', {
      method: 'POST',
      body: JSON.stringify(dadosAgendamento),
    });
  },

  // Verificar disponibilidade de horário
  async verificarDisponibilidade(medicoId, data, hora) {
    return await apiRequest(`/medicos/${medicoId}/verificar-disponibilidade`, {
      method: 'POST',
      body: JSON.stringify({ data, hora }),
    });
  },
};
