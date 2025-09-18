import React, { useState } from 'react';
import { Bell, Search, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Container, 
  SearchContainer, 
  SearchInput, 
  ActionsContainer, 
  NotificationButton, 
  UserButton,
  NotificationBadge,
  UserMenu,
  UserMenuItem
} from './styles';

export const Header: React.FC = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container>
      <SearchContainer>
        <Search size={20} />
        <SearchInput placeholder="Pesquisar..." />
      </SearchContainer>
      
      <ActionsContainer>
        <NotificationButton>
          <Bell size={20} />
          <NotificationBadge>3</NotificationBadge>
        </NotificationButton>
        
        <UserButton onClick={() => setShowUserMenu(!showUserMenu)}>
          <User size={20} />
          <span>{user?.name || 'Usuário'}</span>
          <span style={{ fontSize: '12px', opacity: 0.7 }}>
            ({user?.role === 'admin' ? 'Administrador' : 'Vendedor'})
          </span>
          {showUserMenu && (
            <UserMenu>
              <UserMenuItem onClick={handleLogout}>
                <LogOut size={16} />
                Sair
              </UserMenuItem>
            </UserMenu>
          )}
        </UserButton>
      </ActionsContainer>
    </Container>
  );
};
