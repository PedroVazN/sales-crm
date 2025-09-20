const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

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

// Middleware para verificar conexão (opcional)
const checkDB = async (req, res, next) => {
  // Por enquanto, sempre permitir acesso mesmo sem banco
  // Em produção, você pode habilitar a verificação do banco
  next();
};

// Rota principal
app.get('/', (req, res) => {
  res.json({
    message: 'SellOne API - Novo Backend',
    version: '2.0.0',
    status: 'online',
    timestamp: new Date().toISOString()
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

// Rota de clientes simples
app.get('/api/clients', async (req, res) => {
  try {
    // Simular dados de clientes por enquanto
    const clients = [
      {
        _id: '1',
        name: 'Cliente Teste 1',
        email: 'cliente1@teste.com',
        phone: '(11) 99999-9999',
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        name: 'Cliente Teste 2',
        email: 'cliente2@teste.com',
        phone: '(11) 88888-8888',
        createdAt: new Date().toISOString()
      }
    ];

    res.json({
      success: true,
      data: clients,
      message: 'Clientes carregados com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Rota de produtos simples
app.get('/api/products', async (req, res) => {
  try {
    const products = [
      {
        _id: '1',
        name: 'Produto Teste 1',
        price: 100.00,
        category: 'Categoria A',
        stock: 10,
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        name: 'Produto Teste 2',
        price: 200.00,
        category: 'Categoria B',
        stock: 5,
        createdAt: new Date().toISOString()
      }
    ];

    res.json({
      success: true,
      data: products,
      message: 'Produtos carregados com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Rota de vendas simples
app.get('/api/sales', async (req, res) => {
  try {
    const sales = [
      {
        _id: '1',
        saleNumber: 'V001',
        total: 300.00,
        status: 'finalizada',
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        saleNumber: 'V002',
        total: 150.00,
        status: 'pendente',
        createdAt: new Date().toISOString()
      }
    ];

    res.json({
      success: true,
      data: sales,
      message: 'Vendas carregadas com sucesso'
    });
  } catch (error) {
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
