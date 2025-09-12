const API_BASE_URL = 'http://localhost:3001/api';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'vendedor' | 'cliente';
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  cost?: number;
  category: string;
  brand?: string;
  sku?: string;
  barcode?: string;
  stock: {
    current: number;
    min: number;
    max?: number;
  };
  images?: Array<{
    url: string;
    alt: string;
  }>;
  tags?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Sale {
  _id: string;
  saleNumber: string;
  customer: User;
  seller: User;
  items: Array<{
    product: Product;
    quantity: number;
    unitPrice: number;
    discount: number;
    total: number;
  }>;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix' | 'transferencia' | 'cheque';
  paymentStatus: 'pendente' | 'pago' | 'parcial' | 'cancelado';
  status: 'rascunho' | 'finalizada' | 'cancelada' | 'devolvida';
  notes?: string;
  deliveryDate?: string;
  deliveryAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Proposal {
  _id: string;
  productCode: string;
  productName: string;
  pricing: {
    aVista: number;
    tresXBoleto: number;
    tresXCartao: number;
  };
  client: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
  };
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  validUntil: string;
  notes?: string;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface ProposalStats {
  totalProposals: number;
  draftProposals: number;
  sentProposals: number;
  acceptedProposals: number;
  rejectedProposals: number;
  expiredProposals: number;
}

export interface Client {
  _id: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  contato: {
    nome: string;
    email: string;
    telefone: string;
    cargo?: string;
  };
  endereco: {
    cep?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    uf: string;
  };
  classificacao: 'PROVEDOR' | 'REVENDA' | 'OUTROS';
  observacoes?: string;
  isActive: boolean;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface Distributor {
  _id: string;
  apelido: string;
  razaoSocial: string;
  idDistribuidor: string;
  contato: {
    nome: string;
    email: string;
    telefone: string;
    cargo?: string;
  };
  origem: string;
  atendimento: {
    horario?: string;
    dias?: string;
    observacoes?: string;
  };
  frete: {
    tipo: 'CIF' | 'FOB' | 'TERCEIRO';
    valor?: number;
    prazo?: number;
    observacoes?: string;
  };
  pedidoMinimo: {
    valor: number;
    observacoes?: string;
  };
  endereco: {
    cep?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    uf?: string;
  };
  isActive: boolean;
  observacoes?: string;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface PriceListItem {
  _id: string;
  distributor: Distributor;
  product: Product;
  pricing: {
    aVista: number;
    tresXBoleto: number;
    tresXCartao: number;
  };
  isActive: boolean;
  validFrom: string;
  validUntil: string;
  notes?: string;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'vendedor' | 'cliente';
  phone?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: {
    current: number;
    pages: number;
    total: number;
  };
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Autenticação
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<User>('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success) {
      this.token = 'dummy-token'; // Em produção, usar JWT real
      localStorage.setItem('authToken', this.token);
      localStorage.setItem('currentUser', JSON.stringify(response.data));
    }

    return response as LoginResponse;
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<User>> {
    return this.request<User>('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<void> {
    this.token = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }

  // Usuários
  async getUsers(page = 1, limit = 10): Promise<ApiResponse<User[]>> {
    return this.request<User[]>(`/users?page=${page}&limit=${limit}`);
  }

  async getUser(id: string): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${id}`);
  }

  async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Produtos
  async getProducts(page = 1, limit = 10, search?: string, category?: string): Promise<ApiResponse<Product[]>> {
    let url = `/products?page=${page}&limit=${limit}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    
    return this.request<Product[]>(url);
  }

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    return this.request<Product>(`/products/${id}`);
  }

  async createProduct(productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Product>> {
    return this.request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: string, productData: Partial<Product>): Promise<ApiResponse<Product>> {
    return this.request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  async updateProductStock(id: string, stock: { current: number; min?: number; max?: number }): Promise<ApiResponse<Product>> {
    return this.request<Product>(`/products/${id}/stock`, {
      method: 'PUT',
      body: JSON.stringify(stock),
    });
  }

  async getCategories(): Promise<ApiResponse<string[]>> {
    return this.request<string[]>('/products/categories/list');
  }

  // Vendas
  async getSales(page = 1, limit = 10, status?: string, paymentStatus?: string): Promise<ApiResponse<Sale[]>> {
    let url = `/sales?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    if (paymentStatus) url += `&paymentStatus=${paymentStatus}`;
    
    return this.request<Sale[]>(url);
  }

  async getSale(id: string): Promise<ApiResponse<Sale>> {
    return this.request<Sale>(`/sales/${id}`);
  }

  async createSale(saleData: Omit<Sale, '_id' | 'saleNumber' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Sale>> {
    return this.request<Sale>('/sales', {
      method: 'POST',
      body: JSON.stringify(saleData),
    });
  }

  async updateSaleStatus(id: string, status: string, paymentStatus?: string): Promise<ApiResponse<Sale>> {
    return this.request<Sale>(`/sales/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, paymentStatus }),
    });
  }

  async getSalesStats(startDate?: string, endDate?: string): Promise<ApiResponse<{
    totalSales: number;
    totalRevenue: number;
    averageSale: number;
    totalItems: number;
  }>> {
    let url = '/sales/stats/summary';
    if (startDate) url += `?startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;
    
    return this.request(url);
  }

  // Propostas
  async getProposals(page = 1, limit = 10, status?: string, search?: string): Promise<ApiResponse<Proposal[]>> {
    let url = `/proposals?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    
    return this.request<Proposal[]>(url);
  }

  async getProposal(id: string): Promise<ApiResponse<Proposal>> {
    return this.request<Proposal>(`/proposals/${id}`);
  }

  async createProposal(proposalData: Omit<Proposal, '_id' | 'createdBy' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Proposal>> {
    return this.request<Proposal>('/proposals', {
      method: 'POST',
      body: JSON.stringify(proposalData),
    });
  }

  async updateProposal(id: string, proposalData: Partial<Proposal>): Promise<ApiResponse<Proposal>> {
    return this.request<Proposal>(`/proposals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(proposalData),
    });
  }

  async deleteProposal(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/proposals/${id}`, {
      method: 'DELETE',
    });
  }

  async getProposalStats(): Promise<ApiResponse<ProposalStats>> {
    return this.request<ProposalStats>('/proposals/stats/summary');
  }

  // Clientes
  async getClients(page = 1, limit = 10, search?: string, uf?: string, classificacao?: string, isActive?: boolean): Promise<ApiResponse<Client[]>> {
    let url = `/clients?page=${page}&limit=${limit}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (uf) url += `&uf=${uf}`;
    if (classificacao) url += `&classificacao=${classificacao}`;
    if (isActive !== undefined) url += `&isActive=${isActive}`;
    
    return this.request<Client[]>(url);
  }

  async getClient(id: string): Promise<ApiResponse<Client>> {
    return this.request<Client>(`/clients/${id}`);
  }

  async createClient(clientData: Omit<Client, '_id' | 'createdBy' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Client>> {
    return this.request<Client>('/clients', {
      method: 'POST',
      body: JSON.stringify(clientData),
    });
  }

  async updateClient(id: string, clientData: Partial<Client>): Promise<ApiResponse<Client>> {
    return this.request<Client>(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(clientData),
    });
  }

  async deleteClient(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/clients/${id}`, {
      method: 'DELETE',
    });
  }

  async getClientStats(): Promise<ApiResponse<any>> {
    return this.request<any>('/clients/stats/summary');
  }

  // Distribuidores
  async getDistributors(page = 1, limit = 10, search?: string, origem?: string, isActive?: boolean): Promise<ApiResponse<Distributor[]>> {
    let url = `/distributors?page=${page}&limit=${limit}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (origem) url += `&origem=${origem}`;
    if (isActive !== undefined) url += `&isActive=${isActive}`;
    
    return this.request<Distributor[]>(url);
  }

  async getDistributor(id: string): Promise<ApiResponse<Distributor>> {
    return this.request<Distributor>(`/distributors/${id}`);
  }

  async createDistributor(distributorData: Omit<Distributor, '_id' | 'createdBy' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Distributor>> {
    return this.request<Distributor>('/distributors', {
      method: 'POST',
      body: JSON.stringify(distributorData),
    });
  }

  async updateDistributor(id: string, distributorData: Partial<Distributor>): Promise<ApiResponse<Distributor>> {
    return this.request<Distributor>(`/distributors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(distributorData),
    });
  }

  async deleteDistributor(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/distributors/${id}`, {
      method: 'DELETE',
    });
  }

  // Lista de Preços
  async getPriceList(page = 1, limit = 10, distributor?: string, product?: string, isActive?: boolean): Promise<ApiResponse<PriceListItem[]>> {
    let url = `/price-list?page=${page}&limit=${limit}`;
    if (distributor) url += `&distributor=${distributor}`;
    if (product) url += `&product=${product}`;
    if (isActive !== undefined) url += `&isActive=${isActive}`;
    
    return this.request<PriceListItem[]>(url);
  }

  async getPriceListItem(id: string): Promise<ApiResponse<PriceListItem>> {
    return this.request<PriceListItem>(`/price-list/${id}`);
  }

  async createPriceListItem(priceData: Omit<PriceListItem, '_id' | 'distributor' | 'product' | 'createdBy' | 'createdAt' | 'updatedAt'> & { distributor: string; product: string }): Promise<ApiResponse<PriceListItem>> {
    return this.request<PriceListItem>('/price-list', {
      method: 'POST',
      body: JSON.stringify(priceData),
    });
  }

  async updatePriceListItem(id: string, priceData: Partial<PriceListItem>): Promise<ApiResponse<PriceListItem>> {
    return this.request<PriceListItem>(`/price-list/${id}`, {
      method: 'PUT',
      body: JSON.stringify(priceData),
    });
  }

  async deletePriceListItem(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/price-list/${id}`, {
      method: 'DELETE',
    });
  }

  async getPriceListByDistributor(distributorId: string, page = 1, limit = 10): Promise<ApiResponse<PriceListItem[]>> {
    return this.request<PriceListItem[]>(`/price-list/distributor/${distributorId}?page=${page}&limit=${limit}`);
  }

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Obter usuário atual
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }
}

export const apiService = new ApiService();
