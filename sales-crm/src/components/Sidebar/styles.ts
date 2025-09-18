import styled from 'styled-components';

export const Container = styled.aside`
  position: fixed;
  left: 0;
  top: 0;
  width: 280px;
  height: 100vh;
  background: rgba(15, 15, 35, 0.9);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  z-index: 1000;
  overflow-y: auto;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

export const Logo = styled.div`
  padding: 32px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 20px;
    right: 20px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent);
  }
  
  h1 {
    font-size: 2.2rem;
    font-weight: 800;
    background: linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #ec4899 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
    text-shadow: 0 0 30px rgba(59, 130, 246, 0.3);
    animation: glow 2s ease-in-out infinite alternate;
  }
  
  span {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.6);
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-top: 4px;
    display: block;
  }

  @keyframes glow {
    from { filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.3)); }
    to { filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.6)); }
  }
`;

export const MenuSection = styled.div`
  padding: 24px 0;
`;

export const MenuTitle = styled.h3`
  font-size: 0.7rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0 0 16px 24px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: -12px;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 4px;
    background: linear-gradient(135deg, #3b82f6, #6366f1);
    border-radius: 50%;
  }
`;

export const MenuItem = styled.div<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  padding: 16px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  margin: 0 12px;
  border-radius: 12px;
  
  background: ${({ $isActive }) => 
    $isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent'};
  
  color: ${({ $isActive }) => 
    $isActive ? '#3b82f6' : 'rgba(255, 255, 255, 0.7)'};
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #3b82f6;
    transform: translateX(4px);
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 0;
    background: linear-gradient(135deg, #3b82f6, #6366f1);
    border-radius: 0 2px 2px 0;
    transition: all 0.3s ease;
  }
  
  ${({ $isActive }) => $isActive && `
    &::before {
      height: 20px;
    }
  `}
  
  &:hover::before {
    height: 20px;
  }
`;

export const MenuIcon = styled.div`
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
`;

export const MenuText = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
`;
