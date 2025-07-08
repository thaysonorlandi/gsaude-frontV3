import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Divider } from '@mui/material';
import './financeiro.css';

function Financeiro() {
  const [resumoFinanceiro] = useState({
    receitaTotal: 'R$ 125.800,00',
    despesaTotal: 'R$ 68.450,00',
    lucroLiquido: 'R$ 57.350,00',
    consultasRealizadas: 285,
    examesRealizados: 432,
    valorMedioConsulta: 'R$ 180,00',
    valorMedioExame: 'R$ 150,00',
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Resumo Financeiro
      </Typography>
      
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

      <Typography variant="h5" gutterBottom>
        Detalhes dos Atendimentos
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card className="card-financeiro">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Consultas Realizadas
                </Typography>
                <Typography variant="h4">
                  {resumoFinanceiro.consultasRealizadas}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1">
                  Valor Médio: {resumoFinanceiro.valorMedioConsulta}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card className="card-financeiro">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Exames Realizados
                </Typography>
                <Typography variant="h4">
                  {resumoFinanceiro.examesRealizados}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1">
                  Valor Médio: {resumoFinanceiro.valorMedioExame}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default Financeiro;