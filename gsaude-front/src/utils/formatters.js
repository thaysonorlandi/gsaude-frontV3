// Utilitários para formatação de dados

// Função para formatar telefone com máscara (xx) xxxxx-xxxx
export function formatarTelefone(valor) {
  // Remove todos os caracteres não numéricos
  const numeros = valor.replace(/\D/g, '');
  
  // Aplica a máscara conforme o número de dígitos
  if (numeros.length <= 2) {
    return `(${numeros}`;
  } else if (numeros.length <= 7) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  } else if (numeros.length <= 11) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
  } else {
    // Limita a 11 dígitos
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`;
  }
}

// Função para remover a máscara do telefone
export function removerMascaraTelefone(valor) {
  return valor.replace(/\D/g, '');
}

// Função para formatar data no formato brasileiro
export function formatarDataBR(data) {
  if (!data) return '';
  
  const dataObj = new Date(data);
  return dataObj.toLocaleDateString('pt-BR');
}

// Função para formatar data para o formato do banco (YYYY-MM-DD)
export function formatarDataParaBanco(data) {
  if (!data) return '';
  
  const dataObj = new Date(data);
  return dataObj.toISOString().split('T')[0];
}

// Função para obter o dia da semana em português
export function obterDiaSemana(data) {
  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const dataObj = new Date(data);
  return diasSemana[dataObj.getDay()];
}

// Função para gerar datas dos próximos dias
export function gerarProximasDatas(quantidadeDias = 7) {
  const datas = [];
  const hoje = new Date();
  
  for (let i = 0; i < quantidadeDias; i++) {
    const data = new Date(hoje);
    data.setDate(hoje.getDate() + i);
    
    datas.push({
      data: formatarDataBR(data),
      dataISO: formatarDataParaBanco(data),
      diaSemana: obterDiaSemana(data),
    });
  }
  
  return datas;
}
