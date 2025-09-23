const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rota de teste simples para price-list
app.get('/api/price-list', (req, res) => {
  try {
    console.log('Rota price-list chamada');
    res.json({
      success: true,
      data: [],
      message: 'Rota funcionando - sem dados ainda'
    });
  } catch (error) {
    console.error('Erro na rota price-list:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor de teste rodando na porta ${PORT}`);
  console.log(`🌐 Teste: http://localhost:${PORT}/api/price-list`);
});
