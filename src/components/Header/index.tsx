import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { 
  Container, 
  SearchContainer, 
  SearchInput, 
  ActionsContainer, 
  NotificationButton, 
  UserButton,
  NotificationBadge
} from './styles';

export const Header: React.FC = () => {
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
        
        <UserButton>
          <User size={20} />
          <span>Usuário</span>
        </UserButton>
      </ActionsContainer>
    </Container>
  );
};
