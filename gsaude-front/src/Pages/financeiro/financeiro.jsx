import React, { useState } from 'react';
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
  Tab
} from '@mui/material';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import './financeiro.css';

function Financeiro() {
  const [tabValue, setTabValue] = useState(0);
  
  const [resumoFinanceiro] = useState({
    receitaTotal: 'R$ 125.800,00',
    despesaTotal: 'R$ 68.450,00',
    lucroLiquido: 'R$ 57.350,00',
    consultasRealizadas: 285,
    consultasAguardando: 42,
    examesRealizados: 432,
    examesAguardando: 38,
    valorMedioConsulta: 'R$ 180,00',
    valorMedioExame: 'R$ 150,00',
    tempoMedioConsulta: '35 minutos',
  });

  const [consultasRecentes] = useState([
    { id: 1, paciente: 'Maria Silva', medico: 'Dr. João Cardoso', valor: 'R$ 200,00', data: '07/07/2025', duracao: '40 min', status: 'Realizada' },
    { id: 2, paciente: 'Pedro Santos', medico: 'Dra. Ana Soares', valor: 'R$ 180,00', data: '07/07/2025', duracao: '30 min', status: 'Realizada' },
    { id: 3, paciente: 'Lucas Oliveira', medico: 'Dr. Paulo Menezes', valor: 'R$ 190,00', data: '08/07/2025', duracao: '25 min', status: 'Aguardando' },
    { id: 4, paciente: 'Julia Castro', medico: 'Dra. Carla Mendes', valor: 'R$ 210,00', data: '08/07/2025', duracao: '45 min', status: 'Aguardando' },
  ]);

  const [examesRecentes] = useState([
    { id: 1, paciente: 'Roberto Alves', tipo: 'Raio-X', valor: 'R$ 120,00', data: '07/07/2025', status: 'Realizado' },
    { id: 2, paciente: 'Fernanda Lima', tipo: 'Hemograma', valor: 'R$ 80,00', data: '07/07/2025', status: 'Realizado' },
    { id: 3, paciente: 'Carlos Gomes', tipo: 'Ultrassonografia', valor: 'R$ 250,00', data: '08/07/2025', status: 'Aguardando' },
    { id: 4, paciente: 'Amanda Dias', tipo: 'Eletrocardiograma', valor: 'R$ 180,00', data: '08/07/2025', status: 'Aguardando' },
  ]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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
      
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card className="card-financeiro receita">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Receita Total
                </Typography>
                <Typography variant="h4">
                  {resumoFinanceiro.receitaTotal}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card className="card-financeiro despesa">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Despesa Total
                </Typography>
                <Typography variant="h4">
                  {resumoFinanceiro.despesaTotal}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
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

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Resumo de Atendimentos
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card className="card-financeiro">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Consultas
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center">
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
                      Valor Médio: <strong>{resumoFinanceiro.valorMedioConsulta}</strong>
                    </Typography>
                    <Typography variant="body1">
                      Tempo Médio: <strong>{resumoFinanceiro.tempoMedioConsulta}</strong>
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card className="card-financeiro">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Exames
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center">
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
                      Valor Médio: <strong>{resumoFinanceiro.valorMedioExame}</strong>
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label="Consultas" />
          <Tab label="Exames" />
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
                    <TableCell>Paciente</TableCell>
                    <TableCell>Médico</TableCell>
                    <TableCell>Valor</TableCell>
                    <TableCell>Data</TableCell>
                    <TableCell>Duração</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {consultasRecentes.map((consulta) => (
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
                    <TableCell>Paciente</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Valor</TableCell>
                    <TableCell>Data</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {examesRecentes.map((exame) => (
                    <TableRow key={exame.id} className={exame.status === 'Realizado' ? 'row-realizada' : 'row-aguardando'}>
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
    </Box>
  );
}

export default Financeiro;