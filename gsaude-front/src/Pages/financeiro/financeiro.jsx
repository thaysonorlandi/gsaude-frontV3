import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Divider, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableSortLabel
} from '@mui/material';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import financeiroService from '../../services/financeiroService';
import './financeiro.css';

function Financeiro() {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para ordenação
  const [orderByConsultas, setOrderByConsultas] = useState('data');
  const [orderConsultas, setOrderConsultas] = useState('desc');
  const [orderByExames, setOrderByExames] = useState('data');
  const [orderExames, setOrderExames] = useState('desc');
  
  const [resumoFinanceiro, setResumoFinanceiro] = useState({
    receitaTotal: 'R$ 0,00',
    despesaTotal: 'R$ 0,00',
    lucroLiquido: 'R$ 0,00',
    consultasRealizadas: 0,
    consultasAguardando: 0,
    examesRealizados: 0,
    examesAguardando: 0,
    valorMedioConsulta: 'R$ 0,00',
    valorMedioExame: 'R$ 0,00',
    tempoMedioConsulta: '0 minutos',
    tempoMedioExame: '0 minutos',
  });

  const [consultasRecentes, setConsultasRecentes] = useState([]);
  const [examesRecentes, setExamesRecentes] = useState([]);

  // Carregar dados da API
  useEffect(() => {
    async function carregarDadosFinanceiros() {
      setLoading(true);
      try {
        const dadosAgendamentos = await financeiroService.getDadosFinanceiros();
        
        // Calcular resumo financeiro
        const resumo = financeiroService.calcularResumoFinanceiro(dadosAgendamentos);
        setResumoFinanceiro(resumo);
        
        // Processar detalhamento
        const detalhamento = financeiroService.processarDetalhamento(dadosAgendamentos);
        setConsultasRecentes(detalhamento.consultas);
        setExamesRecentes(detalhamento.exames);
        
        setError(null);
      } catch {
        setError('Erro ao carregar dados financeiros');
        
        // Usar valores vazios em caso de erro
        setResumoFinanceiro({
          receitaTotal: 'R$ 0,00',
          despesaTotal: 'R$ 0,00',
          lucroLiquido: 'R$ 0,00',
          consultasRealizadas: 0,
          consultasAguardando: 0,
          examesRealizados: 0,
          examesAguardando: 0,
          valorMedioConsulta: 'R$ 0,00',
          valorMedioExame: 'R$ 0,00',
          tempoMedioConsulta: '0 minutos',
          tempoMedioExame: '0 minutos',
        });

        setConsultasRecentes([]);
        setExamesRecentes([]);
      } finally {
        setLoading(false);
      }
    }

    carregarDadosFinanceiros();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Função para converter valor monetário em número para ordenação
  const parseValor = (valor) => {
    if (!valor) return 0;
    // Remove R$, espaços e substitui vírgula por ponto
    return parseFloat(valor.replace(/[R$\s]/g, '').replace(',', '.')) || 0;
  };

  // Função para converter data em formato Date para ordenação
  const parseData = (data) => {
    if (!data) return new Date(0);
    // Se já é uma data válida
    if (data instanceof Date) return data;
    // Se é string no formato DD/MM/YYYY
    if (typeof data === 'string' && data.includes('/')) {
      const [dia, mes, ano] = data.split('/');
      return new Date(ano, mes - 1, dia);
    }
    // Tenta converter diretamente
    return new Date(data);
  };

  // Função para ordenar consultas
  const handleRequestSortConsultas = (property) => {
    const isAsc = orderByConsultas === property && orderConsultas === 'asc';
    setOrderConsultas(isAsc ? 'desc' : 'asc');
    setOrderByConsultas(property);
  };

  // Função para ordenar exames
  const handleRequestSortExames = (property) => {
    const isAsc = orderByExames === property && orderExames === 'asc';
    setOrderExames(isAsc ? 'desc' : 'asc');
    setOrderByExames(property);
  };

  // Função para ordenar arrays
  const getSortedData = (array, orderBy, order) => {
    return array.slice().sort((a, b) => {
      let aValue, bValue;
      
      switch (orderBy) {
        case 'valor':
          aValue = parseValor(a.valor);
          bValue = parseValor(b.valor);
          break;
        case 'data':
          aValue = parseData(a.data);
          bValue = parseData(b.data);
          break;
        case 'paciente':
          aValue = a.paciente?.toLowerCase() || '';
          bValue = b.paciente?.toLowerCase() || '';
          break;
        case 'medico':
          aValue = a.medico?.toLowerCase() || '';
          bValue = b.medico?.toLowerCase() || '';
          break;
        case 'status':
          aValue = a.status?.toLowerCase() || '';
          bValue = b.status?.toLowerCase() || '';
          break;
        case 'tipo':
          aValue = a.tipo?.toLowerCase() || '';
          bValue = b.tipo?.toLowerCase() || '';
          break;
        case 'duracao':
          aValue = parseInt(a.duracao) || 0;
          bValue = parseInt(b.duracao) || 0;
          break;
        default:
          aValue = a[orderBy];
          bValue = b[orderBy];
      }

      if (aValue < bValue) {
        return order === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Cabeçalho no estilo das outras páginas */}
      <Box className="page-header">
        <CurrencyExchangeIcon className="page-header-icon" />
        <Typography variant="h4" className="page-header-title">
          Financeiro
        </Typography>
      </Box>

      {/* Alerta de erro */}
      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Resumo Financeiro - Valores Recebidos, Pagos aos Médicos e Lucro Líquido */}
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              Resumo Financeiro
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card className="card-financeiro receita">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Valores Recebidos
                    </Typography>
                    <Typography variant="h4">
                      {resumoFinanceiro.receitaTotal}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card className="card-financeiro despesa">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Valores Pagos
                    </Typography>
                    <Typography variant="h4">
                      {resumoFinanceiro.despesaTotal}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card className="card-financeiro lucro">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Lucro Líquido
                    </Typography>
                    <Typography variant="h4">
                      {resumoFinanceiro.lucroLiquido}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>

          {/* Resumo de Atendimentos - Número de Exames/Consultas, Média de Valores e Tempo Médio */}
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Resumo de Atendimentos
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card className="card-financeiro">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Consultas
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ gap: 2 }}>
                      <Box>
                        <Typography variant="body1">
                          Realizadas: <strong>{resumoFinanceiro.consultasRealizadas}</strong>
                        </Typography>
                        <Typography variant="body1">
                          Aguardando: <strong>{resumoFinanceiro.consultasAguardando}</strong>
                        </Typography>
                      </Box>
                      <Box textAlign="right">
                        <Typography variant="body1">
                          Média de Valores: <strong>{resumoFinanceiro.valorMedioConsulta}</strong>
                        </Typography>
                        <Typography variant="body1">
                          Tempo Médio: <strong>{resumoFinanceiro.tempoMedioConsulta}</strong>
                        </Typography>
                      </Box> 
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card className="card-financeiro">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Exames
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ gap: 2 }}>
                      <Box>
                        <Typography variant="body1">
                          Realizados: <strong>{resumoFinanceiro.examesRealizados}</strong>
                        </Typography>
                        <Typography variant="body1">
                          Aguardando: <strong>{resumoFinanceiro.examesAguardando}</strong>
                        </Typography>
                      </Box>
                      <Box textAlign="right">
                        <Typography variant="body1">
                          Média de Valores: <strong>{resumoFinanceiro.valorMedioExame}</strong>
                        </Typography>
                        <Typography variant="body1">
                          Tempo Médio: <strong>{resumoFinanceiro.tempoMedioExame}</strong>
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>

          {/* Detalhamento das Consultas e Exames Realizados */}
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
              Detalhamento dos Atendimentos
            </Typography>
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
              <Tab label="Consultas Realizadas" />
              <Tab label="Exames Realizados" />
            </Tabs>
            
            {tabValue === 0 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Detalhamento de Consultas
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <TableSortLabel
                            active={orderByConsultas === 'paciente'}
                            direction={orderByConsultas === 'paciente' ? orderConsultas : 'asc'}
                            onClick={() => handleRequestSortConsultas('paciente')}
                          >
                            Paciente
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                          <TableSortLabel
                            active={orderByConsultas === 'medico'}
                            direction={orderByConsultas === 'medico' ? orderConsultas : 'asc'}
                            onClick={() => handleRequestSortConsultas('medico')}
                          >
                            Médico
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                          <TableSortLabel
                            active={orderByConsultas === 'valor'}
                            direction={orderByConsultas === 'valor' ? orderConsultas : 'asc'}
                            onClick={() => handleRequestSortConsultas('valor')}
                          >
                            Valor
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                          <TableSortLabel
                            active={orderByConsultas === 'data'}
                            direction={orderByConsultas === 'data' ? orderConsultas : 'asc'}
                            onClick={() => handleRequestSortConsultas('data')}
                          >
                            Data
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                          <TableSortLabel
                            active={orderByConsultas === 'duracao'}
                            direction={orderByConsultas === 'duracao' ? orderConsultas : 'asc'}
                            onClick={() => handleRequestSortConsultas('duracao')}
                          >
                            Duração
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                          <TableSortLabel
                            active={orderByConsultas === 'status'}
                            direction={orderByConsultas === 'status' ? orderConsultas : 'asc'}
                            onClick={() => handleRequestSortConsultas('status')}
                          >
                            Status
                          </TableSortLabel>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getSortedData(consultasRecentes, orderByConsultas, orderConsultas).map((consulta) => (
                        <TableRow key={consulta.id} className={consulta.status === 'Realizada' ? 'row-realizada' : 'row-aguardando'}>
                          <TableCell>{consulta.paciente}</TableCell>
                          <TableCell>{consulta.medico}</TableCell>
                          <TableCell>{consulta.valor}</TableCell>
                          <TableCell>{consulta.data}</TableCell>
                          <TableCell>{consulta.duracao}</TableCell>
                          <TableCell>{consulta.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}

            {tabValue === 1 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Detalhamento de Exames
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <TableSortLabel
                            active={orderByExames === 'paciente'}
                            direction={orderByExames === 'paciente' ? orderExames : 'asc'}
                            onClick={() => handleRequestSortExames('paciente')}
                          >
                            Paciente
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                          <TableSortLabel
                            active={orderByExames === 'tipo'}
                            direction={orderByExames === 'tipo' ? orderExames : 'asc'}
                            onClick={() => handleRequestSortExames('tipo')}
                          >
                            Tipo
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                          <TableSortLabel
                            active={orderByExames === 'valor'}
                            direction={orderByExames === 'valor' ? orderExames : 'asc'}
                            onClick={() => handleRequestSortExames('valor')}
                          >
                            Valor
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                          <TableSortLabel
                            active={orderByExames === 'data'}
                            direction={orderByExames === 'data' ? orderExames : 'asc'}
                            onClick={() => handleRequestSortExames('data')}
                          >
                            Data
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                          <TableSortLabel
                            active={orderByExames === 'status'}
                            direction={orderByExames === 'status' ? orderExames : 'asc'}
                            onClick={() => handleRequestSortExames('status')}
                          >
                            Status
                          </TableSortLabel>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getSortedData(examesRecentes, orderByExames, orderExames).map((exame) => (
                        <TableRow key={exame.id} className={exame.status === 'Realizada' ? 'row-realizada' : 'row-aguardando'}>
                          <TableCell>{exame.paciente}</TableCell>
                          <TableCell>{exame.tipo}</TableCell>
                          <TableCell>{exame.valor}</TableCell>
                          <TableCell>{exame.data}</TableCell>
                          <TableCell>{exame.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Paper>
        </>
      )}
    </Box>
  );
}

export default Financeiro;
