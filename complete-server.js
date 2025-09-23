const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

// Middlewares
app.use(cors({
  origin: [
    'http://localhost:3001', 
    'http://localhost:3000',
    'https://sales-crm-wine.vercel.app',
    'https://sales-crm-frontend.vercel.app',
    'https://*.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

// Middleware para lidar com requisições OPTIONS (preflight)
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Carregar variáveis de ambiente (apenas em desenvolvimento)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Importar configuração do banco de dados
const { connectDB, setupModels, checkConnection } = require('./config/database');

// Conectar ao MongoDB e configurar modelos
const initializeDatabase = async () => {
  try {
    console.log('🔄 Inicializando banco de dados...');
    const connected = await connectDB();
    if (connected) {
      setupModels();
      console.log('✅ Banco de dados inicializado com sucesso');
    } else {
      console.log('⚠️ Banco de dados não conectado, mas servidor continuará funcionando');
    }
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error.message);
  }
};

// Inicializar banco de dados
initializeDatabase();

// Rota da API
app.get('/api', (req, res) => {
  res.json({
    message: 'Bem-vindo ao SellOne API',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// Middleware para verificar conexão com o banco de dados
app.use('/api', checkConnection);

// Importar e usar as rotas
const clientsRouter = require('./routes/clients');
app.use('/api/clients', clientsRouter);

const eventsRouter = require('./routes/events');
app.use('/api/events', eventsRouter);

const goalsRouter = require('./routes/goals');
app.use('/api/goals', goalsRouter);

const notificationsRouter = require('./routes/notifications');
app.use('/api/notifications', notificationsRouter);

const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);

const productsRouter = require('./routes/products');
app.use('/api/products', productsRouter);

const distributorsRouter = require('./routes/distributors');
app.use('/api/distributors', distributorsRouter);

const salesRouter = require('./routes/sales');
app.use('/api/sales', salesRouter);

const proposalsRouter = require('./routes/proposals');
app.use('/api/proposals', proposalsRouter);

const priceListRouter = require('./routes/priceList');
app.use('/api/price-list', priceListRouter);

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API funcionando',
    database: mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado',
    readyState: mongoose.connection.readyState
  });
});

// Rota de teste de banco de dados
app.get('/api/test-db', (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState;
    const dbName = mongoose.connection.name;
    const dbHost = mongoose.connection.host;
    
    res.json({
      success: true,
      database: {
        status: dbStatus === 1 ? 'Conectado' : 'Desconectado',
        readyState: dbStatus,
        name: dbName,
        host: dbHost
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

// Rota para tentar reconectar ao banco
app.get('/api/reconnect-db', async (req, res) => {
  try {
    console.log('🔄 Tentando reconectar ao MongoDB...');
    
    // Fechar conexão existente se houver
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('🔌 Conexão anterior fechada');
    }
    
    // Tentar conectar novamente
    const { connectDB } = require('./config/database');
    const connected = await connectDB();
    
    res.json({
      success: true,
      connected,
      message: connected ? 'Conexão estabelecida com sucesso' : 'Falha na conexão',
      database: {
        status: mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado',
        readyState: mongoose.connection.readyState,
        name: mongoose.connection.name,
        host: mongoose.connection.host
      }
    });
  } catch (error) {
    console.error('❌ Erro ao reconectar:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      connected: false
    });
  }
});

// Rota de teste para verificar se o servidor está funcionando
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend funcionando!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Para Vercel, não precisamos do app.listen
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor SellOne funcionando na porta ${PORT}`);
    console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Frontend: http://localhost:${PORT}`);
    console.log(`🔗 API: http://localhost:${PORT}/api`);
    console.log(`🔐 Login: admin@sellone.com / 123456`);
  });
}

module.exports = app;