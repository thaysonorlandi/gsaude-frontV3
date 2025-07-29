import React, { useState, useEffect } from 'react';
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
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PictureAsPdf, Assessment, TrendingUp, Group, LocalHospital } from '@mui/icons-material';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
// import relatoriosService from '../../services/relatoriosService'; // Comentado enquanto usamos dados mock
import { PDFGenerator } from '../../utils/pdfGenerator';
import './relatorios.css';

dayjs.locale('pt-br');

const Relatorios = () => {
  const [tipoRelatorio, setTipoRelatorio] = useState('agendamentos');
  const [dataInicio, setDataInicio] = useState(dayjs().startOf('month'));
  const [dataFim, setDataFim] = useState(dayjs().endOf('month'));
  const [dados, setDados] = useState([]);
  const [estatisticas, setEstatisticas] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'info' });

  const showAlert = (message, severity = 'info') => {
    setAlert({ show: true, message, severity });
    setTimeout(() => setAlert({ show: false, message: '', severity: 'info' }), 5000);
  };

  // Função para gerar dados mock enquanto a API não está disponível
  const gerarDadosMock = (tipo) => {
    const dataAtual = dayjs();
    
    switch (tipo) {
      case 'agendamentos':
        return {
          data: [
            {
              data: dataAtual.subtract(1, 'day').format('YYYY-MM-DD'),
              horario: '09:00',
              paciente: 'João Silva',
              medico: 'Dr. Carlos Pereira',
              especialidade: 'Cardiologia',
              status: 'confirmado'
            },
            {
              data: dataAtual.subtract(2, 'day').format('YYYY-MM-DD'),
              horario: '14:30',
              paciente: 'Maria Santos',
              medico: 'Dra. Ana Costa',
              especialidade: 'Dermatologia',
              status: 'realizada'
            },
            {
              data: dataAtual.subtract(3, 'day').format('YYYY-MM-DD'),
              horario: '10:15',
              paciente: 'Pedro Oliveira',
              medico: 'Dr. Roberto Lima',
              especialidade: 'Ortopedia',
              status: 'pendente'
            }
          ],
          estatisticas: {
            total: 15,
            confirmados: 8,
            pendentes: 4,
            cancelados: 3
          }
        };
      
      case 'financeiro':
        return {
          data: [
            {
              data: dataAtual.subtract(1, 'day').format('YYYY-MM-DD'),
              descricao: 'Consulta Cardiologia',
              tipo: 'receita',
              valor: 150.00,
              status: 'realizada'
            },
            {
              data: dataAtual.subtract(2, 'day').format('YYYY-MM-DD'),
              descricao: 'Material Médico',
              tipo: 'despesa',
              valor: 250.00,
              status: 'aguardando'
            },
            {
              data: dataAtual.subtract(3, 'day').format('YYYY-MM-DD'),
              descricao: 'Exame Dermatológico',
              tipo: 'receita',
              valor: 120.00,
              status: 'realizada'
            }
          ],
          estatisticas: {
            receita: 2850.00,
            despesa: 1200.00,
            lucro: 1650.00
          }
        };
      
      case 'medicos':
        return {
          data: [
            {
              nome: 'Dr. Carlos Pereira',
              especialidade: 'Cardiologia',
              total_agendamentos: 25,
              total_receita: 3750.00
            },
            {
              nome: 'Dra. Ana Costa',
              especialidade: 'Dermatologia',
              total_agendamentos: 18,
              total_receita: 2160.00
            },
            {
              nome: 'Dr. Roberto Lima',
              especialidade: 'Ortopedia',
              total_agendamentos: 22,
              total_receita: 3300.00
            }
          ],
          estatisticas: {
            total: 3,
            total_agendamentos: 65,
            total_receita: 9210.00
          }
        };
      
      case 'especialidades':
        return {
          data: [
            {
              nome: 'Cardiologia',
              total_agendamentos: 25,
              total_medicos: 1,
              total_receita: 3750.00
            },
            {
              nome: 'Dermatologia',
              total_agendamentos: 18,
              total_medicos: 1,
              total_receita: 2160.00
            },
            {
              nome: 'Ortopedia',
              total_agendamentos: 22,
              total_medicos: 1,
              total_receita: 3300.00
            }
          ],
          estatisticas: {
            total: 3,
            total_agendamentos: 65,
            total_receita: 9210.00
          }
        };
      
      default:
        return { data: [], estatisticas: {} };
    }
  };

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      try {
        // Dados mock enquanto a API não está disponível
        const dadosMock = gerarDadosMock(tipoRelatorio);
        
        // Simular delay da API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setDados(dadosMock.data);
        setEstatisticas(dadosMock.estatisticas);
        
        /* 
        // Código para quando a API estiver disponível:
        const params = {
          data_inicio: dataInicio.format('YYYY-MM-DD'),
          data_fim: dataFim.format('YYYY-MM-DD')
        };

        let response;
        switch (tipoRelatorio) {
          case 'agendamentos':
            response = await relatoriosService.getRelatorioAgendamentos(params);
            break;
          case 'financeiro':
            response = await relatoriosService.getRelatorioFinanceiro(params);
            break;
          case 'medicos':
            response = await relatoriosService.getRelatorioMedicos(params);
            break;
          case 'especialidades':
            response = await relatoriosService.getRelatorioEspecialidades(params);
            break;
          default:
            response = { data: [], estatisticas: {} };
        }

        setDados(response.data || []);
        setEstatisticas(response.estatisticas || {});
        */
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        showAlert('Erro ao carregar dados do relatório', 'error');
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [tipoRelatorio, dataInicio, dataFim]);

  const gerarPDF = () => {
    try {
      const pdfGenerator = new PDFGenerator();
      const titulo = getTituloRelatorio();
      const periodo = `${dataInicio.format('DD/MM/YYYY')} a ${dataFim.format('DD/MM/YYYY')}`;
      const filtros = { periodo, titulo };
      
      // Chamar o método específico baseado no tipo de relatório
      switch (tipoRelatorio) {
        case 'agendamentos':
          pdfGenerator.gerarRelatorioAgendamentos(dados, filtros);
          break;
        case 'financeiro':
          pdfGenerator.gerarRelatorioFinanceiro(dados, filtros);
          break;
        case 'medicos':
          pdfGenerator.gerarRelatorioPorMedicos(dados, filtros);
          break;
        case 'especialidades':
          pdfGenerator.gerarRelatorioPorEspecialidades(dados, filtros);
          break;
        default:
          throw new Error('Tipo de relatório não suportado');
      }
      
      showAlert('PDF gerado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      showAlert('Erro ao gerar PDF', 'error');
    }
  };

  const getTituloRelatorio = () => {
    const titulos = {
      agendamentos: 'Relatório de Agendamentos',
      financeiro: 'Relatório Financeiro',
      medicos: 'Relatório de Médicos',
      especialidades: 'Relatório de Especialidades'
    };
    return titulos[tipoRelatorio] || 'Relatório';
  };

  const renderEstatisticas = () => {
    if (!estatisticas || Object.keys(estatisticas).length === 0) return null;

    return (
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {Object.entries(estatisticas).map(([key, value]) => (
          <Grid item xs={12} sm={6} md={3} key={key}>
            <Card className="estatistica-card">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  {getIconeEstatistica(key)}
                  <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                    {formatarTituloEstatistica(key)}
                  </Typography>
                </Box>
                <Typography variant="h4" color="primary">
                  {formatarValorEstatistica(key, value)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const getIconeEstatistica = (key) => {
    const icones = {
      total: <Assessment color="primary" />,
      confirmados: <TrendingUp color="success" />,
      pendentes: <Group color="warning" />,
      cancelados: <LocalHospital color="error" />,
      receita: <TrendingUp color="success" />,
      despesa: <LocalHospital color="error" />,
      lucro: <Assessment color="primary" />
    };
    return icones[key] || <Assessment color="primary" />;
  };

  const formatarTituloEstatistica = (key) => {
    const titulos = {
      total: 'Total',
      confirmados: 'Confirmados',
      pendentes: 'Pendentes',
      cancelados: 'Cancelados',
      receita: 'Receita',
      despesa: 'Despesa',
      lucro: 'Lucro'
    };
    return titulos[key] || key;
  };

  const formatarValorEstatistica = (key, value) => {
    if (['receita', 'despesa', 'lucro'].includes(key)) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    }
    return value;
  };

  const renderTabela = () => {
    if (!dados || dados.length === 0) {
      return (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>Nenhum dado encontrado para o período selecionado</Typography>
        </Paper>
      );
    }

    const colunas = getColunas();

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {colunas.map((coluna) => (
                <TableCell key={coluna.id} sx={{ fontWeight: 'bold' }}>
                  {coluna.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dados.map((item, index) => (
              <TableRow key={index}>
                {colunas.map((coluna) => (
                  <TableCell key={coluna.id}>
                    {renderCelula(item, coluna)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const getColunas = () => {
    const colunasPorTipo = {
      agendamentos: [
        { id: 'data', label: 'Data' },
        { id: 'horario', label: 'Horário' },
        { id: 'paciente', label: 'Paciente' },
        { id: 'medico', label: 'Médico' },
        { id: 'especialidade', label: 'Especialidade' },
        { id: 'status', label: 'Status' }
      ],
      financeiro: [
        { id: 'data', label: 'Data' },
        { id: 'descricao', label: 'Descrição' },
        { id: 'tipo', label: 'Tipo' },
        { id: 'valor', label: 'Valor' },
        { id: 'status', label: 'Status' }
      ],
      medicos: [
        { id: 'nome', label: 'Nome' },
        { id: 'especialidade', label: 'Especialidade' },
        { id: 'total_agendamentos', label: 'Total Agendamentos' },
        { id: 'total_receita', label: 'Total Receita' }
      ],
      especialidades: [
        { id: 'nome', label: 'Especialidade' },
        { id: 'total_agendamentos', label: 'Total Agendamentos' },
        { id: 'total_medicos', label: 'Total Médicos' },
        { id: 'total_receita', label: 'Total Receita' }
      ]
    };

    return colunasPorTipo[tipoRelatorio] || [];
  };

  const renderCelula = (item, coluna) => {
    const valor = item[coluna.id];

    switch (coluna.id) {
      case 'status':
        return (
          <Chip
            label={valor}
            color={getCorStatus(valor)}
            size="small"
          />
        );
      case 'data':
        return dayjs(valor).format('DD/MM/YYYY');
      case 'valor':
      case 'total_receita':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(valor);
      case 'tipo':
        return (
          <Chip
            label={valor}
            color={valor === 'receita' ? 'success' : 'error'}
            size="small"
          />
        );
      default:
        return valor;
    }
  };

  const getCorStatus = (status) => {
    const cores = {
      'confirmado': 'success',
      'pendente': 'warning',
      'cancelado': 'error',
      'realizada': 'success',
      'aguardando': 'warning'
    };
    return cores[status?.toLowerCase()] || 'default';
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Box className="relatorios-container">
        {alert.show && (
          <Alert severity={alert.severity} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}

        <Paper className="relatorios-header">
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Assessment sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
            <Typography variant="h4" component="h1" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
              Relatórios Gerenciais
            </Typography>
          </Box>

          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Relatório</InputLabel>
                <Select
                  value={tipoRelatorio}
                  label="Tipo de Relatório"
                  onChange={(e) => setTipoRelatorio(e.target.value)}
                >
                  <MenuItem value="agendamentos">Agendamentos</MenuItem>
                  <MenuItem value="financeiro">Financeiro</MenuItem>
                  <MenuItem value="medicos">Médicos</MenuItem>
                  <MenuItem value="especialidades">Especialidades</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <DatePicker
                label="Data Início"
                value={dataInicio}
                onChange={setDataInicio}
                format="DD/MM/YYYY"
                sx={{ width: '100%' }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <DatePicker
                label="Data Fim"
                value={dataFim}
                onChange={setDataFim}
                format="DD/MM/YYYY"
                sx={{ width: '100%' }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                startIcon={<PictureAsPdf />}
                onClick={gerarPDF}
                fullWidth
                disabled={loading || !dados.length}
              >
                Gerar PDF
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {renderEstatisticas()}
            {renderTabela()}
          </>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default Relatorios;