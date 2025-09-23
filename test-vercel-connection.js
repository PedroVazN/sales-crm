const axios = require('axios');

async function testVercelConnection() {
  const baseUrl = 'https://backend-sell.vercel.app';
  
  console.log('🧪 Testando conexão com a API na Vercel...\n');
  
  try {
    // Teste 1: Rota principal
    console.log('1️⃣ Testando rota principal...');
    const mainResponse = await axios.get(`${baseUrl}/`);
    console.log('✅ Rota principal:', mainResponse.data.message);
    console.log('   Status:', mainResponse.data.status);
    console.log('   Environment:', mainResponse.data.environment);
    
    // Teste 2: Rota de teste
    console.log('\n2️⃣ Testando rota de teste...');
    const testResponse = await axios.get(`${baseUrl}/api/test`);
    console.log('✅ Rota de teste:', testResponse.data.message);
    
    // Teste 3: Rota de teste do banco
    console.log('\n3️⃣ Testando conexão com MongoDB...');
    const dbResponse = await axios.get(`${baseUrl}/api/test-db`);
    console.log('✅ Status do banco:', dbResponse.data.database.status);
    console.log('   ReadyState:', dbResponse.data.database.readyState);
    console.log('   Teste passou:', dbResponse.data.database.testPassed);
    console.log('   Host:', dbResponse.data.database.host);
    console.log('   Database:', dbResponse.data.database.name);
    console.log('   MONGODB_URI configurada:', dbResponse.data.environment.hasMongoUri);
    console.log('   Tamanho da URI:', dbResponse.data.environment.mongoUriLength);
    console.log('   URI (início):', dbResponse.data.environment.mongoUriStart);
    
    // Teste 4: Rota de clientes
    console.log('\n4️⃣ Testando rota de clientes...');
    const clientsResponse = await axios.get(`${baseUrl}/api/clients`);
    console.log('✅ Clientes carregados:', clientsResponse.data.success);
    console.log('   Total de clientes:', clientsResponse.data.pagination.total);
    console.log('   Mensagem:', clientsResponse.data.message);
    
    // Teste 5: Health check
    console.log('\n5️⃣ Testando health check...');
    const healthResponse = await axios.get(`${baseUrl}/health`);
    console.log('✅ Health check:', healthResponse.data.status);
    console.log('   Database:', healthResponse.data.database);
    console.log('   ReadyState:', healthResponse.data.readyState);
    
    console.log('\n🎉 Todos os testes passaram! A API está funcionando corretamente.');
    
  } catch (error) {
    console.error('\n❌ Erro nos testes:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    } else {
      console.error('   Erro:', error.message);
    }
  }
}

// Executar os testes
testVercelConnection();
