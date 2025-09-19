// Script para adicionar dados de exemplo via API
const API_BASE_URL = 'https://backend-sell.vercel.app/api';

async function addSampleData() {
  try {
    console.log('🌱 Adicionando dados de exemplo via API...');

    // Buscar dados existentes
    const productsResponse = await fetch(`${API_BASE_URL}/products?limit=3`);
    const productsData = await productsResponse.json();
    
    const clientsResponse = await fetch(`${API_BASE_URL}/clients?limit=2`);
    const clientsData = await clientsResponse.json();
    
    const distributorsResponse = await fetch(`${API_BASE_URL}/distributors?limit=2`);
    const distributorsData = await distributorsResponse.json();

    if (!productsData.success || productsData.data.length === 0) {
      console.log('❌ Nenhum produto encontrado');
      return;
    }

    if (!clientsData.data || clientsData.data.length === 0) {
      console.log('❌ Nenhum cliente encontrado');
      return;
    }

    if (!distributorsData.data || distributorsData.data.length === 0) {
      console.log('❌ Nenhum distribuidor encontrado');
      return;
    }

    const products = productsData.data;
    const clients = clientsData.data;
    const distributors = distributorsData.data;

    // Criar proposta de exemplo
    const proposalData = {
      client: {
        name: clients[0].contato.nome,
        email: clients[0].contato.email,
        phone: clients[0].contato.telefone,
        company: clients[0].razaoSocial
      },
      distributor: {
        _id: distributors[0]._id,
        apelido: distributors[0].apelido,
        razaoSocial: distributors[0].razaoSocial
      },
      items: [
        {
          product: {
            _id: products[0]._id,
            name: products[0].name,
            description: products[0].description,
            category: products[0].category,
            price: products[0].price
          },
          quantity: 2,
          unitPrice: products[0].price,
          discount: 0,
          total: products[0].price * 2
        }
      ],
      subtotal: products[0].price * 2,
      discount: 0,
      total: products[0].price * 2,
      paymentCondition: '30 dias',
      observations: 'Proposta para implementação de rede',
      status: 'sent',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    // Enviar proposta
    const proposalResponse = await fetch(`${API_BASE_URL}/proposals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(proposalData)
    });

    if (proposalResponse.ok) {
      console.log('✅ Proposta criada com sucesso');
    } else {
      const error = await proposalResponse.text();
      console.log('❌ Erro ao criar proposta:', error);
    }

    // Criar venda de exemplo
    const saleData = {
      customer: {
        _id: clients[0]._id,
        name: clients[0].contato.nome,
        email: clients[0].contato.email,
        phone: clients[0].contato.telefone
      },
      items: [
        {
          product: {
            _id: products[0]._id,
            name: products[0].name,
            description: products[0].description,
            category: products[0].category,
            price: products[0].price
          },
          quantity: 1,
          unitPrice: products[0].price,
          discount: 0,
          total: products[0].price
        }
      ],
      subtotal: products[0].price,
      discount: 0,
      tax: products[0].price * 0.1,
      total: products[0].price * 1.1,
      paymentMethod: 'pix',
      paymentStatus: 'pago',
      status: 'finalizada',
      notes: 'Venda realizada com sucesso'
    };

    // Enviar venda
    const saleResponse = await fetch(`${API_BASE_URL}/sales`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(saleData)
    });

    if (saleResponse.ok) {
      console.log('✅ Venda criada com sucesso');
    } else {
      const error = await saleResponse.text();
      console.log('❌ Erro ao criar venda:', error);
    }

    console.log('🎉 Dados de exemplo adicionados!');

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

addSampleData();
