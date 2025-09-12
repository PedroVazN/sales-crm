import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, Search, Filter, Edit, Trash2, Loader2 } from 'lucide-react';
import { apiService, PriceListItem, Distributor, Product } from '../../services/api';
import { PriceListModal } from '../../components/PriceListModal';
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

export const PriceList: React.FC = () => {
  const [priceList, setPriceList] = useState<PriceListItem[]>([]);
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPriceItem, setEditingPriceItem] = useState<PriceListItem | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [priceListResponse, distributorsResponse, productsResponse] = await Promise.all([
        apiService.getPriceList(1, 100),
        apiService.getDistributors(1, 100),
        apiService.getProducts(1, 100)
      ]);
      
      setPriceList(priceListResponse.data);
      setDistributors(distributorsResponse.data);
      setProducts(productsResponse.data);
    } catch (err) {
      setError('Erro ao carregar dados');
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCreatePriceList = () => {
    setEditingPriceItem(null);
    setShowModal(true);
  };

  const handleEditPriceItem = (priceItem: PriceListItem) => {
    setEditingPriceItem(priceItem);
    setShowModal(true);
  };

  const handleDeletePriceItem = async (priceItem: PriceListItem) => {
    if (window.confirm(`Tem certeza que deseja excluir este item da lista de preços?`)) {
      try {
        await apiService.deletePriceListItem(priceItem._id);
        loadData();
      } catch (err) {
        alert('Erro ao excluir item');
        console.error('Erro ao excluir item:', err);
      }
    }
  };

  const handleSavePriceItem = (priceItem: PriceListItem) => {
    // Recarregar os dados para mostrar os novos itens
    loadData();
    setShowModal(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const filteredPriceList = priceList.filter(item => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      item.distributor?.apelido?.toLowerCase().includes(search) ||
      item.product?.name?.toLowerCase().includes(search) ||
      item.product?.description?.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <Container>
        <Header>
          <Title>Lista de Preços</Title>
          <Actions>
            <SearchContainer>
              <Search size={20} />
              <SearchInput placeholder="Pesquisar preços..." disabled />
            </SearchContainer>
            <FilterButton disabled>
              <Filter size={20} />
              Filtros
            </FilterButton>
            <CreateButton disabled>
              <Plus size={20} />
              Nova Lista
            </CreateButton>
          </Actions>
        </Header>
        <Content>
          <LoadingState>
            <Loader2 size={32} />
            <p>Carregando lista de preços...</p>
          </LoadingState>
        </Content>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header>
          <Title>Lista de Preços</Title>
          <Actions>
            <SearchContainer>
              <Search size={20} />
              <SearchInput placeholder="Pesquisar preços..." disabled />
            </SearchContainer>
            <FilterButton disabled>
              <Filter size={20} />
              Filtros
            </FilterButton>
            <CreateButton disabled>
              <Plus size={20} />
              Nova Lista
            </CreateButton>
          </Actions>
        </Header>
        <Content>
          <ErrorState>
            <p>{error}</p>
            <button onClick={loadData}>Tentar novamente</button>
          </ErrorState>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Lista de Preços</Title>
        <Actions>
          <SearchContainer>
            <Search size={20} />
            <SearchInput 
              placeholder="Pesquisar preços..." 
              value={searchTerm}
              onChange={handleSearch}
            />
          </SearchContainer>
          <FilterButton>
            <Filter size={20} />
            Filtros
          </FilterButton>
            <CreateButton onClick={handleCreatePriceList}>
              <Plus size={20} />
              Nova Lista de Preços
            </CreateButton>
        </Actions>
      </Header>
      
      <Content>
        {filteredPriceList.length === 0 ? (
          <EmptyState>
            <DollarSign size={48} />
            <h3>Nenhum preço encontrado</h3>
            <p>Comece criando sua primeira lista de preços</p>
            <CreateButton onClick={handleCreatePriceList}>
              <Plus size={20} />
              Nova Lista de Preços
            </CreateButton>
          </EmptyState>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Distribuidor</TableCell>
                <TableCell>Produto</TableCell>
                <TableCell>Preços</TableCell>
                <TableCell>Válido Até</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPriceList.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <div>
                      <strong>{item.distributor?.apelido || 'N/A'}</strong>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>
                        {item.distributor?.razaoSocial || 'N/A'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <strong>{item.product?.name || 'N/A'}</strong>
                      {item.product?.description && (
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>
                          {item.product.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {item.pricing?.aVista > 0 && (
                        <div style={{ fontSize: '0.875rem' }}>
                          <span style={{ color: '#10b981', fontWeight: '600' }}>À Vista: </span>
                          {formatCurrency(item.pricing.aVista)}
                        </div>
                      )}
                      {item.pricing?.tresXBoleto > 0 && (
                        <div style={{ fontSize: '0.875rem' }}>
                          <span style={{ color: '#3b82f6', fontWeight: '600' }}>3x Boleto: </span>
                          {formatCurrency(item.pricing.tresXBoleto)}
                        </div>
                      )}
                      {item.pricing?.tresXCartao > 0 && (
                        <div style={{ fontSize: '0.875rem' }}>
                          <span style={{ color: '#8b5cf6', fontWeight: '600' }}>3x Cartão: </span>
                          {formatCurrency(item.pricing.tresXCartao)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.validUntil ? formatDate(item.validUntil) : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <StatusBadge $isActive={item.isActive}>
                      {item.isActive ? 'Ativo' : 'Inativo'}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <ActionButton onClick={() => handleEditPriceItem(item)}>
                      <Edit size={16} />
                    </ActionButton>
                    <ActionButton onClick={() => handleDeletePriceItem(item)}>
                      <Trash2 size={16} />
                    </ActionButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Content>

      <PriceListModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSavePriceItem}
        distributors={distributors}
        products={products}
        priceItem={editingPriceItem}
      />
    </Container>
  );
};
