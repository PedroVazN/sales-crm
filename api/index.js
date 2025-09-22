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
    // Verificar se já está conectado
    if (mongoose.connection.readyState === 1) {
      console.log('✅ MongoDB já conectado');
      return true;
    }

    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.log('❌ MONGODB_URI não encontrada nas variáveis de ambiente');
      console.log('💡 Configure MONGODB_URI na Vercel Dashboard');
      return false;
    }

    console.log('🔗 Conectando ao MongoDB...');
    console.log('URI (primeiros 20 chars):', mongoUri.substring(0, 20) + '...');
    
    // Configurações otimizadas para Vercel/Serverless
    await mongoose.connect(mongoUri, {
      maxPoolSize: 1, // Reduzido para serverless
      serverSelectionTimeoutMS: 10000, // 10 segundos
      socketTimeoutMS: 20000, // 20 segundos
      connectTimeoutMS: 10000, // 10 segundos
      retryWrites: true,
      w: 'majority',
      bufferCommands: false, // Desabilitar buffering para serverless
      bufferMaxEntries: 0, // Desabilitar buffering
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`✅ MongoDB conectado: ${mongoose.connection.host}`);
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🔌 Estado: ${mongoose.connection.readyState}`);
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar MongoDB:', error.message);
    console.error('Stack trace:', error.stack);
    
    // Tentar reconectar uma vez em caso de erro
    if (mongoose.connection.readyState === 0) {
      console.log('🔄 Tentando reconectar...');
      try {
        await mongoose.connect(process.env.MONGODB_URI, {
          maxPoolSize: 1,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 10000,
          connectTimeoutMS: 5000,
          retryWrites: true,
          w: 'majority',
          bufferCommands: false,
          bufferMaxEntries: 0,
          useNewUrlParser: true,
          useUnifiedTopology: true
        });
        console.log('✅ Reconexão bem-sucedida');
        return true;
      } catch (retryError) {
        console.error('❌ Falha na reconexão:', retryError.message);
        return false;
      }
    }
    
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
  try {
    const isConnected = await connectDB();
    
    // Verificar se consegue fazer uma operação simples no banco
    let dbTest = false;
    if (isConnected) {
      try {
        // Tentar listar as coleções para verificar se a conexão está funcionando
        const collections = await mongoose.connection.db.listCollections().toArray();
        dbTest = true;
        console.log('✅ Teste de banco bem-sucedido, coleções encontradas:', collections.length);
      } catch (dbError) {
        console.error('❌ Erro no teste de banco:', dbError.message);
        dbTest = false;
      }
    }

    res.json({
      success: true,
      database: {
        status: isConnected ? 'Conectado' : 'Desconectado',
        readyState: mongoose.connection.readyState,
        testPassed: dbTest,
        host: mongoose.connection.host || 'N/A',
        name: mongoose.connection.name || 'N/A'
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasMongoUri: !!process.env.MONGODB_URI,
        mongoUriLength: process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0,
        mongoUriStart: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) + '...' : 'N/A'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Erro no teste de banco:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      database: {
        status: 'Erro',
        readyState: mongoose.connection.readyState
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasMongoUri: !!process.env.MONGODB_URI
      }
    });
  }
});

// Rota de clientes (conexão real com MongoDB)
app.get('/api/clients', async (req, res) => {
  try {
    // Conectar ao banco de dados
    const isConnected = await connectDB();
    if (!isConnected) {
      return res.status(503).json({
        success: false,
        error: 'Banco de dados não conectado',
        message: 'Verifique a configuração do MongoDB'
      });
    }

    // Importar o modelo Client
    const Client = require('../models/Client');
    
    // Parâmetros de paginação
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Filtros
    const filter = {};
    if (req.query.search) {
      filter.$or = [
        { razaoSocial: { $regex: req.query.search, $options: 'i' } },
        { nomeFantasia: { $regex: req.query.search, $options: 'i' } },
        { cnpj: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    if (req.query.classificacao) {
      filter.classificacao = req.query.classificacao;
    }
    if (req.query.uf) {
      filter['endereco.uf'] = req.query.uf;
    }
    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === 'true';
    }

    // Buscar clientes
    const clients = await Client.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Contar total de clientes
    const total = await Client.countDocuments(filter);
    const pages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: clients,
      pagination: {
        current: page,
        pages: pages,
        total: total,
        limit: limit
      },
      message: 'Clientes carregados com sucesso'
    });
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Erro interno do servidor'
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