const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Importar modelos
const User = require('./models/User');
const Client = require('./models/Client');
const Product = require('./models/Product');
const Sale = require('./models/Sale');
const Proposal = require('./models/Proposal');
const Distributor = require('./models/DistributorNew');
const Event = require('./models/Event');
const Goal = require('./models/Goal');
const Notification = require('./models/Notification');
const PriceList = require('./models/PriceList');

const app = express();

// Middlewares
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://sales-crm-wine.vercel.app',
    'https://sales-crm-frontend.vercel.app',
    'https://*.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração do MongoDB otimizada para serverless
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return true;
    }

    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI não encontrada');
      return false;
    }

    await mongoose.connect(mongoUri, {
      maxPoolSize: 1,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
      connectTimeoutMS: 5000,
      retryWrites: true,
      w: 'majority',
      bufferCommands: false
    });

    console.log('✅ MongoDB conectado');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar MongoDB:', error.message);
    return false;
  }
};

// Middleware para verificar conexão
const checkDB = async (req, res, next) => {
  const isConnected = await connectDB();
  if (!isConnected) {
    return res.status(503).json({
      success: false,
      error: "Banco de dados não conectado",
      message: "Serviço temporariamente indisponível"
    });
  }
  next();
};

// Rota principal
app.get('/', (req, res) => {
  res.json({
    message: 'SellOne API v2.0 - Backend Principal',
    version: '2.0.0',
    status: 'online',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API funcionando!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

// Rota de teste do banco
app.get('/api/test-db', async (req, res) => {
  try {
    const isConnected = await connectDB();
    res.json({
      success: true,
      database: {
        status: isConnected ? 'Conectado' : 'Desconectado',
        readyState: mongoose.connection.readyState,
        name: mongoose.connection.name || 'N/A',
        host: mongoose.connection.host || 'N/A'
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasMongoUri: !!process.env.MONGODB_URI
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Rota de reconexão
app.get('/api/reconnect', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    
    const connected = await connectDB();
    res.json({
      success: true,
      connected,
      message: connected ? 'Conexão estabelecida' : 'Falha na conexão',
      database: {
        status: mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado',
        readyState: mongoose.connection.readyState
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Rotas da API com verificação de banco
app.use('/api', checkDB);

// Rota de clientes com dados reais
app.get('/api/clients', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, uf, classificacao, isActive } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    
    if (search) {
      query.$or = [
        { razaoSocial: { $regex: search, $options: 'i' } },
        { nomeFantasia: { $regex: search, $options: 'i' } },
        { cnpj: { $regex: search, $options: 'i' } },
        { 'contato.nome': { $regex: search, $options: 'i' } },
        { 'contato.email': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (uf) {
      query['endereco.uf'] = uf;
    }
    
    if (classificacao) {
      query.classificacao = classificacao;
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const clients = await Client.find(query)
      .populate('createdBy', 'name email')
      .sort({ razaoSocial: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Client.countDocuments(query);

    res.json({
      success: true,
      data: clients,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
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

// Rota de produtos com dados reais
app.get('/api/products', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { barcode: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.category = category;
    }

    const products = await Product.find(query)
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

// Rota de vendas com dados reais
app.get('/api/sales', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, paymentStatus } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    const sales = await Sale.find(query)
      .populate('customer', 'name email')
      .populate('seller', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Sale.countDocuments(query);

    res.json({
      success: true,
      data: sales,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
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

// Rota de usuários com dados reais
app.get('/api/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ name: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
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

// Rota de propostas com dados reais
app.get('/api/proposals', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    
    if (search) {
      query.$or = [
        { proposalNumber: { $regex: search, $options: 'i' } },
        { 'client.name': { $regex: search, $options: 'i' } },
        { 'client.email': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) {
      query.status = status;
    }

    const proposals = await Proposal.find(query)
      .populate('client', 'name email phone')
      .populate('seller', 'name email')
      .populate('distributor', 'apelido razaoSocial')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Proposal.countDocuments(query);

    res.json({
      success: true,
      data: proposals,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
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

// Rota de distribuidores com dados reais
app.get('/api/distributors', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, origem, isActive } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    
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

// Rota de estatísticas gerais
app.get('/api/stats', async (req, res) => {
  try {
    const totalClients = await Client.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalSales = await Sale.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalProposals = await Proposal.countDocuments();

    // Calcular vendas do mês atual
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const salesThisMonth = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: currentMonth },
          status: 'finalizada'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' },
          count: { $sum: 1 }
        }
      }
    ]);

    const monthlyRevenue = salesThisMonth.length > 0 ? salesThisMonth[0].total : 0;
    const monthlySales = salesThisMonth.length > 0 ? salesThisMonth[0].count : 0;

    res.json({
      success: true,
      data: {
        totalClients,
        totalProducts,
        totalSales,
        totalUsers,
        totalProposals,
        monthlyRevenue,
        monthlySales
      },
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
    message: 'API funcionando',
    database: mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado',
    readyState: mongoose.connection.readyState,
    timestamp: new Date().toISOString()
  });
});

// Rota catch-all para 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
    path: req.originalUrl
  });
});

// Iniciar servidor apenas se não estiver em ambiente serverless
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor SellOne v2.0 funcionando na porta ${PORT}`);
    console.log(`🌐 API: http://localhost:${PORT}`);
    console.log(`🔗 Teste: http://localhost:${PORT}/api/test`);
  });
}

module.exports = app;
