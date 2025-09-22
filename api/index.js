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

// Rota principal
app.get('/', (req, res) => {
  res.json({
    message: 'SellOne API v3.0 - Backend Funcionando!',
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

// Rota de usuários
app.get('/api/users', async (req, res) => {
  try {
    const isConnected = await connectDB();
    
    if (!isConnected) {
      return res.status(503).json({
        success: false,
        error: 'Banco de dados não conectado',
        message: 'Verifique a configuração do MongoDB'
      });
    }

    const User = require('../models/User');
    const users = await User.find({ isActive: true })
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: users,
      total: users.length,
      message: 'Usuários carregados com sucesso'
    });

  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Erro interno do servidor'
    });
  }
});

// Rota de clientes
app.get('/api/clients', async (req, res) => {
  try {
    const isConnected = await connectDB();
    
    if (!isConnected) {
      return res.status(503).json({
        success: false,
        error: 'Banco de dados não conectado',
        message: 'Verifique a configuração do MongoDB'
      });
    }

    const Client = require('../models/Client');
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const filter = {};
    if (req.query.search) {
      filter.$or = [
        { razaoSocial: { $regex: req.query.search, $options: 'i' } },
        { nomeFantasia: { $regex: req.query.search, $options: 'i' } },
        { cnpj: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const clients = await Client.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

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

// Rota de produtos
app.get('/api/products', async (req, res) => {
  try {
    const isConnected = await connectDB();
    
    if (!isConnected) {
      return res.status(503).json({
        success: false,
        error: 'Banco de dados não conectado',
        message: 'Verifique a configuração do MongoDB'
      });
    }

    const Product = require('../models/Product');
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const filter = {};
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { sku: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments(filter);
    const pages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: products,
      pagination: {
        current: page,
        pages: pages,
        total: total,
        limit: limit
      },
      message: 'Produtos carregados com sucesso'
    });

  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Erro interno do servidor'
    });
  }
});

// Rota de vendas
app.get('/api/sales', async (req, res) => {
  try {
    const isConnected = await connectDB();
    
    if (!isConnected) {
      return res.status(503).json({
        success: false,
        error: 'Banco de dados não conectado',
        message: 'Verifique a configuração do MongoDB'
      });
    }

    const Sale = require('../models/Sale');
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const filter = {};
    if (req.query.search) {
      filter.$or = [
        { saleNumber: { $regex: req.query.search, $options: 'i' } },
        { 'customer.name': { $regex: req.query.search, $options: 'i' } },
        { 'seller.name': { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const sales = await Sale.find(filter)
      .populate('client', 'razaoSocial nomeFantasia')
      .populate('seller', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Sale.countDocuments(filter);
    const pages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: sales,
      pagination: {
        current: page,
        pages: pages,
        total: total,
        limit: limit
      },
      message: 'Vendas carregadas com sucesso'
    });

  } catch (error) {
    console.error('Erro ao buscar vendas:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Erro interno do servidor'
    });
  }
});

// Rota de propostas
app.get('/api/proposals', async (req, res) => {
  try {
    const isConnected = await connectDB();
    
    if (!isConnected) {
      return res.status(503).json({
        success: false,
        error: 'Banco de dados não conectado',
        message: 'Verifique a configuração do MongoDB'
      });
    }

    const Proposal = require('../models/Proposal');
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const filter = {};
    if (req.query.search) {
      filter.$or = [
        { proposalNumber: { $regex: req.query.search, $options: 'i' } },
        { 'client.name': { $regex: req.query.search, $options: 'i' } },
        { 'seller.name': { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const proposals = await Proposal.find(filter)
      .populate('client', 'razaoSocial nomeFantasia')
      .populate('seller', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

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
});

// Rota de estatísticas
app.get('/api/stats', async (req, res) => {
  try {
    const isConnected = await connectDB();
    
    if (!isConnected) {
      return res.status(503).json({
        success: false,
        error: 'Banco de dados não conectado',
        message: 'Verifique a configuração do MongoDB'
      });
    }

    const User = require('../models/User');
    const Client = require('../models/Client');
    const Product = require('../models/Product');
    const Sale = require('../models/Sale');
    const Proposal = require('../models/Proposal');

    const [
      totalUsers,
      totalClients,
      totalProducts,
      totalSales,
      totalProposals,
      monthlyRevenue
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
      ])
    ]);

    const stats = {
      totalUsers,
      totalClients,
      totalProducts,
      totalSales,
      totalProposals,
      monthlyRevenue: monthlyRevenue[0]?.total || 0
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