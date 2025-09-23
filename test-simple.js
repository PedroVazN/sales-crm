const mongoose = require('mongoose');

// Conectar ao MongoDB local
mongoose.connect('mongodb://localhost:27017/sellone');

// Importar modelos
const PriceList = require('./models/PriceList');

async function testSimple() {
  try {
    console.log('=== TESTE SIMPLES ===');
    
    // Buscar um item da lista de preços
    const priceItem = await PriceList.findOne();
    
    console.log('Item encontrado:', priceItem);
    console.log('Distribuidor ID:', priceItem.distributor);
    console.log('Produto ID:', priceItem.product);
    
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    mongoose.connection.close();
  }
}

testSimple();
