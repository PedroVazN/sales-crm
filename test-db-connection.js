// Testar conexão com o banco de dados
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('🔍 Testando conexão com MongoDB...');
    
    const atlasUri = process.env.MONGODB_URI;
    console.log('MONGODB_URI configurada:', !!atlasUri);
    
    if (!atlasUri) {
      console.log('❌ MONGODB_URI não encontrada');
      return false;
    }
    
    console.log('🔗 Conectando ao MongoDB...');
    const conn = await mongoose.connect(atlasUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔌 Estado da conexão: ${conn.connection.readyState}`);
    
    // Testar uma operação simples
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`📋 Coleções encontradas: ${collections.length}`);
    collections.forEach(col => console.log(`   - ${col.name}`));
    
    await mongoose.disconnect();
    console.log('✅ Conexão fechada com sucesso');
    return true;
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
    return false;
  }
}

testConnection();
