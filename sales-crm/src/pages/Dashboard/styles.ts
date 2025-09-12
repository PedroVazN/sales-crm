import styled from 'styled-components';

export const Container = styled.div`
  padding: 32px;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  min-height: 100vh;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(0, 212, 170, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(236, 72, 153, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
`;

export const Header = styled.div`
  margin-bottom: 48px;
  position: relative;
  z-index: 1;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #00d4aa 0%, #6366f1 50%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 8px 0;
  text-shadow: 0 0 30px rgba(0, 212, 170, 0.3);
`;

export const Subtitle = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  font-weight: 500;
`;

export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
  position: relative;
  z-index: 1;
`;

export const MetricCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 32px 24px;
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0, 212, 170, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    border-color: #00d4aa;
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.3),
      0 0 0 1px rgba(0, 212, 170, 0.2);
    transform: translateY(-5px);
    
    &::before {
      opacity: 1;
    }
  }
`;

export const MetricValue = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 8px;
  position: relative;
  z-index: 1;
`;

export const MetricLabel = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 8px;
  font-weight: 500;
  position: relative;
  z-index: 1;
`;

export const MetricChange = styled.div<{ $positive?: boolean }>`
  font-size: 0.8rem;
  color: ${({ $positive }) => 
    $positive ? '#86efac' : '#fca5a5'};
  font-weight: 600;
  position: relative;
  z-index: 1;
`;

export const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
  position: relative;
  z-index: 1;
`;

export const ChartCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 32px 24px;
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0, 212, 170, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    border-color: #00d4aa;
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.3),
      0 0 0 1px rgba(0, 212, 170, 0.2);
    transform: translateY(-3px);
    
    &::before {
      opacity: 1;
    }
  }
`;

export const ChartTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 8px 0;
  position: relative;
  z-index: 1;
`;

export const ChartSubtitle = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 24px 0;
  font-weight: 500;
  position: relative;
  z-index: 1;
`;

export const ProductsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const ProductItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border.secondary};
`;

export const ProductName = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const ProductSales = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const ProductRevenue = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

export const GoalsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const GoalItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const GoalName = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const GoalProgress = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const GoalBar = styled.div<{ $color: string; $width: number }>`
  flex: 1;
  height: 8px;
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${({ $width }) => $width}%;
    background: ${({ $color }) => $color};
    border-radius: 4px;
    transition: width 0.3s ease;
  }
`;

export const GoalPercentage = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  min-width: 40px;
  text-align: right;
`;

export const PerformanceMetrics = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.xxl};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  backdrop-filter: blur(10px);
`;

export const MetricItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const MetricItemLabel = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
`;

export const MetricItemValue = styled.div<{ $negative?: boolean }>`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ $negative, theme }) => 
    $negative ? theme.colors.error : theme.colors.text.primary};
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: ${({ theme }) => theme.spacing.lg};
  
  p {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: 1rem;
  }
`;