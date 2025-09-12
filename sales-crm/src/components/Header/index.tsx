import React, { useState } from 'react';
import { Bell, Search, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import { useAuth } from '../../App';
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
  const currentUser = apiService.getCurrentUser();
  const { setIsAuthenticated } = useAuth();

  const handleLogout = async () => {
    await apiService.logout();
    setIsAuthenticated(false); // Atualizar estado de autenticação
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
          <span>{currentUser?.name || 'Usuário'}</span>
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
