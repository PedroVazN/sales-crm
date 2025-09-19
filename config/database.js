const mongoose = require('mongoose');

// Configuração do banco de dados
const connectDB = async () => {
  try {
    const atlasUri = process.env.MONGODB_URI;
    
    if (!atlasUri) {
      console.error('❌ MONGODB_URI não encontrada nas variáveis de ambiente');
      console.log('💡 Configure MONGODB_URI na Vercel ou no arquivo .env');
      if (process.env.NODE_ENV === 'production') {
        console.log('⚠️  Continuando sem conexão com MongoDB em produção');
        return false;
      }
      throw new Error('MONGODB_URI não configurada');
    }
    
    const conn = await mongoose.connect(atlasUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log(`✅ MongoDB Atlas conectado: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com MongoDB:', error.message);
    if (process.env.NODE_ENV === 'production') {
      console.log('⚠️  Continuando sem conexão com MongoDB em produção');
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
    return res.status(503).json({
      success: false,
      error: 'Banco de dados não conectado',
      message: 'Serviço temporariamente indisponível'
    });
  }
  next();
};

module.exports = {
  connectDB,
  setupModels,
  checkConnection
};