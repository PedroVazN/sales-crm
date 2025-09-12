import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
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
  Footer 
} from './styles';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementaria a lógica de autenticação
    navigate('/');
  };

  return (
    <Container>
      <LoginCard>
        <Logo>
          <h1>SalesOne</h1>
          <span>CRM</span>
        </Logo>
        
        <Title>Bem-vindo de volta</Title>
        <Subtitle>Faça login para acessar sua conta</Subtitle>
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Input
              type="email"
              placeholder="EMAIL / USUÁRIO"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>
          
          <InputGroup>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="SENHA"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </PasswordToggle>
          </InputGroup>
          
          <LoginButton type="submit">
            <LogIn size={20} />
            ENTRAR
          </LoginButton>
        </Form>
        
        <Footer>
          <p>Esqueceu sua senha? <a href="#">Recuperar</a></p>
        </Footer>
      </LoginCard>
    </Container>
  );
};
