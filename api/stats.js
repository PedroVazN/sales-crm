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

    // Importar modelos
    const User = require('../models/User');
    const Client = require('../models/Client');
    const Product = require('../models/Product');
    const Sale = require('../models/Sale');
    const Proposal = require('../models/Proposal');

    // Calcular estatísticas
    const [
      totalUsers,
      totalClients,
      totalProducts,
      totalSales,
      totalProposals,
      monthlyRevenue,
      monthlySales
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Client.countDocuments({ isActive: true }),
      Product.countDocuments({ isActive: true }),
      Sale.countDocuments(),
      Proposal.countDocuments(),
      Sale.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          }
        },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Sale.countDocuments({
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      })
    ]);

    const stats = {
      totalUsers,
      totalClients,
      totalProducts,
      totalSales,
      totalProposals,
      monthlyRevenue: monthlyRevenue[0]?.total || 0,
      monthlySales
    };

    res.json({
      success: true,
      data: stats,
      message: 'Estatísticas carregadas com sucesso'
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Erro interno do servidor'
    });
  }
};
