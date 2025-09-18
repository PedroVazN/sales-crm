const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Tentar primeiro MongoDB local, depois Atlas
    const localUri = 'mongodb://localhost:27017/sellone';
    
    // MongoDB Atlas com credenciais corretas
    const atlasUri = process.env.MONGODB_URI || 'mongodb+srv://sellone-user:sellone123@cluster0.npuas1m.mongodb.net/sellone?retryWrites=true&w=majority';
    
    let mongoUri = localUri;
    
    // Verificar se MongoDB local está disponível
    try {
      const conn = await mongoose.connect(localUri);
      console.log(`✅ MongoDB local conectado: ${conn.connection.host}`);
      return;
    } catch (localError) {
      console.log('⚠️  MongoDB local não disponível, tentando Atlas...');
      mongoUri = atlasUri;
    }
    
    // Tentar conectar com Atlas
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Atlas conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Erro ao conectar com MongoDB:', error.message);
    console.log('💡 Dicas para resolver:');
    console.log('   1. Instale MongoDB local: https://www.mongodb.com/try/download/community');
    console.log('   2. Ou configure o IP no MongoDB Atlas: https://www.mongodb.com/docs/atlas/security-whitelist/');
    console.log('   3. Ou crie um arquivo .env com MONGODB_URI válida');
    console.log('   4. Verifique se as credenciais do Atlas estão corretas');
    process.exit(1);
  }
};

module.exports = connectDB;
