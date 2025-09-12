import React, { useState, useEffect } from 'react';
import { apiService, PriceListItem, Distributor, Product } from '../../services/api';
import { PriceListModal } from '../../components/PriceListModal/index';
import { 
  PageContainer, 
  PageHeader, 
  PageTitle, 
  PageSubtitle, 
  PageContent 
} from '../../components/Base/PageContainer';
import { Button, IconButton } from '../../components/Base/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Base/Card';
import { SearchInput, Select } from '../../components/Base/Input';
import { 
  ActionsBar,
  PriceListGrid,
  PriceListCard,
  PriceListHeader,
  PriceListDistributor,
  PriceListProduct,
  PriceListPricing,
  PricingItem,
  PriceListStatus,
  PriceListActions,
  EmptyState,
  LoadingContainer
} from './styles';
import { Plus, Search, Eye, Edit, Trash2, Building2, Package, Loader2 } from 'lucide-react';

const statusOptions = [
  { value: '', label: 'Todos os status' },
  { value: 'true', label: 'Ativo' },
  { value: 'false', label: 'Inativo' }
];

export const PriceList: React.FC = () => {
  const [priceList, setPriceList] = useState<PriceListItem[]>([]);
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [distributorFilter, setDistributorFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadPriceList();
    loadDistributors();
    loadProducts();
  }, [currentPage, statusFilter, distributorFilter, searchTerm]);

  const loadPriceList = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getPriceList(
        currentPage, 
        10, 
        distributorFilter || undefined,
        undefined,
        statusFilter ? statusFilter === 'true' : undefined
      );
      
      setPriceList(response.data);
      setTotalPages(response.pagination?.pages || 1);
    } catch (error) {
      console.error('Erro ao carregar lista de preços:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDistributors = async () => {
    try {
      const response = await apiService.getDistributors(1, 100);
      setDistributors(response.data);
    } catch (error) {
      console.error('Erro ao carregar distribuidores:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await apiService.getProducts(1, 100);
      setProducts(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleDistributorFilter = (value: string) => {
    setDistributorFilter(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar este item da lista de preços?')) {
      try {
        await apiService.deletePriceListItem(id);
        loadPriceList();
      } catch (error) {
        console.error('Erro ao deletar item:', error);
      }
    }
  };

  const handleStatusChange = async (id: string, isActive: boolean) => {
    try {
      await apiService.updatePriceListItem(id, { isActive });
      loadPriceList();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleCreatePriceItem = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSavePriceItem = (priceItem: PriceListItem) => {
    setPriceList(prev => [priceItem, ...prev]);
    setIsModalOpen(false);
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

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <Loader2 size={48} className="animate-spin" />
          <p>Carregando lista de preços...</p>
        </LoadingContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <div>
          <PageTitle>Lista de Preços</PageTitle>
          <PageSubtitle>Gerencie preços por distribuidor e produto</PageSubtitle>
        </div>
        <Button 
          onClick={handleCreatePriceItem}
          variant="primary"
        >
          <Plus size={20} />
          Novo Preço
        </Button>
      </PageHeader>

      <PageContent>
        <ActionsBar>
          <SearchInput>
            <Search size={20} />
            <input
              placeholder="Buscar por produto..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </SearchInput>
          
          <Select
            value={distributorFilter}
            onChange={(e) => handleDistributorFilter(e.target.value)}
          >
            <option value="">Todos os distribuidores</option>
            {distributors.map(distributor => (
              <option key={distributor._id} value={distributor._id}>
                {distributor.apelido} - {distributor.razaoSocial}
              </option>
            ))}
          </Select>
          
          <Select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </ActionsBar>

      {priceList.length === 0 ? (
        <EmptyState>
          <div>
            <h3>Nenhum preço cadastrado</h3>
            <p>
              {searchTerm || distributorFilter || statusFilter 
                ? 'Tente ajustar os filtros de busca' 
                : 'Cadastre preços por distribuidor e produto'
              }
            </p>
            <Button onClick={handleCreatePriceItem} variant="primary">
              <Plus size={20} />
              Novo Preço
            </Button>
          </div>
        </EmptyState>
      ) : (
        <PriceListGrid>
          {priceList.map((item) => (
            <PriceListCard key={item._id}>
              <PriceListHeader>
                <PriceListDistributor>
                  <Building2 size={20} />
                  <div>
                    <h4>{item.distributor?.apelido || 'N/A'}</h4>
                    <span>{item.distributor?.contato?.email || 'N/A'}</span>
                  </div>
                </PriceListDistributor>
                <PriceListStatus $isActive={item.isActive}>
                  {item.isActive ? 'Ativo' : 'Inativo'}
                </PriceListStatus>
              </PriceListHeader>

              <PriceListProduct>
                <Package size={20} />
                <div>
                  <h4>{item.product?.name || 'N/A'}</h4>
                  <span>{item.product?.description || 'N/A'}</span>
                </div>
              </PriceListProduct>

              <PriceListPricing>
                <PricingItem>
                  <span>A Vista</span>
                  <strong>{formatCurrency(item.pricing?.aVista || 0)}</strong>
                </PricingItem>
                <PricingItem>
                  <span>3x Boleto</span>
                  <strong>{formatCurrency(item.pricing?.tresXBoleto || 0)}</strong>
                </PricingItem>
                <PricingItem>
                  <span>3x Cartão</span>
                  <strong>{formatCurrency(item.pricing?.tresXCartao || 0)}</strong>
                </PricingItem>
              </PriceListPricing>

              <PriceListActions>
                <IconButton
                  onClick={() => handleStatusChange(item._id, !item.isActive)}
                  title={item.isActive ? 'Desativar' : 'Ativar'}
                >
                  <Eye size={16} />
                </IconButton>
                <IconButton
                  onClick={() => handleDelete(item._id)}
                  title="Deletar preço"
                  variant="danger"
                >
                  <Trash2 size={16} />
                </IconButton>
              </PriceListActions>

              <div style={{ 
                fontSize: '12px', 
                color: '#6B7280', 
                marginTop: '12px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                paddingTop: '8px'
              }}>
                Criado em {formatDate(item.createdAt)}
                {item.validUntil && (
                  <span> • Válido até {formatDate(item.validUntil)}</span>
                )}
              </div>
            </PriceListCard>
          ))}
        </PriceListGrid>
      )}

      {isModalOpen && (
        <PriceListModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSavePriceItem}
          distributors={distributors}
          products={products}
        />
      )}
      </PageContent>
    </PageContainer>
  );
};