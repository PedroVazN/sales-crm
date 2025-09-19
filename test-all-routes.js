// Testar todas as rotas da API
const baseURL = 'https://backend-sell.vercel.app/api';

const routes = [
  { method: 'GET', path: '/clients', name: 'Listar Clientes' },
  { method: 'GET', path: '/distributors', name: 'Listar Distribuidores' },
  { method: 'GET', path: '/products', name: 'Listar Produtos' },
  { method: 'GET', path: '/users', name: 'Listar Usuários' },
  { method: 'GET', path: '/events', name: 'Listar Eventos' },
  { method: 'GET', path: '/goals', name: 'Listar Metas' },
  { method: 'GET', path: '/notifications', name: 'Listar Notificações' },
  { method: 'GET', path: '/sales', name: 'Listar Vendas' },
  { method: 'GET', path: '/proposals', name: 'Listar Propostas' },
  { method: 'GET', path: '/price-list', name: 'Listar Lista de Preços' }
];

async function testRoute(route) {
  try {
    console.log(`\n--- Testando ${route.name} ---`);
    console.log(`${route.method} ${baseURL}${route.path}`);
    
    const response = await fetch(`${baseURL}${route.path}`, {
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
        console.log(`   Total de itens: ${Array.isArray(result.data) ? result.data.length : 'N/A'}`);
      }
    } else {
      console.log(`❌ ${route.name}: ERRO`);
      console.log(`   Erro: ${result.error || result.message || 'Erro desconhecido'}`);
    }
    
    return response.ok;
  } catch (error) {
    console.log(`❌ ${route.name}: EXCEÇÃO`);
    console.log(`   Erro: ${error.message}`);
    return false;
  }
}

async function testAllRoutes() {
  console.log('🚀 Testando todas as rotas da API...\n');
  
  const results = [];
  
  for (const route of routes) {
    const success = await testRoute(route);
    results.push({ route: route.name, success });
    
    // Pequena pausa entre requisições
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n=== RESUMO DOS TESTES ===');
  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  
  results.forEach(result => {
    console.log(`${result.success ? '✅' : '❌'} ${result.route}`);
  });
  
  console.log(`\n🎯 Resultado: ${successCount}/${totalCount} rotas funcionando`);
  
  if (successCount === totalCount) {
    console.log('🎉 Todas as rotas estão funcionando!');
  } else {
    console.log('⚠️  Algumas rotas precisam de correção');
  }
}

testAllRoutes();
