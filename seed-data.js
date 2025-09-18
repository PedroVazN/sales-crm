const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Distributor = require('./models/DistributorNew');
const Client = require('./models/Client');
const PriceList = require('./models/PriceList');
require('dotenv').config();

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sellone');

async function seedData() {
  try {
    console.log('🌱 Iniciando seed de dados...');

    // Criar usuário admin se não existir
    const existingUser = await User.findOne({ email: 'admin@sellone.com' });
    let adminUser;
    
    if (!existingUser) {
      adminUser = new User({
        name: 'Matheus Dantas',
        email: 'admin@sellone.com',
        password: '12345',
        role: 'admin',
        phone: '(11) 99999-9999',
        isActive: true
      });
      await adminUser.save();
      console.log('✅ Usuário admin criado');
    } else {
      adminUser = existingUser;
      console.log('✅ Usuário admin já existe');
    }

    // Criar produtos de teste
    const products = [
      {
        name: '001-ONU',
        description: 'ONU GPON 1 Porta',
        price: 150.00,
        cost: 100.00,
        category: 'Equipamentos',
        brand: 'Huawei',
        sku: 'ONU001',
        stock: { current: 50, min: 10, max: 100 },
        isActive: true
      },
      {
        name: '002-ONT',
        description: 'ONT GPON 4 Portas',
        price: 250.00,
        cost: 180.00,
        category: 'Equipamentos',
        brand: 'Huawei',
        sku: 'ONT002',
        stock: { current: 30, min: 5, max: 80 },
        isActive: true
      },
      {
        name: '011-OLT',
        description: 'OLT GPON 8 Portas',
        price: 2500.00,
        cost: 2000.00,
        category: 'Equipamentos',
        brand: 'Huawei',
        sku: 'OLT011',
        stock: { current: 10, min: 2, max: 20 },
        isActive: true
      },
      {
        name: '023-ROTE',
        description: 'Roteador WiFi 6',
        price: 300.00,
        cost: 220.00,
        category: 'Equipamentos',
        brand: 'TP-Link',
        sku: 'ROTE023',
        stock: { current: 25, min: 5, max: 50 },
        isActive: true
      },
      {
        name: '026-FONT',
        description: 'Fonte 12V 2A',
        price: 80.00,
        cost: 50.00,
        category: 'Acessórios',
        brand: 'Genérico',
        sku: 'FONT026',
        stock: { current: 100, min: 20, max: 200 },
        isActive: true
      }
    ];

    const createdProducts = [];
    for (const productData of products) {
      const existingProduct = await Product.findOne({ sku: productData.sku });
      if (!existingProduct) {
        const product = new Product(productData);
        await product.save();
        createdProducts.push(product);
        console.log(`✅ Produto ${productData.name} criado`);
      } else {
        createdProducts.push(existingProduct);
        console.log(`✅ Produto ${productData.name} já existe`);
      }
    }

    // Criar distribuidores de teste
    const distributors = [
      {
        apelido: 'TechMax',
        razaoSocial: 'TechMax Distribuidora Ltda',
        idDistribuidor: 'TECH001',
        contato: {
          nome: 'João Silva',
          telefone: '(11) 3333-4444',
          cargo: 'Gerente Comercial'
        },
        origem: 'São Paulo',
        atendimento: {
          horario: '08:00 às 18:00',
          dias: 'Segunda a Sexta',
          observacoes: 'Atendimento especializado'
        },
        frete: {
          tipo: 'CIF',
          valor: 50.00,
          prazo: 2,
          observacoes: 'Frete grátis acima de R$ 500'
        },
        pedidoMinimo: {
          valor: 200.00,
          observacoes: 'Pedido mínimo para desconto especial'
        },
        endereco: {
          cep: '01234-567',
          logradouro: 'Rua das Tecnologias',
          numero: '123',
          bairro: 'Centro',
          cidade: 'São Paulo',
          uf: 'SP'
        },
        isActive: true,
        observacoes: 'Distribuidora especializada em equipamentos de rede',
        createdBy: adminUser._id
      },
      {
        apelido: 'NetConnect',
        razaoSocial: 'NetConnect Distribuidora Ltda',
        idDistribuidor: 'NET001',
        contato: {
          nome: 'Maria Santos',
          telefone: '(21) 2222-3333',
          cargo: 'Diretora de Vendas'
        },
        origem: 'Rio de Janeiro',
        atendimento: {
          horario: '09:00 às 17:00',
          dias: 'Segunda a Sexta',
          observacoes: 'Suporte técnico especializado'
        },
        frete: {
          tipo: 'FOB',
          valor: 30.00,
          prazo: 3,
          observacoes: 'Frete por conta do cliente'
        },
        pedidoMinimo: {
          valor: 300.00,
          observacoes: 'Valor mínimo para entrega'
        },
        endereco: {
          cep: '20000-000',
          logradouro: 'Av. da Conectividade',
          numero: '456',
          bairro: 'Copacabana',
          cidade: 'Rio de Janeiro',
          uf: 'RJ'
        },
        isActive: true,
        observacoes: 'Foco em soluções de conectividade empresarial',
        createdBy: adminUser._id
      },
      {
        apelido: 'DataLink',
        razaoSocial: 'DataLink Soluções em TI Ltda',
        idDistribuidor: 'DATA001',
        contato: {
          nome: 'Carlos Mendes',
          telefone: '(31) 4444-5555',
          cargo: 'Diretor Comercial'
        },
        origem: 'Belo Horizonte',
        atendimento: {
          horario: '08:30 às 17:30',
          dias: 'Segunda a Sexta',
          observacoes: 'Atendimento 24/7 para emergências'
        },
        frete: {
          tipo: 'CIF',
          valor: 40.00,
          prazo: 1,
          observacoes: 'Entrega expressa disponível'
        },
        pedidoMinimo: {
          valor: 150.00,
          observacoes: 'Desconto progressivo por volume'
        },
        endereco: {
          cep: '30000-000',
          logradouro: 'Av. Afonso Pena',
          numero: '1000',
          bairro: 'Centro',
          cidade: 'Belo Horizonte',
          uf: 'MG'
        },
        isActive: true,
        observacoes: 'Especialista em infraestrutura de rede e telecomunicações',
        createdBy: adminUser._id
      },
      {
        apelido: 'FiberTech',
        razaoSocial: 'FiberTech Distribuidora S.A.',
        idDistribuidor: 'FIBER001',
        contato: {
          nome: 'Ana Paula Costa',
          telefone: '(47) 5555-6666',
          cargo: 'Gerente Regional'
        },
        origem: 'Florianópolis',
        atendimento: {
          horario: '08:00 às 18:00',
          dias: 'Segunda a Sexta',
          observacoes: 'Suporte técnico especializado em fibra óptica'
        },
        frete: {
          tipo: 'TERCEIRO',
          valor: 0.00,
          prazo: 2,
          observacoes: 'Frete terceirizado com parceiros locais'
        },
        pedidoMinimo: {
          valor: 500.00,
          observacoes: 'Foco em grandes volumes e projetos'
        },
        endereco: {
          cep: '88000-000',
          logradouro: 'Rua das Palmeiras',
          numero: '789',
          bairro: 'Centro',
          cidade: 'Florianópolis',
          uf: 'SC'
        },
        isActive: true,
        observacoes: 'Líder em soluções de fibra óptica e equipamentos GPON',
        createdBy: adminUser._id
      },
      {
        apelido: 'WirelessPro',
        razaoSocial: 'WirelessPro Tecnologia Ltda',
        idDistribuidor: 'WIRE001',
        contato: {
          nome: 'Roberto Almeida',
          telefone: '(85) 6666-7777',
          cargo: 'Coordenador de Vendas'
        },
        origem: 'Fortaleza',
        atendimento: {
          horario: '07:00 às 19:00',
          dias: 'Segunda a Sexta',
          observacoes: 'Atendimento estendido para região Nordeste'
        },
        frete: {
          tipo: 'FOB',
          valor: 25.00,
          prazo: 4,
          observacoes: 'Frete econômico para todo o Nordeste'
        },
        pedidoMinimo: {
          valor: 100.00,
          observacoes: 'Pedido mínimo flexível para pequenos revendedores'
        },
        endereco: {
          cep: '60000-000',
          logradouro: 'Av. Beira Mar',
          numero: '2000',
          bairro: 'Meireles',
          cidade: 'Fortaleza',
          uf: 'CE'
        },
        isActive: true,
        observacoes: 'Especializada em equipamentos wireless e antenas',
        createdBy: adminUser._id
      },
      {
        apelido: 'ConnectPlus',
        razaoSocial: 'ConnectPlus Distribuidora Ltda',
        idDistribuidor: 'CONN001',
        contato: {
          nome: 'Fernanda Lima',
          telefone: '(51) 7777-8888',
          cargo: 'Supervisora Comercial'
        },
        origem: 'Porto Alegre',
        atendimento: {
          horario: '08:00 às 17:00',
          dias: 'Segunda a Sexta',
          observacoes: 'Atendimento bilingue (português/espanhol)'
        },
        frete: {
          tipo: 'CIF',
          valor: 35.00,
          prazo: 2,
          observacoes: 'Cobertura para RS, SC e PR'
        },
        pedidoMinimo: {
          valor: 250.00,
          observacoes: 'Programa de fidelidade para revendedores'
        },
        endereco: {
          cep: '90000-000',
          logradouro: 'Rua da Independência',
          numero: '500',
          bairro: 'Centro Histórico',
          cidade: 'Porto Alegre',
          uf: 'RS'
        },
        isActive: true,
        observacoes: 'Distribuidora com foco em mercado regional do Sul',
        createdBy: adminUser._id
      }
    ];

    const createdDistributors = [];
    for (const distributorData of distributors) {
      const existingDistributor = await Distributor.findOne({ apelido: distributorData.apelido });
      if (!existingDistributor) {
        const distributor = new Distributor(distributorData);
        await distributor.save();
        createdDistributors.push(distributor);
        console.log(`✅ Distribuidor ${distributorData.apelido} criado`);
      } else {
        createdDistributors.push(existingDistributor);
        console.log(`✅ Distribuidor ${distributorData.apelido} já existe`);
      }
    }

    // Criar clientes de teste
    const clients = [
      {
        cnpj: '12.345.678/0001-90',
        razaoSocial: 'Provedor Tech Solutions Ltda',
        nomeFantasia: 'Tech Solutions',
        contato: {
          nome: 'Carlos Oliveira',
          email: 'carlos@techsolutions.com.br',
          telefone: '(11) 99999-1111',
          cargo: 'Diretor Comercial'
        },
        endereco: {
          cep: '01310-100',
          logradouro: 'Av. Paulista',
          numero: '1000',
          complemento: 'Sala 101',
          bairro: 'Bela Vista',
          cidade: 'São Paulo',
          uf: 'SP'
        },
        classificacao: 'PROVEDOR',
        observacoes: 'Cliente estratégico - alto volume',
        isActive: true,
        createdBy: adminUser._id
      },
      {
        cnpj: '98.765.432/0001-10',
        razaoSocial: 'Revenda Digital Ltda',
        nomeFantasia: 'Digital Revenda',
        contato: {
          nome: 'Ana Costa',
          email: 'ana@digitalrevenda.com.br',
          telefone: '(21) 88888-2222',
          cargo: 'Gerente de Vendas'
        },
        endereco: {
          cep: '20000-000',
          logradouro: 'Rua das Flores',
          numero: '500',
          bairro: 'Ipanema',
          cidade: 'Rio de Janeiro',
          uf: 'RJ'
        },
        classificacao: 'REVENDA',
        observacoes: 'Parceiro comercial - médio volume',
        isActive: true,
        createdBy: adminUser._id
      },
      {
        cnpj: '11.222.333/0001-44',
        razaoSocial: 'Empresa Diversos Ltda',
        nomeFantasia: 'Diversos Corp',
        contato: {
          nome: 'Roberto Silva',
          email: 'roberto@diversos.com.br',
          telefone: '(31) 77777-3333',
          cargo: 'Comprador'
        },
        endereco: {
          cep: '30000-000',
          logradouro: 'Av. Contorno',
          numero: '200',
          bairro: 'Savassi',
          cidade: 'Belo Horizonte',
          uf: 'MG'
        },
        classificacao: 'OUTROS',
        observacoes: 'Cliente ocasional - baixo volume',
        isActive: true,
        createdBy: adminUser._id
      }
    ];

    const createdClients = [];
    for (const clientData of clients) {
      const existingClient = await Client.findOne({ cnpj: clientData.cnpj });
      if (!existingClient) {
        const client = new Client(clientData);
        await client.save();
        createdClients.push(client);
        console.log(`✅ Cliente ${clientData.razaoSocial} criado`);
      } else {
        createdClients.push(existingClient);
        console.log(`✅ Cliente ${clientData.razaoSocial} já existe`);
      }
    }

    // Criar lista de preços de teste
    const priceListData = [
      // TechMax
      {
        distributor: createdDistributors[0]._id,
        product: createdProducts[0]._id, // 001-ONU
        pricing: {
          aVista: 120.00,
          tresXBoleto: 125.00,
          tresXCartao: 130.00
        },
        isActive: true,
        notes: 'Preço promocional para compras acima de 10 unidades'
      },
      {
        distributor: createdDistributors[0]._id,
        product: createdProducts[1]._id, // 002-ONT
        pricing: {
          aVista: 200.00,
          tresXBoleto: 210.00,
          tresXCartao: 220.00
        },
        isActive: true,
        notes: 'Desconto especial para revendedores'
      },
      {
        distributor: createdDistributors[0]._id,
        product: createdProducts[2]._id, // 011-OLT
        pricing: {
          aVista: 2000.00,
          tresXBoleto: 2100.00,
          tresXCartao: 2200.00
        },
        isActive: true,
        notes: 'Preço especial para grandes volumes'
      },
      // NetConnect
      {
        distributor: createdDistributors[1]._id,
        product: createdProducts[0]._id, // 001-ONU
        pricing: {
          aVista: 125.00,
          tresXBoleto: 130.00,
          tresXCartao: 135.00
        },
        isActive: true,
        notes: 'Preço competitivo com garantia estendida'
      },
      {
        distributor: createdDistributors[1]._id,
        product: createdProducts[3]._id, // 023-ROTE
        pricing: {
          aVista: 280.00,
          tresXBoleto: 290.00,
          tresXCartao: 300.00
        },
        isActive: true,
        notes: 'Inclui suporte técnico especializado'
      },
      {
        distributor: createdDistributors[1]._id,
        product: createdProducts[4]._id, // 026-FONT
        pricing: {
          aVista: 70.00,
          tresXBoleto: 75.00,
          tresXCartao: 80.00
        },
        isActive: true,
        notes: 'Fonte com certificação de qualidade'
      }
    ];

    for (const priceData of priceListData) {
      const existingPrice = await PriceList.findOne({
        distributor: priceData.distributor,
        product: priceData.product,
        createdBy: adminUser._id
      });
      
      if (!existingPrice) {
        const priceItem = new PriceList({
          ...priceData,
          createdBy: adminUser._id
        });
        await priceItem.save();
        console.log(`✅ Preço criado para ${priceData.distributor} - ${priceData.product}`);
      } else {
        console.log(`✅ Preço já existe para ${priceData.distributor} - ${priceData.product}`);
      }
    }

    console.log('🎉 Seed de dados concluído com sucesso!');
    console.log(`📊 Criados/Verificados:`);
    console.log(`   - ${createdProducts.length} produtos`);
    console.log(`   - ${createdDistributors.length} distribuidores`);
    console.log(`   - ${createdClients.length} clientes`);
    console.log(`   - ${priceListData.length} itens de preço`);

  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedData();
