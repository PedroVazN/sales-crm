const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middlewares
app.use(cors({
  origin: ['http://localhost:3000', 'https://sales-crm.vercel.app'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Função de conexão com MongoDB
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('✅ MongoDB já conectado');
      return true;
    }

    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.log('❌ MONGODB_URI não encontrada');
      return false;
    }

    console.log('🔗 Conectando ao MongoDB...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 20000,
      connectTimeoutMS: 10000,
      maxPoolSize: 1,
      bufferCommands: false
    });

    console.log('✅ MongoDB conectado com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar MongoDB:', error.message);
    return false;
  }
};

// Rota principal
app.get('/', (req, res) => {
  res.json({
    message: 'SellOne API v3.0 - Backend Limpo e Funcional',
    version: '3.0.0',
    status: 'online',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API funcionando perfeitamente!',
    timestamp: new Date().toISOString(),
    status: 'OK'
  });
});

// Rota de teste do banco
app.get('/api/test-db', async (req, res) => {
  const isConnected = await connectDB();
  res.json({
    success: true,
    database: {
      status: isConnected ? 'Conectado' : 'Desconectado',
      readyState: mongoose.connection.readyState
    },
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasMongoUri: !!process.env.MONGODB_URI
    }
  });
});

// Rota de clientes (mock data por enquanto)
app.get('/api/clients', async (req, res) => {
  try {
    const mockClients = [
      {
        _id: '1',
        razaoSocial: 'Cliente Teste 1',
        nomeFantasia: 'Teste 1',
        cnpj: '12.345.678/0001-90',
        contato: {
          nome: 'João Silva',
          email: 'joao@teste.com',
          telefone: '(11) 99999-9999'
        },
        endereco: {
          uf: 'SP',
          cidade: 'São Paulo'
        },
        classificacao: 'A',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        razaoSocial: 'Cliente Teste 2',
        nomeFantasia: 'Teste 2',
        cnpj: '98.765.432/0001-10',
        contato: {
          nome: 'Maria Santos',
          email: 'maria@teste.com',
          telefone: '(11) 88888-8888'
        },
        endereco: {
          uf: 'RJ',
          cidade: 'Rio de Janeiro'
        },
        classificacao: 'B',
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];

    res.json({
      success: true,
      data: mockClients,
      pagination: {
        current: 1,
        pages: 1,
        total: 2,
        limit: 10
      },
      message: 'Clientes carregados com sucesso'
    });
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Rota de produtos (mock data por enquanto)
app.get('/api/products', async (req, res) => {
  try {
    const mockProducts = [
      {
        _id: '1',
        name: 'Produto Teste 1',
        description: 'Descrição do produto 1',
        price: 100.00,
        category: 'Categoria A',
        sku: 'SKU001',
        stock: 10,
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        name: 'Produto Teste 2',
        description: 'Descrição do produto 2',
        price: 200.00,
        category: 'Categoria B',
        sku: 'SKU002',
        stock: 5,
        createdAt: new Date().toISOString()
      }
    ];

    res.json({
      success: true,
      data: mockProducts,
      pagination: {
        current: 1,
        pages: 1,
        total: 2,
        limit: 10
      },
      message: 'Produtos carregados com sucesso'
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Rota de vendas (mock data por enquanto)
app.get('/api/sales', async (req, res) => {
  try {
    const mockSales = [
      {
        _id: '1',
        saleNumber: 'V001',
        total: 300.00,
        status: 'finalizada',
        paymentStatus: 'pago',
        customer: {
          name: 'Cliente Teste 1',
          email: 'cliente1@teste.com'
        },
        seller: {
          name: 'Vendedor Teste',
          email: 'vendedor@teste.com'
        },
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        saleNumber: 'V002',
        total: 150.00,
        status: 'pendente',
        paymentStatus: 'pendente',
        customer: {
          name: 'Cliente Teste 2',
          email: 'cliente2@teste.com'
        },
        seller: {
          name: 'Vendedor Teste',
          email: 'vendedor@teste.com'
        },
        createdAt: new Date().toISOString()
      }
    ];

    res.json({
      success: true,
      data: mockSales,
      pagination: {
        current: 1,
        pages: 1,
        total: 2,
        limit: 10
      },
      message: 'Vendas carregadas com sucesso'
    });
  } catch (error) {
    console.error('Erro ao buscar vendas:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Rota de usuários (mock data por enquanto)
app.get('/api/users', async (req, res) => {
  try {
    const mockUsers = [
      {
        _id: '1',
        name: 'Usuário Admin',
        email: 'admin@sellone.com',
        role: 'admin',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        name: 'Vendedor Teste',
        email: 'vendedor@sellone.com',
        role: 'vendedor',
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];

    res.json({
      success: true,
      data: mockUsers,
      pagination: {
        current: 1,
        pages: 1,
        total: 2,
        limit: 10
      },
      message: 'Usuários carregados com sucesso'
    });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Rota de propostas (mock data por enquanto)
app.get('/api/proposals', async (req, res) => {
  try {
    const mockProposals = [
      {
        _id: '1',
        proposalNumber: 'P001',
        status: 'ativa',
        client: {
          name: 'Cliente Teste 1',
          email: 'cliente1@teste.com',
          phone: '(11) 99999-9999'
        },
        seller: {
          name: 'Vendedor Teste',
          email: 'vendedor@teste.com'
        },
        total: 500.00,
        createdAt: new Date().toISOString()
      }
    ];

    res.json({
      success: true,
      data: mockProposals,
      pagination: {
        current: 1,
        pages: 1,
        total: 1,
        limit: 10
      },
      message: 'Propostas carregadas com sucesso'
    });
  } catch (error) {
    console.error('Erro ao buscar propostas:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Rota de distribuidores (mock data por enquanto)
app.get('/api/distributors', async (req, res) => {
  try {
    const mockDistributors = [
      {
        _id: '1',
        apelido: 'Distribuidor Teste 1',
        razaoSocial: 'Distribuidor Teste 1 LTDA',
        contato: {
          nome: 'João Distribuidor',
          telefone: '(11) 77777-7777'
        },
        origem: 'Sistema',
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];

    res.json({
      success: true,
      data: mockDistributors,
      pagination: {
        current: 1,
        pages: 1,
        total: 1,
        limit: 10
      },
      message: 'Distribuidores carregados com sucesso'
    });
  } catch (error) {
    console.error('Erro ao buscar distribuidores:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Rota de estatísticas (mock data por enquanto)
app.get('/api/stats', async (req, res) => {
  try {
    const mockStats = {
      totalClients: 2,
      totalProducts: 2,
      totalSales: 2,
      totalUsers: 2,
      totalProposals: 1,
      monthlyRevenue: 450.00,
      monthlySales: 2
    };

    res.json({
      success: true,
      data: mockStats,
      message: 'Estatísticas carregadas com sucesso'
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Rota de health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API funcionando perfeitamente',
    database: mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado',
    readyState: mongoose.connection.readyState,
    timestamp: new Date().toISOString()
  });
});

// Rota catch-all para 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada',
    message: 'Verifique a URL e tente novamente'
  });
});

module.exports = app;