import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Filter, Edit, Trash2, Loader2 } from 'lucide-react';
import { apiService, Product } from '../../services/api';
import { 
  Container, 
  Header, 
  Title, 
  Actions, 
  SearchContainer, 
  SearchInput, 
  CreateButton, 
  FilterButton,
  Content,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  ActionButton,
  StatusBadge,
  EmptyState,
  LoadingState,
  ErrorState
} from './styles';

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getProducts(1, 100, searchTerm);
      setProducts(response.data);
    } catch (err) {
      setError('Erro ao carregar produtos');
      console.error('Erro ao carregar produtos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteProduct = async (product: Product) => {
    if (window.confirm(`Tem certeza que deseja excluir o produto ${product.name}?`)) {
      try {
        await apiService.deleteProduct(product._id);
        loadProducts();
      } catch (err) {
        alert('Erro ao excluir produto');
        console.error('Erro ao excluir produto:', err);
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getStockStatus = (current: number, min: number) => {
    if (current === 0) return { status: 'Esgotado', color: '#ef4444' };
    if (current <= min) return { status: 'Baixo', color: '#f59e0b' };
    return { status: 'Disponível', color: '#10b981' };
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <Title>Produtos</Title>
          <Actions>
            <SearchContainer>
              <Search size={20} />
              <SearchInput placeholder="Pesquisar produtos..." disabled />
            </SearchContainer>
            <FilterButton disabled>
              <Filter size={20} />
              Filtros
            </FilterButton>
            <CreateButton disabled>
              <Plus size={20} />
              Novo Produto
            </CreateButton>
          </Actions>
        </Header>
        <Content>
          <LoadingState>
            <Loader2 size={32} />
            <p>Carregando produtos...</p>
          </LoadingState>
        </Content>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header>
          <Title>Produtos</Title>
          <Actions>
            <SearchContainer>
              <Search size={20} />
              <SearchInput placeholder="Pesquisar produtos..." disabled />
            </SearchContainer>
            <FilterButton disabled>
              <Filter size={20} />
              Filtros
            </FilterButton>
            <CreateButton disabled>
              <Plus size={20} />
              Novo Produto
            </CreateButton>
          </Actions>
        </Header>
        <Content>
          <ErrorState>
            <p>{error}</p>
            <button onClick={loadProducts}>Tentar novamente</button>
          </ErrorState>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Produtos</Title>
        <Actions>
          <SearchContainer>
            <Search size={20} />
            <SearchInput 
              placeholder="Pesquisar produtos..." 
              value={searchTerm}
              onChange={handleSearch}
            />
          </SearchContainer>
          <FilterButton>
            <Filter size={20} />
            Filtros
          </FilterButton>
          <CreateButton>
            <Plus size={20} />
            Novo Produto
          </CreateButton>
        </Actions>
      </Header>
      
      <Content>
        {products.length === 0 ? (
          <EmptyState>
            <Package size={48} />
            <h3>Nenhum produto encontrado</h3>
            <p>Comece criando seu primeiro produto</p>
            <CreateButton>
              <Plus size={20} />
              Novo Produto
            </CreateButton>
          </EmptyState>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Produto</TableCell>
                <TableCell>Categoria</TableCell>
                <TableCell>Preço</TableCell>
                <TableCell>Estoque</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                const stockStatus = getStockStatus(product.stock.current, product.stock.min);
                
                return (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div>
                        <strong>{product.name}</strong>
                        {product.description && (
                          <div style={{ fontSize: '0.9rem', color: '#666' }}>
                            {product.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <strong style={{ color: '#10b981' }}>
                        {formatPrice(product.price)}
                      </strong>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div style={{ fontWeight: 600 }}>
                          {product.stock.current} unidades
                        </div>
                        <div style={{ 
                          fontSize: '0.9rem', 
                          color: stockStatus.color,
                          fontWeight: 500
                        }}>
                          {stockStatus.status}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>
                          Mín: {product.stock.min}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge $isActive={product.isActive}>
                        {product.isActive ? 'Ativo' : 'Inativo'}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      <ActionButton>
                        <Edit size={16} />
                      </ActionButton>
                      <ActionButton onClick={() => handleDeleteProduct(product)}>
                        <Trash2 size={16} />
                      </ActionButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Content>
    </Container>
  );
};
