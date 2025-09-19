const mongoose = require('mongoose');

// Configuração do banco de dados
const connectDB = async () => {
  try {
    const atlasUri = process.env.MONGODB_URI;
    
    console.log('🔍 Verificando configuração do MongoDB...');
    console.log('MONGODB_URI configurada:', !!atlasUri);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    
    if (!atlasUri) {
      console.error('❌ MONGODB_URI não encontrada nas variáveis de ambiente');
      console.log('💡 Configure MONGODB_URI na Vercel ou no arquivo .env');
      if (process.env.NODE_ENV === 'production') {
        console.log('⚠️  Continuando sem conexão com MongoDB em produção');
        return false;
      }
      throw new Error('MONGODB_URI não configurada');
    }
    
    console.log('🔗 Tentando conectar ao MongoDB...');
    console.log('URI (primeiros 20 chars):', atlasUri.substring(0, 20) + '...');
    
    const conn = await mongoose.connect(atlasUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      retryWrites: true,
      w: 'majority',
      bufferCommands: false,
      bufferMaxEntries: 0
    });
    
    console.log(`✅ MongoDB Atlas conectado: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔌 Estado da conexão: ${conn.connection.readyState}`);
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com MongoDB:', error.message);
    console.error('Stack trace:', error.stack);
    
    // Em produção, tentar reconectar após um delay
    if (process.env.NODE_ENV === 'production') {
      console.log('⚠️  Tentando reconectar em 5 segundos...');
      setTimeout(async () => {
        try {
          await connectDB();
        } catch (retryError) {
          console.error('❌ Falha na reconexão:', retryError.message);
        }
      }, 5000);
      return false;
    } else {
      throw error;
    }
  }
};

// Configuração de modelos
const setupModels = () => {
  try {
    // Importar todos os modelos
    require('../models/User');
    require('../models/Client');
    require('../models/DistributorNew');
    require('../models/Product');
    require('../models/Proposal');
    require('../models/Sale');
    require('../models/Event');
    require('../models/Goal');
    require('../models/Notification');
    require('../models/PriceList');
    
    console.log('✅ Modelos carregados com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro ao carregar modelos:', error.message);
    return false;
  }
};

// Middleware para verificar conexão
const checkConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    console.log('⚠️ Banco de dados não conectado, usando dados em memória');
    // Usar dados em memória em vez de retornar erro
    req.useMemoryStore = true;
  }
  next();
};

module.exports = {
  connectDB,
  setupModels,
  checkConnection
};