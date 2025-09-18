import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Container, 
  LoginCard, 
  Logo, 
  Title, 
  Subtitle, 
  Form, 
  InputGroup, 
  Input, 
  PasswordToggle, 
  LoginButton, 
  Footer,
  ErrorMessage,
  SuccessMessage
} from './styles';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const success = await login(email, password);
      
      if (success) {
        setSuccess('Login realizado com sucesso!');
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setError('Email ou senha incorretos');
      }
    } catch (error) {
      setError('Erro de conexão. Verifique se o servidor está rodando.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <LoginCard>
        <Logo>
          <h1>Sell.On</h1>
          <span>CRM</span>
        </Logo>
        
        <Title>Bem-vindo de volta</Title>
        <Subtitle>Faça login para acessar sua conta</Subtitle>
        
        <Form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
          
          <InputGroup>
            <Input
              type="email"
              placeholder="EMAIL / USUÁRIO"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </InputGroup>
          
          <InputGroup>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="SENHA"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </PasswordToggle>
          </InputGroup>
          
          <LoginButton type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <LogIn size={20} />}
            {isLoading ? 'ENTRANDO...' : 'ENTRAR'}
          </LoginButton>
        </Form>
        
        <Footer>
          <p>Esqueceu sua senha? <a href="#">Recuperar</a></p>
        </Footer>
      </LoginCard>
    </Container>
  );
};
