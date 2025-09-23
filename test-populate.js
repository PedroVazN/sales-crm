const mongoose = require('mongoose');

// Conectar ao MongoDB
mongoose.connect('mongodb+srv://pedrovazn:pedrovazn123@cluster0.npuas1m.mongodb.net/sellone?retryWrites=true&w=majority&authSource=admin');

// Importar modelos
const PriceList = require('./models/PriceList');
const DistributorNew = require('./models/DistributorNew');
const Product = require('./models/Product');

async function testPopulate() {
  try {
    console.log('=== TESTE DE POPULATE ===');
    
    // Buscar um item da lista de preços
    const priceItem = await PriceList.findOne().populate('distributor').populate('product');
    
    console.log('Item encontrado:', priceItem);
    console.log('Distribuidor:', priceItem.distributor);
    console.log('Produto:', priceItem.product);
    
    // Buscar distribuidor diretamente
    const distributor = await DistributorNew.findById(priceItem.distributor);
    console.log('Distribuidor direto:', distributor);
    
    // Buscar produto diretamente
    const product = await Product.findById(priceItem.product);
    console.log('Produto direto:', product);
    
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    mongoose.connection.close();
  }
}

testPopulate();
