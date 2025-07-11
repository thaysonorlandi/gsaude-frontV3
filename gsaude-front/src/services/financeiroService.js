import api from './api';

// Serviço para dados financeiros
export const financeiroService = {
  // Buscar dados consolidados de agendamentos financeiros
  async getDadosFinanceiros() {
    try {
      const response = await api.get('/agendados/relatorios/financeiro');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Erro ao carregar dados financeiros:', error);
      throw error;
    }
  },

  // Calcular resumo financeiro a partir dos dados
  calcularResumoFinanceiro(dadosAgendamentos) {
    // Garantir que dadosAgendamentos é um array
    if (!Array.isArray(dadosAgendamentos)) {
      console.warn('Dados de agendamentos não é um array:', dadosAgendamentos);
      return this.getResumoVazio();
    }

    const agendamentosRealizados = dadosAgendamentos.filter(item => 
      (item.status === 'Realizado' || item.status === 'realizado') && 
      item.valor_consulta && 
      parseFloat(item.valor_consulta) > 0
    );

    // Cálculos de receita, despesa e lucro
    const receitaTotal = agendamentosRealizados.reduce((total, item) => {
      return total + (parseFloat(item.valor_consulta) || 0);
    }, 0);

    const despesaTotal = agendamentosRealizados.reduce((total, item) => {
      return total + (parseFloat(item.valor_pago_medico) || 0);
    }, 0);

    const lucroLiquido = receitaTotal - despesaTotal;

    // Separar consultas e exames
    const consultas = agendamentosRealizados.filter(item => 
      item.tipo_procedimento === 'consulta' || item.tipo === 'Consulta'
    );
    const exames = agendamentosRealizados.filter(item => 
      item.tipo_procedimento === 'exame' || item.tipo === 'Exame'
    );

    // Cálculos para consultas
    const consultasRealizadas = consultas.length;
    const consultasAguardando = dadosAgendamentos.filter(item => 
      (item.tipo_procedimento === 'consulta' || item.tipo === 'Consulta') && 
      (item.status === 'Aguardando' || item.status === 'agendado' || item.status === 'confirmado')
    ).length;

    const valorMedioConsulta = consultasRealizadas > 0 
      ? consultas.reduce((total, item) => total + (parseFloat(item.valor_consulta) || 0), 0) / consultasRealizadas 
      : 0;

    const tempoMedioConsulta = consultasRealizadas > 0
      ? consultas.reduce((total, item) => total + (parseInt(item.duracao_consulta) || 0), 0) / consultasRealizadas
      : 0;

    // Cálculos para exames
    const examesRealizados = exames.length;
    const examesAguardando = dadosAgendamentos.filter(item => 
      (item.tipo_procedimento === 'exame' || item.tipo === 'Exame') && 
      (item.status === 'Aguardando' || item.status === 'agendado' || item.status === 'confirmado')
    ).length;

    const valorMedioExame = examesRealizados > 0 
      ? exames.reduce((total, item) => total + (parseFloat(item.valor_consulta) || 0), 0) / examesRealizados 
      : 0;

    const tempoMedioExame = examesRealizados > 0
      ? exames.reduce((total, item) => total + (parseInt(item.duracao_consulta) || 0), 0) / examesRealizados
      : 0;

    return {
      receitaTotal: this.formatarMoeda(receitaTotal),
      despesaTotal: this.formatarMoeda(despesaTotal),
      lucroLiquido: this.formatarMoeda(lucroLiquido),
      consultasRealizadas,
      consultasAguardando,
      examesRealizados,
      examesAguardando,
      valorMedioConsulta: this.formatarMoeda(valorMedioConsulta),
      valorMedioExame: this.formatarMoeda(valorMedioExame),
      tempoMedioConsulta: `${Math.round(tempoMedioConsulta)} minutos`,
      tempoMedioExame: `${Math.round(tempoMedioExame)} minutos`
    };
  },

  // Retorna um resumo vazio em caso de erro
  getResumoVazio() {
    return {
      receitaTotal: this.formatarMoeda(0),
      despesaTotal: this.formatarMoeda(0),
      lucroLiquido: this.formatarMoeda(0),
      consultasRealizadas: 0,
      consultasAguardando: 0,
      examesRealizados: 0,
      examesAguardando: 0,
      valorMedioConsulta: this.formatarMoeda(0),
      valorMedioExame: this.formatarMoeda(0),
      tempoMedioConsulta: '0 minutos',
      tempoMedioExame: '0 minutos'
    };
  },

  // Processar dados para as tabelas de detalhamento
  processarDetalhamento(dadosAgendamentos) {
    // Garantir que dadosAgendamentos é um array
    if (!Array.isArray(dadosAgendamentos)) {
      console.warn('Dados de agendamentos não é um array:', dadosAgendamentos);
      return { consultas: [], exames: [] };
    }

    const consultasDetalhadas = dadosAgendamentos
      .filter(item => item.tipo_procedimento === 'consulta' || item.tipo === 'Consulta')
      .map(item => ({
        id: item.id,
        paciente: item.nome_paciente || item.paciente_nome || 'Não informado',
        medico: item.medico_nome || 'Não informado',
        valor: this.formatarMoeda(parseFloat(item.valor_consulta) || 0),
        data: this.formatarData(item.data_agendamento || item.data),
        duracao: `${item.duracao_consulta || 0} min`,
        status: this.traduzirStatus(item.status)
      }));

    const examesDetalhados = dadosAgendamentos
      .filter(item => item.tipo_procedimento === 'exame' || item.tipo === 'Exame')
      .map(item => ({
        id: item.id,
        paciente: item.nome_paciente || item.paciente_nome || 'Não informado',
        tipo: item.procedimento_nome || item.exame || 'Não informado',
        valor: this.formatarMoeda(parseFloat(item.valor_consulta) || 0),
        data: this.formatarData(item.data_agendamento || item.data),
        status: this.traduzirStatus(item.status)
      }));

    return {
      consultas: consultasDetalhadas,
      exames: examesDetalhados
    };
  },

  // Funções auxiliares
  formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  },

  formatarData(data) {
    if (!data) return '';
    
    try {
      // Se já está no formato brasileiro (DD/MM/YYYY), mantém
      if (typeof data === 'string' && data.includes('/') && data.length === 10) {
        return data;
      }
      
      // Tenta converter de ISO string ou outros formatos
      const dataObj = new Date(data);
      
      // Verifica se a data é válida
      if (isNaN(dataObj.getTime())) {
        return data; // Retorna o valor original se não conseguir converter
      }
      
      return dataObj.toLocaleDateString('pt-BR');
    } catch (error) {
      console.warn('Erro ao formatar data:', data, error);
      return data || '';
    }
  },

  traduzirStatus(status) {
    const traducoes = {
      'Aguardando': 'Aguardando',
      'Realizado': 'Realizada',
      'Cancelado': 'Cancelado',
      'agendado': 'Aguardando',
      'confirmado': 'Confirmado',
      'realizado': 'Realizada',
      'cancelado': 'Cancelado'
    };
    return traducoes[status] || status;
  }
};

export default financeiroService;
