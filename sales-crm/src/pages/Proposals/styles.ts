import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const ActionsBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

export const PriceListGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
  position: relative;
  z-index: 1;

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

export const PriceListCard = styled.div`
  background: ${theme.colors.background.card};
  backdrop-filter: blur(20px);
  border: 1px solid ${theme.colors.border.primary};
  border-radius: ${theme.borderRadius.lg};
  padding: 1.5rem;
  transition: all ${theme.transitions.normal};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  }

  &:hover {
    transform: translateY(-4px);
    background: ${theme.colors.background.cardHover};
    border-color: ${theme.colors.border.secondary};
    box-shadow: ${theme.shadows.large};
  }
`;

export const PriceListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

export const PriceListDistributor = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  div {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  h4 {
    color: ${theme.colors.text.primary};
    font-size: 1.1rem;
    font-weight: 700;
    margin: 0;
  }

  span {
    color: ${theme.colors.text.secondary};
    font-size: 0.9rem;
  }
`;

export const PriceListProduct = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;

  div {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  h4 {
    color: ${theme.colors.text.primary};
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
  }

  span {
    color: ${theme.colors.text.secondary};
    font-size: 0.9rem;
  }
`;

export const PriceListStatus = styled.div<{ $isActive: boolean }>`
  padding: 0.5rem 1rem;
  background: ${({ $isActive, theme }) => 
    $isActive ? theme.colors.success + '20' : theme.colors.error + '20'};
  border: 1px solid ${({ $isActive, theme }) => 
    $isActive ? theme.colors.success + '40' : theme.colors.error + '40'};
  border-radius: 20px;
  color: ${({ $isActive, theme }) => 
    $isActive ? theme.colors.success : theme.colors.error};
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const PriceListPricing = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: ${theme.colors.background.card};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border.primary};
`;

export const PricingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${theme.colors.border.primary};

  &:last-child {
    border-bottom: none;
  }

  span {
    color: ${theme.colors.text.secondary};
    font-size: 0.9rem;
    font-weight: 500;
  }

  strong {
    color: ${theme.colors.text.primary};
    font-size: 1rem;
    font-weight: 700;
  }
`;

export const PriceListActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  position: relative;
  z-index: 1;

  h3 {
    color: ${theme.colors.text.primary};
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 1rem 0;
  }

  p {
    color: ${theme.colors.text.secondary};
    font-size: 1rem;
    margin: 0 0 2rem 0;
    max-width: 400px;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  position: relative;
  z-index: 1;

  p {
    color: ${theme.colors.text.secondary};
    font-size: 1.1rem;
    margin-top: 1rem;
  }
`;