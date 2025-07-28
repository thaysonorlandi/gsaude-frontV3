import React from 'react';
import { Card, Row, Col, Statistic, Progress } from 'antd';
import { 
  CalendarOutlined, 
  UserOutlined, 
  DollarOutlined,
  MedicineBoxOutlined,
  TeamOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

export default function DashboardStats({ dados }) {
  if (!dados || dados.length === 0) {
    return null;
  }

  // Calcular estatísticas
  const totalAgendamentos = dados.length;
  const consultas = dados.filter(item => item.tipo_procedimento === 'consulta').length;
  const exames = dados.filter(item => item.tipo_procedimento === 'exame').length;
  const receitaTotal = dados.reduce((sum, item) => sum + (item.valor || 0), 0);
  const medicosUnicos = new Set(dados.map(item => item.medico?.nome)).size;
  const especialidadesUnicas = new Set(dados.map(item => item.especialidade?.nome)).size;
  
  // Calcular percentuais
  const percentualConsultas = totalAgendamentos > 0 ? (consultas / totalAgendamentos) * 100 : 0;
  const percentualExames = totalAgendamentos > 0 ? (exames / totalAgendamentos) * 100 : 0;
  
  // Status dos agendamentos
  const confirmados = dados.filter(item => item.status === 'Confirmado' || item.status === 'Realizado').length;
  const percentualConfirmados = totalAgendamentos > 0 ? (confirmados / totalAgendamentos) * 100 : 0;

  return (
    <div style={{ marginBottom: 24 }}>
      <Row gutter={[16, 16]}>
        {/* Total de Agendamentos */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Total de Agendamentos"
              value={totalAgendamentos}
              prefix={<CalendarOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>

        {/* Receita Total */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Receita Total"
              value={receitaTotal}
              prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
              precision={2}
              suffix="R$"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>

        {/* Médicos Ativos */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Médicos Ativos"
              value={medicosUnicos}
              prefix={<UserOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>

        {/* Especialidades */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Especialidades"
              value={especialidadesUnicas}
              prefix={<MedicineBoxOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* Distribuição Consultas/Exames */}
        <Col xs={24} md={12}>
          <Card title="Distribuição por Tipo" size="small">
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span><TeamOutlined /> Consultas</span>
                <span>{consultas} ({percentualConsultas.toFixed(1)}%)</span>
              </div>
              <Progress 
                percent={percentualConsultas} 
                strokeColor="#1890ff"
                size="small"
              />
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span><MedicineBoxOutlined /> Exames</span>
                <span>{exames} ({percentualExames.toFixed(1)}%)</span>
              </div>
              <Progress 
                percent={percentualExames} 
                strokeColor="#52c41a"
                size="small"
              />
            </div>
          </Card>
        </Col>

        {/* Taxa de Confirmação */}
        <Col xs={24} md={12}>
          <Card title="Status dos Agendamentos" size="small">
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span><CheckCircleOutlined /> Confirmados/Realizados</span>
                <span>{confirmados} ({percentualConfirmados.toFixed(1)}%)</span>
              </div>
              <Progress 
                percent={percentualConfirmados} 
                strokeColor="#52c41a"
                size="small"
              />
            </div>
            
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Pendentes</span>
                <span>{totalAgendamentos - confirmados}</span>
              </div>
              <Progress 
                percent={100 - percentualConfirmados} 
                strokeColor="#faad14"
                size="small"
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
