// Testar todas as rotas corrigidas
async function testAllRoutes() {
  const routes = [
    { method: 'GET', path: '/users?page=1&limit=1', name: 'Usuários' },
    { method: 'GET', path: '/products?page=1&limit=1', name: 'Produtos' },
    { method: 'GET', path: '/sales?page=1&limit=1', name: 'Vendas' },
    { method: 'GET', path: '/notifications/unread-count', name: 'Notificações' },
    { method: 'GET', path: '/distributors?page=1&limit=1', name: 'Distribuidores' }
  ];

  console.log('🧪 Testando todas as rotas corrigidas...\n');

  for (const route of routes) {
    try {
      console.log(`--- Testando ${route.name} ---`);
      
      const response = await fetch(`https://backend-sell.vercel.app/api${route.path}`, {
        method: route.method,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      
      console.log(`Status: ${response.status}`);
      
      if (response.ok) {
        console.log(`✅ ${route.name}: OK`);
        if (result.data) {
          if (Array.isArray(result.data)) {
            console.log(`   Total de itens: ${result.data.length}`);
          } else if (typeof result.data === 'object') {
            console.log(`   Dados: ${JSON.stringify(result.data).substring(0, 100)}...`);
          }
        }
      } else {
        console.log(`❌ ${route.name}: ERRO`);
        console.log(`   Erro: ${result.error || result.message || 'Erro desconhecido'}`);
      }
      
    } catch (error) {
      console.log(`❌ ${route.name}: EXCEÇÃO`);
      console.log(`   Erro: ${error.message}`);
    }
    
    console.log(''); // Linha em branco
  }
  
  console.log('🎉 Teste concluído!');
}

testAllRoutes();
