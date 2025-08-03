import jsPDF from 'jspdf';
import 'jspdf-autotable';

export class PDFGenerator {
  constructor() {
    this.doc = new jsPDF();
    this.pageHeight = this.doc.internal.pageSize.height;
    this.pageWidth = this.doc.internal.pageSize.width;
    this.margin = 20;
    this.systemData = null; // Cache para dados do sistema
  }

  // Buscar dados do sistema da API
  async getSystemData() {
    if (this.systemData) {
      return this.systemData; // Usar cache se disponível
    }

    try {
      // Importar API dinamicamente para evitar problemas de dependência circular
      const { default: api } = await import('../services/api');
      const response = await api.get('/system-configs/relatorios/dados');
      
      this.systemData = response.data?.data || {
        hospital_nome: 'GSaúde Hospital',
        hospital_logo: null,
        hospital_endereco: 'Endereço não configurado',
        hospital_telefone: 'Telefone não configurado',
        hospital_email: 'Email não configurado',
        hospital_cnpj: 'CNPJ não configurado',
        mostrar_valores_padrao: false
      };
      
      return this.systemData;
    } catch (error) {
      console.warn('Erro ao buscar dados do sistema, usando valores padrão:', error);
      // Valores padrão caso a API falhe
      this.systemData = {
        hospital_nome: 'GSaúde Hospital',
        hospital_logo: null,
        hospital_endereco: 'Rua Principal, 123 - Centro',
        hospital_telefone: '(47) 3456-7890',
        hospital_email: 'contato@gsaude.com.br',
        hospital_cnpj: '12.345.678/0001-90',
        mostrar_valores_padrao: false
      };
      
      return this.systemData;
    }
  }

  // Função auxiliar para calcular larguras das colunas baseada no conteúdo
  calculateOptimalColumnWidths(columns, rows, hasValues = false) {
    if (hasValues) {
      // Com valores financeiros - larguras fixas
      return {
        0: 60,  // Data
        1: 45,  // Horário
        2: 110, // Paciente
        3: 75,  // Telefone
        4: 90,  // Médico
        5: 85,  // Tipo/Especialidade
        6: 45,  // Status
        7: 50   // Valor
      };
    } else {
      // Sem valores financeiros - larguras fixas
      return {
        0: 70,  // Data
        1: 50,  // Horário
        2: 130, // Paciente
        3: 85,  // Telefone
        4: 110, // Médico
        5: 100, // Tipo/Especialidade
        6: 55   // Status
      };
    }
  }

  // Função auxiliar para truncar texto se necessário
  truncateText(text, maxLength) {
    if (!text) return 'N/A';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }

  // Função auxiliar para verificar se autoTable está disponível
  isAutoTableAvailable() {
    return typeof this.doc.autoTable === 'function';
  }

  // Função para usar autoTable com fallback melhorado
  createTable(options) {
    if (this.isAutoTableAvailable()) {
      // Calcular larguras ótimas baseadas no número de colunas
      const hasValues = options.head[0].includes('Valor');
      const optimalWidths = this.calculateOptimalColumnWidths(options.head[0], options.body, hasValues);
      
      // Merge das configurações de coluna com larguras calculadas
      const columnStyles = {};
      Object.keys(optimalWidths).forEach(key => {
        columnStyles[key] = {
          cellWidth: optimalWidths[key],
          ...options.columnStyles?.[key]
        };
      });
      
      // Se há coluna de valor, ajustar a última coluna
      if (hasValues && options.head[0].length > Object.keys(optimalWidths).length) {
        const lastIndex = options.head[0].length - 1;
        columnStyles[lastIndex] = {
          cellWidth: this.pageWidth - (this.margin * 2) - Object.values(optimalWidths).reduce((sum, width) => sum + width, 0),
          halign: 'right',
          ...options.columnStyles?.[lastIndex]
        };
      }
      
      // Usar autoTable com configurações melhoradas
      const tableOptions = {
        ...options,
        theme: 'grid',
        styles: {
          fontSize: 8, // Aumentado para melhor legibilidade
          cellPadding: 3,
          lineColor: [200, 200, 200],
          lineWidth: 0.25,
          overflow: 'linebreak',
          valign: 'top',
          halign: 'left',
          ...options.styles
        },
        headStyles: {
          fillColor: [66, 139, 202],
          textColor: 255,
          fontStyle: 'bold',
          halign: 'center',
          valign: 'middle',
          fontSize: 9,
          ...options.headStyles
        },
        bodyStyles: {
          valign: 'top',
          halign: 'left',
          fontSize: 8,
          ...options.bodyStyles
        },
        columnStyles: columnStyles,
        margin: { left: this.margin, right: this.margin },
        tableWidth: 'auto'
      };
      
      this.doc.autoTable(tableOptions);
    } else {
      // Fallback melhorado com formatação em tabela
      let currentY = options.startY || 60;
      const colWidths = this.calculateColumnWidths(options.head[0]);
      const tableWidth = colWidths.reduce((sum, width) => sum + width, 0);
      const startX = (this.pageWidth - tableWidth) / 2; // Centralizar tabela
      
      // Função para desenhar linha horizontal
      const drawHorizontalLine = (y) => {
        this.doc.setLineWidth(0.25);
        this.doc.line(startX, y, startX + tableWidth, y);
      };
      
      // Função para desenhar linhas verticais
      const drawVerticalLines = (y, height) => {
        this.doc.setLineWidth(0.25);
        let x = startX;
        for (let i = 0; i <= colWidths.length; i++) {
          this.doc.line(x, y, x, y + height);
          if (i < colWidths.length) x += colWidths[i];
        }
      };
      
      // Cabeçalho da tabela
      if (options.head && options.head[0]) {
        const headerHeight = 8;
        
        // Fundo do cabeçalho (simulado com retângulo)
        this.doc.setFillColor(66, 139, 202);
        this.doc.rect(startX, currentY, tableWidth, headerHeight, 'F');
        
        // Bordas do cabeçalho
        drawHorizontalLine(currentY);
        drawVerticalLines(currentY, headerHeight);
        drawHorizontalLine(currentY + headerHeight);
        
        // Texto do cabeçalho
        this.doc.setFont('helvetica', 'bold');
        this.doc.setFontSize(8);
        this.doc.setTextColor(255, 255, 255); // Texto branco
        
        let x = startX + 2;
        options.head[0].forEach((header, index) => {
          this.doc.text(header, x, currentY + 5);
          x += colWidths[index];
        });
        
        currentY += headerHeight;
        this.doc.setTextColor(0, 0, 0); // Voltar ao preto
      }
      
      // Dados da tabela
      if (options.body) {
        this.doc.setFont('helvetica', 'normal');
        this.doc.setFontSize(8);
        
        options.body.forEach((row, rowIndex) => {
          const rowHeight = 6;
          
          // Verificar se precisa de nova página
          if (currentY + rowHeight > this.pageHeight - 30) {
            this.doc.addPage();
            currentY = 30;
          }
          
          // Fundo alternado para as linhas
          if (rowIndex % 2 === 0) {
            this.doc.setFillColor(249, 249, 249);
            this.doc.rect(startX, currentY, tableWidth, rowHeight, 'F');
          }
          
          // Bordas da linha
          drawVerticalLines(currentY, rowHeight);
          
          // Texto da linha
          let x = startX + 2;
          row.forEach((cell, cellIndex) => {
            const cellText = String(cell || '').substring(0, 20); // Limitar texto
            this.doc.text(cellText, x, currentY + 4);
            x += colWidths[cellIndex];
          });
          
          currentY += rowHeight;
        });
        
        // Linha final da tabela
        drawHorizontalLine(currentY);
      }
    }
  }

  // Calcular larguras das colunas
  calculateColumnWidths(headers) {
    const baseWidth = 25; // Largura base
    const maxCols = headers.length;
    const availableWidth = this.pageWidth - (2 * this.margin);
    const colWidth = Math.min(baseWidth, availableWidth / maxCols);
    
    return new Array(maxCols).fill(colWidth);
  }

  // Adicionar seção de resumo organizada
  addResumoSection(currentY, titulo, dados) {
    // Título da seção
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(66, 139, 202); // Azul
    this.doc.text(titulo, this.margin, currentY);
    
    currentY += 2;
    // Linha decorativa sob o título
    this.doc.setLineWidth(0.5);
    this.doc.setDrawColor(66, 139, 202);
    this.doc.line(this.margin, currentY, this.margin + this.doc.getTextWidth(titulo), currentY);
    
    currentY += 8;
    this.doc.setTextColor(0, 0, 0); // Voltar ao preto
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(10);
    
    // Organizar dados em duas colunas
    const coluna1 = [];
    const coluna2 = [];
    
    dados.forEach((item, index) => {
      if (index % 2 === 0) {
        coluna1.push(item);
      } else {
        coluna2.push(item);
      }
    });
    
    const meioWidth = (this.pageWidth - 2 * this.margin) / 2;
    
    // Coluna 1
    let y1 = currentY;
    coluna1.forEach(item => {
      this.doc.text(`• ${item}`, this.margin, y1);
      y1 += 5;
    });
    
    // Coluna 2
    let y2 = currentY;
    coluna2.forEach(item => {
      this.doc.text(`• ${item}`, this.margin + meioWidth, y2);
      y2 += 5;
    });
    
    return Math.max(y1, y2) + 5;
  }

  // Adicionar cabeçalho do sistema
  async addHeader(titulo, subtitulo = '') {
    const systemData = await this.getSystemData();
    
    // Logo do hospital (lado esquerdo) - usando um ícone médico melhor
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(66, 139, 202); // Cor azul médica
    this.doc.text('⚕', this.margin, 22); // Símbolo médico
    
    // Informações do hospital vindas do banco de dados
    this.doc.setFontSize(14);
    this.doc.setTextColor(0, 0, 0); // Preto
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(systemData.hospital_nome, this.margin + 15, 20);
    
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Sistema de Gestão Médica', this.margin + 15, 26);
    this.doc.text(`Tel: ${systemData.hospital_telefone}`, this.margin + 15, 30);
    this.doc.text(systemData.hospital_email, this.margin + 15, 34);
    
    // CNPJ se disponível
    if (systemData.hospital_cnpj && systemData.hospital_cnpj !== 'CNPJ não configurado') {
      this.doc.text(`CNPJ: ${systemData.hospital_cnpj}`, this.margin + 15, 38);
    }
    
    // Data de geração (lado direito)
    const dataGeracao = new Date().toLocaleString('pt-BR');
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    const dataText = `Gerado em: ${dataGeracao}`;
    const dataWidth = this.doc.getTextWidth(dataText);
    this.doc.text(dataText, this.pageWidth - this.margin - dataWidth, 20);
    
    // Linha separadora superior
    this.doc.setLineWidth(0.5);
    const lineY = systemData.hospital_cnpj && systemData.hospital_cnpj !== 'CNPJ não configurado' ? 42 : 38;
    this.doc.line(this.margin, lineY, this.pageWidth - this.margin, lineY);
    
    // Título centralizado
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    const tituloWidth = this.doc.getTextWidth(titulo);
    const centroX = (this.pageWidth - tituloWidth) / 2;
    this.doc.text(titulo, centroX, lineY + 12);
    
    // Subtítulo centralizado (se existir)
    let subtituloY = lineY + 12;
    if (subtitulo) {
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      const subtituloWidth = this.doc.getTextWidth(subtitulo);
      const centroXSubtitulo = (this.pageWidth - subtituloWidth) / 2;
      subtituloY = lineY + 19;
      this.doc.text(subtitulo, centroXSubtitulo, subtituloY);
    }
    
    // Linha separadora inferior
    this.doc.setLineWidth(0.3);
    this.doc.line(this.margin, subtituloY + 5, this.pageWidth - this.margin, subtituloY + 5);
    
    return subtituloY + 15; // Retorna a posição Y após o cabeçalho
  }

  // Calcular totais financeiros dos dados
  calcularTotais(dados, mostrarValores = false) {
    if (!mostrarValores || !dados || dados.length === 0) {
      return null;
    }

    const totais = {
      receita_total: 0,
      custo_total: 0,
      lucro_total: 0,
      quantidade_total: dados.length,
      quantidade_consultas: 0,
      quantidade_exames: 0
    };

    dados.forEach(item => {
      // Valores monetários
      const receita = parseFloat(item.valor_consulta || item.receita || 0);
      const custo = parseFloat(item.valor_pago_funcionario || item.valor_pago_medico || item.custo || 0);
      
      totais.receita_total += receita;
      totais.custo_total += custo;
      totais.lucro_total += (receita - custo);

      // Contagem por tipo
      if (item.tipo_procedimento === 'consulta' || item.tipo === 'Consulta') {
        totais.quantidade_consultas++;
      } else if (item.tipo_procedimento === 'exame' || item.tipo === 'Exame') {
        totais.quantidade_exames++;
      }
    });

    return totais;
  }

  // Adicionar seção de totais no final do PDF
  addTotalsSection(totais, currentY) {
    if (!totais) return currentY;

    // Verificar se há espaço suficiente na página
    if (currentY > this.pageHeight - 60) {
      this.doc.addPage();
      currentY = 30;
    }

    // Título da seção de totais
    currentY += 10;
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('RESUMO FINANCEIRO', this.margin, currentY);
    
    // Linha separadora
    currentY += 5;
    this.doc.setLineWidth(0.3);
    this.doc.line(this.margin, currentY, this.pageWidth - this.margin, currentY);
    
    currentY += 10;
    
    // Dados dos totais
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    
    const dados = [
      ['Quantidade Total de Itens:', totais.quantidade_total.toString()],
      ['Consultas:', totais.quantidade_consultas.toString()],
      ['Exames:', totais.quantidade_exames.toString()],
      ['Receita Total:', `R$ ${totais.receita_total.toFixed(2).replace('.', ',')}`],
      ['Custos Totais:', `R$ ${totais.custo_total.toFixed(2).replace('.', ',')}`],
      ['Lucro Total:', `R$ ${totais.lucro_total.toFixed(2).replace('.', ',')}`]
    ];
    
    dados.forEach(([label, value]) => {
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(label, this.margin, currentY);
      
      this.doc.setFont('helvetica', 'bold');
      const valueWidth = this.doc.getTextWidth(value);
      this.doc.text(value, this.pageWidth - this.margin - valueWidth, currentY);
      
      currentY += 6;
    });
    
    // Destacar lucro total
    if (totais.lucro_total >= 0) {
      this.doc.setTextColor(0, 128, 0); // Verde para lucro
    } else {
      this.doc.setTextColor(255, 0, 0); // Vermelho para prejuízo
    }
    
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('RESULTADO:', this.margin, currentY);
    const resultadoText = totais.lucro_total >= 0 ? 'LUCRO' : 'PREJUÍZO';
    const resultadoWidth = this.doc.getTextWidth(resultadoText);
    this.doc.text(resultadoText, this.pageWidth - this.margin - resultadoWidth, currentY);
    
    // Voltar cor para preto
    this.doc.setTextColor(0, 0, 0);
    
    return currentY + 10;
  }

  // Adicionar rodapé melhorado
  addFooter(pageNumber, totalPages) {
    const footerY = this.pageHeight - 20;
    
    // Linha separadora
    this.doc.setLineWidth(0.3);
    this.doc.line(this.margin, footerY - 5, this.pageWidth - this.margin, footerY - 5);
    
    // Informações do hospital (lado esquerdo)
    this.doc.setFontSize(7);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('GSaúde Hospital - Rua das Flores, 123 - Centro - São Paulo/SP', this.margin, footerY);
    this.doc.text('CNPJ: 12.345.678/0001-90 | Tel: (11) 3456-7890', this.margin, footerY + 4);
    
    // Numeração da página (centralizada)
    this.doc.setFont('helvetica', 'bold');
    const pageText = `Página ${pageNumber}${totalPages ? ` de ${totalPages}` : ''}`;
    const pageWidth = this.doc.getTextWidth(pageText);
    this.doc.text(pageText, (this.pageWidth - pageWidth) / 2, footerY + 2);
    
    // Data/hora no rodapé (lado direito)
    const agora = new Date().toLocaleString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    const dataWidth = this.doc.getTextWidth(agora);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(agora, this.pageWidth - this.margin - dataWidth, footerY + 2);
  }

  // Gerar relatório de agendamentos
  async gerarRelatorioAgendamentos(dados, filtros, mostrarValores = null) {
    // Determinar se deve mostrar valores
    const systemData = await this.getSystemData();
    const shouldShowValues = mostrarValores !== null ? mostrarValores : systemData.mostrar_valores_padrao;
    
    let currentY = await this.addHeader('RELATÓRIO DE AGENDAMENTOS', this.getFiltrosText(filtros));
    
    // Resumo usando a nova função
    const consultas = dados.filter(item => item.tipo_procedimento === 'consulta').length;
    const exames = dados.filter(item => item.tipo_procedimento === 'exame').length;
    const realizados = dados.filter(item => item.status === 'Realizado').length;
    const cancelados = dados.filter(item => item.status === 'cancelado').length;
    
    const resumoDados = [
      `Total de agendamentos: ${dados.length}`,
      `Consultas agendadas: ${consultas}`,
      `Exames agendados: ${exames}`,
      `Procedimentos realizados: ${realizados}`,
      `Procedimentos cancelados: ${cancelados}`,
      `Taxa de realização: ${dados.length > 0 ? ((realizados / dados.length) * 100).toFixed(1) : 0}%`
    ];
    
    currentY = this.addResumoSection(currentY, 'RESUMO EXECUTIVO', resumoDados);
    
    // Espaço antes da tabela
    currentY += 10;
    
    // Título da tabela
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(66, 139, 202);
    this.doc.text('DETALHAMENTO DOS AGENDAMENTOS', this.margin, currentY);
    this.doc.setTextColor(0, 0, 0);
    
    currentY += 8;
    
    // Definir colunas baseado na exibição de valores
    const columns = shouldShowValues 
      ? ['Data', 'Hora', 'Paciente', 'Médico', 'Tipo', 'Especialidade', 'Status', 'Valor']
      : ['Data', 'Hora', 'Paciente', 'Médico', 'Tipo', 'Especialidade', 'Status'];
    
    const rows = dados.map(item => {
      const baseRow = [
        item.data ? new Date(item.data).toLocaleDateString('pt-BR') : 'N/A',
        item.horario || 'N/A',
        item.paciente || 'N/A',
        item.medico || 'N/A',
        item.tipo_procedimento === 'consulta' ? 'Consulta' : 'Exame',
        item.especialidade || 'N/A',
        item.status || 'Agendado'
      ];

      if (shouldShowValues) {
        const valor = parseFloat(item.valor_consulta || item.valor || 0);
        baseRow.push(`R$ ${valor.toFixed(2).replace('.', ',')}`);
      }

      return baseRow;
    });
    
    this.createTable({
      startY: currentY,
      head: [columns],
      body: rows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] },
      margin: { left: this.margin, right: this.margin }
    });

    // Adicionar totais se valores estão sendo exibidos
    if (shouldShowValues) {
      const totais = this.calcularTotais(dados, true);
      if (totais) {
        const finalY = this.doc.lastAutoTable?.finalY || (currentY + 50);
        this.addTotalsSection(totais, finalY);
      }
    }
    
    this.addFooter(1, 1);
    this.doc.save('relatorio-agendamentos.pdf');
    return this.doc;
  }

  // Gerar relatório financeiro
  async gerarRelatorioFinanceiro(dados, filtros) {
    // Para relatório financeiro, valores sempre devem ser exibidos
    let currentY = await this.addHeader('RELATÓRIO FINANCEIRO', this.getFiltrosText(filtros));
    
    // Resumo financeiro melhorado
    const totais = this.calcularTotais(dados, true);
    if (totais) {
      const resumoDados = [
        `Total de registros: ${totais.quantidade_total}`,
        `Consultas: ${totais.quantidade_consultas} | Exames: ${totais.quantidade_exames}`,
        `Receita Total: R$ ${totais.receita_total.toFixed(2).replace('.', ',')}`,
        `Custos Totais: R$ ${totais.custo_total.toFixed(2).replace('.', ',')}`,
        `Lucro: R$ ${totais.lucro_total.toFixed(2).replace('.', ',')}`
      ];
      
      currentY = this.addResumoSection(currentY, 'RESUMO FINANCEIRO', resumoDados);
    }
    
    // Espaço antes da tabela
    currentY += 10;
    
    // Título da tabela
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(66, 139, 202);
    this.doc.text('DETALHAMENTO FINANCEIRO', this.margin, currentY);
    this.doc.setTextColor(0, 0, 0);
    
    currentY += 8;
    
    const columns = [
      'Data',
      'Paciente',
      'Tipo',
      'Médico',
      'Convênio',
      'Receita',
      'Custo',
      'Lucro'
    ];
    
    const rows = dados.map(item => {
      const receita = parseFloat(item.valor_consulta || item.valor || 0);
      const custo = parseFloat(item.valor_pago_funcionario || item.valor_pago_medico || item.custo || 0);
      const lucro = receita - custo;
      
      return [
        item.data ? new Date(item.data).toLocaleDateString('pt-BR') : 'N/A',
        item.paciente || item.nome_paciente || 'N/A',
        item.tipo === 'consulta' || item.tipo_procedimento === 'consulta' ? 'Consulta' : 'Exame',
        item.medico || item.medico_nome || 'N/A',
        item.convenio || item.convenio_nome || 'N/A',
        `R$ ${receita.toFixed(2).replace('.', ',')}`,
        `R$ ${custo.toFixed(2).replace('.', ',')}`,
        `R$ ${lucro.toFixed(2).replace('.', ',')}`
      ];
    });
    
    this.createTable({
      startY: currentY,
      head: [columns],
      body: rows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [34, 139, 34] },
      margin: { left: this.margin, right: this.margin },
      columnStyles: {
        5: { halign: 'right' }, // Receita
        6: { halign: 'right' }, // Custo
        7: { halign: 'right' }  // Lucro
      }
    });

    // Adicionar totais
    if (totais) {
      const finalY = this.doc.lastAutoTable?.finalY || (currentY + 50);
      this.addTotalsSection(totais, finalY);
    }

    this.addFooter(1, 1);
    this.doc.save('relatorio-financeiro.pdf');
    return this.doc;
  }

  // Gerar relatório por médicos
  gerarRelatorioPorMedicos(dados, filtros) {
    let currentY = this.addHeader('RELATÓRIO POR MÉDICOS', this.getFiltrosText(filtros));
    
    // Agrupar dados por médico
    const dadosPorMedico = dados.reduce((acc, item) => {
      const medico = item.medico || 'Não informado';
      if (!acc[medico]) {
        acc[medico] = {
          nome: medico,
          total: 0,
          consultas: 0,
          exames: 0,
          receita: 0
        };
      }
      acc[medico].total++;
      if (item.tipo_procedimento === 'consulta') {
        acc[medico].consultas++;
      } else {
        acc[medico].exames++;
      }
      acc[medico].receita += item.valor || 0;
      return acc;
    }, {});
    
    // Resumo usando a nova função
    const totalMedicos = Object.keys(dadosPorMedico).length;
    const totalAtendimentos = dados.length;
    const valorTotal = Object.values(dadosPorMedico).reduce((acc, medico) => acc + medico.receita, 0);
    const medicoMaisAtivo = Object.values(dadosPorMedico).reduce((max, medico) => 
      medico.total > (max?.total || 0) ? medico : max, {nome: 'N/A'}).nome;
    
    const resumoDados = [
      `Total de médicos: ${totalMedicos}`,
      `Total de atendimentos: ${totalAtendimentos}`,
      `Valor total: R$ ${valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      `Média por médico: ${totalMedicos > 0 ? (totalAtendimentos / totalMedicos).toFixed(1) : 0} atendimentos`,
      `Médico mais ativo: ${medicoMaisAtivo}`,
      `Valor médio por atendimento: R$ ${totalAtendimentos > 0 ? (valorTotal / totalAtendimentos).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}`
    ];
    
    currentY = this.addResumoSection(currentY, 'RESUMO POR MÉDICOS', resumoDados);
    
    // Espaço antes da tabela
    currentY += 10;
    
    // Título da tabela
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(76, 175, 80);
    this.doc.text('DETALHAMENTO POR MÉDICOS', this.margin, currentY);
    this.doc.setTextColor(0, 0, 0);
    
    currentY += 8;
    
    const columns = [
      'Médico',
      'Total',
      'Consultas',
      'Exames',
      'Receita'
    ];
    
    const rows = Object.values(dadosPorMedico).map(medico => [
      medico.nome,
      medico.total.toString(),
      medico.consultas.toString(),
      medico.exames.toString(),
      `R$ ${medico.receita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    ]);
    
    this.createTable({
      startY: currentY,
      head: [columns],
      body: rows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [76, 175, 80] },
      margin: { left: this.margin, right: this.margin }
    });

    this.addFooter(1, 1);
    this.doc.save('relatorio-medicos.pdf');
    return this.doc;
  }

  // Gerar relatório por especialidades
  gerarRelatorioPorEspecialidades(dados, filtros) {
    let currentY = this.addHeader('RELATÓRIO POR ESPECIALIDADES', this.getFiltrosText(filtros));
    
    // Agrupar dados por especialidade
    const dadosPorEspecialidade = dados.reduce((acc, item) => {
      const especialidade = item.especialidade?.nome || 'Não informado';
      if (!acc[especialidade]) {
        acc[especialidade] = {
          nome: especialidade,
          total: 0,
          consultas: 0,
          exames: 0,
          receita: 0
        };
      }
      acc[especialidade].total++;
      if (item.tipo_procedimento === 'consulta') {
        acc[especialidade].consultas++;
      } else {
        acc[especialidade].exames++;
      }
      acc[especialidade].receita += item.valor || 0;
      return acc;
    }, {});
    
    // Resumo usando a nova função
    const totalEspecialidades = Object.keys(dadosPorEspecialidade).length;
    const totalAtendimentos = dados.length;
    const valorTotal = Object.values(dadosPorEspecialidade).reduce((acc, esp) => acc + esp.receita, 0);
    const especialidadeMaisAtiva = Object.values(dadosPorEspecialidade).reduce((max, esp) => 
      esp.total > (max?.total || 0) ? esp : max, {nome: 'N/A'}).nome;
    
    const resumoDados = [
      `Total de especialidades: ${totalEspecialidades}`,
      `Total de atendimentos: ${totalAtendimentos}`,
      `Valor total: R$ ${valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      `Média por especialidade: ${totalEspecialidades > 0 ? (totalAtendimentos / totalEspecialidades).toFixed(1) : 0} atendimentos`,
      `Especialidade mais ativa: ${especialidadeMaisAtiva}`,
      `Valor médio por atendimento: R$ ${totalAtendimentos > 0 ? (valorTotal / totalAtendimentos).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}`
    ];
    
    currentY = this.addResumoSection(currentY, 'RESUMO POR ESPECIALIDADES', resumoDados);
    
    // Espaço antes da tabela
    currentY += 10;
    
    // Título da tabela
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(76, 175, 80);
    this.doc.text('DETALHAMENTO POR ESPECIALIDADES', this.margin, currentY);
    this.doc.setTextColor(0, 0, 0);
    
    currentY += 8;
    
    const columns = [
      'Especialidade',
      'Total',
      'Consultas',
      'Exames',
      'Receita'
    ];
    
    const rows = Object.values(dadosPorEspecialidade).map(esp => [
      esp.nome,
      esp.total.toString(),
      esp.consultas.toString(),
      esp.exames.toString(),
      `R$ ${esp.receita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    ]);
    
    this.createTable({
      startY: currentY,
      head: [columns],
      body: rows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [76, 175, 80] },
      margin: { left: this.margin, right: this.margin }
    });

    this.addFooter(1, 1);
    this.doc.save('relatorio-especialidades.pdf');
    return this.doc;
  }

  // Gerar relatório específico de consultas
  gerarRelatorioConsultas(dados, filtros) {
    let currentY = this.addHeader('RELATÓRIO DE CONSULTAS', this.getFiltrosText(filtros));
    
    // Resumo usando a nova função
    const realizadas = dados.filter(item => item.status === 'Realizado').length;
    const agendadas = dados.filter(item => item.status === 'agendado').length;
    const canceladas = dados.filter(item => item.status === 'cancelado').length;
    const duracaoMedia = dados.filter(item => item.duracao_consulta)
      .reduce((acc, item) => acc + (item.duracao_consulta || 0), 0) / 
      dados.filter(item => item.duracao_consulta).length || 0;
    
    const resumoDados = [
      `Total de consultas: ${dados.length}`,
      `Consultas realizadas: ${realizadas}`,
      `Consultas agendadas: ${agendadas}`,
      `Consultas canceladas: ${canceladas}`,
      `Taxa de realização: ${dados.length > 0 ? ((realizadas / dados.length) * 100).toFixed(1) : 0}%`,
      `Duração média: ${duracaoMedia.toFixed(1)} min`
    ];
    
    currentY = this.addResumoSection(currentY, 'RESUMO DE CONSULTAS', resumoDados);
    
    // Espaço antes da tabela
    currentY += 10;
    
    // Título da tabela
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(33, 150, 243);
    this.doc.text('DETALHAMENTO DAS CONSULTAS', this.margin, currentY);
    this.doc.setTextColor(0, 0, 0);
    
    currentY += 8;
    
    const columns = [
      'Data',
      'Hora',
      'Paciente',
      'Médico',
      'Especialidade',
      'Status',
      'Duração'
    ];
    
    const rows = dados.map(item => [
      item.data ? new Date(item.data).toLocaleDateString('pt-BR') : 'N/A',
      item.horario || 'N/A',
      item.paciente || 'N/A',
      item.medico || 'N/A',
      item.especialidade || 'N/A',
      item.status || 'Agendado',
      item.duracao_consulta ? `${item.duracao_consulta} min` : 'N/A'
    ]);
    
    this.createTable({
      startY: currentY,
      head: [columns],
      body: rows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [33, 150, 243] },
      margin: { left: this.margin, right: this.margin }
    });
    
    this.addFooter(1, 1);
    this.doc.save('relatorio-consultas.pdf');
    return this.doc;
  }

  // Gerar relatório específico de exames
  gerarRelatorioExames(dados, filtros) {
    let currentY = this.addHeader('RELATÓRIO DE EXAMES', this.getFiltrosText(filtros));
    
    // Resumo usando a nova função
    const realizados = dados.filter(item => item.status === 'Realizado').length;
    const agendados = dados.filter(item => item.status === 'agendado').length;
    const cancelados = dados.filter(item => item.status === 'cancelado').length;
    const valorTotal = dados.reduce((acc, item) => acc + (item.valor_consulta || 0), 0);
    const valorMedio = dados.length > 0 ? valorTotal / dados.length : 0;
    
    const resumoDados = [
      `Total de exames: ${dados.length}`,
      `Exames realizados: ${realizados}`,
      `Exames agendados: ${agendados}`,
      `Exames cancelados: ${cancelados}`,
      `Taxa de realização: ${dados.length > 0 ? ((realizados / dados.length) * 100).toFixed(1) : 0}%`,
      `Valor médio: R$ ${valorMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    ];
    
    currentY = this.addResumoSection(currentY, 'RESUMO DE EXAMES', resumoDados);
    
    // Espaço antes da tabela
    currentY += 10;
    
    // Título da tabela
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(76, 175, 80);
    this.doc.text('DETALHAMENTO DOS EXAMES', this.margin, currentY);
    this.doc.setTextColor(0, 0, 0);
    
    currentY += 8;
    
    const columns = [
      'Data',
      'Hora',
      'Paciente',
      'Médico',
      'Procedimento',
      'Status',
      'Valor'
    ];
    
    const rows = dados.map(item => [
      item.data ? new Date(item.data).toLocaleDateString('pt-BR') : 'N/A',
      item.horario || 'N/A',
      item.paciente || 'N/A',
      item.medico || 'N/A',
      item.procedimento || 'N/A',
      item.status || 'Agendado',
      item.valor_consulta ? `R$ ${item.valor_consulta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'N/A'
    ]);
    
    this.createTable({
      startY: currentY,
      head: [columns],
      body: rows,
      styles: { 
        fontSize: 8,
        cellPadding: 3,
        overflow: 'linebreak',
        valign: 'top'
      },
      headStyles: { 
        fillColor: [76, 175, 80],
        fontStyle: 'bold',
        halign: 'center'
      },
      margin: { left: this.margin, right: this.margin },
      tableWidth: 'auto',
      columnStyles: {
        0: { halign: 'center', cellWidth: 'auto' }, // Data
        1: { halign: 'center', cellWidth: 'auto' }, // Hora
        2: { halign: 'left', cellWidth: 'auto', overflow: 'linebreak' }, // Paciente
        3: { halign: 'left', cellWidth: 'auto', overflow: 'linebreak' }, // Médico
        4: { halign: 'left', cellWidth: 'auto', overflow: 'linebreak' }, // Procedimento
        5: { halign: 'center', cellWidth: 'auto' }, // Status
        6: { halign: 'right', cellWidth: 'auto' } // Valor
      }
    });
    
    this.addFooter(1, 1);
    this.doc.save('relatorio-exames.pdf');
    return this.doc;
  }

  // Nova função para relatório consolidado
  gerarRelatorioConsolidado(dados, estatisticas, opcoes = {}) {
    this.doc = new jsPDF();
    
    this.addHeader('RELATÓRIO CONSOLIDADO', opcoes.periodo);
    
    let yPosition = 60;

    // Seção de resumo financeiro (se mostrarValores estiver ativo)
    if (opcoes.mostrarValores && estatisticas.total_valor_recebido) {
      this.addSectionTitle('RESUMO FINANCEIRO', yPosition);
      yPosition += 15;
      
      const resumoFinanceiro = [
        ['Valor Total Recebido', `R$ ${estatisticas.total_valor_recebido?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}`],
        ['Valor Total Pago', `R$ ${estatisticas.total_valor_pago?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}`],
        ['Lucro Total', `R$ ${estatisticas.total_lucro?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}`],
        ['Valor Médio por Procedimento', `R$ ${estatisticas.valor_medio?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}`]
      ];

      this.createTable({
        startY: yPosition,
        head: [['Descrição', 'Valor']],
        body: resumoFinanceiro,
        headStyles: { fillColor: [66, 139, 202] }
      });

      yPosition = this.doc.lastAutoTable.finalY + 20;
    }

    // Seção de estatísticas operacionais
    this.addSectionTitle('ESTATÍSTICAS OPERACIONAIS', yPosition);
    yPosition += 15;
    
    const estatisticasOperacionais = [
      ['Total de Agendamentos', estatisticas.total_agendamentos || 0],
      ['Total de Consultas', estatisticas.total_consultas || 0],
      ['Total de Exames', estatisticas.total_exames || 0],
      ['Realizados', estatisticas.realizados || 0],
      ['Agendados', estatisticas.agendados || 0],
      ['Confirmados', estatisticas.confirmados || 0],
      ['Cancelados', estatisticas.cancelados || 0]
    ];

    this.createTable({
      startY: yPosition,
      head: [['Indicador', 'Quantidade']],
      body: estatisticasOperacionais,
      headStyles: { fillColor: [40, 167, 69] }
    });

    yPosition = this.doc.lastAutoTable.finalY + 20;

    // Tabela detalhada de dados
    this.addSectionTitle('DADOS DETALHADOS', yPosition);
    yPosition += 15;

    // Preparar dados para a tabela
    const headers = ['Data', 'Horário', 'Paciente', 'Tipo', 'Procedimento', 'Médico', 'Convênio', 'Situação'];
    if (opcoes.mostrarValores) {
      headers.push('Valor Recebido', 'Valor Pago', 'Lucro');
    }

    const tableData = dados.map(item => {
      const row = [
        item.data,
        item.horario,
        item.paciente,
        item.tipo_procedimento === 'consulta' ? 'Consulta' : 'Exame',
        item.procedimento || '-',
        item.medico || '-',
        item.convenio || '-',
        item.situacao
      ];

      if (opcoes.mostrarValores) {
        row.push(
          item.valor_recebido ? `R$ ${item.valor_recebido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-',
          item.valor_pago ? `R$ ${item.valor_pago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-',
          item.lucro ? `R$ ${item.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'
        );
      }

      return row;
    });

    this.createTable({
      startY: yPosition,
      head: [headers],
      body: tableData,
      styles: { fontSize: 7 },
      columnStyles: opcoes.mostrarValores ? {
        0: { halign: 'center', cellWidth: 15 },
        1: { halign: 'center', cellWidth: 15 },
        2: { cellWidth: 25 },
        3: { halign: 'center', cellWidth: 15 },
        4: { cellWidth: 25 },
        5: { cellWidth: 20 },
        6: { cellWidth: 20 },
        7: { halign: 'center', cellWidth: 15 },
        8: { halign: 'right', cellWidth: 18 },
        9: { halign: 'right', cellWidth: 18 },
        10: { halign: 'right', cellWidth: 18 }
      } : {
        0: { halign: 'center' },
        1: { halign: 'center' },
        7: { halign: 'center' }
      }
    });

    this.addFooter();
    this.doc.save('relatorio-consolidado.pdf');
  }

  // Novo método: Relatório de Agendamentos
  async gerarRelatorioAgendamentosDia(dados, filtros, mostrarValores = null) {
    // Determinar se deve mostrar valores
    const systemData = await this.getSystemData();
    const shouldShowValues = mostrarValores !== null ? mostrarValores : systemData.mostrar_valores_padrao;
    
    const dataInicio = filtros.data_inicio || new Date().toLocaleDateString('pt-BR');
    const dataFim = filtros.data_fim || dataInicio;
    const periodo = dataInicio === dataFim ? `Data: ${dataInicio}` : `Período: ${dataInicio} a ${dataFim}`;
    
    let currentY = await this.addHeader('RELATÓRIO DE AGENDAMENTOS - AGUARDANDO', periodo);
    
    // Resumo do período focado em agendamentos aguardando
    const totalAgendamentos = dados.length;
    const consultas = dados.filter(item => item.tipo_procedimento === 'consulta').length;
    const exames = dados.filter(item => item.tipo_procedimento === 'exame').length;
    const agendados = dados.filter(item => item.status === 'agendado').length;
    const confirmados = dados.filter(item => item.status === 'confirmado').length;
    const realizados = dados.filter(item => item.status === 'realizado').length;
    
    const resumoDados = [
      `Total de agendamentos aguardando: ${totalAgendamentos}`,
      `Consultas aguardando: ${consultas} | Exames aguardando: ${exames}`,
      `Status: Agendados: ${agendados} | Confirmados: ${confirmados} | Realizados: ${realizados}`,
      `Período: ${dataInicio === dataFim ? dataInicio : `${dataInicio} a ${dataFim}`}`
    ];
    
    if (dados.length > 0) {
      resumoDados.push(`Primeiro horário: ${dados[0].hora_agendamento || 'N/A'}`);
      resumoDados.push(`Último horário: ${dados[dados.length - 1].hora_agendamento || 'N/A'}`);
    }
    
    currentY = this.addResumoSection(currentY, 'RESUMO - AGENDAMENTOS AGUARDANDO', resumoDados);
    
    // Espaço antes da tabela
    currentY += 10;
    
    // Título da tabela
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(66, 139, 202);
    this.doc.text('AGENDAMENTOS AGUARDANDO CONFIRMAÇÃO', this.margin, currentY);
    this.doc.setTextColor(0, 0, 0);
    
    currentY += 8;
    
    // Definir colunas para o relatório
    const columns = shouldShowValues 
      ? ['Data', 'Horário', 'Paciente', 'Telefone', 'Médico', 'Tipo/Especialidade', 'Status', 'Valor']
      : ['Data', 'Horário', 'Paciente', 'Telefone', 'Médico', 'Tipo/Especialidade', 'Status'];
    
    const rows = dados.map(item => {
      const tipoEspecialidade = item.tipo_procedimento === 'consulta' 
        ? `Consulta - ${this.truncateText(item.especialidade_nome, 20)}`
        : `Exame - ${this.truncateText(item.procedimento_nome, 20)}`;
      
      const dataFormatada = item.data_agendamento 
        ? new Date(item.data_agendamento).toLocaleDateString('pt-BR')
        : (item.data || 'N/A');
      
      const baseRow = [
        dataFormatada,
        item.hora_agendamento || 'N/A',
        this.truncateText(item.nome_paciente, 25),
        item.telefone_paciente || 'N/A',
        this.truncateText(item.medico_nome, 22),
        tipoEspecialidade,
        this.formatarStatus(item.status)
      ];

      if (shouldShowValues) {
        const valor = parseFloat(item.valor_consulta || item.valor || 0);
        baseRow.push(`R$ ${valor.toFixed(2).replace('.', ',')}`);
      }

      return baseRow;
    });
    
    this.createTable({
      startY: currentY,
      head: [columns],
      body: rows,
      styles: { 
        fontSize: 7,
        cellPadding: 2,
        overflow: 'linebreak',
        valign: 'top',
        lineColor: [200, 200, 200],
        lineWidth: 0.1
      },
      headStyles: { 
        fillColor: [66, 139, 202],
        fontStyle: 'bold',
        halign: 'center',
        valign: 'middle',
        fontSize: 8
      },
      columnStyles: {
        0: { halign: 'center' }, // Data
        1: { halign: 'center' }, // Horário
        2: { halign: 'left', overflow: 'linebreak' }, // Paciente
        3: { halign: 'center' }, // Telefone
        4: { halign: 'left', overflow: 'linebreak' }, // Médico
        5: { halign: 'left', overflow: 'linebreak' }, // Tipo/Especialidade
        6: { halign: 'center' }, // Status
        7: { halign: 'right' } // Valor (se existir)
      }
    });

    // Adicionar totais se valores estão sendo exibidos
    if (shouldShowValues) {
      const totais = this.calcularTotais(dados, true);
      if (totais) {
        const finalY = this.doc.lastAutoTable?.finalY || (currentY + 50);
        this.addTotalsSection(totais, finalY);
      }
    }
    
    this.addFooter(1, 1);
    const nomeArquivo = dataInicio === dataFim 
      ? `agendamentos-aguardando-${dataInicio.replace(/\//g, '-')}.pdf`
      : `agendamentos-aguardando-${dataInicio.replace(/\//g, '-')}-a-${dataFim.replace(/\//g, '-')}.pdf`;
    this.doc.save(nomeArquivo);
    return this.doc;
  }

  // Método auxiliar para formatar status
  formatarStatus(status) {
    const statusMap = {
      'agendado': 'Aguardando',
      'confirmado': 'Confirmado', 
      'realizado': 'Realizado',
      'cancelado': 'Cancelado',
      'Aguardando': 'Aguardando',
      'Realizado': 'Realizado',
      'Cancelado': 'Cancelado'
    };
    return statusMap[status?.toLowerCase()] || statusMap[status] || status || 'N/A';
  }

  // Texto dos filtros aplicados
  getFiltrosText(filtros) {
    const textos = [];
    
    if (filtros.dataInicio && filtros.dataFim) {
      textos.push(`Período: ${filtros.dataInicio} a ${filtros.dataFim}`);
    }
    
    if (filtros.medico_id) {
      textos.push(`Médico ID: ${filtros.medico_id}`);
    }
    
    if (filtros.especialidade_id) {
      textos.push(`Especialidade ID: ${filtros.especialidade_id}`);
    }
    
    if (filtros.tipo_procedimento) {
      textos.push(`Tipo: ${filtros.tipo_procedimento === 'consulta' ? 'Consulta' : 'Exame'}`);
    }
    
    return textos.length > 0 ? textos.join(' | ') : '';
  }

  // Salvar PDF
  save(filename) {
    this.doc.save(filename);
  }

  // Abrir PDF em nova janela
  output() {
    return this.doc.output('blob');
  }
}
