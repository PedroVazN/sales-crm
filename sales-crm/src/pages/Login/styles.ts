import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.gradients.background};
  position: relative;
  padding: ${({ theme }) => theme.spacing.lg};
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(0, 212, 170, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(245, 158, 11, 0.08) 0%, transparent 50%);
    animation: float 20s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.02) 50%, transparent 70%),
      linear-gradient(-45deg, transparent 30%, rgba(0, 212, 170, 0.03) 50%, transparent 70%);
    animation: shimmer 8s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-20px) rotate(1deg); }
    66% { transform: translateY(10px) rotate(-1deg); }
  }

  @keyframes shimmer {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.8; }
  }
`;

export const LoginCard = styled.div`
  background: ${({ theme }) => theme.colors.background.glass};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.xxl};
  width: 100%;
  max-width: 450px;
  backdrop-filter: blur(30px);
  box-shadow: 
    ${({ theme }) => theme.shadows.large},
    0 0 0 1px ${({ theme }) => theme.colors.border.primary},
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 1;
  transition: all ${({ theme }) => theme.transitions.normal};
  animation: scaleIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 
      ${({ theme }) => theme.shadows.glow},
      0 0 0 1px ${({ theme }) => theme.colors.border.secondary},
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ theme }) => theme.colors.gradients.glass};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    z-index: -1;
  }

  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: ${({ theme }) => theme.colors.gradients.primary};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    z-index: -2;
    opacity: 0;
    transition: opacity ${({ theme }) => theme.transitions.normal};
  }

  &:hover::after {
    opacity: 0.1;
  }
`;

export const Logo = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  position: relative;
  
  h1 {
    font-size: 4rem;
    font-weight: 900;
    background: ${({ theme }) => theme.colors.gradients.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
    text-shadow: 0 0 50px rgba(0, 212, 170, 0.4);
    animation: glow 3s ease-in-out infinite alternate, float 6s ease-in-out infinite;
    letter-spacing: -3px;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: ${({ theme }) => theme.colors.gradients.primary};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      filter: blur(2px);
      opacity: 0.5;
      z-index: -1;
    }
  }
  
  span {
    font-size: 1.2rem;
    color: ${({ theme }) => theme.colors.text.secondary};
    font-weight: 700;
    letter-spacing: 6px;
    text-transform: uppercase;
    margin-top: 12px;
    display: block;
    animation: fadeInUp 1.2s ease-out 0.6s both;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 2px;
      background: ${({ theme }) => theme.colors.gradients.primary};
      border-radius: 2px;
      animation: expand 1s ease-out 1.5s both;
    }
  }

  @keyframes glow {
    0%, 100% { 
      filter: drop-shadow(0 0 20px rgba(0, 212, 170, 0.3)) drop-shadow(0 0 40px rgba(139, 92, 246, 0.2)); 
    }
    50% { 
      filter: drop-shadow(0 0 30px rgba(0, 212, 170, 0.6)) drop-shadow(0 0 60px rgba(139, 92, 246, 0.4)); 
    }
  }

  @keyframes fadeInUp {
    from { 
      opacity: 0; 
      transform: translateY(30px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }

  @keyframes expand {
    from { width: 0; }
    to { width: 60px; }
  }
`;

export const Title = styled.h2`
  font-size: 2.2rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  animation: fadeInUp 1.2s ease-out 0.8s both;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: ${({ theme }) => theme.colors.gradients.primary};
    border-radius: 3px;
    animation: expand 1s ease-out 1.8s both;
  }
`;

export const Subtitle = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  margin: 0 0 ${({ theme }) => theme.spacing.xxl} 0;
  animation: fadeInUp 1.2s ease-out 1s both;
  line-height: 1.6;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  animation: fadeInUp 1.2s ease-out 1.2s both;
`;

export const InputGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  transition: all ${({ theme }) => theme.transitions.normal};
  
  &:hover {
    transform: translateY(-2px);
  }
`;

export const Input = styled.input`
  width: 100%;
  background: ${({ theme }) => theme.colors.background.glass};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1.1rem;
  padding: 20px 24px;
  outline: none;
  transition: all ${({ theme }) => theme.transitions.normal};
  backdrop-filter: blur(20px);
  position: relative;
  
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.background.glassHover};
    box-shadow: 
      0 0 0 3px ${({ theme }) => theme.colors.border.focus},
      ${({ theme }) => theme.shadows.medium};
    transform: translateY(-3px);
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
    text-transform: uppercase;
    font-size: 0.9rem;
    letter-spacing: 1.5px;
    font-weight: 600;
    transition: all ${({ theme }) => theme.transitions.fast};
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.border.secondary};
    background: ${({ theme }) => theme.colors.background.glassHover};
    transform: translateY(-2px);
  }

  &:focus::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
    transform: translateY(-2px);
  }
`;

export const PasswordToggle = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.tertiary};
  cursor: pointer;
  padding: 12px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: all ${({ theme }) => theme.transitions.fast};
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.hover.primary};
    transform: translateY(-50%) scale(1.1);
  }
  
  &:active {
    transform: translateY(-50%) scale(0.95);
  }
`;

export const LoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: ${({ theme }) => theme.colors.gradients.button};
  color: ${({ theme }) => theme.colors.text.inverse};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: 22px 40px;
  font-size: 1.2rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  margin-top: ${({ theme }) => theme.spacing.xxl};
  position: relative;
  overflow: hidden;
  box-shadow: 
    ${({ theme }) => theme.shadows.medium},
    0 0 0 1px ${({ theme }) => theme.colors.border.primary};
  animation: fadeInUp 1.2s ease-out 1.4s both;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.6s ease;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 
      ${({ theme }) => theme.shadows.glow},
      0 0 0 1px ${({ theme }) => theme.colors.border.secondary};
    
    &::before {
      left: 100%;
    }
    
    &::after {
      width: 300px;
      height: 300px;
    }
  }
  
  &:active {
    transform: translateY(-2px) scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    
    &:hover {
      transform: none;
      box-shadow: ${({ theme }) => theme.shadows.medium};
    }
  }
`;

export const ErrorMessage = styled.div`
  background: ${({ theme }) => theme.colors.hover.danger};
  border: 1px solid ${({ theme }) => theme.colors.error};
  color: ${({ theme }) => theme.colors.error};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: 0.95rem;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  animation: fadeInUp 0.4s ease-out;
  backdrop-filter: blur(10px);
  font-weight: 600;
`;

export const SuccessMessage = styled.div`
  background: ${({ theme }) => theme.colors.hover.success};
  border: 1px solid ${({ theme }) => theme.colors.success};
  color: ${({ theme }) => theme.colors.success};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: 0.95rem;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  animation: fadeInUp 0.4s ease-out;
  backdrop-filter: blur(10px);
  font-weight: 600;
`;

export const Footer = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.xxl};
  animation: fadeInUp 1.2s ease-out 1.6s both;
  
  p {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: 1rem;
    margin: 0;
    font-weight: 500;
  }
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    font-weight: 700;
    position: relative;
    transition: all ${({ theme }) => theme.transitions.fast};
    
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: ${({ theme }) => theme.colors.gradients.primary};
      transition: width ${({ theme }) => theme.transitions.fast};
    }
    
    &:hover {
      color: ${({ theme }) => theme.colors.text.accent};
      
      &::after {
        width: 100%;
      }
    }
  }
`;
