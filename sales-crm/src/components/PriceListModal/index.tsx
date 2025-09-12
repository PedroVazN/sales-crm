import React, { useState, useEffect } from 'react';
import { apiService, PriceListItem, Distributor, Product } from '../../services/api';
import { X, Loader2 } from 'lucide-react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

interface PriceListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (priceItem: PriceListItem) => void;
  distributors: Distributor[];
  products: Product[];
  priceItem?: PriceListItem;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContainer = styled.div`
  background: ${theme.colors.background.modal};
  backdrop-filter: blur(20px);
  border: 1px solid ${theme.colors.border.primary};
  border-radius: ${theme.borderRadius.lg};
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: ${theme.shadows.large};
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid ${theme.colors.border.primary};
  background: ${theme.colors.background.card};
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: ${theme.colors.text.primary};
  font-size: 1.5rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: ${theme.borderRadius.sm};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${theme.colors.background.secondary};
    color: ${theme.colors.text.primary};
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-height: calc(90vh - 140px);
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${theme.colors.background.secondary};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.border.secondary};
    border-radius: 4px;
    border: 1px solid ${theme.colors.background.secondary};
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.primary};
  }
  
  /* Firefox scrollbar */
  scrollbar-width: thin;
  scrollbar-color: ${theme.colors.border.secondary} ${theme.colors.background.secondary};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: ${theme.colors.text.primary};
  font-weight: 500;
  font-size: 0.9rem;
`;

const Input = styled.input<{ $hasError?: boolean }>`
  padding: 0.75rem;
  border: 1px solid ${({ $hasError }) => $hasError ? theme.colors.error : theme.colors.border.primary};
  border-radius: ${theme.borderRadius.sm};
  background: ${theme.colors.background.secondary};
  color: ${theme.colors.text.primary};
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
  }
  
  &::placeholder {
    color: ${theme.colors.text.muted};
  }
`;

const Select = styled.select<{ $hasError?: boolean }>`
  padding: 0.75rem;
  border: 1px solid ${({ $hasError }) => $hasError ? theme.colors.error : theme.colors.border.primary};
  border-radius: ${theme.borderRadius.sm};
  background: ${theme.colors.background.secondary};
  color: ${theme.colors.text.primary};
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid ${theme.colors.border.primary};
  border-radius: ${theme.borderRadius.sm};
  background: ${theme.colors.background.secondary};
  color: ${theme.colors.text.primary};
  font-size: 1rem;
  transition: all 0.2s ease;
  resize: vertical;
  min-height: 80px;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
  }
  
  &::placeholder {
    color: ${theme.colors.text.muted};
  }
`;

const ErrorMessage = styled.span`
  color: ${theme.colors.error};
  font-size: 0.8rem;
  font-weight: 500;
`;

const ModalFooter = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1.5rem;
  border-top: 1px solid ${theme.colors.border.primary};
  background: ${theme.colors.background.card};
  flex-shrink: 0;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 120px;
  justify-content: center;
  
  ${({ variant = 'secondary' }) => variant === 'primary' ? `
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
    }
  ` : `
    background: transparent;
    color: ${theme.colors.text.primary};
    border: 1px solid ${theme.colors.border.primary};
    
    &:hover:not(:disabled) {
      background: ${theme.colors.background.secondary};
      border-color: ${theme.colors.border.secondary};
    }
  `}
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled(Loader2)`
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const Grid = styled.div<{ columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${({ columns = 3 }) => columns}, 1fr);
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const PriceListModal: React.FC<PriceListModalProps> = ({
  isOpen,
  onClose,
  onSave,
  distributors,
  products,
  priceItem
}) => {
  const [formData, setFormData] = useState({
    distributor: '',
    product: '',
    pricing: {
      aVista: '',
      tresXBoleto: '',
      tresXCartao: ''
    },
    validFrom: '',
    validUntil: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (priceItem) {
        setFormData({
          distributor: priceItem.distributor._id,
          product: priceItem.product._id,
          pricing: {
            aVista: priceItem.pricing.aVista.toString(),
            tresXBoleto: priceItem.pricing.tresXBoleto.toString(),
            tresXCartao: priceItem.pricing.tresXCartao.toString()
          },
          validFrom: priceItem.validFrom ? new Date(priceItem.validFrom).toISOString().split('T')[0] : '',
          validUntil: priceItem.validUntil ? new Date(priceItem.validUntil).toISOString().split('T')[0] : '',
          notes: priceItem.notes || ''
        });
      } else {
        setFormData({
          distributor: '',
          product: '',
          pricing: {
            aVista: '',
            tresXBoleto: '',
            tresXCartao: ''
          },
          validFrom: '',
          validUntil: '',
          notes: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, priceItem]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('pricing.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        pricing: {
          ...prev.pricing,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Limpar erro do campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.distributor) {
      newErrors.distributor = 'Distribuidor é obrigatório';
    }

    if (!formData.product) {
      newErrors.product = 'Produto é obrigatório';
    }

    if (!formData.pricing.aVista || parseFloat(formData.pricing.aVista) <= 0) {
      newErrors.aVista = 'Preço à vista deve ser maior que zero';
    }

    if (!formData.pricing.tresXBoleto || parseFloat(formData.pricing.tresXBoleto) <= 0) {
      newErrors.tresXBoleto = 'Preço 3x boleto deve ser maior que zero';
    }

    if (!formData.pricing.tresXCartao || parseFloat(formData.pricing.tresXCartao) <= 0) {
      newErrors.tresXCartao = 'Preço 3x cartão deve ser maior que zero';
    }

    if (formData.validUntil && formData.validFrom) {
      const validFrom = new Date(formData.validFrom);
      const validUntil = new Date(formData.validUntil);
      
      if (validUntil <= validFrom) {
        newErrors.validUntil = 'Data de validade deve ser posterior à data de início';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const priceData = {
        distributor: formData.distributor,
        product: formData.product,
        pricing: {
          aVista: parseFloat(formData.pricing.aVista),
          tresXBoleto: parseFloat(formData.pricing.tresXBoleto),
          tresXCartao: parseFloat(formData.pricing.tresXCartao)
        },
        isActive: true,
        validFrom: formData.validFrom ? new Date(formData.validFrom).toISOString() : new Date().toISOString(),
        validUntil: formData.validUntil ? new Date(formData.validUntil).toISOString() : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        notes: formData.notes
      };

      console.log('Enviando dados:', priceData);
      const response = await apiService.createPriceListItem(priceData);
      console.log('Resposta:', response);
      onSave(response.data);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar preço:', error);
      alert('Erro ao salvar preço. Verifique o console para mais detalhes.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {priceItem ? 'Editar Preço' : 'Novo Preço'}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={24} />
          </CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <FormGroup>
              <Label>Distribuidor *</Label>
              <Select
                name="distributor"
                value={formData.distributor}
                onChange={handleInputChange}
                $hasError={!!errors.distributor}
              >
                <option value="">Selecione um distribuidor</option>
                {distributors.map(distributor => (
                  <option key={distributor._id} value={distributor._id}>
                    {distributor.apelido} - {distributor.razaoSocial}
                  </option>
                ))}
              </Select>
              {errors.distributor && <ErrorMessage>{errors.distributor}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label>Produto *</Label>
              <Select
                name="product"
                value={formData.product}
                onChange={handleInputChange}
                $hasError={!!errors.product}
              >
                <option value="">Selecione um produto</option>
                {products.map(product => (
                  <option key={product._id} value={product._id}>
                    {product.name} - {product.description}
                  </option>
                ))}
              </Select>
              {errors.product && <ErrorMessage>{errors.product}</ErrorMessage>}
            </FormGroup>

            <Grid columns={3}>
              <FormGroup>
                <Label>À Vista *</Label>
                <Input
                  type="number"
                  name="pricing.aVista"
                  value={formData.pricing.aVista}
                  onChange={handleInputChange}
                  placeholder="0,00"
                  step="0.01"
                  min="0"
                  $hasError={!!errors.aVista}
                />
                {errors.aVista && <ErrorMessage>{errors.aVista}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>3x Boleto *</Label>
                <Input
                  type="number"
                  name="pricing.tresXBoleto"
                  value={formData.pricing.tresXBoleto}
                  onChange={handleInputChange}
                  placeholder="0,00"
                  step="0.01"
                  min="0"
                  $hasError={!!errors.tresXBoleto}
                />
                {errors.tresXBoleto && <ErrorMessage>{errors.tresXBoleto}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>3x Cartão *</Label>
                <Input
                  type="number"
                  name="pricing.tresXCartao"
                  value={formData.pricing.tresXCartao}
                  onChange={handleInputChange}
                  placeholder="0,00"
                  step="0.01"
                  min="0"
                  $hasError={!!errors.tresXCartao}
                />
                {errors.tresXCartao && <ErrorMessage>{errors.tresXCartao}</ErrorMessage>}
              </FormGroup>
            </Grid>

            <Grid columns={2}>
              <FormGroup>
                <Label>Válido de</Label>
                <Input
                  type="date"
                  name="validFrom"
                  value={formData.validFrom}
                  onChange={handleInputChange}
                />
              </FormGroup>

              <FormGroup>
                <Label>Válido até</Label>
                <Input
                  type="date"
                  name="validUntil"
                  value={formData.validUntil}
                  onChange={handleInputChange}
                  $hasError={!!errors.validUntil}
                />
                {errors.validUntil && <ErrorMessage>{errors.validUntil}</ErrorMessage>}
              </FormGroup>
            </Grid>

            <FormGroup>
              <Label>Observações</Label>
              <Textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Observações sobre o preço..."
                rows={3}
              />
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              variant="secondary"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              variant="primary"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size={16} />
                  Salvando...
                </>
              ) : (
                'Salvar Preço'
              )}
            </Button>
          </ModalFooter>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};