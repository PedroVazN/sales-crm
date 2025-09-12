const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dados mockados para teste
const mockData = {
  clients: [
    {
      _id: '1',
      cnpj: '12345678000195',
      razaoSocial: 'Empresa Teste LTDA',
      nomeFantasia: 'Teste Corp',
      contato: {
        nome: 'João Silva',
        email: 'joao@teste.com',
        telefone: '11999999999',
        cargo: 'Gerente'
      },
      endereco: {
        cep: '01234567',
        logradouro: 'Rua Teste',
        numero: '123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        uf: 'SP'
      },
      classificacao: 'PROVEDOR',
      observacoes: 'Cliente de teste',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  distributors: [
    {
      _id: '1',
      apelido: 'Dist Teste',
      razaoSocial: 'Distribuidor Teste LTDA',
      idDistribuidor: 'DIST001',
      contato: {
        nome: 'Maria Santos',
        email: 'maria@dist.com',
        telefone: '11888888888',
        cargo: 'Vendedora'
      },
      origem: 'São Paulo',
      atendimento: {
        horario: '08:00 às 18:00',
        dias: 'Segunda a Sexta'
      },
      frete: {
        tipo: 'CIF',
        valor: 50,
        prazo: 3
      },
      pedidoMinimo: {
        valor: 1000,
        observacoes: 'Pedido mínimo de R$ 1.000'
      },
      endereco: {
        cep: '04567890',
        logradouro: 'Av. Distribuidor',
        numero: '456',
        bairro: 'Vila Olímpia',
        cidade: 'São Paulo',
        uf: 'SP'
      },
      observacoes: 'Distribuidor de teste',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  products: [
    {
      _id: '1',
      name: 'Produto Teste',
      description: 'Descrição do produto teste',
      price: 299.99,
      cost: 150.00,
      category: 'Eletrônicos',
      brand: 'Marca Teste',
      sku: 'PROD001',
      barcode: '1234567890123',
      stock: {
        current: 100,
        min: 10,
        max: 500
      },
      tags: ['teste', 'eletrônico'],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  priceList: [
    {
      _id: '1',
      distributor: {
        _id: '1',
        apelido: 'Dist Teste',
        razaoSocial: 'Distribuidor Teste LTDA',
        contato: {
          nome: 'Maria Santos'
        }
      },
      product: {
        _id: '1',
        name: 'Produto Teste',
        description: 'Descrição do produto teste',
        price: 299.99,
        category: 'Eletrônicos'
      },
      pricing: {
        aVista: 299.99,
        tresXBoleto: 319.99,
        tresXCartao: 329.99
      },
      isActive: true,
      validFrom: new Date().toISOString(),
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      notes: 'Preço de teste',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
};

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

// Rotas de clientes
app.get('/api/clients', (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  let clients = [...mockData.clients];
  
  if (search) {
    clients = clients.filter(client => 
      client.razaoSocial.toLowerCase().includes(search.toLowerCase()) ||
      client.nomeFantasia?.toLowerCase().includes(search.toLowerCase()) ||
      client.cnpj.includes(search)
    );
  }
  
  res.json({
    success: true,
    data: clients,
    pagination: {
      current: parseInt(page),
      pages: Math.ceil(clients.length / limit),
      total: clients.length,
      limit: parseInt(limit)
    }
  });
});

app.post('/api/clients', (req, res) => {
  const newClient = {
    _id: Date.now().toString(),
    ...req.body,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  mockData.clients.push(newClient);
  res.json({
    success: true,
    data: newClient
  });
});

app.put('/api/clients/:id', (req, res) => {
  const clientIndex = mockData.clients.findIndex(c => c._id === req.params.id);
  if (clientIndex === -1) {
    return res.status(404).json({ success: false, message: 'Cliente não encontrado' });
  }
  
  mockData.clients[clientIndex] = {
    ...mockData.clients[clientIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: mockData.clients[clientIndex]
  });
});

app.delete('/api/clients/:id', (req, res) => {
  const clientIndex = mockData.clients.findIndex(c => c._id === req.params.id);
  if (clientIndex === -1) {
    return res.status(404).json({ success: false, message: 'Cliente não encontrado' });
  }
  
  mockData.clients.splice(clientIndex, 1);
  res.json({
    success: true,
    message: 'Cliente deletado com sucesso'
  });
});

// Rotas de distribuidores
app.get('/api/distributors', (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  let distributors = [...mockData.distributors];
  
  if (search) {
    distributors = distributors.filter(dist => 
      dist.apelido.toLowerCase().includes(search.toLowerCase()) ||
      dist.razaoSocial.toLowerCase().includes(search.toLowerCase()) ||
      dist.idDistribuidor.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  res.json({
    success: true,
    data: distributors,
    pagination: {
      current: parseInt(page),
      pages: Math.ceil(distributors.length / limit),
      total: distributors.length,
      limit: parseInt(limit)
    }
  });
});

app.post('/api/distributors', (req, res) => {
  const newDistributor = {
    _id: Date.now().toString(),
    ...req.body,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  mockData.distributors.push(newDistributor);
  res.json({
    success: true,
    data: newDistributor
  });
});

app.put('/api/distributors/:id', (req, res) => {
  const distIndex = mockData.distributors.findIndex(d => d._id === req.params.id);
  if (distIndex === -1) {
    return res.status(404).json({ success: false, message: 'Distribuidor não encontrado' });
  }
  
  mockData.distributors[distIndex] = {
    ...mockData.distributors[distIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: mockData.distributors[distIndex]
  });
});

app.delete('/api/distributors/:id', (req, res) => {
  const distIndex = mockData.distributors.findIndex(d => d._id === req.params.id);
  if (distIndex === -1) {
    return res.status(404).json({ success: false, message: 'Distribuidor não encontrado' });
  }
  
  mockData.distributors.splice(distIndex, 1);
  res.json({
    success: true,
    message: 'Distribuidor deletado com sucesso'
  });
});

// Rotas de produtos
app.get('/api/products', (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  let products = [...mockData.products];
  
  if (search) {
    products = products.filter(product => 
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase()) ||
      product.description?.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  res.json({
    success: true,
    data: products,
    pagination: {
      current: parseInt(page),
      pages: Math.ceil(products.length / limit),
      total: products.length,
      limit: parseInt(limit)
    }
  });
});

app.post('/api/products', (req, res) => {
  const newProduct = {
    _id: Date.now().toString(),
    ...req.body,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  mockData.products.push(newProduct);
  res.json({
    success: true,
    data: newProduct
  });
});

app.put('/api/products/:id', (req, res) => {
  const productIndex = mockData.products.findIndex(p => p._id === req.params.id);
  if (productIndex === -1) {
    return res.status(404).json({ success: false, message: 'Produto não encontrado' });
  }
  
  mockData.products[productIndex] = {
    ...mockData.products[productIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: mockData.products[productIndex]
  });
});

app.delete('/api/products/:id', (req, res) => {
  const productIndex = mockData.products.findIndex(p => p._id === req.params.id);
  if (productIndex === -1) {
    return res.status(404).json({ success: false, message: 'Produto não encontrado' });
  }
  
  mockData.products.splice(productIndex, 1);
  res.json({
    success: true,
    message: 'Produto deletado com sucesso'
  });
});

// Rotas de lista de preços
app.get('/api/price-list', (req, res) => {
  const { page = 1, limit = 10, distributor, product, isActive } = req.query;
  let priceList = [...mockData.priceList];
  
  if (distributor) {
    priceList = priceList.filter(item => item.distributor._id === distributor);
  }
  
  if (product) {
    priceList = priceList.filter(item => item.product._id === product);
  }
  
  if (isActive !== undefined) {
    priceList = priceList.filter(item => item.isActive === (isActive === 'true'));
  }
  
  res.json({
    success: true,
    data: priceList,
    pagination: {
      current: parseInt(page),
      pages: Math.ceil(priceList.length / limit),
      total: priceList.length,
      limit: parseInt(limit)
    }
  });
});

app.post('/api/price-list', (req, res) => {
  const { distributor, product, pricing } = req.body;
  
  // Encontrar distribuidor e produto pelos IDs
  const distributorData = mockData.distributors.find(d => d._id === distributor);
  const productData = mockData.products.find(p => p._id === product);
  
  if (!distributorData || !productData) {
    return res.status(400).json({ success: false, message: 'Distribuidor ou produto não encontrado' });
  }
  
  const newPriceItem = {
    _id: Date.now().toString(),
    distributor: {
      _id: distributorData._id,
      apelido: distributorData.apelido,
      razaoSocial: distributorData.razaoSocial,
      contato: {
        nome: distributorData.contato.nome
      }
    },
    product: {
      _id: productData._id,
      name: productData.name,
      description: productData.description,
      price: productData.price,
      category: productData.category
    },
    pricing,
    isActive: true,
    validFrom: new Date().toISOString(),
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    notes: req.body.notes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  mockData.priceList.push(newPriceItem);
  res.json({
    success: true,
    data: newPriceItem
  });
});

app.put('/api/price-list/:id', (req, res) => {
  const priceIndex = mockData.priceList.findIndex(p => p._id === req.params.id);
  if (priceIndex === -1) {
    return res.status(404).json({ success: false, message: 'Item não encontrado' });
  }
  
  mockData.priceList[priceIndex] = {
    ...mockData.priceList[priceIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: mockData.priceList[priceIndex]
  });
});

app.delete('/api/price-list/:id', (req, res) => {
  const priceIndex = mockData.priceList.findIndex(p => p._id === req.params.id);
  if (priceIndex === -1) {
    return res.status(404).json({ success: false, message: 'Item não encontrado' });
  }
  
  mockData.priceList.splice(priceIndex, 1);
  res.json({
    success: true,
    message: 'Item deletado com sucesso'
  });
});

// Rotas de autenticação
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simulação de login - aceita qualquer email/senha para teste
  if (email && password) {
    const token = 'mock-jwt-token-' + Date.now();
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: 'dev-user-id',
          name: 'Usuário Desenvolvimento',
          email: email,
          role: 'admin'
        }
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Email e senha são obrigatórios'
    });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout realizado com sucesso'
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json({
    success: true,
    data: {
      id: 'dev-user-id',
      name: 'Usuário Desenvolvimento',
      email: 'dev@example.com',
      role: 'admin'
    }
  });
});

// Rotas de propostas
app.get('/api/proposals', (req, res) => {
  res.json({
    success: true,
    data: [],
    pagination: {
      current: 1,
      pages: 0,
      total: 0,
      limit: 10
    }
  });
});

app.post('/api/proposals', (req, res) => {
  const newProposal = {
    _id: Date.now().toString(),
    ...req.body,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  res.json({
    success: true,
    data: newProposal
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
  });
});

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor SellOne rodando na porta ${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Acesse: http://localhost:${PORT}`);
  console.log(`📋 API Status: http://localhost:${PORT}/api/status`);
});