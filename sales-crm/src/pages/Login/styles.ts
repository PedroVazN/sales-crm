import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
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
      radial-gradient(circle at 20% 80%, rgba(0, 212, 170, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(236, 72, 153, 0.1) 0%, transparent 50%);
    animation: float 20s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-20px) rotate(1deg); }
    66% { transform: translateY(10px) rotate(-1deg); }
  }
`;

export const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: ${({ theme }) => theme.spacing.xxl};
  width: 100%;
  max-width: 420px;
  backdrop-filter: blur(20px);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0, 212, 170, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%);
    border-radius: 24px;
    z-index: -1;
  }
`;

export const Logo = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  position: relative;
  
  h1 {
    font-size: 3.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, #00d4aa 0%, #6366f1 50%, #ec4899 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
    text-shadow: 0 0 40px rgba(0, 212, 170, 0.3);
    animation: glow 2s ease-in-out infinite alternate;
    letter-spacing: -2px;
  }
  
  span {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.7);
    font-weight: 600;
    letter-spacing: 4px;
    text-transform: uppercase;
    margin-top: 8px;
    display: block;
    animation: fadeInUp 1s ease-out 0.5s both;
  }

  @keyframes glow {
    from { filter: drop-shadow(0 0 20px rgba(0, 212, 170, 0.3)); }
    to { filter: drop-shadow(0 0 30px rgba(0, 212, 170, 0.6)); }
  }

  @keyframes fadeInUp {
    from { 
      opacity: 0; 
      transform: translateY(20px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
`;

export const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  animation: fadeInUp 1s ease-out 0.7s both;
`;

export const Subtitle = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  margin: 0 0 ${({ theme }) => theme.spacing.xxl} 0;
  animation: fadeInUp 1s ease-out 0.9s both;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const InputGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const Input = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  padding: 16px 20px;
  outline: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:focus {
    border-color: #00d4aa;
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 
      0 0 0 3px rgba(0, 212, 170, 0.1),
      0 8px 25px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
    font-size: 0.8rem;
    letter-spacing: 1px;
    font-weight: 500;
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.06);
  }
`;

export const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    color: #00d4aa;
    background: rgba(0, 212, 170, 0.1);
  }
`;

export const LoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: linear-gradient(135deg, #00d4aa 0%, #6366f1 100%);
  color: white;
  border: none;
  border-radius: 16px;
  padding: 18px 32px;
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 32px;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 8px 25px rgba(0, 212, 170, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 
      0 15px 35px rgba(0, 212, 170, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.2);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fca5a5;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const SuccessMessage = styled.div`
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #86efac;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const Footer = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.xl};
  
  p {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: 0.875rem;
    margin: 0;
  }
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;
