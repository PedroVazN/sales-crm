import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { apiService, Distributor, Product } from '../../../services/api';
import {
  Container,
  Header,
  Title,
  BackButton,
  SaveButton,
  Content,
  FormSection,
  FormGroup,
  Label,
  Select,
  ProductSection,
  ProductItem,
  ProductHeader,
  ProductName,
  ProductPricing,
  PriceRow,
  PriceLabel,
  PriceInput,
  RemoveButton,
  AddProductButton,
  Button
} from './styles';

export const NewPriceList: React.FC = () => {
  const navigate = useNavigate();
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDistributor, setSelectedDistributor] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<{
    productId: string;
    productName: string;
    pricing: {
      aVista: number;
      cartao: number;
      boleto: number;
    };
    isActive: boolean;
    validFrom: string;
    validUntil: string;
    notes: string;
  }[]>([]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [distributorsResponse, productsResponse] = await Promise.all([
        apiService.getDistributors(1, 100),
        apiService.getProducts(1, 100)
      ]);
      
      setDistributors(distributorsResponse.data || []);
      setProducts(productsResponse.data || []);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      alert('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addProduct = () => {
    if (products.length > 0) {
      setSelectedProducts(prev => [...prev, {
        productId: products[0]._id,
        productName: products[0].name,
        pricing: {
          aVista: 100, // Preço padrão válido
          cartao: 110, // Preço padrão válido
          boleto: 105  // Preço padrão válido
        },
        isActive: true,
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: ''
      }]);
    }
  };

  const removeProduct = (index: number) => {
    setSelectedProducts(prev => prev.filter((_, i) => i !== index));
  };

  const updateProduct = (index: number, field: string, value: any) => {
    setSelectedProducts(prev => prev.map((product, i) => {
      if (i === index) {
        if (field.startsWith('pricing.')) {
          const pricingField = field.split('.')[1];
          return {
            ...product,
            pricing: {
              ...product.pricing,
              [pricingField]: value
            }
          };
        } else {
          return { ...product, [field]: value };
        }
      }
      return product;
    }));
  };

  const handleSave = async () => {
    try {
      if (!selectedDistributor || selectedProducts.length === 0) {
        alert('Selecione um distribuidor e pelo menos um produto');
        return;
      }

      // Criar uma lista de preços única com múltiplos produtos
      const priceListData = {
        distributorId: selectedDistributor,
        products: selectedProducts.map(product => ({
          productId: product.productId,
          productName: product.productName,
          pricing: {
            aVista: product.pricing.aVista,
            cartao: product.pricing.cartao,
            boleto: product.pricing.boleto
          },
          isActive: product.isActive,
          validFrom: product.validFrom,
          validUntil: product.validUntil,
          notes: product.notes
        }))
      };

      // Usar a rota de criação de lista completa (não individual)
      await apiService.customRequest('/price-list/create', {
        method: 'POST',
        body: JSON.stringify(priceListData)
      });
      
      alert('Lista de preços criada com sucesso!');
      navigate('/price-list');
    } catch (err) {
      console.error('Erro ao salvar lista:', err);
      alert(`Erro ao salvar lista: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    }
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <BackButton onClick={() => navigate('/price-list')}>
            <ArrowLeft size={20} />
            Voltar
          </BackButton>
          <Title>Nova Lista de Preços</Title>
          <div></div>
        </Header>
        <Content>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Carregando dados...</p>
          </div>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/price-list')}>
          <ArrowLeft size={20} />
          Voltar
        </BackButton>
        <Title>Nova Lista de Preços</Title>
        <SaveButton onClick={handleSave}>
          <Save size={20} />
          Salvar
        </SaveButton>
      </Header>
      
      <Content>
        <FormSection>
          <FormGroup>
            <Label>Distribuidor *</Label>
            <Select
              value={selectedDistributor || ''}
              onChange={(e) => setSelectedDistributor(e.target.value)}
            >
              <option value="">Selecione um distribuidor</option>
              {distributors.map(distributor => (
                <option key={distributor._id} value={distributor._id}>
                  {distributor.apelido} - {distributor.razaoSocial}
                </option>
              ))}
            </Select>
          </FormGroup>

          <ProductSection>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <Label>Produtos e Preços *</Label>
              <AddProductButton onClick={addProduct}>
                <Plus size={16} />
                Adicionar Produto
              </AddProductButton>
            </div>

            {selectedProducts.map((product, index) => (
              <ProductItem key={index}>
                <ProductHeader>
                  <ProductName>
                    <Select
                      value={product.productId || ''}
                      onChange={(e) => {
                        const selectedProduct = products.find(p => p._id === e.target.value);
                        if (selectedProduct) {
                          updateProduct(index, 'productId', selectedProduct._id);
                          updateProduct(index, 'productName', selectedProduct.name);
                        }
                      }}
                    >
                      <option value="">Selecione um produto</option>
                      {products.map(p => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                      ))}
                    </Select>
                  </ProductName>
                  <RemoveButton onClick={() => removeProduct(index)}>
                    <Trash2 size={16} />
                  </RemoveButton>
                </ProductHeader>

                <ProductPricing>
                  <PriceRow>
                    <PriceLabel>À Vista:</PriceLabel>
                    <PriceInput
                      type="number"
                      step="0.01"
                      value={product.pricing.aVista || 0}
                      onChange={(e) => updateProduct(index, 'pricing.aVista', parseFloat(e.target.value) || 0)}
                    />
                  </PriceRow>
                  <PriceRow>
                    <PriceLabel>Cartão (3x):</PriceLabel>
                    <PriceInput
                      type="number"
                      step="0.01"
                      value={product.pricing.cartao || 0}
                      onChange={(e) => updateProduct(index, 'pricing.cartao', parseFloat(e.target.value) || 0)}
                    />
                  </PriceRow>
                  <PriceRow>
                    <PriceLabel>Boleto (3x):</PriceLabel>
                    <PriceInput
                      type="number"
                      step="0.01"
                      value={product.pricing.boleto || 0}
                      onChange={(e) => updateProduct(index, 'pricing.boleto', parseFloat(e.target.value) || 0)}
                    />
                  </PriceRow>
                </ProductPricing>
              </ProductItem>
            ))}
          </ProductSection>
        </FormSection>
      </Content>
    </Container>
  );
};
