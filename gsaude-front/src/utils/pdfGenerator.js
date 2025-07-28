import jsPDF from 'jspdf';
import 'jspdf-autotable';

export class PDFGenerator {
  constructor() {
    this.doc = new jsPDF();
    this.pageHeight = this.doc.internal.pageSize.height;
    this.pageWidth = this.doc.internal.pageSize.width;
    this.margin = 20;
  }

  // Adicionar cabeçalho do sistema
  addHeader(titulo, subtitulo = '') {
    // Logo/Nome do sistema
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('GSaúde - Sistema de Gestão Médica', this.margin, 25);
    
    // Título do relatório
    this.doc.setFontSize(14);
    this.doc.text(titulo, this.margin, 35);
    
    if (subtitulo) {
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(subtitulo, this.margin, 42);
    }
    
    // Data de geração
    const dataGeracao = new Date().toLocaleString('pt-BR');
    this.doc.setFontSize(8);
    this.doc.text(`Gerado em: ${dataGeracao}`, this.pageWidth - 60, 15);
    
    // Linha separadora
    this.doc.line(this.margin, 48, this.pageWidth - this.margin, 48);
    
    return 55; // Retorna a posição Y após o cabeçalho
  }

  // Adicionar rodapé
  addFooter(pageNumber, totalPages) {
    const footerY = this.pageHeight - 15;
    
    // Linha separadora
    this.doc.line(this.margin, footerY - 5, this.pageWidth - this.margin, footerY - 5);
    
    // Numeração da página
    this.doc.setFontSize(8);
    this.doc.text(
      `Página ${pageNumber} de ${totalPages}`,
      this.pageWidth / 2 - 15,
      footerY
    );
  }

  // Gerar relatório de agendamentos
  gerarRelatorioAgendamentos(dados, filtros) {
    let currentY = this.addHeader('Relatório de Agendamentos', this.getFiltrosText(filtros));
    
    // Resumo
    currentY += 10;
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Resumo:', this.margin, currentY);
    
    currentY += 8;
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Total de agendamentos: ${dados.length}`, this.margin, currentY);
    
    currentY += 5;
    const consultas = dados.filter(item => item.tipo_procedimento === 'consulta').length;
    const exames = dados.filter(item => item.tipo_procedimento === 'exame').length;
    this.doc.text(`Consultas: ${consultas} | Exames: ${exames}`, this.margin, currentY);
    
    // Tabela de dados
    currentY += 15;
    
    const columns = [
      'Data',
      'Hora',
      'Paciente',
      'Médico',
      'Tipo',
      'Especialidade',
      'Status'
    ];
    
    const rows = dados.map(item => [
      new Date(item.data_agendamento).toLocaleDateString('pt-BR'),
      item.hora_agendamento,
      item.nome_paciente,
      item.medico?.nome || 'N/A',
      item.tipo_procedimento === 'consulta' ? 'Consulta' : 'Exame',
      item.especialidade?.nome || 'N/A',
      item.status || 'Agendado'
    ]);
    
    this.doc.autoTable({
      startY: currentY,
      head: [columns],
      body: rows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
      margin: { left: this.margin, right: this.margin }
    });
    
    this.addFooter(1, 1);
    return this.doc;
  }

  // Gerar relatório financeiro
  gerarRelatorioFinanceiro(dados, filtros) {
    let currentY = this.addHeader('Relatório Financeiro', this.getFiltrosText(filtros));
    
    // Resumo financeiro
    currentY += 10;
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Resumo Financeiro:', this.margin, currentY);
    
    currentY += 8;
    const totalReceita = dados.reduce((sum, item) => sum + (item.valor || 0), 0);
    const totalConsultas = dados.filter(item => item.tipo === 'consulta').reduce((sum, item) => sum + (item.valor || 0), 0);
    const totalExames = dados.filter(item => item.tipo === 'exame').reduce((sum, item) => sum + (item.valor || 0), 0);
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Receita Total: R$ ${totalReceita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, this.margin, currentY);
    
    currentY += 5;
    this.doc.text(`Consultas: R$ ${totalConsultas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, this.margin, currentY);
    
    currentY += 5;
    this.doc.text(`Exames: R$ ${totalExames.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, this.margin, currentY);
    
    // Tabela de dados
    currentY += 15;
    
    const columns = [
      'Data',
      'Paciente',
      'Tipo',
      'Médico',
      'Convênio',
      'Valor'
    ];
    
    const rows = dados.map(item => [
      new Date(item.data).toLocaleDateString('pt-BR'),
      item.paciente,
      item.tipo === 'consulta' ? 'Consulta' : 'Exame',
      item.medico,
      item.convenio,
      `R$ ${(item.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    ]);
    
    this.doc.autoTable({
      startY: currentY,
      head: [columns],
      body: rows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [34, 139, 34] },
      margin: { left: this.margin, right: this.margin }
    });
    
    this.addFooter(1, 1);
    return this.doc;
  }

  // Gerar relatório por médicos
  gerarRelatorioPorMedicos(dados, filtros) {
    let currentY = this.addHeader('Relatório por Médicos', this.getFiltrosText(filtros));
    
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
    
    // Resumo
    currentY += 10;
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Resumo por Médicos:', this.margin, currentY);
    
    currentY += 10;
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
    
    this.doc.autoTable({
      startY: currentY,
      head: [columns],
      body: rows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [156, 39, 176] },
      margin: { left: this.margin, right: this.margin }
    });
    
    this.addFooter(1, 1);
    return this.doc;
  }

  // Gerar relatório por especialidades
  gerarRelatorioPorEspecialidades(dados, filtros) {
    let currentY = this.addHeader('Relatório por Especialidades', this.getFiltrosText(filtros));
    
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
    
    // Resumo
    currentY += 10;
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Resumo por Especialidades:', this.margin, currentY);
    
    currentY += 10;
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
    
    this.doc.autoTable({
      startY: currentY,
      head: [columns],
      body: rows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [255, 152, 0] },
      margin: { left: this.margin, right: this.margin }
    });
    
    this.addFooter(1, 1);
    return this.doc;
  }

  // Gerar relatório consolidado
  gerarRelatorioConsolidado(dados, filtros) {
    let currentY = this.addHeader('Relatório Consolidado', this.getFiltrosText(filtros));
    
    // Estatísticas gerais
    currentY += 10;
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Estatísticas Gerais:', this.margin, currentY);
    
    currentY += 8;
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    
    const totalAgendamentos = dados.agendamentos?.length || 0;
    const totalConsultas = dados.agendamentos?.filter(item => item.tipo_procedimento === 'consulta').length || 0;
    const totalExames = dados.agendamentos?.filter(item => item.tipo_procedimento === 'exame').length || 0;
    const receitaTotal = dados.financeiro?.reduce((sum, item) => sum + (item.valor || 0), 0) || 0;
    
    this.doc.text(`Total de Agendamentos: ${totalAgendamentos}`, this.margin, currentY);
    currentY += 5;
    this.doc.text(`Consultas: ${totalConsultas}`, this.margin, currentY);
    currentY += 5;
    this.doc.text(`Exames: ${totalExames}`, this.margin, currentY);
    currentY += 5;
    this.doc.text(`Receita Total: R$ ${receitaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, this.margin, currentY);
    
    this.addFooter(1, 1);
    return this.doc;
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
    
    return textos.length > 0 ? textos.join(' | ') : 'Todos os registros';
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
