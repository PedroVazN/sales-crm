// Testar endpoint de reconexão
async function testReconnect() {
  try {
    console.log('🔄 Testando reconexão ao MongoDB...');
    
    const response = await fetch('https://backend-sell.vercel.app/api/reconnect-db');
    const result = await response.json();
    
    console.log('Status:', response.status);
    console.log('Resposta:', JSON.stringify(result, null, 2));
    
    if (result.connected) {
      console.log('✅ Conexão estabelecida com sucesso!');
    } else {
      console.log('❌ Falha na conexão');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testReconnect();
