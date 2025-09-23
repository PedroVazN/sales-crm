import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Plus, Search, Trash2, Loader2, Download } from 'lucide-react';
import { apiService, PriceList as PriceListType } from '../../services/api';
import { 
  Container, 
  Header, 
  Title, 
  Actions, 
  SearchContainer, 
  SearchInput, 
  CreateButton, 
  Content,
  TableWrapper,
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
  const navigate = useNavigate();
  const [priceLists, setPriceLists] = useState<PriceListType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingItems, setDeletingItems] = useState<string[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  
  // Force hot reload update - no modal references

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Carregando dados...');
      
      const priceListResponse = await apiService.getPriceList(1, 100);
      
      console.log('Resposta da API:', priceListResponse);
      
      setPriceLists(priceListResponse.data || []);
      
      console.log('Dados carregados:', {
        priceLists: priceListResponse.data?.length || 0
      });
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
    navigate('/price-list/new');
  };

  const toggleRow = (distributorId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(distributorId)) {
        newSet.delete(distributorId);
      } else {
        newSet.add(distributorId);
      }
      return newSet;
    });
  };

  const handleDeletePriceList = async (priceList: PriceListType) => {
    if (window.confirm(`Tem certeza que deseja excluir esta lista de preços?`)) {
      try {
        setDeletingItems(prev => [...prev, priceList._id]);
        
        await apiService.deletePriceList(priceList._id);
        
        setDeletingItems(prev => prev.filter(id => id !== priceList._id));
        await loadData();
        
        alert('Lista de preços excluída com sucesso!');
      } catch (err) {
        console.error('Erro ao excluir lista:', err);
        alert(`Erro ao excluir lista: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
        setDeletingItems(prev => prev.filter(id => id !== priceList._id));
      }
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

  const exportToCSV = () => {
    const csvData = [];
    
    // Cabeçalho
    csvData.push([
      'Distribuidor',
      'Razão Social',
      'Produto',
      'Categoria',
      'À Vista',
      '3x Cartão',
      '3x Boleto',
      'Status',
      'Válido De',
      'Válido Até',
      'Observações',
      'Data Criação'
    ]);

    // Dados
    priceLists.forEach(priceList => {
      priceList.products.forEach(product => {
        csvData.push([
          priceList.distributor.apelido,
          priceList.distributor.razaoSocial,
          product.product.name,
          product.product.category,
          formatCurrency(product.pricing.aVista),
          formatCurrency(product.pricing.cartao),
          formatCurrency(product.pricing.boleto),
          product.isActive ? 'Ativo' : 'Inativo',
          formatDate(product.validFrom),
          formatDate(product.validUntil),
          product.notes || '',
          formatDate(priceList.createdAt)
        ]);
      });
    });

    // Converter para CSV
    const csvContent = csvData.map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `lista_precos_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredPriceLists = priceLists.filter(priceList => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      priceList.distributor?.apelido?.toLowerCase().includes(search) ||
      priceList.distributor?.razaoSocial?.toLowerCase().includes(search) ||
      priceList.products.some(product => 
        product.product?.name?.toLowerCase().includes(search)
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
              <SearchInput placeholder="Pesquisar listas..." disabled />
            </SearchContainer>
            <CreateButton disabled>
              <Plus size={20} />
              Nova Lista
            </CreateButton>
          </Actions>
        </Header>
        <Content>
          <LoadingState>
            <Loader2 size={32} />
            <p>Carregando listas de preços...</p>
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
              <SearchInput placeholder="Pesquisar listas..." disabled />
            </SearchContainer>
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
              placeholder="Pesquisar listas..." 
              value={searchTerm || ''}
              onChange={handleSearch}
            />
          </SearchContainer>
          <CreateButton onClick={exportToCSV} style={{ backgroundColor: '#10b981', marginRight: '0.5rem' }}>
            <Download size={20} />
            Exportar CSV
          </CreateButton>
            <CreateButton onClick={handleCreatePriceList}>
              <Plus size={20} />
              Nova Lista de Preços
            </CreateButton>
        </Actions>
      </Header>
      
      <Content>
        {filteredPriceLists.length === 0 ? (
          <EmptyState>
            <DollarSign size={48} />
            <h3>Nenhuma lista de preços encontrada</h3>
            <p>Comece criando sua primeira lista de preços</p>
            <CreateButton onClick={handleCreatePriceList}>
              <Plus size={20} />
              Nova Lista de Preços
            </CreateButton>
          </EmptyState>
        ) : (
          <TableWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Distribuidor</TableCell>
                  <TableCell>Razão Social</TableCell>
                  <TableCell>Produto</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>À Vista</TableCell>
                  <TableCell>3x Cartão</TableCell>
                  <TableCell>3x Boleto</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Válido De</TableCell>
                  <TableCell>Válido Até</TableCell>
                  <TableCell>Observações</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPriceLists.map((priceList) => {
                  const isExpanded = expandedRows.has(priceList._id);
                  const isDeleting = deletingItems.includes(priceList._id);
                  
                  return (
                    <React.Fragment key={priceList._id}>
                      {/* Linha do Distribuidor */}
                      <TableRow 
                        style={{ 
                          opacity: isDeleting ? 0.5 : 1,
                          cursor: 'pointer',
                          backgroundColor: isExpanded ? '#374151' : '#1f2937'
                        }}
                        onClick={() => toggleRow(priceList._id)}
                      >
                        <TableCell colSpan={12}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <div style={{ fontSize: '1.2rem', color: '#60a5fa' }}>
                                {isExpanded ? '▼' : '▶'}
                              </div>
                              <div>
                                <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#f9fafb' }}>
                                  {priceList.distributor.apelido}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: '#d1d5db' }}>
                                  {priceList.distributor.razaoSocial}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                  {priceList.products.length} produto(s)
                                </div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <ActionButton 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeletePriceList(priceList);
                                }}
                                disabled={isDeleting}
                                title="Excluir Lista"
                              >
                                {isDeleting ? <Loader2 size={16} /> : <Trash2 size={16} />}
                              </ActionButton>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>

                      {/* Linhas dos Produtos (quando expandido) */}
                      {isExpanded && priceList.products.map((product, productIndex) => (
                        <TableRow key={`${priceList._id}-${product._id}`} style={{ backgroundColor: '#374151' }}>
                          <TableCell>
                            <div style={{ paddingLeft: '2rem', fontSize: '0.875rem', color: '#d1d5db' }}>
                              {product.product.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div style={{ fontSize: '0.875rem', color: '#d1d5db' }}>
                              {product.product.category}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div style={{ fontWeight: 'bold', color: '#10b981' }}>
                              {formatCurrency(product.pricing.aVista)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div style={{ fontWeight: 'bold', color: '#3b82f6' }}>
                              {formatCurrency(product.pricing.cartao)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div style={{ fontWeight: 'bold', color: '#8b5cf6' }}>
                              {formatCurrency(product.pricing.boleto)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <StatusBadge $isActive={product.isActive}>
                              {product.isActive ? 'Ativo' : 'Inativo'}
                            </StatusBadge>
                          </TableCell>
                          <TableCell>
                            <div style={{ fontSize: '0.875rem', color: '#d1d5db' }}>
                              {formatDate(product.validFrom)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div style={{ fontSize: '0.875rem', color: '#d1d5db' }}>
                              {formatDate(product.validUntil)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div style={{ fontSize: '0.875rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', color: '#d1d5db' }}>
                              {product.notes || '-'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <ActionButton 
                                onClick={() => handleDeletePriceList(priceList)}
                                disabled={isDeleting}
                                title="Excluir Item"
                              >
                                {isDeleting ? <Loader2 size={16} /> : <Trash2 size={16} />}
                              </ActionButton>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableWrapper>
        )}
      </Content>

    </Container>
  );
};