import React, { useState, useEffect, useCallback } from 'react';
import './relatorios.css';
import {
  Box,
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
  Tooltip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PictureAsPdf, Assessment, TrendingUp, Group, LocalHospital } from '@mui/icons-material';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import relatoriosService from '../../services/relatoriosService';
import { PDFGenerator } from '../../utils/pdfGenerator';

dayjs.locale('pt-br');

const Relatorios = () => {
  const [tipoRelatorio, setTipoRelatorio] = useState('exames-por-tipo');
  const [dataInicio, setDataInicio] = useState(dayjs().startOf('month'));
  const [dataFim, setDataFim] = useState(dayjs().endOf('month'));
  const [dados, setDados] = useState([]);
  const [estatisticas, setEstatisticas] = useState({});
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [mostrarValores, setMostrarValores] = useState(false);
  
  // Estados para filtros específicos
  const [procedimentoId, setProcedimentoId] = useState('');
  const [especialidadeId, setEspecialidadeId] = useState('');
  const [tipoAgendamento, setTipoAgendamento] = useState(''); // Alterado de 'situacao' para 'tipoAgendamento'
  const [convenioId, setConvenioId] = useState('');
  
  // Estados para dados dos filtros
  const [procedimentos, setProcedimentos] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [convenios, setConvenios] = useState([]);

  const tiposRelatorio = [
    { value: 'agendamentos-dia', label: 'Agendamentos' },
    { value: 'exames-por-tipo', label: 'Relatório de Exames por Tipo' },
    { value: 'consultas-por-especialidade', label: 'Relatório de Consultas por Especialidade' },
    { value: 'consolidado', label: 'Relatório Consolidado' }
  ];

  const tiposAgendamento = [
    { value: '', label: 'Todos os Tipos' },
    { value: 'consulta', label: 'Consultas' },
    { value: 'exame', label: 'Exames' }
  ];

  const situacoes = [
    { value: '', label: 'Todas as Situações' },
    { value: 'Aguardando', label: 'Aguardando' },
    { value: 'confirmado', label: 'Confirmado' },
    { value: 'Realizado', label: 'Realizado' },
    { value: 'cancelado', label: 'Cancelado' }
  ];

  // Carregar dados dos filtros
  useEffect(() => {
    carregarDadosFiltros();
  }, []);

  const carregarDadosFiltros = async () => {
    try {
      // Usar dados mock direto se a API falhar
      setProcedimentos([
        { id: 1, nome: 'Ultrassonografia', valor: 120.00 },
        { id: 2, nome: 'Raio-X', valor: 80.00 },
        { id: 3, nome: 'Ressonância Magnética', valor: 350.00 },
        { id: 4, nome: 'Tomografia', valor: 200.00 },
        { id: 5, nome: 'Ecocardiograma', valor: 150.00 }
      ]);

      setEspecialidades([
        { id: 1, nome: 'Cardiologia' },
        { id: 2, nome: 'Dermatologia' },
        { id: 3, nome: 'Pediatria' },
        { id: 4, nome: 'Ortopedia' },
        { id: 5, nome: 'Ginecologia' }
      ]);

      setConvenios([
        { id: 1, nome: 'UNIMED' },
        { id: 2, nome: 'SUS' },
        { id: 3, nome: 'Particular' },
        { id: 4, nome: 'AMIL' },
        { id: 5, nome: 'Bradesco Saúde' }
      ]);

      // Tentar carregar da API em segundo plano
      try {
        const [procResp, espResp, convResp] = await Promise.all([
          relatoriosService.getProcedimentos(),
          relatoriosService.getEspecialidades(),
          relatoriosService.getConvenios()
        ]);

        if (procResp.success) setProcedimentos(procResp.data);
        if (espResp.success) setEspecialidades(espResp.data);
        if (convResp.success) setConvenios(convResp.data);
      } catch (apiError) {
        console.log('Usando dados mock - API não disponível:', apiError.message);
      }
    } catch (error) {
      console.error('Erro ao carregar dados dos filtros:', error);
    }
  };

  // Carregar dados do relatório
  const carregarDados = useCallback(async () => {
    setLoading(true);
    setErro('');

    // Função para gerar dados mock
    const gerarDadosMock = () => {
      const dadosMock = [];
      let estatisticasMock = {};

      switch (tipoRelatorio) {
        case 'agendamentos-dia': {
          // Gerar dados mock para o período selecionado
          const diasNoPeriodo = dataFim.diff(dataInicio, 'day') + 1;
          let itemIndex = 0;
          
          for (let dia = 0; dia < diasNoPeriodo; dia++) {
            const dataAtual = dataInicio.add(dia, 'day');
            // Gerar alguns agendamentos para cada dia (variando entre 3-6 por dia)
            const agendamentosPorDia = Math.floor(Math.random() * 4) + 3;
            
            for (let i = 0; i < agendamentosPorDia; i++) {
              const isConsulta = itemIndex % 2 === 0;
              const especialidades = ['Cardiologia', 'Dermatologia', 'Pediatria', 'Ortopedia', 'Ginecologia'];
              const procedimentos = ['Ultrassonografia', 'Raio-X', 'Ressonância Magnética', 'Tomografia', 'Ecocardiograma'];
              
              // Gerar mais status "agendado" (70% dos casos) para simular agendamentos aguardando
              let statusAgendamento;
              const statusRandom = Math.random();
              if (statusRandom < 0.7) {
                statusAgendamento = 'agendado'; // 70% agendado (Aguardando)
              } else if (statusRandom < 0.85) {
                statusAgendamento = 'confirmado'; // 15% confirmado
              } else if (statusRandom < 0.95) {
                statusAgendamento = 'realizado'; // 10% realizado
              } else {
                statusAgendamento = 'cancelado'; // 5% cancelado
              }
              
              dadosMock.push({
                hora_agendamento: `${8 + (i * 2)}:${i % 2 === 0 ? '00' : '30'}`,
                nome_paciente: `Paciente ${itemIndex + 1}`,
                telefone_paciente: `(47) 9999-${1000 + itemIndex}`,
                medico_nome: `Dr. Médico ${(itemIndex % 5) + 1}`,
                tipo_procedimento: isConsulta ? 'consulta' : 'exame',
                especialidade_nome: isConsulta ? especialidades[itemIndex % especialidades.length] : null,
                procedimento_nome: !isConsulta ? procedimentos[itemIndex % procedimentos.length] : null,
                convenio_nome: itemIndex % 3 === 0 ? 'UNIMED' : itemIndex % 3 === 1 ? 'SUS' : 'Particular',
                status: statusAgendamento,
                valor_consulta: mostrarValores ? (150 + itemIndex * 20) : null,
                data_agendamento: dataAtual.format('YYYY-MM-DD'),
                data: dataAtual.format('DD/MM/YYYY')
              });
              itemIndex++;
            }
          }
          
          // Por padrão, filtrar apenas agendamentos "Aguardando" se nenhum tipo específico foi selecionado
          let dadosFiltrados = dadosMock;
          if (tipoAgendamento) {
            dadosFiltrados = dadosMock.filter(item => {
              return item.tipo_procedimento === tipoAgendamento;
            });
          } else {
            // Se não há filtro de tipo, mostrar apenas agendamentos "Aguardando" (status = 'agendado')
            dadosFiltrados = dadosMock.filter(item => item.status === 'agendado');
          }
          
          estatisticasMock = {
            total_agendamentos: dadosFiltrados.length,
            consultas: dadosFiltrados.filter(item => item.tipo_procedimento === 'consulta').length,
            exames: dadosFiltrados.filter(item => item.tipo_procedimento === 'exame').length,
            agendados: dadosFiltrados.filter(item => item.status === 'agendado').length,
            confirmados: dadosFiltrados.filter(item => item.status === 'confirmado').length,
            realizados: dadosFiltrados.filter(item => item.status === 'realizado').length,
            data_inicio: dataInicio.format('YYYY-MM-DD'),
            data_fim: dataFim.format('YYYY-MM-DD'),
            periodo_horario: {
              primeiro_agendamento: '08:00',
              ultimo_agendamento: '16:00'
            }
          };
          
          setDados(dadosFiltrados);
          break;
        }

        case 'exames-por-tipo': {
          const procedimentos = ['Ultrassonografia', 'Raio-X', 'Ressonância Magnética', 'Tomografia', 'Ecocardiograma', 'Eletrocardiograma'];
          for (let i = 0; i < 15; i++) {
            const situacoes = ['Realizado', 'Aguardando', 'confirmado', 'cancelado'];
            dadosMock.push({
              data: dayjs().subtract(i, 'day').format('DD/MM/YYYY'),
              horario: `${8 + (i % 10)}:${(i % 6) * 10}`,
              paciente: `Paciente ${i + 1}`,
              telefone: `(47) 9999-${1000 + i}`,
              exame: procedimentos[i % procedimentos.length],
              medico: `Dr. Médico ${(i % 5) + 1}`,
              convenio: i % 3 === 0 ? 'UNIMED' : i % 3 === 1 ? 'SUS' : 'Particular',
              filial: 'Filial Centro',
              situacao: situacoes[i % 4],
              valor_recebido: mostrarValores ? (150 + i * 10) : null,
              valor_pago: mostrarValores ? (100 + i * 5) : null,
              lucro: mostrarValores ? (50 + i * 5) : null
            });
          }
          
          // Filtrar por tipo de agendamento se especificado
          let dadosExamesFiltrados = dadosMock;
          if (tipoAgendamento) {
            dadosExamesFiltrados = dadosMock.filter(item => item.tipo_procedimento === tipoAgendamento);
          }
          
          estatisticasMock = {
            total_exames: dadosExamesFiltrados.length,
            realizados: dadosExamesFiltrados.filter(item => item.situacao === 'Realizado').length,
            agendados: dadosExamesFiltrados.filter(item => item.situacao === 'Aguardando').length,
            confirmados: dadosExamesFiltrados.filter(item => item.situacao === 'confirmado').length,
            cancelados: dadosExamesFiltrados.filter(item => item.situacao === 'cancelado').length,
            total_valor_recebido: mostrarValores ? dadosExamesFiltrados.reduce((acc, item) => acc + (item.valor_recebido || 0), 0) : null,
            total_valor_pago: mostrarValores ? dadosExamesFiltrados.reduce((acc, item) => acc + (item.valor_pago || 0), 0) : null,
            total_lucro: mostrarValores ? dadosExamesFiltrados.reduce((acc, item) => acc + (item.lucro || 0), 0) : null
          };
          
          setDados(dadosExamesFiltrados);
          break;
        }

        case 'consultas-por-especialidade': {
          const especialidades = ['Cardiologia', 'Dermatologia', 'Pediatria', 'Ortopedia', 'Ginecologia', 'Neurologia'];
          for (let i = 0; i < 12; i++) {
            const situacoes = ['Realizado', 'Aguardando', 'confirmado', 'cancelado'];
            dadosMock.push({
              data: dayjs().subtract(i, 'day').format('DD/MM/YYYY'),
              horario: `${8 + (i % 10)}:${(i % 6) * 10}`,
              paciente: `Paciente ${i + 1}`,
              telefone: `(47) 9999-${1000 + i}`,
              especialidade: especialidades[i % especialidades.length],
              medico: `Dr. Especialista ${(i % 4) + 1}`,
              convenio: i % 3 === 0 ? 'UNIMED' : i % 3 === 1 ? 'SUS' : 'Particular',
              filial: 'Filial Centro',
              situacao: situacoes[i % 4],
              valor_recebido: mostrarValores ? (200 + i * 15) : null,
              valor_pago: mostrarValores ? (120 + i * 8) : null,
              lucro: mostrarValores ? (80 + i * 7) : null
            });
          }
          
          // Filtrar por tipo de agendamento se especificado
          let dadosConsultasFiltrados = dadosMock;
          if (tipoAgendamento) {
            dadosConsultasFiltrados = dadosMock.filter(item => item.tipo_procedimento === tipoAgendamento);
          }
          
          estatisticasMock = {
            total_consultas: dadosConsultasFiltrados.length,
            realizadas: dadosConsultasFiltrados.filter(item => item.situacao === 'Realizado').length,
            agendadas: dadosConsultasFiltrados.filter(item => item.situacao === 'Aguardando').length,
            confirmadas: dadosConsultasFiltrados.filter(item => item.situacao === 'confirmado').length,
            canceladas: dadosConsultasFiltrados.filter(item => item.situacao === 'cancelado').length,
            total_valor_recebido: mostrarValores ? dadosConsultasFiltrados.reduce((acc, item) => acc + (item.valor_recebido || 0), 0) : null,
            total_valor_pago: mostrarValores ? dadosConsultasFiltrados.reduce((acc, item) => acc + (item.valor_pago || 0), 0) : null,
            total_lucro: mostrarValores ? dadosConsultasFiltrados.reduce((acc, item) => acc + (item.lucro || 0), 0) : null
          };
          
          setDados(dadosConsultasFiltrados);
          break;
        }

        case 'consolidado': {
          for (let i = 0; i < 20; i++) {
            const situacoes = ['Realizado', 'Aguardando', 'confirmado', 'cancelado'];
            dadosMock.push({
              data: dayjs().subtract(i, 'day').format('DD/MM/YYYY'),
              horario: `${8 + (i % 10)}:${(i % 6) * 10}`,
              paciente: `Paciente ${i + 1}`,
              telefone: `(47) 9999-${1000 + i}`,
              tipo_procedimento: i % 2 === 0 ? 'consulta' : 'exame',
              procedimento: i % 2 === 0 ? 'Cardiologia' : 'Ultrassonografia',
              medico: `Dr. Médico ${i + 1}`,
              convenio: i % 3 === 0 ? 'UNIMED' : i % 3 === 1 ? 'SUS' : 'Particular',
              filial: 'Filial Centro',
              situacao: situacoes[i % 4],
              valor_recebido: mostrarValores ? (180 + i * 12) : null,
              valor_pago: mostrarValores ? (110 + i * 6) : null,
              lucro: mostrarValores ? (70 + i * 6) : null
            });
          }
          
          // Filtrar por tipo de agendamento se especificado
          let dadosConsolidadosFiltrados = dadosMock;
          if (tipoAgendamento) {
            dadosConsolidadosFiltrados = dadosMock.filter(item => item.tipo_procedimento === tipoAgendamento);
          }
          
          estatisticasMock = {
            total_agendamentos: dadosConsolidadosFiltrados.length,
            total_consultas: dadosConsolidadosFiltrados.filter(item => item.tipo_procedimento === 'consulta').length,
            total_exames: dadosConsolidadosFiltrados.filter(item => item.tipo_procedimento === 'exame').length,
            realizados: dadosConsolidadosFiltrados.filter(item => item.situacao === 'Realizado').length,
            agendados: dadosConsolidadosFiltrados.filter(item => item.situacao === 'Aguardando').length,
            confirmados: dadosConsolidadosFiltrados.filter(item => item.situacao === 'confirmado').length,
            cancelados: dadosConsolidadosFiltrados.filter(item => item.situacao === 'cancelado').length,
            total_valor_recebido: mostrarValores ? dadosConsolidadosFiltrados.reduce((acc, item) => acc + (item.valor_recebido || 0), 0) : null,
            total_valor_pago: mostrarValores ? dadosConsolidadosFiltrados.reduce((acc, item) => acc + (item.valor_pago || 0), 0) : null,
            total_lucro: mostrarValores ? dadosConsolidadosFiltrados.reduce((acc, item) => acc + (item.lucro || 0), 0) : null
          };
          
          setDados(dadosConsolidadosFiltrados);
          break;
        }
        default:
          break;
      }

      setEstatisticas(estatisticasMock);
    };
    
    try {
      const params = {
        data_inicio: dataInicio.format('YYYY-MM-DD'),
        data_fim: dataFim.format('YYYY-MM-DD'),
        mostrar_valores: mostrarValores
      };

      // Adicionar filtros específicos
      if (procedimentoId) params.procedimento_id = procedimentoId;
      if (especialidadeId) params.especialidade_id = especialidadeId;
      if (tipoAgendamento) params.tipo_agendamento = tipoAgendamento;
      if (convenioId) params.convenio_id = convenioId;

      let response;
      try {
        switch (tipoRelatorio) {
          case 'agendamentos-dia':
            response = await relatoriosService.getRelatorioAgendamentosDia(params);
            break;
          case 'exames-por-tipo':
            response = await relatoriosService.getExamesPorTipo(params);
            break;
          case 'consultas-por-especialidade':
            response = await relatoriosService.getConsultasPorEspecialidade(params);
            break;
          case 'consolidado':
            response = await relatoriosService.getRelatorioConsolidado(params);
            break;
          default:
            throw new Error('Tipo de relatório não encontrado');
        }

        if (response && response.success) {
          setDados(response.data);
          setEstatisticas(response.estatisticas);
        } else {
          throw new Error(response?.message || 'API não disponível');
        }
      } catch (apiError) {
        console.log('API não disponível, usando dados mock:', apiError.message);
        // Fallback para dados mock
        gerarDadosMock();
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setErro('Usando dados de demonstração - API não disponível');
      // Fallback para dados mock
      gerarDadosMock();
    } finally {
      setLoading(false);
    }
  }, [tipoRelatorio, dataInicio, dataFim, mostrarValores, procedimentoId, especialidadeId, tipoAgendamento, convenioId]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const gerarPDF = async () => {
    try {
      const pdfGenerator = new PDFGenerator();
      
      switch (tipoRelatorio) {
        case 'agendamentos-dia':
          await pdfGenerator.gerarRelatorioAgendamentosDia(dados, {
            data_inicio: dataInicio.format('DD/MM/YYYY'),
            data_fim: dataFim.format('DD/MM/YYYY'),
            filtros: { especialidadeId, tipoAgendamento }
          }, mostrarValores);
          break;
        case 'exames-por-tipo':
          await pdfGenerator.gerarRelatorioExames(dados, estatisticas, {
            titulo: 'Relatório de Exames por Tipo',
            periodo: `${dataInicio.format('DD/MM/YYYY')} a ${dataFim.format('DD/MM/YYYY')}`,
            mostrarValores,
            filtros: { procedimentoId, tipoAgendamento, convenioId }
          });
          break;
        case 'consultas-por-especialidade':
          await pdfGenerator.gerarRelatorioConsultas(dados, estatisticas, {
            titulo: 'Relatório de Consultas por Especialidade',
            periodo: `${dataInicio.format('DD/MM/YYYY')} a ${dataFim.format('DD/MM/YYYY')}`,
            mostrarValores,
            filtros: { especialidadeId, tipoAgendamento, convenioId }
          });
          break;
        case 'consolidado':
          await pdfGenerator.gerarRelatorioConsolidado(dados, estatisticas, {
            titulo: 'Relatório Consolidado',
            periodo: `${dataInicio.format('DD/MM/YYYY')} a ${dataFim.format('DD/MM/YYYY')}`,
            mostrarValores,
            filtros: { tipoAgendamento, convenioId }
          });
          break;
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      setErro('Erro ao gerar PDF: ' + error.message);
    }
  };

  const aplicarFiltros = () => {
    carregarDados();
  };

  const limparFiltros = () => {
    setProcedimentoId('');
    setEspecialidadeId('');
    setTipoAgendamento('');
    setConvenioId('');
    setMostrarValores(false);
  };

  const renderFiltrosEspecificos = () => {
    return (
      <Grid container spacing={2} className="relatorios-filtros" sx={{ mb: 2 }}>
        {/* Filtro por Procedimento/Exame */}
        {tipoRelatorio === 'exames-por-tipo' && (
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo de Exame</InputLabel>
              <Select
                value={procedimentoId}
                onChange={(e) => setProcedimentoId(e.target.value)}
                label="Tipo de Exame"
              >
                <MenuItem value="">Todos os Exames</MenuItem>
                {procedimentos.map((proc) => (
                  <MenuItem key={proc.id} value={proc.id}>
                    {proc.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {/* Filtro por Especialidade */}
        {tipoRelatorio === 'consultas-por-especialidade' && (
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Especialidade</InputLabel>
              <Select
                value={especialidadeId}
                onChange={(e) => setEspecialidadeId(e.target.value)}
                label="Especialidade"
              >
                <MenuItem value="">Todas as Especialidades</MenuItem>
                {especialidades.map((esp) => (
                  <MenuItem key={esp.id} value={esp.id}>
                    {esp.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {/* Filtro por Tipo de Agendamento (apenas para relatório de Agendamentos) */}
        {tipoRelatorio === 'agendamentos-dia' && (
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo de Agendamento</InputLabel>
              <Select
                value={tipoAgendamento}
                onChange={(e) => setTipoAgendamento(e.target.value)}
                label="Tipo de Agendamento"
              >
                {tiposAgendamento.map((tipo) => (
                  <MenuItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {/* Filtro por Situação (para outros relatórios) */}
        {tipoRelatorio !== 'agendamentos-dia' && (
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Situação</InputLabel>
              <Select
                value={tipoAgendamento}
                onChange={(e) => setTipoAgendamento(e.target.value)}
                label="Situação"
              >
                {situacoes.map((sit) => (
                  <MenuItem key={sit.value} value={sit.value}>
                    {sit.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {/* Filtro por Convênio */}
        <Grid size={{ xs: 12, md: 3 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Convênio</InputLabel>
            <Select
              value={convenioId}
              onChange={(e) => setConvenioId(e.target.value)}
              label="Convênio"
            >
              <MenuItem value="">Todos os Convênios</MenuItem>
              {convenios.map((conv) => (
                <MenuItem key={conv.id} value={conv.id}>
                  {conv.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Botões de ação */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="contained" 
              onClick={aplicarFiltros}
              size="small"
            >
              Aplicar Filtros
            </Button>
            <Button 
              variant="outlined" 
              onClick={limparFiltros}
              size="small"
            >
              Limpar
            </Button>
          </Box>
        </Grid>
      </Grid>
    );
  };

  const renderEstatisticas = () => {
    const cards = [];

    // Cards baseados no tipo de relatório
    if (tipoRelatorio === 'exames-por-tipo') {
      cards.push(
        { label: 'Total de Exames', valor: estatisticas.total_exames || 0, icone: <LocalHospital color="primary" /> },
        { label: 'Realizados', valor: estatisticas.realizados || 0, icone: <Assessment color="success" /> },
        { label: 'Aguardando', valor: estatisticas.agendados || 0, icone: <TrendingUp color="info" /> },
        { label: 'Cancelados', valor: estatisticas.cancelados || 0, icone: <Group color="error" /> }
      );
    } else if (tipoRelatorio === 'consultas-por-especialidade') {
      cards.push(
        { label: 'Total de Consultas', valor: estatisticas.total_consultas || 0, icone: <LocalHospital color="primary" /> },
        { label: 'Realizadas', valor: estatisticas.realizadas || 0, icone: <Assessment color="success" /> },
        { label: 'Aguardando', valor: estatisticas.agendadas || 0, icone: <TrendingUp color="info" /> },
        { label: 'Canceladas', valor: estatisticas.canceladas || 0, icone: <Group color="error" /> }
      );
    } else if (tipoRelatorio === 'consolidado') {
      cards.push(
        { label: 'Total Agendamentos', valor: estatisticas.total_agendamentos || 0, icone: <LocalHospital color="primary" /> },
        { label: 'Consultas', valor: estatisticas.total_consultas || 0, icone: <Assessment color="info" /> },
        { label: 'Exames', valor: estatisticas.total_exames || 0, icone: <TrendingUp color="info" /> },
        { label: 'Realizados', valor: estatisticas.realizados || 0, icone: <Group color="success" /> }
      );
    }

    // Adicionar cards financeiros se mostrarValores estiver ativo
    if (mostrarValores) {
      cards.push(
        { 
          label: 'Valor Total Recebido', 
          valor: `R$ ${(estatisticas.total_valor_recebido || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 
          icone: <TrendingUp color="success" /> 
        },
        { 
          label: 'Valor Total Pago', 
          valor: `R$ ${(estatisticas.total_valor_pago || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 
          icone: <Group color="warning" /> 
        },
        { 
          label: 'Lucro Total', 
          valor: `R$ ${(estatisticas.total_lucro || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 
          icone: <Assessment color="primary" /> 
        }
      );
    }

    return (
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {cards.map((card, index) => (
          <Grid size={{ xs: 12, sm: 6, md: mostrarValores ? 2 : 3 }} key={index}>
            <Card className="estatistica-card">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  {card.icone}
                  <Typography variant="h6" component="div" sx={{ ml: 1, fontSize: '0.9rem' }}>
                    {card.label}
                  </Typography>
                </Box>
                <Typography variant="h4" color="primary" sx={{ fontSize: '1.5rem' }}>
                  {card.valor}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const getColumns = () => {
    const baseColumns = ['Data', 'Horário', 'Paciente', 'Telefone'];
    
    switch (tipoRelatorio) {
      case 'agendamentos-dia':
        baseColumns.push('Médico', 'Tipo/Especialidade', 'Status');
        break;
      case 'exames-por-tipo':
        baseColumns.push('Exame', 'Médico', 'Convênio', 'Situação');
        break;
      case 'consultas-por-especialidade':
        baseColumns.push('Especialidade', 'Médico', 'Convênio', 'Situação');
        break;
      case 'consolidado':
        baseColumns.push('Tipo', 'Procedimento', 'Médico', 'Convênio', 'Situação');
        break;
    }

    if (mostrarValores) {
      if (tipoRelatorio === 'agendamentos-dia') {
        baseColumns.push('Valor');
      } else {
        baseColumns.push('Valor Recebido', 'Valor Pago', 'Lucro');
      }
    }

    return baseColumns;
  };

  const renderCellValue = (item, column) => {
    switch (column) {
      case 'Data': 
        if (tipoRelatorio === 'agendamentos-dia') {
          return item.data || (item.data_agendamento ? new Date(item.data_agendamento).toLocaleDateString('pt-BR') : 'N/A');
        }
        return item.data;
      case 'Horário': 
        return tipoRelatorio === 'agendamentos-dia' 
          ? item.hora_agendamento 
          : item.horario;
      case 'Paciente': {
        const nomePaciente = tipoRelatorio === 'agendamentos-dia' 
          ? item.nome_paciente 
          : item.paciente;
        return (
          <Tooltip title={nomePaciente} placement="top">
            <Box 
              className="cell-content"
              sx={{ 
                fontSize: '0.875rem',
                cursor: 'help'
              }}
            >
              {nomePaciente}
            </Box>
          </Tooltip>
        );
      }
      case 'Telefone': 
        return tipoRelatorio === 'agendamentos-dia' 
          ? item.telefone_paciente 
          : item.telefone;
      case 'Médico': {
        const nomeMedico = tipoRelatorio === 'agendamentos-dia' 
          ? item.medico_nome 
          : item.medico;
        return (
          <Tooltip title={nomeMedico} placement="top">
            <Box 
              className="cell-content"
              sx={{ 
                fontSize: '0.875rem',
                cursor: 'help'
              }}
            >
              {nomeMedico}
            </Box>
          </Tooltip>
        );
      }
      case 'Tipo/Especialidade':
        if (tipoRelatorio === 'agendamentos-dia') {
          const tipoTexto = item.tipo_procedimento === 'consulta' 
            ? `Consulta - ${item.especialidade_nome || 'N/A'}`
            : `Exame - ${item.procedimento_nome || 'N/A'}`;
          
          return (
            <Tooltip title={tipoTexto} placement="top">
              <Box 
                className="cell-content"
                sx={{ 
                  fontSize: '0.875rem',
                  cursor: 'help'
                }}
              >
                {tipoTexto}
              </Box>
            </Tooltip>
          );
        }
        return '-';
      case 'Status':
        if (tipoRelatorio === 'agendamentos-dia') {
          const statusMap = {
            'agendado': 'Agendado',
            'confirmado': 'Confirmado',
            'realizado': 'Realizado',
            'cancelado': 'Cancelado',
            'Aguardando': 'Aguardando'
          };
          const statusText = statusMap[item.status?.toLowerCase()] || statusMap[item.status] || item.status || 'N/A';
          return (
            <Chip 
              label={statusText} 
              color={
                statusText === 'Realizado' ? 'success' : 
                statusText === 'Confirmado' ? 'info' : 
                statusText === 'Aguardando' ? 'warning' :
                statusText === 'Agendado' ? 'default' : 'error'
              }
              size="small"
            />
          );
        }
        return '-';
      case 'Exame': return item.exame;
      case 'Especialidade': return item.especialidade;
      case 'Tipo': return item.tipo_procedimento === 'consulta' ? 'Consulta' : 'Exame';
      case 'Procedimento': return item.procedimento;
      case 'Convênio': return item.convenio;
      case 'Situação': {
        // Mapear valores para padronizar a exibição
        const situacaoMap = {
          'agendado': 'Agendado',
          'confirmado': 'Confirmado', 
          'realizado': 'Realizado',
          'cancelado': 'Cancelado',
          'Aguardando': 'Aguardando'
        };
        const situacaoText = situacaoMap[item.situacao?.toLowerCase()] || situacaoMap[item.situacao] || item.situacao || 'N/A';
        return (
          <Chip 
            label={situacaoText} 
            color={
              situacaoText === 'Realizado' ? 'success' : 
              situacaoText === 'Confirmado' ? 'info' : 
              situacaoText === 'Aguardando' ? 'warning' :
              situacaoText === 'Agendado' ? 'default' : 'error'
            }
            size="small"
          />
        );
      }
      case 'Valor':
        if (tipoRelatorio === 'agendamentos-dia') {
          return item.valor_consulta ? `R$ ${item.valor_consulta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-';
        }
        return '-';
      case 'Valor Recebido': 
        return item.valor_recebido ? `R$ ${item.valor_recebido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-';
      case 'Valor Pago': 
        return item.valor_pago ? `R$ ${item.valor_pago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-';
      case 'Lucro': 
        return item.lucro ? `R$ ${item.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-';
      default: return '-';
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Box className="relatorios-container">
        <Paper className="relatorios-paper">
          <Typography variant="h5" className="relatorios-title">
            <Assessment className="relatorios-icon"/>
            Relatórios Gerenciais
          </Typography>

          {/* Filtros Principais */}
          <Grid container spacing={2} className="relatorios-filtros">
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Tipo de Relatório</InputLabel>
                <Select
                  value={tipoRelatorio}
                  onChange={(e) => setTipoRelatorio(e.target.value)}
                  label="Tipo de Relatório"
                >
                  {tiposRelatorio.map((tipo) => (
                    <MenuItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <DatePicker
                label="Data Início"
                value={dataInicio}
                onChange={(newValue) => setDataInicio(newValue)}
                format="DD/MM/YYYY"
                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <DatePicker
                label="Data Fim"
                value={dataFim}
                onChange={(newValue) => setDataFim(newValue)}
                format="DD/MM/YYYY"
                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={mostrarValores}
                    onChange={(e) => setMostrarValores(e.target.checked)}
                    color="primary"
                  />
                }
                label="Mostrar Valores Financeiros"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <Button
                variant="contained"
                startIcon={<PictureAsPdf />}
                onClick={gerarPDF}
                fullWidth
                disabled={loading || dados.length === 0}
                size="small"
              >
                Gerar PDF
              </Button>
            </Grid>
          </Grid>

          {/* Filtros Específicos */}
          {renderFiltrosEspecificos()}

          {/* Mensagem de Erro */}
          {erro && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {erro}
            </Alert>
          )}

          {/* Loading */}
          {loading && (
            <Box display="flex" justifyContent="center" sx={{ mb: 3 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Estatísticas */}
          {!loading && dados.length > 0 && renderEstatisticas()}

          {/* Tabela de Dados */}
          {!loading && dados.length > 0 && (
            <TableContainer component={Paper} className="relatorios-table">
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {getColumns().map((column) => (
                      <TableCell key={column} className="table-header">
                        {column}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dados.map((item, index) => (
                    <TableRow key={index}>
                      {getColumns().map((column) => (
                        <TableCell key={column}>
                          {renderCellValue(item, column)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Mensagem quando não há dados */}
          {!loading && dados.length === 0 && (
            <Box textAlign="center" sx={{ py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                Nenhum dado encontrado para os filtros selecionados
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default Relatorios;