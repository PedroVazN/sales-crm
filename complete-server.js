const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

// Conectar ao MongoDB
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://edvar:edvar123@cluster0.npuas1m.mongodb.net/sellone?retryWrites=true&w=majority';
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error('Erro ao conectar com MongoDB:', error.message);
    process.exit(1);
  }
};

// Conectar ao banco
connectDB();

// Modelos do MongoDB
const PriceListSchema = new mongoose.Schema({
  distributor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DistributorNew',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  pricing: {
    aVista: { type: Number, required: true, min: 0 },
    tresXBoleto: { type: Number, required: true, min: 0 },
    tresXCartao: { type: Number, required: true, min: 0 }
  },
  isActive: { type: Boolean, default: true },
  validFrom: { type: Date, default: Date.now },
  validUntil: { type: Date, default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
  notes: { type: String, trim: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const DistributorSchema = new mongoose.Schema({
  apelido: { type: String, required: true },
  razaoSocial: { type: String, required: true },
  idDistribuidor: { type: String, unique: true },
  contato: {
    nome: String,
    email: String,
    telefone: String,
    cargo: String
  },
  origem: String,
  atendimento: {
    horario: String,
    dias: String,
    observacoes: String
  },
  frete: {
    tipo: String,
    valor: Number,
    prazo: Number,
    observacoes: String
  },
  pedidoMinimo: {
    valor: Number,
    observacoes: String
  },
  endereco: {
    cep: String,
    logradouro: String,
    numero: String,
    complemento: String,
    bairro: String,
    cidade: String,
    uf: String
  },
  isActive: { type: Boolean, default: true },
  observacoes: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true, min: 0 },
  cost: { type: Number, min: 0 },
  category: String,
  brand: String,
  sku: { type: String, unique: true },
  barcode: { type: String, unique: true },
  stock: {
    current: { type: Number, default: 0 },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 }
  },
  images: [{ url: String, alt: String }],
  tags: [String],
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const PriceList = mongoose.model('PriceList', PriceListSchema);
const Distributor = mongoose.model('DistributorNew', DistributorSchema);
const Product = mongoose.model('Product', ProductSchema);

// Middlewares
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota da API
app.get('/api', (req, res) => {
  res.json({
    message: 'Bem-vindo ao SellOne API',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// Rota de status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Servidor SellOne funcionando'
  });
});

// Rota de login
app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;
  
  const users = [
    {
      _id: '1',
      name: 'Administrador',
      email: 'admin@sellone.com',
      password: '123456',
      role: 'admin',
      phone: '11999999999',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      _id: '2',
      name: 'Vendedor',
      email: 'vendedor@sellone.com',
      password: '123456',
      role: 'vendedor',
      phone: '11988888888',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ];
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: userWithoutPassword
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Email ou senha incorretos'
    });
  }
});

// Rota de usuários
app.get('/api/users', (req, res) => {
  const users = [
    {
      _id: '1',
      name: 'Administrador',
      email: 'admin@sellone.com',
      role: 'admin',
      phone: '11999999999',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      _id: '2',
      name: 'Vendedor',
      email: 'vendedor@sellone.com',
      role: 'vendedor',
      phone: '11988888888',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      _id: '3',
      name: 'João Silva',
      email: 'joao@sellone.com',
      role: 'vendedor',
      phone: '11977777777',
      isActive: true,
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    }
  ];

  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const paginatedUsers = users.slice(skip, skip + parseInt(limit));

  res.json({
    success: true,
    data: paginatedUsers,
    pagination: {
      current: parseInt(page),
      pages: Math.ceil(users.length / limit),
      total: users.length,
      limit: parseInt(limit)
    }
  });
});

// Rota de produtos
app.get('/api/products', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;
    const skip = (page - 1) * limit;

    let query = { createdBy: '68c1afbcf906c14a8e7e8ff7' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    const products = await Product.find(query)
      .populate('createdBy', 'name email')
      .sort({ name: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota de produtos (fallback para dados mock se necessário)
app.get('/api/products-mock', (req, res) => {
  const products = [
    {
      _id: '1',
      name: 'Sistema CRM Pro',
      description: 'Sistema completo de gestão de relacionamento com clientes',
      price: 299.90,
      cost: 150.00,
      category: 'Software',
      brand: 'SellOne',
      sku: 'CRM-PRO-001',
      barcode: '1234567890123',
      stock: { current: 50, min: 10, max: 100 },
      images: [
        { url: '/images/crm-pro.jpg', alt: 'Sistema CRM Pro' }
      ],
      tags: ['CRM', 'Gestão', 'Vendas'],
      isActive: true,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      _id: '2',
      name: 'Consultoria Empresarial',
      description: 'Consultoria especializada em transformação digital',
      price: 1500.00,
      cost: 800.00,
      category: 'Serviços',
      brand: 'SellOne',
      sku: 'CONS-EMP-001',
      barcode: '1234567890124',
      stock: { current: 25, min: 5, max: 50 },
      images: [
        { url: '/images/consultoria.jpg', alt: 'Consultoria Empresarial' }
      ],
      tags: ['Consultoria', 'Digital', 'Transformação'],
      isActive: true,
      createdAt: '2024-01-20T14:30:00Z',
      updatedAt: '2024-01-20T14:30:00Z'
    },
    {
      _id: '3',
      name: 'Plano Premium',
      description: 'Plano premium com recursos avançados',
      price: 199.90,
      cost: 100.00,
      category: 'Assinatura',
      brand: 'SellOne',
      sku: 'PLAN-PREM-001',
      barcode: '1234567890125',
      stock: { current: 100, min: 20, max: 200 },
      images: [
        { url: '/images/plano-premium.jpg', alt: 'Plano Premium' }
      ],
      tags: ['Plano', 'Premium', 'Recursos'],
      isActive: true,
      createdAt: '2024-02-01T09:15:00Z',
      updatedAt: '2024-02-01T09:15:00Z'
    }
  ];

  const { page = 1, limit = 10, search, category } = req.query;
  const skip = (page - 1) * limit;

  let filteredProducts = products;

  if (search) {
    const searchLower = search.toLowerCase();
    filteredProducts = products.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower) ||
      p.category.toLowerCase().includes(searchLower)
    );
  }

  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }

  const paginatedProducts = filteredProducts.slice(skip, skip + parseInt(limit));

  res.json({
    success: true,
    data: paginatedProducts,
    pagination: {
      current: parseInt(page),
      pages: Math.ceil(filteredProducts.length / limit),
      total: filteredProducts.length,
      limit: parseInt(limit)
    }
  });
});

// Rota de categorias de produtos
app.get('/api/products/categories/list', (req, res) => {
  const categories = ['Software', 'Serviços', 'Assinatura', 'Educação', 'Hardware'];
  res.json({
    success: true,
    data: categories
  });
});

// Rota de vendas
app.get('/api/sales', (req, res) => {
  const sales = [
    {
      _id: '1',
      saleNumber: 'V001',
      customer: {
        _id: '1',
        name: 'Empresa ABC',
        email: 'contato@empresaabc.com',
        role: 'cliente',
        phone: '11999999999',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      seller: {
        _id: '2',
        name: 'Vendedor',
        email: 'vendedor@sellone.com',
        role: 'vendedor',
        phone: '11988888888',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      items: [
        {
          product: {
            _id: '1',
            name: 'Sistema CRM Pro',
            price: 299.90
          },
          quantity: 2,
          unitPrice: 299.90,
          discount: 0,
          total: 599.80
        }
      ],
      subtotal: 599.80,
      discount: 0,
      tax: 107.96,
      total: 707.76,
      paymentMethod: 'pix',
      paymentStatus: 'pago',
      status: 'finalizada',
      notes: 'Venda realizada com sucesso',
      deliveryDate: '2024-01-20T00:00:00Z',
      deliveryAddress: {
        street: 'Rua das Flores, 123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
        country: 'Brasil'
      },
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    }
  ];

  const { page = 1, limit = 10, status, paymentStatus } = req.query;
  const skip = (page - 1) * limit;

  let filteredSales = sales;

  if (status) {
    filteredSales = filteredSales.filter(s => s.status === status);
  }

  if (paymentStatus) {
    filteredSales = filteredSales.filter(s => s.paymentStatus === paymentStatus);
  }

  const paginatedSales = filteredSales.slice(skip, skip + parseInt(limit));

  res.json({
    success: true,
    data: paginatedSales,
    pagination: {
      current: parseInt(page),
      pages: Math.ceil(filteredSales.length / limit),
      total: filteredSales.length,
      limit: parseInt(limit)
    }
  });
});

// Rota de estatísticas de vendas
app.get('/api/sales/stats/summary', (req, res) => {
  res.json({
    success: true,
    data: {
      totalSales: 15,
      totalRevenue: 12500.50,
      averageSale: 833.37,
      totalItems: 45
    }
  });
});

// Rota de clientes
app.get('/api/clients', (req, res) => {
  const clients = [
    {
      _id: '1',
      cnpj: '12.345.678/0001-90',
      razaoSocial: 'Empresa ABC Ltda',
      nomeFantasia: 'ABC Corp',
      contato: {
        nome: 'João Silva',
        email: 'joao@empresaabc.com',
        telefone: '11999999999',
        cargo: 'Gerente'
      },
      endereco: {
        cep: '01234-567',
        logradouro: 'Rua das Flores, 123',
        numero: '123',
        complemento: 'Sala 45',
        bairro: 'Centro',
        cidade: 'São Paulo',
        uf: 'SP'
      },
      classificacao: 'PROVEDOR',
      observacoes: 'Cliente importante',
      isActive: true,
      createdBy: {
        _id: '1',
        name: 'Administrador',
        email: 'admin@sellone.com'
      },
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      _id: '2',
      cnpj: '98.765.432/0001-10',
      razaoSocial: 'Empresa XYZ S.A.',
      nomeFantasia: 'XYZ Corp',
      contato: {
        nome: 'Maria Santos',
        email: 'maria@empresaxyz.com',
        telefone: '11988888888',
        cargo: 'Diretora'
      },
      endereco: {
        cep: '04567-890',
        logradouro: 'Av. Paulista, 1000',
        numero: '1000',
        complemento: '15º andar',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        uf: 'SP'
      },
      classificacao: 'REVENDA',
      observacoes: 'Grande cliente',
      isActive: true,
      createdBy: {
        _id: '1',
        name: 'Administrador',
        email: 'admin@sellone.com'
      },
      createdAt: '2024-01-20T14:30:00Z',
      updatedAt: '2024-01-20T14:30:00Z'
    }
  ];

  const { page = 1, limit = 10, search, uf, classificacao, isActive } = req.query;
  const skip = (page - 1) * limit;

  let filteredClients = clients;

  if (search) {
    const searchLower = search.toLowerCase();
    filteredClients = clients.filter(c => 
      c.razaoSocial.toLowerCase().includes(searchLower) ||
      c.nomeFantasia?.toLowerCase().includes(searchLower) ||
      c.contato.nome.toLowerCase().includes(searchLower) ||
      c.cnpj.includes(search)
    );
  }

  if (uf) {
    filteredClients = filteredClients.filter(c => c.endereco.uf === uf);
  }

  if (classificacao) {
    filteredClients = filteredClients.filter(c => c.classificacao === classificacao);
  }

  if (isActive !== undefined) {
    filteredClients = filteredClients.filter(c => c.isActive === (isActive === 'true'));
  }

  const paginatedClients = filteredClients.slice(skip, skip + parseInt(limit));

  res.json({
    success: true,
    data: paginatedClients,
    pagination: {
      current: parseInt(page),
      pages: Math.ceil(filteredClients.length / limit),
      total: filteredClients.length,
      limit: parseInt(limit)
    }
  });
});

// Rota de estatísticas de clientes
app.get('/api/clients/stats/summary', (req, res) => {
  res.json({
    success: true,
    data: {
      totalClients: 25,
      activeClients: 23,
      inactiveClients: 2,
      provedores: 15,
      revendas: 8,
      outros: 2
    }
  });
});

// Rota de distribuidores
app.get('/api/distributors', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, origem, isActive } = req.query;
    const skip = (page - 1) * limit;

    let query = { createdBy: '68c1afbcf906c14a8e7e8ff7' };

    if (search) {
      query.$or = [
        { apelido: { $regex: search, $options: 'i' } },
        { razaoSocial: { $regex: search, $options: 'i' } },
        { 'contato.nome': { $regex: search, $options: 'i' } }
      ];
    }

    if (origem) {
      query.origem = origem;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const distributors = await Distributor.find(query)
      .populate('createdBy', 'name email')
      .sort({ apelido: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Distributor.countDocuments(query);

    res.json({
      success: true,
      data: distributors,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar distribuidores:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota de distribuidores (fallback para dados mock se necessário)
app.get('/api/distributors-mock', (req, res) => {
  const distributors = [
    {
      _id: '1',
      apelido: 'Distribuidor Alpha',
      razaoSocial: 'Alpha Distribuidora Ltda',
      idDistribuidor: 'DIST001',
      contato: {
        nome: 'João Silva',
        email: 'joao@alpha.com',
        telefone: '11999887766',
        cargo: 'Gerente'
      },
      origem: 'Indicação',
      atendimento: {
        horario: '08:00 às 18:00',
        dias: 'Segunda a Sexta',
        observacoes: 'Atendimento prioritário'
      },
      frete: {
        tipo: 'CIF',
        valor: 50.00,
        prazo: 3,
        observacoes: 'Frete grátis acima de R$ 500'
      },
      pedidoMinimo: {
        valor: 200.00,
        observacoes: 'Valor mínimo para pedidos'
      },
      endereco: {
        cep: '01234-567',
        logradouro: 'Rua das Flores, 123',
        numero: '123',
        complemento: 'Sala 45',
        bairro: 'Centro',
        cidade: 'São Paulo',
        uf: 'SP'
      },
      isActive: true,
      observacoes: 'Distribuidor confiável',
      createdBy: {
        _id: '1',
        name: 'Administrador',
        email: 'admin@sellone.com'
      },
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      _id: '2',
      apelido: 'Beta Corp',
      razaoSocial: 'Beta Corporation S.A.',
      idDistribuidor: 'DIST002',
      contato: {
        nome: 'Maria Santos',
        email: 'maria@beta.com',
        telefone: '11988776655',
        cargo: 'Diretora'
      },
      origem: 'Site',
      atendimento: {
        horario: '09:00 às 17:00',
        dias: 'Segunda a Sexta',
        observacoes: 'Atendimento via WhatsApp'
      },
      frete: {
        tipo: 'FOB',
        valor: 0,
        prazo: 5,
        observacoes: 'Cliente retira'
      },
      pedidoMinimo: {
        valor: 500.00,
        observacoes: 'Valor mínimo para pedidos especiais'
      },
      endereco: {
        cep: '04567-890',
        logradouro: 'Av. Paulista, 1000',
        numero: '1000',
        complemento: '15º andar',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        uf: 'SP'
      },
      isActive: true,
      observacoes: 'Grande distribuidor regional',
      createdBy: {
        _id: '1',
        name: 'Administrador',
        email: 'admin@sellone.com'
      },
      createdAt: '2024-01-20T14:30:00Z',
      updatedAt: '2024-01-20T14:30:00Z'
    },
    {
      _id: '3',
      apelido: 'Gamma Tech',
      razaoSocial: 'Gamma Tecnologia Ltda',
      idDistribuidor: 'DIST003',
      contato: {
        nome: 'Carlos Oliveira',
        email: 'carlos@gamma.com',
        telefone: '11977665544',
        cargo: 'Coordenador'
      },
      origem: 'Feira',
      atendimento: {
        horario: '08:30 às 17:30',
        dias: 'Segunda a Sexta',
        observacoes: 'Atendimento especializado'
      },
      frete: {
        tipo: 'TERCEIRO',
        valor: 0,
        prazo: 7,
        observacoes: 'Transportadora própria'
      },
      pedidoMinimo: {
        valor: 300.00,
        observacoes: 'Valor mínimo para pedidos'
      },
      endereco: {
        cep: '05678-901',
        logradouro: 'Rua da Tecnologia, 456',
        numero: '456',
        complemento: 'Bloco B',
        bairro: 'Vila Olímpia',
        cidade: 'São Paulo',
        uf: 'SP'
      },
      isActive: false,
      observacoes: 'Distribuidor inativo temporariamente',
      createdBy: {
        _id: '1',
        name: 'Administrador',
        email: 'admin@sellone.com'
      },
      createdAt: '2024-02-01T09:15:00Z',
      updatedAt: '2024-02-01T09:15:00Z'
    }
  ];

  const { page = 1, limit = 10, search, origem, isActive } = req.query;
  const skip = (page - 1) * limit;

  let filteredDistributors = distributors;

  if (search) {
    const searchLower = search.toLowerCase();
    filteredDistributors = distributors.filter(d => 
      d.apelido.toLowerCase().includes(searchLower) ||
      d.razaoSocial.toLowerCase().includes(searchLower) ||
      d.idDistribuidor.toLowerCase().includes(searchLower) ||
      d.contato.nome.toLowerCase().includes(searchLower) ||
      d.contato.telefone.includes(search)
    );
  }

  if (origem) {
    filteredDistributors = filteredDistributors.filter(d => d.origem === origem);
  }

  if (isActive !== undefined) {
    filteredDistributors = filteredDistributors.filter(d => d.isActive === (isActive === 'true'));
  }

  const paginatedDistributors = filteredDistributors.slice(skip, skip + parseInt(limit));

  res.json({
    success: true,
    data: paginatedDistributors,
    pagination: {
      current: parseInt(page),
      pages: Math.ceil(filteredDistributors.length / limit),
      total: filteredDistributors.length,
      limit: parseInt(limit)
    }
  });
});

// Rota para buscar distribuidor específico
app.get('/api/distributors/:id', (req, res) => {
  const distributors = [
    {
      _id: '1',
      apelido: 'Distribuidor Alpha',
      razaoSocial: 'Alpha Distribuidora Ltda',
      idDistribuidor: 'DIST001',
      contato: {
        nome: 'João Silva',
        email: 'joao@alpha.com',
        telefone: '11999887766',
        cargo: 'Gerente'
      },
      origem: 'Indicação',
      atendimento: {
        horario: '08:00 às 18:00',
        dias: 'Segunda a Sexta',
        observacoes: 'Atendimento prioritário'
      },
      frete: {
        tipo: 'CIF',
        valor: 50.00,
        prazo: 3,
        observacoes: 'Frete grátis acima de R$ 500'
      },
      pedidoMinimo: {
        valor: 200.00,
        observacoes: 'Valor mínimo para pedidos'
      },
      endereco: {
        cep: '01234-567',
        logradouro: 'Rua das Flores, 123',
        numero: '123',
        complemento: 'Sala 45',
        bairro: 'Centro',
        cidade: 'São Paulo',
        uf: 'SP'
      },
      isActive: true,
      observacoes: 'Distribuidor confiável',
      createdBy: {
        _id: '1',
        name: 'Administrador',
        email: 'admin@sellone.com'
      },
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    }
  ];

  const distributor = distributors.find(d => d._id === req.params.id);
  
  if (!distributor) {
    return res.status(404).json({
      success: false,
      message: 'Distribuidor não encontrado'
    });
  }

  res.json({
    success: true,
    data: distributor
  });
});

// Rota para criar distribuidor
app.post('/api/distributors', (req, res) => {
  const newDistributor = {
    _id: Date.now().toString(),
    ...req.body,
    createdBy: {
      _id: '1',
      name: 'Administrador',
      email: 'admin@sellone.com'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  res.status(201).json({
    success: true,
    data: newDistributor
  });
});

// Rota para atualizar distribuidor
app.put('/api/distributors/:id', (req, res) => {
  const updatedDistributor = {
    _id: req.params.id,
    ...req.body,
    createdBy: {
      _id: '1',
      name: 'Administrador',
      email: 'admin@sellone.com'
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: new Date().toISOString()
  };

  res.json({
    success: true,
    data: updatedDistributor
  });
});

// Rota para deletar distribuidor
app.delete('/api/distributors/:id', (req, res) => {
  res.json({
    success: true,
    message: 'Distribuidor deletado com sucesso'
  });
});

// Rota de propostas
app.get('/api/proposals', (req, res) => {
  const proposals = [
    {
      _id: '1',
      productCode: 'CRM-PRO-001',
      productName: 'Sistema CRM Pro',
      pricing: {
        aVista: 299.90,
        tresXBoleto: 319.90,
        tresXCartao: 329.90
      },
      client: {
        name: 'Empresa ABC',
        email: 'contato@empresaabc.com',
        phone: '11999999999',
        company: 'ABC Corp'
      },
      status: 'sent',
      validUntil: '2024-03-15T00:00:00Z',
      notes: 'Proposta especial para cliente VIP',
      createdBy: {
        _id: '1',
        name: 'Administrador',
        email: 'admin@sellone.com'
      },
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    }
  ];

  const { page = 1, limit = 10, status, search } = req.query;
  const skip = (page - 1) * limit;

  let filteredProposals = proposals;

  if (status) {
    filteredProposals = filteredProposals.filter(p => p.status === status);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filteredProposals = filteredProposals.filter(p => 
      p.productName.toLowerCase().includes(searchLower) ||
      p.client.name.toLowerCase().includes(searchLower) ||
      p.client.company?.toLowerCase().includes(searchLower)
    );
  }

  const paginatedProposals = filteredProposals.slice(skip, skip + parseInt(limit));

  res.json({
    success: true,
    data: paginatedProposals,
    pagination: {
      current: parseInt(page),
      pages: Math.ceil(filteredProposals.length / limit),
      total: filteredProposals.length,
      limit: parseInt(limit)
    }
  });
});

// Rota de estatísticas de propostas
app.get('/api/proposals/stats/summary', (req, res) => {
  res.json({
    success: true,
    data: {
      totalProposals: 12,
      draftProposals: 3,
      sentProposals: 5,
      acceptedProposals: 2,
      rejectedProposals: 1,
      expiredProposals: 1
    }
  });
});

// Armazenamento em memória para lista de preços
let priceListData = [
  {
    _id: '1',
    distributor: {
      _id: '1',
      apelido: 'Distribuidor Alpha',
      razaoSocial: 'Alpha Distribuidora Ltda'
    },
    product: {
      _id: '1',
      name: 'Sistema CRM Pro',
      description: 'Sistema completo de gestão'
    },
    pricing: {
      aVista: 299.90,
      tresXBoleto: 319.90,
      tresXCartao: 329.90
    },
    isActive: true,
    validFrom: '2024-01-01T00:00:00Z',
    validUntil: '2024-12-31T23:59:59Z',
    notes: 'Preço especial para distribuidor',
    createdBy: {
      _id: '1',
      name: 'Administrador',
      email: 'admin@sellone.com'
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    _id: '2',
    distributor: {
      _id: '1',
      apelido: 'Distribuidor Alpha',
      razaoSocial: 'Alpha Distribuidora Ltda'
    },
    product: {
      _id: '2',
      name: 'Consultoria Empresarial',
      description: 'Consultoria especializada em transformação digital'
    },
    pricing: {
      aVista: 1500.00,
      tresXBoleto: 1600.00,
      tresXCartao: 1700.00
    },
    isActive: true,
    validFrom: '2024-01-01T00:00:00Z',
    validUntil: '2024-12-31T23:59:59Z',
    notes: 'Consultoria premium',
    createdBy: {
      _id: '1',
      name: 'Administrador',
      email: 'admin@sellone.com'
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    _id: '3',
    distributor: {
      _id: '2',
      apelido: 'Beta Corp',
      razaoSocial: 'Beta Corporation S.A.'
    },
    product: {
      _id: '1',
      name: 'Sistema CRM Pro',
      description: 'Sistema completo de gestão'
    },
    pricing: {
      aVista: 350.00,
      tresXBoleto: 370.00,
      tresXCartao: 380.00
    },
    isActive: true,
    validFrom: '2024-01-01T00:00:00Z',
    validUntil: '2024-12-31T23:59:59Z',
    notes: 'Preço para Beta Corp',
    createdBy: {
      _id: '1',
      name: 'Administrador',
      email: 'admin@sellone.com'
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    _id: '4',
    distributor: {
      _id: '2',
      apelido: 'Beta Corp',
      razaoSocial: 'Beta Corporation S.A.'
    },
    product: {
      _id: '3',
      name: 'Plano Premium',
      description: 'Plano premium com recursos avançados'
    },
    pricing: {
      aVista: 199.90,
      tresXBoleto: 219.90,
      tresXCartao: 229.90
    },
    isActive: true,
    validFrom: '2024-01-01T00:00:00Z',
    validUntil: '2024-12-31T23:59:59Z',
    notes: 'Plano premium Beta',
    createdBy: {
      _id: '1',
      name: 'Administrador',
      email: 'admin@sellone.com'
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }
];

// Rota de lista de preços
app.get('/api/price-list', async (req, res) => {
  try {
    const { page = 1, limit = 10, distributor, product, isActive } = req.query;
    const skip = (page - 1) * limit;

    let query = { createdBy: '68c1afbcf906c14a8e7e8ff7' }; // ID do usuário fixo para desenvolvimento
    
    if (distributor) {
      query.distributor = distributor;
    }
    
    if (product) {
      query.product = product;
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    // Buscar todos os itens da lista de preços
    console.log('Query para buscar itens:', query);
    const priceList = await PriceList.find(query)
      .populate('distributor', 'apelido razaoSocial contato.nome')
      .populate('product', 'name description price category')
      .populate('createdBy', 'name email')
      .sort({ 'distributor.apelido': 1, 'product.name': 1 });
    
    console.log('Itens encontrados no banco:', priceList.length);

    // Agrupar por distribuidor
    const groupedData = priceList.reduce((acc, item) => {
      const distributorId = item.distributor._id.toString();
      
      if (!acc[distributorId]) {
        acc[distributorId] = {
          distributor: item.distributor,
          products: []
        };
      }
      
      acc[distributorId].products.push({
        _id: item._id,
        product: item.product,
        pricing: item.pricing,
        isActive: item.isActive,
        validFrom: item.validFrom,
        validUntil: item.validUntil,
        notes: item.notes,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      });
      
      return acc;
    }, {});

    // Converter para array e aplicar paginação
    const groupedArray = Object.values(groupedData);
    const total = groupedArray.length;
    const paginatedData = groupedArray.slice(skip, skip + parseInt(limit));

    console.log('Dados agrupados enviados para o frontend:', JSON.stringify(paginatedData, null, 2));

    res.json({
      success: true,
      data: paginatedData,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar lista de preços:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para criar item da lista de preços
app.post('/api/price-list', async (req, res) => {
  try {
    const {
      distributor,
      product,
      pricing,
      isActive,
      validFrom,
      validUntil,
      notes
    } = req.body;

    // Validações básicas
    if (!distributor || !product || !pricing) {
      return res.status(400).json({ 
        error: 'Distribuidor, produto e preços são obrigatórios' 
      });
    }

    if (!pricing.aVista || !pricing.tresXBoleto || !pricing.tresXCartao) {
      return res.status(400).json({ 
        error: 'Todos os valores de preço são obrigatórios' 
      });
    }

    // Verificar se já existe um item para este distribuidor e produto
    const existingItem = await PriceList.findOne({
      distributor,
      product,
      createdBy: '68c1afbcf906c14a8e7e8ff7'
    });

    if (existingItem) {
      return res.status(400).json({ 
        error: 'Já existe um preço cadastrado para este distribuidor e produto' 
      });
    }

    const priceItem = new PriceList({
      distributor,
      product,
      pricing,
      validFrom: validFrom ? new Date(validFrom) : undefined,
      validUntil: validUntil ? new Date(validUntil) : undefined,
      notes,
      createdBy: '68c1afbcf906c14a8e7e8ff7'
    });

    await priceItem.save();
    await priceItem.populate('distributor', 'apelido razaoSocial contato.nome');
    await priceItem.populate('product', 'name description price category');
    await priceItem.populate('createdBy', 'name email');

    res.status(201).json({ 
      success: true,
      data: priceItem 
    });
  } catch (error) {
    console.error('Erro ao criar item da lista de preços:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para atualizar item da lista de preços
app.put('/api/price-list/:id', (req, res) => {
  const { pricing, isActive, validFrom, validUntil, notes } = req.body;
  
  const updatedPriceItem = {
    _id: req.params.id,
    distributor: {
      _id: '1',
      apelido: 'Distribuidor Alpha',
      razaoSocial: 'Alpha Distribuidora Ltda'
    },
    product: {
      _id: '1',
      name: 'Sistema CRM Pro',
      description: 'Sistema completo de gestão'
    },
    pricing: pricing || { aVista: 0, tresXBoleto: 0, tresXCartao: 0 },
    isActive: isActive !== undefined ? isActive : true,
    validFrom: validFrom || new Date().toISOString(),
    validUntil: validUntil || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    notes: notes || '',
    createdBy: {
      _id: '1',
      name: 'Administrador',
      email: 'admin@sellone.com'
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: new Date().toISOString()
  };

  res.json({
    success: true,
    data: updatedPriceItem
  });
});

// Rota para deletar item da lista de preços
app.delete('/api/price-list/:id', async (req, res) => {
  try {
    console.log('Tentando deletar item:', req.params.id);
    
    // Primeiro, verificar se o item existe
    const existingItem = await PriceList.findOne({
      _id: req.params.id,
      createdBy: '68c1afbcf906c14a8e7e8ff7'
    });
    
    if (!existingItem) {
      console.log('Item não encontrado ou não pertence ao usuário');
      return res.status(404).json({ error: 'Item não encontrado' });
    }
    
    console.log('Item encontrado, procedendo com a exclusão:', existingItem);
    
    const priceItem = await PriceList.findOneAndDelete({
      _id: req.params.id,
      createdBy: '68c1afbcf906c14a8e7e8ff7'
    });

    if (!priceItem) {
      console.log('Falha na exclusão - item não foi deletado');
      return res.status(500).json({ error: 'Falha ao deletar item' });
    }

    console.log('Item deletado com sucesso do banco de dados:', priceItem._id);
    
    // Verificar se o item foi realmente deletado
    const verifyDeletion = await PriceList.findOne({ _id: req.params.id });
    console.log('Verificação pós-exclusão - item ainda existe?', !!verifyDeletion);
    
    // Verificar quantos itens restam no banco para este usuário
    const remainingItems = await PriceList.countDocuments({ createdBy: '68c1afbcf906c14a8e7e8ff7' });
    console.log('Total de itens restantes para o usuário:', remainingItems);
    
    res.json({ 
      success: true,
      message: 'Item da lista de preços deletado com sucesso',
      deletedItem: priceItem._id,
      remainingItems: remainingItems
    });
  } catch (error) {
    console.error('Erro ao deletar item da lista de preços:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, 'sales-crm/build')));

// Rota para servir o React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'sales-crm/build', 'index.html'));
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`🚀 Servidor SellOne completo rodando na porta ${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(`🔐 Login: admin@sellone.com / 123456`);
});
