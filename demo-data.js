// Dados de demonstração para o sistema de vendas
const demoData = {
  users: [
    {
      _id: 'user1',
      name: 'Administrador',
      email: 'admin@sellone.com',
      password: '12345',
      role: 'admin',
      phone: '(11) 99999-9999',
      isActive: true
    }
  ],
  
  distributors: [
    {
      _id: 'dist1',
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
      observacoes: 'Distribuidora especializada em equipamentos de rede'
    },
    {
      _id: 'dist2',
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
      observacoes: 'Foco em soluções de conectividade empresarial'
    },
    {
      _id: 'dist3',
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
      observacoes: 'Especialista em infraestrutura de rede e telecomunicações'
    },
    {
      _id: 'dist4',
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
      observacoes: 'Líder em soluções de fibra óptica e equipamentos GPON'
    },
    {
      _id: 'dist5',
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
      observacoes: 'Especializada em equipamentos wireless e antenas'
    },
    {
      _id: 'dist6',
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
      observacoes: 'Distribuidora com foco em mercado regional do Sul'
    }
  ],

  clients: [
    {
      _id: 'client1',
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
      isActive: true
    },
    {
      _id: 'client2',
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
      isActive: true
    },
    {
      _id: 'client3',
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
      isActive: true
    }
  ],

  products: [
    {
      _id: 'prod1',
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
      _id: 'prod2',
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
      _id: 'prod3',
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
      _id: 'prod4',
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
      _id: 'prod5',
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
  ],

  priceList: [
    {
      _id: 'price1',
      distributor: 'dist1',
      product: 'prod1',
      pricing: {
        aVista: 120.00,
        tresXBoleto: 125.00,
        tresXCartao: 130.00
      },
      isActive: true,
      notes: 'Preço promocional para compras acima de 10 unidades'
    },
    {
      _id: 'price2',
      distributor: 'dist1',
      product: 'prod2',
      pricing: {
        aVista: 200.00,
        tresXBoleto: 210.00,
        tresXCartao: 220.00
      },
      isActive: true,
      notes: 'Desconto especial para revendedores'
    },
    {
      _id: 'price3',
      distributor: 'dist2',
      product: 'prod1',
      pricing: {
        aVista: 125.00,
        tresXBoleto: 130.00,
        tresXCartao: 135.00
      },
      isActive: true,
      notes: 'Preço competitivo com garantia estendida'
    }
  ]
};

module.exports = demoData;
