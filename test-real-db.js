// Testar conexão real com banco de dados
async function testRealDatabase() {
  try {
    console.log('🔍 Testando conexão real com banco de dados...');
    
    // Testar status do banco
    const statusResponse = await fetch('https://backend-sell.vercel.app/api/test-db');
    const statusResult = await statusResponse.json();
    
    console.log('📊 Status do banco:');
    console.log(JSON.stringify(statusResult, null, 2));
    
    if (statusResult.database.readyState === 1) {
      console.log('✅ Banco conectado! Testando CRUD...');
      
      // Testar operação CRUD
      const crudResponse = await fetch('https://backend-sell.vercel.app/api/test-crud');
      const crudResult = await crudResponse.json();
      
      console.log('🧪 Teste CRUD:');
      console.log(JSON.stringify(crudResult, null, 2));
      
      if (crudResult.success) {
        console.log('🎉 CRUD funcionando com dados reais!');
        console.log(`📈 Total de distribuidores: ${crudResult.test.distributorsCount}`);
      } else {
        console.log('❌ Erro no teste CRUD');
      }
    } else {
      console.log('❌ Banco não conectado, tentando reconectar...');
      
      // Tentar reconectar
      const reconnectResponse = await fetch('https://backend-sell.vercel.app/api/reconnect-db');
      const reconnectResult = await reconnectResponse.json();
      
      console.log('🔄 Resultado da reconexão:');
      console.log(JSON.stringify(reconnectResult, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testRealDatabase();
