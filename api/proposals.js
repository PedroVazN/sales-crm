const mongoose = require('mongoose');

// Função de conexão com MongoDB
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return true;
    }

    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.log('❌ MONGODB_URI não encontrada');
      return false;
    }

    await mongoose.connect(mongoUri, {
      maxPoolSize: 1,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 20000,
      connectTimeoutMS: 10000,
      retryWrites: true,
      w: 'majority',
      bufferCommands: false,
      bufferMaxEntries: 0,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar MongoDB:', error.message);
    return false;
  }
};

module.exports = async (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Conectar ao banco
    const isConnected = await connectDB();
    
    if (!isConnected) {
      return res.status(503).json({
        success: false,
        error: 'Banco de dados não conectado',
        message: 'Verifique a configuração do MongoDB'
      });
    }

    // Importar modelo Proposal
    const Proposal = require('../models/Proposal');
    
    // Parâmetros de paginação
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Filtros
    const filter = {};
    if (req.query.search) {
      filter.$or = [
        { proposalNumber: { $regex: req.query.search, $options: 'i' } },
        { 'client.name': { $regex: req.query.search, $options: 'i' } },
        { 'seller.name': { $regex: req.query.search, $options: 'i' } }
      ];
    }
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.dateFrom && req.query.dateTo) {
      filter.createdAt = {
        $gte: new Date(req.query.dateFrom),
        $lte: new Date(req.query.dateTo)
      };
    }

    // Buscar propostas
    const proposals = await Proposal.find(filter)
      .populate('client', 'razaoSocial nomeFantasia')
      .populate('seller', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Contar total de propostas
    const total = await Proposal.countDocuments(filter);
    const pages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: proposals,
      pagination: {
        current: page,
        pages: pages,
        total: total,
        limit: limit
      },
      message: 'Propostas carregadas com sucesso'
    });

  } catch (error) {
    console.error('Erro ao buscar propostas:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Erro interno do servidor'
    });
  }
};
