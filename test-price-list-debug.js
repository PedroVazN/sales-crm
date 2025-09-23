const mongoose = require('mongoose');

// Conectar ao MongoDB
const connectDB = async () => {
  try {
    const atlasUri = process.env.MONGODB_URI || "mongodb+srv://pedrovazn:pedrovazn123@cluster0.npuas1m.mongodb.net/sellone?retryWrites=true&w=majority&authSource=admin";
    
    console.log('🔗 Conectando ao MongoDB...');
    const conn = await mongoose.connect(atlasUri);
    console.log(`✅ MongoDB Atlas conectado: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com MongoDB:', error.message);
    return false;
  }
};

// Importar modelos
const PriceList = require('./models/PriceList');
const DistributorNew = require('./models/DistributorNew');
const Product = require('./models/Product');

const testPriceList = async () => {
  try {
    const isConnected = await connectDB();
    if (!isConnected) {
      console.log('❌ Não foi possível conectar ao MongoDB');
      return;
    }

    console.log('\n=== TESTE DE PRICE LIST ===');
    
    // Buscar todos os itens sem populate
    const allItems = await PriceList.find({}).limit(5);
    console.log('Total de itens encontrados:', allItems.length);
    
    if (allItems.length > 0) {
      console.log('\nPrimeiro item (sem populate):');
      console.log(JSON.stringify(allItems[0], null, 2));
      
      // Verificar se os IDs de referência existem
      const firstItem = allItems[0];
      console.log('\nIDs de referência:');
      console.log('Distributor ID:', firstItem.distributor);
      console.log('Product ID:', firstItem.product);
      console.log('CreatedBy ID:', firstItem.createdBy);
      
      // Verificar se os modelos existem
      const distributorExists = await DistributorNew.findById(firstItem.distributor);
      const productExists = await Product.findById(firstItem.product);
      
      console.log('\nVerificação de existência:');
      console.log('Distributor existe:', !!distributorExists);
      console.log('Product existe:', !!productExists);
      
      if (distributorExists) {
        console.log('Distributor encontrado:', distributorExists.apelido);
      }
      if (productExists) {
        console.log('Product encontrado:', productExists.name);
      }
    }
    
    // Testar populate
    console.log('\n=== TESTE DE POPULATE ===');
    const populatedItems = await PriceList.find({})
      .populate({
        path: 'distributor',
        model: 'DistributorNew',
        select: 'apelido razaoSocial contato.nome'
      })
      .populate({
        path: 'product',
        model: 'Product',
        select: 'name description price category'
      })
      .limit(3);
    
    console.log('Itens com populate:', populatedItems.length);
    
    if (populatedItems.length > 0) {
      console.log('\nPrimeiro item (com populate):');
      console.log(JSON.stringify(populatedItems[0], null, 2));
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  } finally {
    mongoose.connection.close();
  }
};

testPriceList();
