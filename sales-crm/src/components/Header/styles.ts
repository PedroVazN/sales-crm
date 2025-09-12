import styled from 'styled-components';

export const Container = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  background: rgba(15, 15, 35, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 12px 20px;
  min-width: 350px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:focus-within {
    border-color: #00d4aa;
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
  }
  
  svg {
    color: rgba(255, 255, 255, 0.4);
    margin-right: 12px;
    transition: color 0.2s ease;
  }
  
  &:focus-within svg {
    color: #00d4aa;
  }
`;

export const SearchInput = styled.input`
  background: transparent;
  border: none;
  outline: none;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  flex: 1;
  font-weight: 500;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
    font-weight: 400;
  }
`;

export const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const NotificationButton = styled.button`
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    color: #00d4aa;
    border-color: #00d4aa;
    background: rgba(0, 212, 170, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 212, 170, 0.2);
  }
`;

export const NotificationBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  background: ${({ theme }) => theme.colors.error};
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
`;

export const UserButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 20px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    color: #00d4aa;
    border-color: #00d4aa;
    background: rgba(0, 212, 170, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 212, 170, 0.2);
  }
  
  span {
    font-size: 0.9rem;
    font-weight: 600;
  }
`;

export const UserMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: rgba(15, 15, 35, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  padding: 8px;
  min-width: 180px;
  z-index: 1000;
  margin-top: 8px;
  backdrop-filter: blur(20px);
  animation: slideDown 0.2s ease-out;
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const UserMenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  font-weight: 500;
  
  &:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #fca5a5;
    transform: translateX(4px);
  }
`;
