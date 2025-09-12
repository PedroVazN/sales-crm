import React, { useState, useEffect } from 'react';
import { apiService, Proposal } from '../../services/api';
import { 
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalClose,
  ModalBody,
  FormGroup,
  FormLabel,
  FormInput,
  FormSelect,
  FormTextarea,
  FormRow,
  PricingSection,
  PricingTitle,
  PricingGrid,
  PricingItem,
  PricingLabel,
  PricingInput,
  ClientSection,
  ClientTitle,
  ClientGrid,
  ModalFooter,
  CancelButton,
  SaveButton,
  LoadingSpinner
} from './styles';
import { X, Loader2, Package, User, DollarSign } from 'lucide-react';

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (proposal: Proposal) => void;
}

const productOptions = [
  { value: '001-ONU', label: '001-ONU - ONU' },
  { value: '002-ONT', label: '002-ONT - ONT' },
  { value: '003-ONT', label: '003-ONT - ONT' },
  { value: '004-ONT', label: '004-ONT - ONT' },
  { value: '005-ONT', label: '005-ONT - ONT' },
  { value: '006-ONT', label: '006-ONT - ONT' },
  { value: '007-ONT', label: '007-ONT - ONT' },
  { value: '008-ONT', label: '008-ONT - ONT' },
  { value: '009-MODU', label: '009-MODU - MODU' },
  { value: '010-MODU', label: '010-MODU - MODU' },
  { value: '011-OLT', label: '011-OLT - OLT' },
  { value: '012-OLT', label: '012-OLT - OLT' },
  { value: '013-OLT', label: '013-OLT - OLT' },
  { value: '014-OLT', label: '014-OLT - OLT' },
  { value: '015-OLT', label: '015-OLT - OLT' },
  { value: '016-OLT', label: '016-OLT - OLT' },
  { value: '017-OLT', label: '017-OLT - OLT' },
  { value: '018-OLT', label: '018-OLT - OLT' },
  { value: '019-OLT', label: '019-OLT - OLT' },
  { value: '020-OLT', label: '020-OLT - OLT' },
  { value: '021-OLT', label: '021-OLT - OLT' },
  { value: '022-OLT', label: '022-OLT - OLT' },
  { value: '023-ROTE', label: '023-ROTE - ROTE' },
  { value: '024-ROTE', label: '024-ROTE - ROTE' },
  { value: '025-FONT', label: '025-FONT - FONT' },
  { value: '026-FONT', label: '026-FONT - FONT' },
  { value: '027-FONT', label: '027-FONT - FONT' },
  { value: '028-FONT', label: '028-FONT - FONT' },
  { value: '029-FONT', label: '029-FONT - FONT' },
  { value: '030-FONT', label: '030-FONT - FONT' },
  { value: '031-FONT', label: '031-FONT - FONT' },
];

export const ProposalModal: React.FC<ProposalModalProps> = ({ isOpen, onClose, onSave }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    productCode: '',
    productName: '',
    pricing: {
      aVista: 0,
      tresXBoleto: 0,
      tresXCartao: 0
    },
    client: {
      name: '',
      email: '',
      phone: '',
      company: ''
    },
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        productCode: '',
        productName: '',
        pricing: {
          aVista: 0,
          tresXBoleto: 0,
          tresXCartao: 0
        },
        client: {
          name: '',
          email: '',
          phone: '',
          company: ''
        },
        notes: ''
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleProductChange = (productCode: string) => {
    const product = productOptions.find(p => p.value === productCode);
    setFormData(prev => ({
      ...prev,
      productCode,
      productName: product?.label.split(' - ')[1] || ''
    }));
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.productCode) {
      newErrors.productCode = 'Selecione um produto';
    }

    if (!formData.client.name) {
      newErrors['client.name'] = 'Nome do cliente é obrigatório';
    }

    if (!formData.client.email) {
      newErrors['client.email'] = 'Email do cliente é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.client.email)) {
      newErrors['client.email'] = 'Email inválido';
    }

    if (formData.pricing.aVista <= 0) {
      newErrors['pricing.aVista'] = 'Valor à vista deve ser maior que zero';
    }

    if (formData.pricing.tresXBoleto <= 0) {
      newErrors['pricing.tresXBoleto'] = 'Valor 3x boleto deve ser maior que zero';
    }

    if (formData.pricing.tresXCartao <= 0) {
      newErrors['pricing.tresXCartao'] = 'Valor 3x cartão deve ser maior que zero';
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
      const proposalData = {
        ...formData,
        status: 'draft' as const,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };
      
      const response = await apiService.createProposal(proposalData);
      onSave(response.data);
      onClose();
    } catch (error) {
      console.error('Erro ao criar proposta:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <Package size={24} />
            Nova Proposta
          </ModalTitle>
          <ModalClose onClick={onClose}>
            <X size={20} />
          </ModalClose>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            {/* Seleção do Produto */}
            <FormGroup>
              <FormLabel>
                <Package size={16} />
                Produto
              </FormLabel>
              <FormSelect
                value={formData.productCode}
                onChange={(e) => handleProductChange(e.target.value)}
                $hasError={!!errors.productCode}
              >
                <option value="">Selecione um produto</option>
                {productOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </FormSelect>
              {errors.productCode && <span className="error">{errors.productCode}</span>}
            </FormGroup>

            {/* Preços */}
            <PricingSection>
              <PricingTitle>
                <DollarSign size={20} />
                Preços
              </PricingTitle>
              <PricingGrid>
                <PricingItem>
                  <PricingLabel>À Vista</PricingLabel>
                  <PricingInput
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.pricing.aVista || ''}
                    onChange={(e) => handleInputChange('pricing.aVista', parseFloat(e.target.value) || 0)}
                    $hasError={!!errors['pricing.aVista']}
                    placeholder="0,00"
                  />
                  {errors['pricing.aVista'] && <span className="error">{errors['pricing.aVista']}</span>}
                </PricingItem>

                <PricingItem>
                  <PricingLabel>3x Boleto</PricingLabel>
                  <PricingInput
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.pricing.tresXBoleto || ''}
                    onChange={(e) => handleInputChange('pricing.tresXBoleto', parseFloat(e.target.value) || 0)}
                    $hasError={!!errors['pricing.tresXBoleto']}
                    placeholder="0,00"
                  />
                  {errors['pricing.tresXBoleto'] && <span className="error">{errors['pricing.tresXBoleto']}</span>}
                </PricingItem>

                <PricingItem>
                  <PricingLabel>3x Cartão</PricingLabel>
                  <PricingInput
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.pricing.tresXCartao || ''}
                    onChange={(e) => handleInputChange('pricing.tresXCartao', parseFloat(e.target.value) || 0)}
                    $hasError={!!errors['pricing.tresXCartao']}
                    placeholder="0,00"
                  />
                  {errors['pricing.tresXCartao'] && <span className="error">{errors['pricing.tresXCartao']}</span>}
                </PricingItem>
              </PricingGrid>
            </PricingSection>

            {/* Dados do Cliente */}
            <ClientSection>
              <ClientTitle>
                <User size={20} />
                Dados do Cliente
              </ClientTitle>
              <ClientGrid>
                <FormGroup>
                  <FormLabel>Nome *</FormLabel>
                  <FormInput
                    type="text"
                    value={formData.client.name}
                    onChange={(e) => handleInputChange('client.name', e.target.value)}
                    $hasError={!!errors['client.name']}
                    placeholder="Nome completo do cliente"
                  />
                  {errors['client.name'] && <span className="error">{errors['client.name']}</span>}
                </FormGroup>

                <FormGroup>
                  <FormLabel>Email *</FormLabel>
                  <FormInput
                    type="email"
                    value={formData.client.email}
                    onChange={(e) => handleInputChange('client.email', e.target.value)}
                    $hasError={!!errors['client.email']}
                    placeholder="email@exemplo.com"
                  />
                  {errors['client.email'] && <span className="error">{errors['client.email']}</span>}
                </FormGroup>

                <FormGroup>
                  <FormLabel>Telefone</FormLabel>
                  <FormInput
                    type="tel"
                    value={formData.client.phone}
                    onChange={(e) => handleInputChange('client.phone', e.target.value)}
                    placeholder="(11) 99999-9999"
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel>Empresa</FormLabel>
                  <FormInput
                    type="text"
                    value={formData.client.company}
                    onChange={(e) => handleInputChange('client.company', e.target.value)}
                    placeholder="Nome da empresa"
                  />
                </FormGroup>
              </ClientGrid>
            </ClientSection>

            {/* Observações */}
            <FormGroup>
              <FormLabel>Observações</FormLabel>
              <FormTextarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Observações adicionais sobre a proposta..."
                rows={3}
              />
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <CancelButton type="button" onClick={onClose}>
              Cancelar
            </CancelButton>
            <SaveButton type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoadingSpinner size={16} />
                  Salvando...
                </>
              ) : (
                'Salvar Proposta'
              )}
            </SaveButton>
          </ModalFooter>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};
