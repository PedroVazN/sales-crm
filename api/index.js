const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API funcionando!',
    timestamp: new Date().toISOString(),
    status: 'OK'
  });
});

// Rota principal
app.get('/', (req, res) => {
  res.json({
    message: 'SellOne API v3.0',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

module.exports = app;
