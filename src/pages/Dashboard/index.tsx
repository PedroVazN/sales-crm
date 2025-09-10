import React from 'react';
// Ícones removidos para evitar warnings de variáveis não utilizadas
import { 
  Container, 
  Header, 
  Title, 
  Subtitle, 
  MetricsGrid, 
  MetricCard, 
  MetricValue, 
  MetricLabel, 
  MetricChange,
  ChartsGrid,
  ChartCard,
  ChartTitle,
  ChartSubtitle,
  ProductsList,
  ProductItem,
  ProductName,
  ProductSales,
  ProductRevenue,
  GoalsList,
  GoalItem,
  GoalName,
  GoalProgress,
  GoalBar,
  GoalPercentage,
  PerformanceMetrics,
  MetricItem,
  MetricItemLabel,
  MetricItemValue
} from './styles';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const salesData = [
  { month: 'Jan', vendas: 400, receita: 240 },
  { month: 'Fev', vendas: 300, receita: 139 },
  { month: 'Mar', vendas: 200, receita: 980 },
  { month: 'Abr', vendas: 278, receita: 390 },
  { month: 'Mai', vendas: 189, receita: 480 },
  { month: 'Jun', vendas: 239, receita: 380 },
  { month: 'Jul', vendas: 349, receita: 430 },
  { month: 'Ago', vendas: 420, receita: 520 },
  { month: 'Set', vendas: 500, receita: 600 },
];

const revenueData = [
  { month: 'Jan', receita: 240 },
  { month: 'Fev', receita: 139 },
  { month: 'Mar', receita: 980 },
  { month: 'Abr', receita: 390 },
  { month: 'Mai', receita: 480 },
  { month: 'Jun', receita: 380 },
  { month: 'Jul', receita: 430 },
  { month: 'Ago', receita: 520 },
  { month: 'Set', receita: 600 },
];

const topProducts = [
  { name: 'Sistema Pro', sales: 124, revenue: 186000 },
  { name: 'Plano Empresarial', sales: 89, revenue: 142400 },
  { name: 'Consultoria Plus', sales: 67, revenue: 98500 },
];

const goals = [
  { name: 'Meta Individual', progress: 83, color: '#3B82F6' },
  { name: 'Meta da Equipe', progress: 72, color: '#10B981' },
  { name: 'Meta Trimestral', progress: 93, color: '#F59E0B' },
];

export const Dashboard: React.FC = () => {
  return (
    <Container>
      <Header>
        <Title>Dashboard</Title>
        <Subtitle>Visão geral das suas vendas e performance</Subtitle>
      </Header>

      <MetricsGrid>
        <MetricCard>
          <MetricValue>R$ 145.231</MetricValue>
          <MetricLabel>Receita Total</MetricLabel>
          <MetricChange $positive>+20.1% vs mês anterior</MetricChange>
        </MetricCard>

        <MetricCard>
          <MetricValue>2.350</MetricValue>
          <MetricLabel>Capitalização</MetricLabel>
          <MetricChange $positive>+12.5% novos leads</MetricChange>
        </MetricCard>

        <MetricCard>
          <MetricValue>189</MetricValue>
          <MetricLabel>Vendas Fechadas</MetricLabel>
          <MetricChange $positive>+8.2% este mês</MetricChange>
        </MetricCard>

        <MetricCard>
          <MetricValue>24.7%</MetricValue>
          <MetricLabel>Taxa de Conversão</MetricLabel>
          <MetricChange $positive>+2.4% média mensal</MetricChange>
        </MetricCard>
      </MetricsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartTitle>Performance de Vendas</ChartTitle>
          <ChartSubtitle>Evolução mensal de vendas e receita</ChartSubtitle>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis dataKey="month" stroke="#A3A3A3" />
              <YAxis stroke="#A3A3A3" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1A1A1A', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#FFFFFF'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="vendas" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="receita" 
                stroke="#EC4899" 
                strokeWidth={3}
                dot={{ fill: '#EC4899', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <ChartTitle>Receita Mensal (R$)</ChartTitle>
          <ChartSubtitle>Evolução da receita por mês</ChartSubtitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis dataKey="month" stroke="#A3A3A3" />
              <YAxis stroke="#A3A3A3" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1A1A1A', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#FFFFFF'
                }} 
              />
              <Bar 
                dataKey="receita" 
                fill="url(#colorGradient)"
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00D4AA" />
                  <stop offset="100%" stopColor="#6366F1" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartTitle>Produtos Mais Vendidos</ChartTitle>
          <ChartSubtitle>Top 5 produtos do mês</ChartSubtitle>
          <ProductsList>
            {topProducts.map((product, index) => (
              <ProductItem key={index}>
                <ProductName>{index + 1} {product.name}</ProductName>
                <ProductSales>{product.sales} vendas</ProductSales>
                <ProductRevenue>R$ {product.revenue.toLocaleString()}</ProductRevenue>
              </ProductItem>
            ))}
          </ProductsList>
        </ChartCard>

        <ChartCard>
          <ChartTitle>Metas de Vendas</ChartTitle>
          <ChartSubtitle>Progresso das metas mensais</ChartSubtitle>
          <GoalsList>
            {goals.map((goal, index) => (
              <GoalItem key={index}>
                <GoalName>{goal.name}</GoalName>
                <GoalProgress>
                  <GoalBar $color={goal.color} $width={goal.progress} />
                  <GoalPercentage>{goal.progress}%</GoalPercentage>
                </GoalProgress>
              </GoalItem>
            ))}
          </GoalsList>
        </ChartCard>
      </ChartsGrid>

      <PerformanceMetrics>
        <MetricItem>
          <MetricItemLabel>Propostas Perdidas</MetricItemLabel>
          <MetricItemValue $negative>23</MetricItemValue>
        </MetricItem>
        <MetricItem>
          <MetricItemLabel>Vendas Abertas</MetricItemLabel>
          <MetricItemValue $negative>45</MetricItemValue>
        </MetricItem>
        <MetricItem>
          <MetricItemLabel>Ticket Médio</MetricItemLabel>
          <MetricItemValue $negative>R$ 1.250</MetricItemValue>
        </MetricItem>
      </PerformanceMetrics>
    </Container>
  );
};
