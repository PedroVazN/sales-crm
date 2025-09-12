const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

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

// Rota de login simples
app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('Login attempt:', email, password);
  
  // Usuários fixos
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

// Rotas de Distribuidores
app.get('/api/distributors', (req, res) => {
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

  const { page = 1, limit = 10, search } = req.query;
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

app.delete('/api/distributors/:id', (req, res) => {
  res.json({
    success: true,
    message: 'Distribuidor deletado com sucesso'
  });
});

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, 'sales-crm/build')));

// Rota para servir o React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'sales-crm/build', 'index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor SellOne unificado rodando na porta ${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
});
