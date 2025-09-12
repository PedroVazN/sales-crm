const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();

// Conectar ao MongoDB
connectDB();

// Middlewares
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dados integrados no servidor
const integratedData = require('./demo-data');

// Rota da API
app.get('/api', (req, res) => {
  res.json({
    message: 'Bem-vindo ao SellOne API',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString(),
    data: {
      distributors: integratedData.distributors.length,
      clients: integratedData.clients.length,
      products: integratedData.products.length,
      priceList: integratedData.priceList.length
    }
  });
});

// Rota de status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Servidor SellOne funcionando',
    data: {
      distributors: integratedData.distributors.length,
      clients: integratedData.clients.length,
      products: integratedData.products.length,
      priceList: integratedData.priceList.length
    }
  });
});

// Rotas de distribuidores integradas
app.get('/api/distributors', (req, res) => {
  res.json({
    success: true,
    data: integratedData.distributors
  });
});

app.post('/api/distributors', (req, res) => {
  const newDistributor = {
    _id: `dist${Date.now()}`,
    ...req.body,
    isActive: true
  };
  integratedData.distributors.push(newDistributor);
  res.json({
    success: true,
    data: newDistributor
  });
});

// Rotas de clientes integradas
app.get('/api/clients', (req, res) => {
  res.json({
    success: true,
    data: integratedData.clients
  });
});

app.post('/api/clients', (req, res) => {
  const newClient = {
    _id: `client${Date.now()}`,
    ...req.body,
    isActive: true
  };
  integratedData.clients.push(newClient);
  res.json({
    success: true,
    data: newClient
  });
});

// Rotas de produtos integradas
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    data: integratedData.products
  });
});

app.post('/api/products', (req, res) => {
  const newProduct = {
    _id: `prod${Date.now()}`,
    ...req.body,
    isActive: true
  };
  integratedData.products.push(newProduct);
  res.json({
    success: true,
    data: newProduct
  });
});

// Rotas de lista de preços integradas
app.get('/api/price-list', (req, res) => {
  const priceListWithDetails = integratedData.priceList.map(price => ({
    ...price,
    distributor: integratedData.distributors.find(d => d._id === price.distributor),
    product: integratedData.products.find(p => p._id === price.product)
  }));
  res.json({
    success: true,
    data: priceListWithDetails
  });
});

app.post('/api/price-list', (req, res) => {
  const newPriceItem = {
    _id: `price${Date.now()}`,
    ...req.body,
    isActive: true
  };
  integratedData.priceList.push(newPriceItem);
  
  const priceWithDetails = {
    ...newPriceItem,
    distributor: integratedData.distributors.find(d => d._id === newPriceItem.distributor),
    product: integratedData.products.find(p => p._id === newPriceItem.product)
  };
  
  res.json({
    success: true,
    data: priceWithDetails
  });
});

// Rotas de propostas integradas
app.get('/api/proposals', (req, res) => {
  res.json({
    success: true,
    data: []
  });
});

app.post('/api/proposals', (req, res) => {
  const newProposal = {
    _id: `prop${Date.now()}`,
    ...req.body,
    status: 'draft',
    createdAt: new Date().toISOString()
  };
  res.json({
    success: true,
    data: newProposal
  });
});

// Rotas de API originais (mantidas para compatibilidade)
app.use('/api/users', require('./routes/users'));
app.use('/api/sales', require('./routes/sales'));

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
  });
});

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor SellOne rodando na porta ${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Acesse: http://localhost:${PORT}`);
});
