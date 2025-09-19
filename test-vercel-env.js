// Testar informações do ambiente na Vercel
async function testVercelEnv() {
  try {
    console.log('🔍 Testando ambiente da Vercel...');
    
    const response = await fetch('https://backend-sell.vercel.app/api/test-db');
    const result = await response.json();
    
    console.log('Status:', response.status);
    console.log('Resposta:', JSON.stringify(result, null, 2));
    
    if (result.environment) {
      console.log('\n📊 Informações do ambiente:');
      console.log(`   Node ENV: ${result.environment.nodeEnv}`);
      console.log(`   Tem MONGODB_URI: ${result.environment.hasMongoUri}`);
    }
    
    if (result.database) {
      console.log('\n🗄️ Status do banco:');
      console.log(`   Status: ${result.database.status}`);
      console.log(`   Ready State: ${result.database.readyState}`);
      console.log(`   Host: ${result.database.host}`);
      console.log(`   Database: ${result.database.name}`);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testVercelEnv();
