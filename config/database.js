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
      console.log('💡 Exemplo: MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/nome-do-banco?retryWrites=true&w=majority');
      if (process.env.NODE_ENV === 'production') {
        console.log('⚠️  Continuando sem conexão com MongoDB em produção');
        return false;
      }
      throw new Error('MONGODB_URI não configurada');
    }
    
    console.log('🔗 Tentando conectar ao MongoDB...');
    console.log('URI (primeiros 20 chars):', atlasUri.substring(0, 20) + '...');
    
    // Verificar se já está conectado
    if (mongoose.connection.readyState === 1) {
      console.log('✅ MongoDB já está conectado');
      return true;
    }
    
    const conn = await mongoose.connect(atlasUri, {
      maxPoolSize: 1, // Reduzido para serverless
      serverSelectionTimeoutMS: 10000, // Reduzido para serverless
      socketTimeoutMS: 20000, // Reduzido para serverless
      connectTimeoutMS: 10000, // Reduzido para serverless
      retryWrites: true,
      w: 'majority',
      bufferCommands: false // Desabilitar buffering para serverless
    });
    
    console.log(`✅ MongoDB Atlas conectado: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔌 Estado da conexão: ${conn.connection.readyState}`);
    
    // Aguardar um pouco para garantir que a conexão está estável
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com MongoDB:', error.message);
    console.error('Stack trace:', error.stack);
    
    // Em produção, tentar reconectar após um delay
    if (process.env.NODE_ENV === 'production') {
      console.log('⚠️  Tentando reconectar em 2 segundos...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      try {
        const retryConn = await mongoose.connect(atlasUri, {
          maxPoolSize: 1,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 10000,
          connectTimeoutMS: 5000,
          retryWrites: true,
          w: 'majority',
          bufferCommands: false
        });
        
        console.log(`✅ MongoDB reconectado: ${retryConn.connection.host}`);
        return true;
      } catch (retryError) {
        console.error('❌ Falha na reconexão:', retryError.message);
        return false;
      }
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

// Middleware para verificar conexão com o banco de dados
const checkConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    console.log('⚠️ Banco de dados não conectado');
    return res.status(503).json({
      success: false,
      error: "Banco de dados não conectado",
      message: "Serviço temporariamente indisponível"
    });
  }
  next();
};

module.exports = {
  connectDB,
  setupModels,
  checkConnection
};