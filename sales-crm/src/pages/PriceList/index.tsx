import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, Search, Filter, Edit, Trash2, Loader2, ChevronDown, ChevronRight } from 'lucide-react';
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
  ErrorState,
  DistributorGroup,
  DistributorHeader,
  DistributorInfo,
  DistributorName,
  DistributorDetails,
  ProductCount,
  ToggleButton,
  ProductsList,
  ProductRow,
  ProductInfo,
  ProductName,
  ProductDescription,
  PricingInfo,
  PriceItem,
  PriceLabel,
  PriceValue,
  ProductActions
} from './styles';

interface GroupedPriceList {
  distributor: Distributor;
  products: PriceListItem[];
}

export const PriceList: React.FC = () => {
  const [priceList, setPriceList] = useState<GroupedPriceList[]>([]);
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPriceItem, setEditingPriceItem] = useState<PriceListItem | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [deletingItems, setDeletingItems] = useState<string[]>([]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Verificar se está autenticado
      if (!apiService.isAuthenticated()) {
        console.log('Usuário não autenticado');
        setError('Usuário não autenticado. Faça login para continuar.');
        return;
      }
      
      console.log('Usuário autenticado, carregando dados...');
      
      const [priceListResponse, distributorsResponse, productsResponse] = await Promise.all([
        apiService.getPriceList(1, 100),
        apiService.getDistributors(1, 100),
        apiService.getProducts(1, 100)
      ]);
      
      // O backend retorna dados já agrupados
      const groupedData = priceListResponse.data as unknown as GroupedPriceList[];
      console.log('Dados agrupados recebidos:', groupedData);
      
      // Verificar se os dados estão no formato correto
      if (Array.isArray(groupedData) && groupedData.length > 0) {
        // Verificar se cada item tem a estrutura correta
        const validData = groupedData.filter(group => 
          group && 
          group.distributor && 
          group.products && 
          Array.isArray(group.products)
        );
        
        console.log('Dados válidos após filtro:', validData);
        setPriceList(validData);
        
        // Expandir todos os grupos por padrão
        const allDistributorIds = new Set<string>();
        validData.forEach(group => {
          allDistributorIds.add(group.distributor._id.toString());
        });
        setExpandedGroups(allDistributorIds);
      } else {
        console.log('Nenhum dado válido encontrado');
        setPriceList([]);
        setExpandedGroups(new Set());
      }
      
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
        console.log('Deletando item:', priceItem._id);
        
        // Adicionar item à lista de itens sendo deletados
        setDeletingItems(prev => [...prev, priceItem._id]);
        
        // Fazer a requisição para o backend
        const response = await apiService.deletePriceListItem(priceItem._id);
        console.log('Resposta da API:', response);
        
        if (response.success || response.message) {
          console.log('Item deletado com sucesso no backend');
          
          // Remover item da lista de itens sendo deletados
          setDeletingItems(prev => prev.filter(id => id !== priceItem._id));
          
          // Forçar recarregamento imediato dos dados
          console.log('Recarregando dados imediatamente...');
          await loadData();
          
          // Mostrar mensagem de sucesso
          alert('Item excluído com sucesso!');
        } else {
          throw new Error('Resposta inválida da API');
        }
      } catch (err) {
        console.error('Erro ao excluir item:', err);
        alert(`Erro ao excluir item: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
        
        // Remover item da lista de itens sendo deletados em caso de erro
        setDeletingItems(prev => prev.filter(id => id !== priceItem._id));
      }
    }
  };

  const handleSavePriceItem = async (priceItem: PriceListItem) => {
    try {
      console.log('Salvando item:', priceItem);
      
      if (editingPriceItem) {
        // Editando item existente
        console.log('Editando item existente');
        await apiService.updatePriceListItem(priceItem._id, priceItem);
        console.log('Item editado com sucesso');
      } else {
        // Criando novo item
        console.log('Criando novo item');
        await apiService.createPriceListItem({
          distributor: priceItem.distributor._id,
          product: priceItem.product._id,
          pricing: priceItem.pricing,
          isActive: priceItem.isActive,
          validFrom: priceItem.validFrom,
          validUntil: priceItem.validUntil,
          notes: priceItem.notes
        });
        console.log('Item criado com sucesso');
      }
      
      // Recarregar os dados para mostrar as mudanças
      loadData();
      setShowModal(false);
    } catch (err) {
      console.error('Erro ao salvar item:', err);
      alert(`Erro ao salvar item: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    }
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

  const toggleGroup = (distributorId: string) => {
    setExpandedGroups(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(distributorId)) {
        newExpanded.delete(distributorId);
      } else {
        newExpanded.add(distributorId);
      }
      return newExpanded;
    });
  };

  const filteredPriceList = priceList.filter(group => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      group.distributor?.apelido?.toLowerCase().includes(search) ||
      group.distributor?.razaoSocial?.toLowerCase().includes(search) ||
      group.products.some(product => 
        product.product?.name?.toLowerCase().includes(search) ||
        product.product?.description?.toLowerCase().includes(search)
      )
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
          <div>
            {filteredPriceList.map((group, groupIndex) => {
              console.log(`Renderizando grupo ${groupIndex}:`, group);
              const distributorId = group.distributor._id.toString();
              const isExpanded = expandedGroups.has(distributorId);
              
              return (
                <DistributorGroup key={distributorId}>
                  <DistributorHeader onClick={() => toggleGroup(distributorId)}>
                    <DistributorInfo>
                      <DistributorName>{group.distributor.apelido || 'N/A'}</DistributorName>
                      <DistributorDetails>{group.distributor.razaoSocial || 'N/A'}</DistributorDetails>
                    </DistributorInfo>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <ProductCount>{group.products.length} produto{group.products.length !== 1 ? 's' : ''}</ProductCount>
                      <ToggleButton>
                        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                      </ToggleButton>
                    </div>
                  </DistributorHeader>
                  
                  {isExpanded && (
                    <ProductsList>
                      {group.products.map((product) => {
                        const isDeleting = deletingItems.includes(product._id);
                        return (
                          <ProductRow key={product._id} style={{ opacity: isDeleting ? 0.5 : 1 }}>
                            <ProductInfo>
                              <ProductName>{product.product?.name || 'N/A'}</ProductName>
                              {product.product?.description && (
                                <ProductDescription>{product.product.description}</ProductDescription>
                              )}
                            </ProductInfo>
                          
                          <PricingInfo>
                            {product.pricing?.aVista > 0 && (
                              <PriceItem>
                                <PriceLabel $color="#10b981">À Vista:</PriceLabel>
                                <PriceValue>{formatCurrency(product.pricing.aVista)}</PriceValue>
                              </PriceItem>
                            )}
                            {product.pricing?.tresXBoleto > 0 && (
                              <PriceItem>
                                <PriceLabel $color="#3b82f6">3x Boleto:</PriceLabel>
                                <PriceValue>{formatCurrency(product.pricing.tresXBoleto)}</PriceValue>
                              </PriceItem>
                            )}
                            {product.pricing?.tresXCartao > 0 && (
                              <PriceItem>
                                <PriceLabel $color="#8b5cf6">3x Cartão:</PriceLabel>
                                <PriceValue>{formatCurrency(product.pricing.tresXCartao)}</PriceValue>
                              </PriceItem>
                            )}
                          </PricingInfo>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                            <div style={{ fontSize: '0.875rem', color: '#666' }}>
                              {product.validUntil ? formatDate(product.validUntil) : 'N/A'}
                            </div>
                            <StatusBadge $isActive={product.isActive}>
                              {product.isActive ? 'Ativo' : 'Inativo'}
                            </StatusBadge>
                          </div>
                          
                          <ProductActions>
                            <ActionButton 
                              onClick={() => handleEditPriceItem(product)}
                              disabled={isDeleting}
                            >
                              <Edit size={16} />
                            </ActionButton>
                            <ActionButton 
                              onClick={() => handleDeletePriceItem(product)}
                              disabled={isDeleting}
                            >
                              {isDeleting ? <Loader2 size={16} /> : <Trash2 size={16} />}
                            </ActionButton>
                          </ProductActions>
                        </ProductRow>
                        );
                      })}
                    </ProductsList>
                  )}
                </DistributorGroup>
              );
            })}
          </div>
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
