import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Filter, Edit, Trash2, Eye, Star, TrendingUp, DollarSign } from 'lucide-react';
import { apiService } from '../../services/api';
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
  ProductsGrid,
  ProductCard,
  ProductImage,
  ProductInfo,
  ProductName,
  ProductCategory,
  ProductPrice,
  ProductStock,
  ProductActions,
  ActionButton,
  ProductStats,
  StatItem,
  StatValue,
  StatLabel,
  LoadingContainer,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription
} from './styles';

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: {
    current: number;
    min: number;
  };
  isActive: boolean;
  createdAt: string;
}

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [products, searchTerm]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getProducts(1, 50);
      setProducts(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setIsLoading(false);
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

  if (isLoading) {
    return (
      <Container>
        <LoadingContainer>
          <Package size={48} className="animate-spin" />
          <p>Carregando produtos...</p>
        </LoadingContainer>
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
              onChange={(e) => setSearchTerm(e.target.value)}
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
        {filteredProducts.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <Package size={64} />
            </EmptyIcon>
            <EmptyTitle>Nenhum produto encontrado</EmptyTitle>
            <EmptyDescription>
              {searchTerm ? 'Tente ajustar sua pesquisa' : 'Comece adicionando seu primeiro produto'}
            </EmptyDescription>
          </EmptyState>
        ) : (
          <ProductsGrid>
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.stock.current, product.stock.min);
              
              return (
                <ProductCard key={product._id}>
                  <ProductImage>
                    <Package size={40} />
                  </ProductImage>
                  
                  <ProductInfo>
                    <ProductName>{product.name}</ProductName>
                    <ProductCategory>{product.category}</ProductCategory>
                    <ProductPrice>{formatPrice(product.price)}</ProductPrice>
                    <ProductStock $color={stockStatus.color}>
                      {product.stock.current} unidades - {stockStatus.status}
                    </ProductStock>
                  </ProductInfo>
                  
                  <ProductStats>
                    <StatItem>
                      <StatValue>R$ {(product.price * product.stock.current).toLocaleString('pt-BR')}</StatValue>
                      <StatLabel>Valor Total</StatLabel>
                    </StatItem>
                    <StatItem>
                      <StatValue>{product.stock.min}</StatValue>
                      <StatLabel>Estoque Mín.</StatLabel>
                    </StatItem>
                  </ProductStats>
                  
                  <ProductActions>
                    <ActionButton $variant="view">
                      <Eye size={16} />
                    </ActionButton>
                    <ActionButton $variant="edit">
                      <Edit size={16} />
                    </ActionButton>
                    <ActionButton $variant="delete">
                      <Trash2 size={16} />
                    </ActionButton>
                  </ProductActions>
                </ProductCard>
              );
            })}
          </ProductsGrid>
        )}
      </Content>
    </Container>
  );
};
