import React from 'react';
import { DollarSign, Plus, Search, Filter } from 'lucide-react';
import { 
  Container, 
  Header, 
  Title, 
  Actions, 
  SearchContainer, 
  SearchInput, 
  CreateButton, 
  FilterButton,
  Content
} from './styles';

export const PriceList: React.FC = () => {
  return (
    <Container>
      <Header>
        <Title>Lista de Preços</Title>
        <Actions>
          <SearchContainer>
            <Search size={20} />
            <SearchInput placeholder="Pesquisar preços..." />
          </SearchContainer>
          <FilterButton>
            <Filter size={20} />
            Filtros
          </FilterButton>
          <CreateButton>
            <Plus size={20} />
            Nova Lista
          </CreateButton>
        </Actions>
      </Header>
      
      <Content>
        <p>Conteúdo da página de Lista de Preços será implementado aqui.</p>
      </Content>
    </Container>
  );
};
