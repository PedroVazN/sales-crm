const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rota da API
app.get('/api', (req, res) => {
  res.json({
    message: 'Bem-vindo ao SellOne API',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString()
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
      role: 'admin'
    },
    {
      _id: '2',
      name: 'Vendedor',
      email: 'vendedor@sellone.com',
      password: '123456',
      role: 'vendedor'
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

// Rotas simuladas
app.get('/api/products', (req, res) => {
  const products = [
    {
      _id: '1',
      name: 'Sistema CRM Pro',
      description: 'Sistema completo de gestão de relacionamento com clientes',
      price: 299.90,
      category: 'Software',
      stock: { current: 50, min: 10 },
      isActive: true,
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      _id: '2',
      name: 'Consultoria Empresarial',
      description: 'Consultoria especializada em transformação digital',
      price: 1500.00,
      category: 'Serviços',
      stock: { current: 25, min: 5 },
      isActive: true,
      createdAt: '2024-01-20T14:30:00Z'
    },
    {
      _id: '3',
      name: 'Plano Premium',
      description: 'Plano premium com recursos avançados',
      price: 199.90,
      category: 'Assinatura',
      stock: { current: 100, min: 20 },
      isActive: true,
      createdAt: '2024-02-01T09:15:00Z'
    },
    {
      _id: '4',
      name: 'Treinamento Online',
      description: 'Curso completo de vendas e negociação',
      price: 89.90,
      category: 'Educação',
      stock: { current: 0, min: 15 },
      isActive: true,
      createdAt: '2024-02-10T16:45:00Z'
    },
    {
      _id: '5',
      name: 'Relatórios Avançados',
      description: 'Módulo de relatórios e analytics avançados',
      price: 149.90,
      category: 'Software',
      stock: { current: 75, min: 10 },
      isActive: true,
      createdAt: '2024-02-15T11:20:00Z'
    }
  ];
  
  res.json({
    success: true,
    data: products,
    pagination: { total: products.length }
  });
});

app.get('/api/sales', (req, res) => {
  res.json({
    success: true,
    data: [],
    pagination: { total: 0 }
  });
});

app.get('/api/users', (req, res) => {
  res.json({
    success: true,
    data: [],
    pagination: { total: 0 }
  });
});

app.get('/api/sales/stats/summary', (req, res) => {
  res.json({
    success: true,
    data: {
      totalSales: 0,
      totalRevenue: 0,
      averageSale: 0,
      totalItems: 0
    }
  });
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`🚀 Servidor de teste rodando na porta ${PORT}`);
  console.log(`🌐 API: http://localhost:${PORT}/api`);
});
