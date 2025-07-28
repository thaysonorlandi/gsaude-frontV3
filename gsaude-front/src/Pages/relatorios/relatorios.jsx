import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
  Box,
  Divider,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Stack,
  Chip
} from '@mui/material';
import {
  Description as FileTextIcon,
  Download as DownloadIcon,
  CalendarToday as CalendarIcon,
  Person as UserIcon,
  AttachMoney as DollarIcon,
  BarChart as BarChartIcon,
  Group as TeamIcon,
  LocalHospital as MedicineBoxIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import relatoriosService from '../../services/relatoriosService';
import { PDFGenerator } from '../../utils/pdfGenerator';
import './relatorios.css';

export default function Relatorios() {
  const [loading, setLoading] = useState(false);
  const [tipoRelatorio, setTipoRelatorio] = useState('agendamentos');
  const [filtros, setFiltros] = useState({
    dataInicio: dayjs().subtract(30, 'days').format('YYYY-MM-DD'),
    dataFim: dayjs().format('YYYY-MM-DD'),
    medico_id: null,
    especialidade_id: null,
    tipo_procedimento: null,
    filial_id: null
  });
  const [dados, setDados] = useState([]);
  const [estatisticas, setEstatisticas] = useState({});
  const [medicos, setMedicos] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  // Carregar dados iniciais
  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  const carregarDadosIniciais = async () => {
    try {
      // Aqui você pode carregar médicos, especialidades e filiais
      // Por enquanto, vou simular os dados
      setMedicos([
        { id: 1, nome: 'Dr. João Silva' },
        { id: 2, nome: 'Dra. Maria Santos' },
        { id: 3, nome: 'Dr. Pedro Oliveira' }
      ]);
      
      setEspecialidades([
        { id: 1, nome: 'Cardiologia' },
        { id: 2, nome: 'Neurologia' },
        { id: 3, nome: 'Pediatria' }
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
      setNotification({ open: true, message: 'Erro ao carregar dados iniciais', severity: 'error' });
    }
  };

  const buscarDados = async () => {
    setLoading(true);
    try {
      let resultado = [];
      
      switch (tipoRelatorio) {
        case 'agendamentos':
          resultado = await relatoriosService.getRelatorioAgendamentos(filtros);
          break;
        case 'financeiro':
          resultado = await relatoriosService.getRelatorioFinanceiro(filtros);
          break;
        case 'medicos':
          resultado = await relatoriosService.getRelatorioMedicos(filtros);
          break;
        case 'especialidades':
          resultado = await relatoriosService.getRelatorioEspecialidades(filtros);
          break;
        case 'consultas-dia':
          resultado = await relatoriosService.getRelatorioConsultasPorDia(filtros);
          break;
        case 'exames-dia':
          resultado = await relatoriosService.getRelatorioExamesPorDia(filtros);
          break;
        case 'consolidado':
          resultado = await relatoriosService.getRelatorioConsolidado(filtros);
          break;
        default:
          resultado = [];
      }
      
      setDados(resultado);
      calcularEstatisticas(resultado);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setNotification({ open: true, message: 'Erro ao carregar relatório', severity: 'error' });
      // Simular dados para demonstração
      simularDados();
    } finally {
      setLoading(false);
    }
  };

  const simularDados = () => {
    // Dados simulados para demonstração
    const dadosSimulados = [
      {
        id: 1,
        data_agendamento: '2025-01-15',
        hora_agendamento: '09:00',
        nome_paciente: 'João Silva',
        medico: { nome: 'Dr. Carlos Mendes' },
        especialidade: { nome: 'Cardiologia' },
        tipo_procedimento: 'consulta',
        status: 'Confirmado',
        valor: 150.00
      },
      {
        id: 2,
        data_agendamento: '2025-01-15',
        hora_agendamento: '10:00',
        nome_paciente: 'Maria Santos',
        medico: { nome: 'Dra. Ana Costa' },
        especialidade: { nome: 'Neurologia' },
        tipo_procedimento: 'exame',
        status: 'Realizado',
        valor: 200.00
      },
      {
        id: 3,
        data_agendamento: '2025-01-16',
        hora_agendamento: '14:00',
        nome_paciente: 'Pedro Oliveira',
        medico: { nome: 'Dr. Roberto Lima' },
        especialidade: { nome: 'Pediatria' },
        tipo_procedimento: 'consulta',
        status: 'Agendado',
        valor: 120.00
      }
    ];
    
    setDados(dadosSimulados);
    calcularEstatisticas(dadosSimulados);
  };

  const calcularEstatisticas = (dados) => {
    const stats = {
      total: dados.length,
      consultas: dados.filter(item => item.tipo_procedimento === 'consulta').length,
      exames: dados.filter(item => item.tipo_procedimento === 'exame').length,
      receitaTotal: dados.reduce((sum, item) => sum + (item.valor || 0), 0),
      medicosUnicos: new Set(dados.map(item => item.medico?.nome)).size,
      especialidadesUnicas: new Set(dados.map(item => item.especialidade?.nome)).size
    };
    
    setEstatisticas(stats);
  };

  const gerarPDF = () => {
    try {
      const pdfGen = new PDFGenerator();
      
      switch (tipoRelatorio) {
        case 'agendamentos':
          pdfGen.gerarRelatorioAgendamentos(dados, filtros);
          break;
        case 'financeiro':
          pdfGen.gerarRelatorioFinanceiro(dados, filtros);
          break;
        case 'medicos':
          pdfGen.gerarRelatorioPorMedicos(dados, filtros);
          break;
        case 'especialidades':
          pdfGen.gerarRelatorioPorEspecialidades(dados, filtros);
          break;
        case 'consolidado':
          pdfGen.gerarRelatorioConsolidado({ agendamentos: dados, financeiro: dados }, filtros);
          break;
        default:
          pdfGen.gerarRelatorioAgendamentos(dados, filtros);
      }
      
      const filename = `relatorio_${tipoRelatorio}_${dayjs().format('YYYY-MM-DD_HH-mm')}.pdf`;
      pdfGen.save(filename);
      
      setNotification({ open: true, message: 'PDF gerado com sucesso!', severity: 'success' });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      setNotification({ open: true, message: 'Erro ao gerar PDF', severity: 'error' });
    }
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const getColumns = () => {
    switch (tipoRelatorio) {
      case 'agendamentos':
        return [
          {
            title: 'Data',
            dataIndex: 'data_agendamento',
            key: 'data',
            render: (date) => dayjs(date).format('DD/MM/YYYY')
          },
          {
            title: 'Hora',
            dataIndex: 'hora_agendamento',
            key: 'hora'
          },
          {
            title: 'Paciente',
            dataIndex: 'nome_paciente',
            key: 'paciente'
          },
          {
            title: 'Médico',
            dataIndex: 'medico.nome',
            key: 'medico'
          },
          {
            title: 'Especialidade',
            dataIndex: 'especialidade.nome',
            key: 'especialidade'
          },
          {
            title: 'Tipo',
            dataIndex: 'tipo_procedimento',
            key: 'tipo',
            render: (tipo) => tipo === 'consulta' ? 'Consulta' : 'Exame'
          },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status'
          }
        ];
      
      case 'financeiro':
        return [
          {
            title: 'Data',
            dataIndex: 'data_agendamento',
            key: 'data',
            render: (date) => dayjs(date).format('DD/MM/YYYY')
          },
          {
            title: 'Paciente',
            dataIndex: 'nome_paciente',
            key: 'paciente'
          },
          {
            title: 'Tipo',
            dataIndex: 'tipo_procedimento',
            key: 'tipo',
            render: (tipo) => tipo === 'consulta' ? 'Consulta' : 'Exame'
          },
          {
            title: 'Médico',
            dataIndex: 'medico.nome',
            key: 'medico'
          },
          {
            title: 'Valor',
            dataIndex: 'valor',
            key: 'valor',
            render: (valor) => `R$ ${(valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
          }
        ];
      
      default:
        return [];
    }
  };

  const tiposRelatorio = [
    { value: 'agendamentos', label: 'Relatório de Agendamentos', icon: <CalendarIcon /> },
    { value: 'financeiro', label: 'Relatório Financeiro', icon: <DollarIcon /> },
    { value: 'medicos', label: 'Relatório por Médicos', icon: <UserIcon /> },
    { value: 'especialidades', label: 'Relatório por Especialidades', icon: <MedicineBoxIcon /> },
    { value: 'consultas-dia', label: 'Consultas por Dia', icon: <TeamIcon /> },
    { value: 'exames-dia', label: 'Exames por Dia', icon: <BarChartIcon /> },
    { value: 'consolidado', label: 'Relatório Consolidado', icon: <FileTextIcon /> }
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className="relatorios-container" sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <Card>
          <CardContent>
            <Box textAlign="center" mb={2}>
              <Typography variant="h4" component="h1" color="primary" gutterBottom>
                <FileTextIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Relatórios Gerenciais
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gere relatórios detalhados do sistema em PDF
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Filtros */}
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Filtros
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Tipo de Relatório</InputLabel>
                      <Select
                        value={tipoRelatorio}
                        onChange={(e) => setTipoRelatorio(e.target.value)}
                        label="Tipo de Relatório"
                      >
                        {tiposRelatorio.map(tipo => (
                          <MenuItem key={tipo.value} value={tipo.value}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {tipo.icon} {tipo.label}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <DatePicker
                      label="Data Início"
                      value={dayjs(filtros.dataInicio)}
                      onChange={(date) => handleFiltroChange('dataInicio', date.format('YYYY-MM-DD'))}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <DatePicker
                      label="Data Fim"
                      value={dayjs(filtros.dataFim)}
                      onChange={(date) => handleFiltroChange('dataFim', date.format('YYYY-MM-DD'))}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Médico</InputLabel>
                      <Select
                        value={filtros.medico_id || ''}
                        onChange={(e) => handleFiltroChange('medico_id', e.target.value)}
                        label="Médico"
                      >
                        <MenuItem value="">Todos os médicos</MenuItem>
                        {medicos.map(medico => (
                          <MenuItem key={medico.id} value={medico.id}>
                            {medico.nome}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Especialidade</InputLabel>
                      <Select
                        value={filtros.especialidade_id || ''}
                        onChange={(e) => handleFiltroChange('especialidade_id', e.target.value)}
                        label="Especialidade"
                      >
                        <MenuItem value="">Todas as especialidades</MenuItem>
                        {especialidades.map(esp => (
                          <MenuItem key={esp.id} value={esp.id}>
                            {esp.nome}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Tipo de Procedimento</InputLabel>
                      <Select
                        value={filtros.tipo_procedimento || ''}
                        onChange={(e) => handleFiltroChange('tipo_procedimento', e.target.value)}
                        label="Tipo de Procedimento"
                      >
                        <MenuItem value="">Todos os tipos</MenuItem>
                        <MenuItem value="consulta">Consulta</MenuItem>
                        <MenuItem value="exame">Exame</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Stack direction="row" spacing={2} justifyContent="center">
                    <Button 
                      variant="contained"
                      onClick={buscarDados}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <BarChartIcon />}
                    >
                      Gerar Relatório
                    </Button>
                    
                    <Button 
                      variant="outlined"
                      onClick={gerarPDF}
                      disabled={dados.length === 0}
                      startIcon={<DownloadIcon />}
                    >
                      Baixar PDF
                    </Button>
                  </Stack>
                </Box>
              </CardContent>
            </Card>

            {/* Estatísticas */}
            {Object.keys(estatisticas).length > 0 && (
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Estatísticas
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={2}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6" color="primary">
                          {estatisticas.total}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} md={2}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6" color="primary">
                          {estatisticas.consultas}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Consultas
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} md={2}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6" color="primary">
                          {estatisticas.exames}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Exames
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} md={2}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6" color="primary">
                          R$ {estatisticas.receitaTotal?.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Receita Total
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} md={2}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6" color="primary">
                          {estatisticas.medicosUnicos}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Médicos
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6} md={2}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6" color="primary">
                          {estatisticas.especialidadesUnicas}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Especialidades
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}

            {/* Tabela de dados */}
            {dados.length > 0 && (
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Dados do Relatório
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          {getColumns().map((column) => (
                            <TableCell key={column.key}>{column.title}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dados.map((row) => (
                          <TableRow key={row.id}>
                            {getColumns().map((column) => (
                              <TableCell key={column.key}>
                                {column.render 
                                  ? column.render(column.dataIndex.includes('.') 
                                      ? column.dataIndex.split('.').reduce((obj, key) => obj?.[key], row)
                                      : row[column.dataIndex])
                                  : (column.dataIndex.includes('.') 
                                      ? column.dataIndex.split('.').reduce((obj, key) => obj?.[key], row)
                                      : row[column.dataIndex])
                                }
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            )}

            {/* Loading */}
            {loading && (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <CircularProgress size={60} />
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Carregando relatório...
                </Typography>
              </Box>
            )}

            {/* Mensagem quando não há dados */}
            {!loading && dados.length === 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Nenhum dado encontrado. Clique em 'Gerar Relatório' para carregar os dados ou ajuste os filtros.
              </Alert>
            )}

            {/* Notificação */}
            {notification.open && (
              <Alert 
                severity={notification.severity} 
                onClose={handleCloseNotification}
                sx={{ 
                  position: 'fixed', 
                  top: 20, 
                  right: 20, 
                  zIndex: 9999,
                  minWidth: 300
                }}
              >
                {notification.message}
              </Alert>
            )}
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
}
