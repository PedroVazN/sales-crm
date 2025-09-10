const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();

// Conectar ao MongoDB
connectDB();

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

// Rota de login simples
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Simular login com usuários fixos
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
      // Remover senha da resposta
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
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Rota de registro simples
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Simular criação de usuário
    const newUser = {
      _id: Date.now().toString(),
      name,
      email,
      role: role || 'cliente',
      isActive: true,
      createdAt: new Date().toISOString()
    };
    
    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: newUser
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Rotas de produtos (simuladas)
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        _id: '1',
        name: 'Produto 1',
        price: 99.90,
        category: 'Eletrônicos',
        stock: { current: 10 }
      },
      {
        _id: '2',
        name: 'Produto 2',
        price: 149.90,
        category: 'Roupas',
        stock: { current: 5 }
      }
    ],
    pagination: { total: 2 }
  });
});

// Rotas de vendas (simuladas)
app.get('/api/sales', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        _id: '1',
        saleNumber: 'VENDA-001',
        total: 199.80,
        status: 'finalizada',
        customer: { name: 'Cliente 1' },
        seller: { name: 'Vendedor 1' }
      }
    ],
    pagination: { total: 1 }
  });
});

// Rotas de usuários (simuladas)
app.get('/api/users', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        _id: '1',
        name: 'Administrador',
        email: 'admin@sellone.com',
        role: 'admin',
        isActive: true
      },
      {
        _id: '2',
        name: 'Vendedor',
        email: 'vendedor@sellone.com',
        role: 'vendedor',
        isActive: true
      }
    ],
    pagination: { total: 2 }
  });
});

// Estatísticas de vendas
app.get('/api/sales/stats/summary', (req, res) => {
  res.json({
    success: true,
    data: {
      totalSales: 1,
      totalRevenue: 199.80,
      averageSale: 199.80,
      totalItems: 2
    }
  });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`🚀 Servidor SellOne rodando na porta ${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API: http://localhost:${PORT}/api`);
});
