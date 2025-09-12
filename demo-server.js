const express = require('express');
const cors = require('cors');
const demoData = require('./demo-data');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Simular delay de rede
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Rotas de usuários
app.get('/api/users', async (req, res) => {
  await delay(500);
  res.json({ data: demoData.users });
});

app.post('/api/users/login', async (req, res) => {
  await delay(500);
  const { email, password } = req.body;
  
  const user = demoData.users.find(u => u.email === email && u.password === password);
  
  if (user) {
    res.json({ 
      data: { 
        user: { ...user, password: undefined },
        token: 'demo-token-123'
      }
    });
  } else {
    res.status(401).json({ error: 'Credenciais inválidas' });
  }
});

// Rotas de distribuidores
app.get('/api/distributors', async (req, res) => {
  await delay(500);
  res.json({ data: demoData.distributors });
});

app.post('/api/distributors', async (req, res) => {
  await delay(500);
  const newDistributor = {
    _id: `dist${Date.now()}`,
    ...req.body,
    isActive: true
  };
  demoData.distributors.push(newDistributor);
  res.json({ data: newDistributor });
});

app.put('/api/distributors/:id', async (req, res) => {
  await delay(500);
  const { id } = req.params;
  const index = demoData.distributors.findIndex(d => d._id === id);
  
  if (index !== -1) {
    demoData.distributors[index] = { ...demoData.distributors[index], ...req.body };
    res.json({ data: demoData.distributors[index] });
  } else {
    res.status(404).json({ error: 'Distribuidor não encontrado' });
  }
});

app.delete('/api/distributors/:id', async (req, res) => {
  await delay(500);
  const { id } = req.params;
  const index = demoData.distributors.findIndex(d => d._id === id);
  
  if (index !== -1) {
    demoData.distributors.splice(index, 1);
    res.json({ message: 'Distribuidor removido com sucesso' });
  } else {
    res.status(404).json({ error: 'Distribuidor não encontrado' });
  }
});

// Rotas de clientes
app.get('/api/clients', async (req, res) => {
  await delay(500);
  res.json({ data: demoData.clients });
});

app.post('/api/clients', async (req, res) => {
  await delay(500);
  const newClient = {
    _id: `client${Date.now()}`,
    ...req.body,
    isActive: true
  };
  demoData.clients.push(newClient);
  res.json({ data: newClient });
});

app.put('/api/clients/:id', async (req, res) => {
  await delay(500);
  const { id } = req.params;
  const index = demoData.clients.findIndex(c => c._id === id);
  
  if (index !== -1) {
    demoData.clients[index] = { ...demoData.clients[index], ...req.body };
    res.json({ data: demoData.clients[index] });
  } else {
    res.status(404).json({ error: 'Cliente não encontrado' });
  }
});

app.delete('/api/clients/:id', async (req, res) => {
  await delay(500);
  const { id } = req.params;
  const index = demoData.clients.findIndex(c => c._id === id);
  
  if (index !== -1) {
    demoData.clients.splice(index, 1);
    res.json({ message: 'Cliente removido com sucesso' });
  } else {
    res.status(404).json({ error: 'Cliente não encontrado' });
  }
});

// Rotas de produtos
app.get('/api/products', async (req, res) => {
  await delay(500);
  res.json({ data: demoData.products });
});

app.post('/api/products', async (req, res) => {
  await delay(500);
  const newProduct = {
    _id: `prod${Date.now()}`,
    ...req.body,
    isActive: true
  };
  demoData.products.push(newProduct);
  res.json({ data: newProduct });
});

// Rotas de lista de preços
app.get('/api/price-list', async (req, res) => {
  await delay(500);
  const priceListWithDetails = demoData.priceList.map(price => ({
    ...price,
    distributor: demoData.distributors.find(d => d._id === price.distributor),
    product: demoData.products.find(p => p._id === price.product)
  }));
  res.json({ data: priceListWithDetails });
});

app.post('/api/price-list', async (req, res) => {
  await delay(500);
  const newPriceItem = {
    _id: `price${Date.now()}`,
    ...req.body,
    isActive: true
  };
  demoData.priceList.push(newPriceItem);
  
  const priceWithDetails = {
    ...newPriceItem,
    distributor: demoData.distributors.find(d => d._id === newPriceItem.distributor),
    product: demoData.products.find(p => p._id === newPriceItem.product)
  };
  
  res.json({ data: priceWithDetails });
});

// Rotas de propostas
app.get('/api/proposals', async (req, res) => {
  await delay(500);
  res.json({ data: [] }); // Vazio por enquanto
});

app.post('/api/proposals', async (req, res) => {
  await delay(500);
  const newProposal = {
    _id: `prop${Date.now()}`,
    ...req.body,
    status: 'draft',
    createdAt: new Date().toISOString()
  };
  res.json({ data: newProposal });
});

// Rota de status
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor de demonstração funcionando',
    data: {
      distributors: demoData.distributors.length,
      clients: demoData.clients.length,
      products: demoData.products.length,
      priceList: demoData.priceList.length
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor de demonstração rodando na porta ${PORT}`);
  console.log(`📊 Dados carregados:`);
  console.log(`   - ${demoData.distributors.length} distribuidores`);
  console.log(`   - ${demoData.clients.length} clientes`);
  console.log(`   - ${demoData.products.length} produtos`);
  console.log(`   - ${demoData.priceList.length} itens de preço`);
  console.log(`\n🌐 Acesse: http://localhost:${PORT}/api/status`);
});
