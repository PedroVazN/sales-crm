const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota da API
app.get('/api', (req, res) => {
  res.json({
    message: 'Bem-vindo ao SellOne API (Modo Demo)',
    version: '1.0.0',
    status: 'online',
    mode: 'demo',
    timestamp: new Date().toISOString()
  });
});

// Rota de status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Servidor SellOne funcionando em modo demo'
  });
});

// Rota de login
app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;
  
  const users = [
    {
      _id: '1',
      name: 'Administrador',
      email: 'admin@sellone.com',
      password: '123456',
      role: 'admin',
      phone: '11999999999',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      _id: '2',
      name: 'Vendedor',
      email: 'vendedor@sellone.com',
      password: '123456',
      role: 'vendedor',
      phone: '11988888888',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ];
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: userWithoutPassword
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Email ou senha incorretos'
    });
  }
});

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, 'sales-crm/build')));

// Rota para servir o React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'sales-crm/build', 'index.html'));
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`🚀 Servidor SellOne DEMO rodando na porta ${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(`🔐 Login: admin@sellone.com / 123456`);
  console.log(`💡 Modo: DEMO (sem banco de dados)`);
});