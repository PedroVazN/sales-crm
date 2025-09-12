import styled from 'styled-components';

export const Container = styled.aside`
  position: fixed;
  left: 0;
  top: 0;
  width: 280px;
  height: 100vh;
  background: ${({ theme }) => theme.colors.background.secondary};
  border-right: 1px solid ${({ theme }) => theme.colors.border.primary};
  backdrop-filter: blur(10px);
  z-index: 1000;
  overflow-y: auto;
`;

export const Logo = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
  text-align: center;
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
    margin: 0;
    text-shadow: 0 0 20px rgba(0, 212, 170, 0.3);
  }
  
  span {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.text.secondary};
    font-weight: 500;
    letter-spacing: 2px;
  }
`;

export const MenuSection = styled.div`
  padding: ${({ theme }) => theme.spacing.lg} 0;
`;

export const MenuTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.tertiary};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
`;

export const MenuItem = styled.div<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  
  background: ${({ $isActive, theme }) => 
    $isActive ? theme.colors.background.card : 'transparent'};
  
  color: ${({ $isActive, theme }) => 
    $isActive ? theme.colors.primary : theme.colors.text.secondary};
  
  &:hover {
    background: ${({ theme }) => theme.colors.background.card};
    color: ${({ theme }) => theme.colors.primary};
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: ${({ $isActive, theme }) => 
      $isActive ? theme.colors.primary : 'transparent'};
    transition: all 0.2s ease;
  }
  
  &:hover::before {
    background: ${({ theme }) => theme.colors.primary};
  }
`;

export const MenuIcon = styled.div`
  margin-right: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MenuText = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
`;
