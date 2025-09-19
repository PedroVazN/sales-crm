const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

// Middlewares
app.use(cors({
  origin: [
    'http://localhost:3001', 
    'http://localhost:3000',
    'https://sales-crm-frontend.vercel.app',
    'https://*.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Carregar variáveis de ambiente
require('dotenv').config();

// Conexão com MongoDB
const connectDB = async () => {
  try {
    // MongoDB Atlas - usar variável de ambiente
    const atlasUri = process.env.MONGODB_URI;
    
    if (!atlasUri) {
      console.error('❌ MONGODB_URI não encontrada nas variáveis de ambiente');
      console.log('💡 Configure MONGODB_URI na Vercel ou no arquivo .env');
      // Em produção, não sair do processo, apenas logar o erro
      if (process.env.NODE_ENV === 'production') {
        console.log('⚠️  Continuando sem conexão com MongoDB em produção');
        return;
      }
      process.exit(1);
    }
    
    // MongoDB local como fallback
    const localUri = 'mongodb://localhost:27017/sellone';
    
    // Tentar primeiro MongoDB Atlas
    try {
      const conn = await mongoose.connect(atlasUri);
      console.log(`✅ MongoDB Atlas conectado: ${conn.connection.host}`);
      return;
    } catch (atlasError) {
      console.log('⚠️  MongoDB Atlas não disponível, tentando local...');
      console.log(`   Erro Atlas: ${atlasError.message}`);
    }
    
    // Tentar conectar com MongoDB local como fallback
    const conn = await mongoose.connect(localUri);
    console.log(`✅ MongoDB local conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Erro ao conectar com MongoDB:', error.message);
    console.log('💡 Dicas para resolver:');
    console.log('   1. Verifique se as credenciais do Atlas estão corretas no .env');
    console.log('   2. Configure o IP no MongoDB Atlas: https://www.mongodb.com/docs/atlas/security-whitelist/');
    console.log('   3. Ou instale MongoDB local: https://www.mongodb.com/try/download/community');
    console.log('   4. Verifique se a string MONGODB_URI está correta');
    process.exit(1);
  }
};

// Schemas do MongoDB
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  cost: Number,
  category: String,
  brand: String,
  sku: String,
  barcode: String,
  stock: {
    current: Number,
    min: Number,
    max: Number
  },
  images: [{
    url: String,
    alt: String
  }],
  tags: [String],
  isActive: { type: Boolean, default: true },
  createdBy: {
    _id: String,
    name: String,
    email: String
  }
}, { timestamps: true });

const DistributorSchema = new mongoose.Schema({
  apelido: { type: String, required: true },
  razaoSocial: { type: String, required: true },
  idDistribuidor: String,
  contato: {
    nome: String,
    email: String,
    telefone: String,
    cargo: String
  },
  origem: String,
  atendimento: {
    horario: String,
    dias: String,
    observacoes: String
  },
  frete: {
    tipo: String,
    valor: Number,
    prazo: Number,
    observacoes: String
  },
  pedidoMinimo: {
    valor: Number,
    observacoes: String
  },
  endereco: {
    cep: String,
    logradouro: String,
    numero: String,
    complemento: String,
    bairro: String,
    cidade: String,
    uf: String
  },
  isActive: { type: Boolean, default: true },
  observacoes: String,
  createdBy: {
    _id: String,
    name: String,
    email: String
  }
}, { timestamps: true });

const PriceListSchema = new mongoose.Schema({
  distributor: {
    _id: String,
    apelido: String,
    razaoSocial: String,
    contato: {
      nome: String,
      telefone: String
    }
  },
  products: [{
    product: {
      _id: String,
      name: String,
      description: String,
      category: String
    },
    pricing: {
      aVista: Number,
      cartao: Number,
      boleto: Number
    },
    isActive: { type: Boolean, default: true },
    validFrom: Date,
    validUntil: Date,
    notes: String
  }],
  createdBy: {
    _id: String,
    name: String,
    email: String
  }
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);
const Distributor = mongoose.model('Distributor', DistributorSchema);
const PriceList = mongoose.model('PriceList', PriceListSchema);

// Conectar ao MongoDB
connectDB();

// Rota da API
app.get('/api', (req, res) => {
  res.json({
    message: 'Bem-vindo ao SellOne API',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// Rota de status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Servidor SellOne funcionando'
  });
});

// Rota de login
app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;
  
  const users = [
    {
      _id: '1',
      name: 'Administrador',
      email: 'admin@sellone.com',
      password: '123456',
      role: 'admin',
      phone: '11999999999',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ];
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: userWithoutPassword
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Email ou senha incorretos'
    });
  }
});

// Rota de usuários
app.get('/api/users', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const users = [
      {
        _id: '1',
        name: 'Administrador',
        email: 'admin@sellone.com',
        role: 'admin',
        phone: '11999999999',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        _id: '2',
        name: 'Vendedor 1',
        email: 'vendedor1@sellone.com',
        role: 'vendedor',
        phone: '11988887777',
        isActive: true,
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z'
      }
    ];

    res.json({
      success: true,
      data: users,
      pagination: {
        current: parseInt(page),
        pages: 1,
        total: users.length,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota de vendas
app.get('/api/sales', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const sales = [
      {
        _id: '1',
        client: {
          _id: '1',
          name: 'Cliente Exemplo',
          email: 'cliente@exemplo.com'
        },
        products: [
          {
            product: {
              _id: '1',
              name: 'Sistema CRM Pro',
              price: 299.90
            },
            quantity: 1,
            total: 299.90
          }
        ],
        total: 299.90,
        status: 'completed',
        paymentMethod: 'credit_card',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      }
    ];

    res.json({
      success: true,
      data: sales,
      pagination: {
        current: parseInt(page),
        pages: 1,
        total: sales.length,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar vendas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota de estatísticas de vendas
app.get('/api/sales/stats/summary', async (req, res) => {
  try {
    const stats = {
      totalSales: 15000.00,
      totalOrders: 25,
      averageOrderValue: 600.00,
      conversionRate: 12.5,
      topProducts: [
        { name: 'Sistema CRM Pro', sales: 8, revenue: 2399.20 },
        { name: 'Consultoria Empresarial', sales: 5, revenue: 7500.00 },
        { name: 'Plano Premium', sales: 12, revenue: 2398.80 }
      ],
      monthlyGrowth: 15.3,
      period: 'Últimos 30 dias'
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota de produtos
app.get('/api/products', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const products = await Product.find({ isActive: true })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments({ isActive: true });

    // Se não há produtos no banco, criar alguns dados de exemplo
    if (products.length === 0) {
      const sampleProducts = [
        {
          name: 'Sistema CRM Pro',
          description: 'Sistema completo de gestão de relacionamento com clientes',
          price: 299.90,
          cost: 150.00,
          category: 'Software',
          brand: 'SellOne',
          sku: 'CRM-PRO-001',
          barcode: '1234567890123',
          stock: { current: 50, min: 10, max: 100 },
          images: [{ url: '/images/crm-pro.jpg', alt: 'Sistema CRM Pro' }],
          tags: ['CRM', 'Gestão', 'Vendas'],
          isActive: true,
          createdBy: {
            _id: '1',
            name: 'Administrador',
            email: 'admin@sellone.com'
          }
        },
        {
          name: 'Consultoria Empresarial',
          description: 'Consultoria especializada em transformação digital',
          price: 1500.00,
          cost: 800.00,
          category: 'Serviços',
          brand: 'SellOne',
          sku: 'CONS-EMP-001',
          barcode: '1234567890124',
          stock: { current: 25, min: 5, max: 50 },
          images: [{ url: '/images/consultoria.jpg', alt: 'Consultoria Empresarial' }],
          tags: ['Consultoria', 'Digital', 'Transformação'],
          isActive: true,
          createdBy: {
            _id: '1',
            name: 'Administrador',
            email: 'admin@sellone.com'
          }
        },
        {
          name: 'Plano Premium',
          description: 'Plano premium com recursos avançados',
          price: 199.90,
          cost: 100.00,
          category: 'Assinatura',
          brand: 'SellOne',
          sku: 'PLAN-PREM-001',
          barcode: '1234567890125',
          stock: { current: 100, min: 20, max: 200 },
          images: [{ url: '/images/plano-premium.jpg', alt: 'Plano Premium' }],
          tags: ['Plano', 'Premium', 'Recursos'],
          isActive: true,
          createdBy: {
            _id: '1',
            name: 'Administrador',
            email: 'admin@sellone.com'
          }
        }
      ];

      await Product.insertMany(sampleProducts);
      const newProducts = await Product.find({ isActive: true })
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      return res.json({
        success: true,
        data: newProducts,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(sampleProducts.length / limit),
          total: sampleProducts.length,
          limit: parseInt(limit)
        }
      });
    }

    res.json({
      success: true,
      data: products,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/products - Criar produto
app.post('/api/products', async (req, res) => {
  try {
    // Gerar SKU único se estiver vazio
    let sku = req.body.sku;
    if (!sku || sku.trim() === '') {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8).toUpperCase();
      sku = `PROD-${timestamp}-${random}`;
    }
    
    const productData = {
      ...req.body,
      sku: sku,
      createdBy: {
        _id: '1',
        name: 'Administrador',
        email: 'admin@sellone.com'
      }
    };
    
    const product = new Product(productData);
    const savedProduct = await product.save();
    
    res.status(201).json({
      success: true,
      data: savedProduct,
      message: 'Produto criado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/products/:id - Atualizar produto
app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Produto não encontrado' 
      });
    }
    
    res.json({
      success: true,
      data: product,
      message: 'Produto atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/products/:id - Deletar produto
app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Produto não encontrado' 
      });
    }

    await Product.findByIdAndDelete(req.params.id);
    
    res.json({ 
      success: true,
      message: 'Produto deletado com sucesso',
      deletedId: req.params.id
    });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota de distribuidores
app.get('/api/distributors', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const distributors = await Distributor.find({ isActive: true })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Distributor.countDocuments({ isActive: true });

    // Se não há distribuidores no banco, criar alguns dados de exemplo
    if (distributors.length === 0) {
      const sampleDistributors = [
        {
          apelido: 'Distribuidor Alpha',
          razaoSocial: 'Alpha Distribuidora Ltda',
          idDistribuidor: 'DIST001',
          contato: {
            nome: 'João Silva',
            email: 'joao@alpha.com',
            telefone: '11999887766',
            cargo: 'Gerente'
          },
          origem: 'Indicação',
          atendimento: {
            horario: '08:00 às 18:00',
            dias: 'Segunda a Sexta',
            observacoes: 'Atendimento prioritário'
          },
          frete: {
            tipo: 'CIF',
            valor: 50.00,
            prazo: 3,
            observacoes: 'Frete grátis acima de R$ 500'
          },
          pedidoMinimo: {
            valor: 200.00,
            observacoes: 'Valor mínimo para pedidos'
          },
          endereco: {
            cep: '01234-567',
            logradouro: 'Rua das Flores, 123',
            numero: '123',
            complemento: 'Sala 45',
            bairro: 'Centro',
            cidade: 'São Paulo',
            uf: 'SP'
          },
          isActive: true,
          observacoes: 'Distribuidor confiável',
          createdBy: {
            _id: '1',
            name: 'Administrador',
            email: 'admin@sellone.com'
          }
        },
        {
          apelido: 'Beta Corp',
          razaoSocial: 'Beta Corporation S.A.',
          idDistribuidor: 'DIST002',
          contato: {
            nome: 'Maria Santos',
            email: 'maria@beta.com',
            telefone: '11988776655',
            cargo: 'Diretora'
          },
          origem: 'Site',
          atendimento: {
            horario: '09:00 às 17:00',
            dias: 'Segunda a Sexta',
            observacoes: 'Atendimento via WhatsApp'
          },
          frete: {
            tipo: 'FOB',
            valor: 0,
            prazo: 5,
            observacoes: 'Cliente retira'
          },
          pedidoMinimo: {
            valor: 500.00,
            observacoes: 'Valor mínimo para pedidos especiais'
          },
          endereco: {
            cep: '04567-890',
            logradouro: 'Av. Paulista, 1000',
            numero: '1000',
            complemento: '15º andar',
            bairro: 'Bela Vista',
            cidade: 'São Paulo',
            uf: 'SP'
          },
          isActive: true,
          observacoes: 'Grande distribuidor regional',
          createdBy: {
            _id: '1',
            name: 'Administrador',
            email: 'admin@sellone.com'
          }
        }
      ];

      await Distributor.insertMany(sampleDistributors);
      const newDistributors = await Distributor.find({ isActive: true })
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      return res.json({
        success: true,
        data: newDistributors,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(sampleDistributors.length / limit),
          total: sampleDistributors.length,
          limit: parseInt(limit)
        }
      });
    }

    res.json({
      success: true,
      data: distributors,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar distribuidores:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota de lista de preços - GET
app.get('/api/price-list', async (req, res) => {
  try {
    const { distributorId } = req.query;

    let query = {};
    if (distributorId) {
      query['distributor._id'] = distributorId;
    }

    const priceLists = await PriceList.find(query)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: priceLists
    });
  } catch (error) {
    console.error('Erro ao buscar lista de preços:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota de lista de preços - POST
app.post('/api/price-list', async (req, res) => {
  try {
    console.log('=== POST /api/price-list ===');
    console.log('Body:', req.body);
    
    // Aceitar tanto o formato antigo quanto o novo
    let distributorId, products;
    
    if (req.body.distributorId && req.body.products) {
      // Formato do frontend: { distributorId, products: [...] }
      distributorId = req.body.distributorId;
      products = req.body.products;
    } else if (req.body.distributor && req.body.product) {
      // Formato antigo: { distributor, product, pricing, ... }
      distributorId = req.body.distributor;
      products = [{
        productId: req.body.product,
        pricing: {
          aVista: req.body.pricing.aVista,
          cartao: req.body.pricing.tresXCartao || req.body.pricing.cartao,
          boleto: req.body.pricing.tresXBoleto || req.body.pricing.boleto
        },
        isActive: req.body.isActive,
        validFrom: req.body.validFrom,
        validUntil: req.body.validUntil,
        notes: req.body.notes
      }];
    } else {
      return res.status(400).json({ 
        error: 'Formato de dados inválido. Use { distributorId, products } ou { distributor, product, pricing }' 
      });
    }

    console.log('distributorId:', distributorId);
    console.log('products:', products);
    console.log('Array.isArray(products):', Array.isArray(products));

    // Validações básicas
    if (!distributorId) {
      console.log('Erro: distributorId não fornecido');
      return res.status(400).json({ 
        error: 'Distribuidor é obrigatório' 
      });
    }
    
    if (!products) {
      console.log('Erro: products não fornecido');
      return res.status(400).json({ 
        error: 'Produtos são obrigatórios' 
      });
    }
    
    if (!Array.isArray(products)) {
      console.log('Erro: products não é um array');
      return res.status(400).json({ 
        error: 'Produtos deve ser um array' 
      });
    }

    // Validar e normalizar estrutura dos produtos
    for (const product of products) {
      if (!product.productId || !product.pricing) {
        return res.status(400).json({ 
          error: 'Cada produto deve ter productId e pricing' 
        });
      }

      // Normalizar formato do pricing
      if (product.pricing.cartao && typeof product.pricing.cartao === 'object') {
        product.pricing.cartao = product.pricing.cartao.valor || product.pricing.cartao;
      }
      if (product.pricing.boleto && typeof product.pricing.boleto === 'object') {
        product.pricing.boleto = product.pricing.boleto.valor || product.pricing.boleto;
      }

      if (product.pricing.aVista === undefined || product.pricing.cartao === undefined || product.pricing.boleto === undefined) {
        return res.status(400).json({ 
          error: 'Cada produto deve ter preços à vista, cartão e boleto' 
        });
      }
    }

    // Buscar dados do distribuidor selecionado
    const selectedDistributor = await Distributor.findById(distributorId);
    if (!selectedDistributor) {
      return res.status(404).json({ 
        error: 'Distribuidor não encontrado' 
      });
    }

    // Buscar dados dos produtos selecionados
    const productIds = products.map(p => p.productId);
    const allProducts = await Product.find({ _id: { $in: productIds } });

    const newPriceList = new PriceList({
      distributor: {
        _id: selectedDistributor._id,
        apelido: selectedDistributor.apelido,
        razaoSocial: selectedDistributor.razaoSocial,
        contato: selectedDistributor.contato
      },
      products: products.map((product) => {
        const productData = allProducts.find(p => p._id.toString() === product.productId) || {
          _id: product.productId,
          name: product.productName || 'Produto',
          description: product.description || '',
          category: product.category || 'Geral'
        };

        return {
          product: {
            _id: productData._id,
            name: productData.name,
            description: productData.description,
            category: productData.category
          },
          pricing: product.pricing,
          isActive: product.isActive !== false,
          validFrom: product.validFrom || new Date(),
          validUntil: product.validUntil || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          notes: product.notes || ''
        };
      }),
      createdBy: {
        _id: '1',
        name: 'Administrador',
        email: 'admin@sellone.com'
      }
    });

    // Salvar no MongoDB
    const savedPriceList = await newPriceList.save();

    console.log('Lista criada com sucesso:', savedPriceList);

    res.status(201).json({ 
      success: true,
      data: savedPriceList,
      message: 'Lista de preços criada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar lista de preços:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para atualizar lista de preços
app.put('/api/price-list/:id', async (req, res) => {
  try {
    const { distributorId, products } = req.body;
    
    const priceList = await PriceList.findById(req.params.id);
    
    if (!priceList) {
      return res.status(404).json({ 
        success: false,
        message: 'Lista de preços não encontrada' 
      });
    }

    // Buscar dados do distribuidor
    const selectedDistributor = await Distributor.findById(distributorId);
    if (!selectedDistributor) {
      return res.status(404).json({ 
        error: 'Distribuidor não encontrado' 
      });
    }

    // Buscar dados dos produtos selecionados
    const productIds = products.map(p => p.productId);
    const allProducts = await Product.find({ _id: { $in: productIds } });

    // Atualizar a lista
    priceList.distributor = {
      _id: selectedDistributor._id,
      apelido: selectedDistributor.apelido,
      razaoSocial: selectedDistributor.razaoSocial,
      contato: selectedDistributor.contato
    };

    priceList.products = products.map((product) => {
      const productData = allProducts.find(p => p._id.toString() === product.productId) || {
        _id: product.productId,
        name: product.productName || 'Produto',
        description: product.description || '',
        category: product.category || 'Geral'
      };

      return {
        product: {
          _id: productData._id,
          name: productData.name,
          description: productData.description,
          category: productData.category
        },
        pricing: product.pricing,
        isActive: product.isActive !== false,
        validFrom: product.validFrom || new Date(),
        validUntil: product.validUntil || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        notes: product.notes || ''
      };
    });

    const updatedPriceList = await priceList.save();

    res.json({
      success: true,
      data: updatedPriceList,
      message: 'Lista de preços atualizada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar lista de preços:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para deletar lista de preços
app.delete('/api/price-list/:id', async (req, res) => {
  try {
    const priceList = await PriceList.findById(req.params.id);
    
    if (!priceList) {
      return res.status(404).json({ 
        success: false,
        message: 'Lista de preços não encontrada' 
      });
    }

    await PriceList.findByIdAndDelete(req.params.id);
    
    res.json({ 
      success: true,
      message: 'Lista de preços deletada com sucesso',
      deletedId: req.params.id
    });
  } catch (error) {
    console.error('Erro ao deletar lista de preços:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Schema para Propostas
const ProposalSchema = new mongoose.Schema({
  proposalNumber: { type: String, required: true, unique: true },
  client: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    company: { type: String }
  },
  seller: {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  distributor: {
    _id: { type: String, required: true },
    apelido: { type: String, required: true },
    razaoSocial: { type: String, required: true }
  },
  items: [{
    product: {
      _id: { type: String, required: true },
      name: { type: String, required: true },
      description: { type: String },
      category: { type: String },
      price: { type: Number, required: true }
    },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    total: { type: Number, required: true, min: 0 }
  }],
  subtotal: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  total: { type: Number, required: true, min: 0 },
  paymentCondition: { type: String, required: true },
  observations: { type: String },
  status: { 
    type: String, 
    enum: ['draft', 'sent', 'accepted', 'rejected', 'expired'], 
    default: 'draft' 
  },
  validUntil: { type: Date, required: true },
  createdBy: {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true }
  }
}, {
  timestamps: true
});

const Proposal = mongoose.model('Proposal', ProposalSchema);

// Função para gerar número da proposta
const generateProposalNumber = async () => {
  const count = await Proposal.countDocuments();
  return `PROP-${String(count + 1).padStart(4, '0')}`;
};

// Rotas de Propostas
// GET /api/proposals - Listar propostas
app.get('/api/proposals', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const search = req.query.search;
    
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { proposalNumber: { $regex: search, $options: 'i' } },
        { 'client.name': { $regex: search, $options: 'i' } },
        { 'client.company': { $regex: search, $options: 'i' } },
        { 'seller.name': { $regex: search, $options: 'i' } },
        { 'distributor.apelido': { $regex: search, $options: 'i' } }
      ];
    }
    
    const proposals = await Proposal.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    const total = await Proposal.countDocuments(query);
    
    res.json({
      success: true,
      data: proposals,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar propostas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/proposals/:id - Buscar proposta por ID
app.get('/api/proposals/:id', async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    
    if (!proposal) {
      return res.status(404).json({ 
        success: false,
        message: 'Proposta não encontrada' 
      });
    }
    
    res.json({
      success: true,
      data: proposal
    });
  } catch (error) {
    console.error('Erro ao buscar proposta:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/proposals - Criar proposta
app.post('/api/proposals', async (req, res) => {
  try {
    const proposalNumber = await generateProposalNumber();
    
    const proposalData = {
      ...req.body,
      proposalNumber,
      createdBy: {
        _id: '1',
        name: 'Administrador',
        email: 'admin@sellone.com'
      }
    };
    
    const proposal = new Proposal(proposalData);
    const savedProposal = await proposal.save();
    
    res.status(201).json({
      success: true,
      data: savedProposal,
      message: 'Proposta criada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar proposta:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/proposals/:id - Atualizar proposta
app.put('/api/proposals/:id', async (req, res) => {
  try {
    const proposal = await Proposal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!proposal) {
      return res.status(404).json({ 
        success: false,
        message: 'Proposta não encontrada' 
      });
    }
    
    res.json({
      success: true,
      data: proposal,
      message: 'Proposta atualizada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar proposta:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PATCH /api/proposals/:id/status - Atualizar status da proposta
app.patch('/api/proposals/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['draft', 'sent', 'accepted', 'rejected', 'expired'].includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: 'Status inválido' 
      });
    }
    
    const proposal = await Proposal.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!proposal) {
      return res.status(404).json({ 
        success: false,
        message: 'Proposta não encontrada' 
      });
    }
    
    res.json({
      success: true,
      data: proposal,
      message: 'Status atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/proposals/:id - Deletar proposta
app.delete('/api/proposals/:id', async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    
    if (!proposal) {
      return res.status(404).json({ 
        success: false,
        message: 'Proposta não encontrada' 
      });
    }

    await Proposal.findByIdAndDelete(req.params.id);
    
    res.json({ 
      success: true,
      message: 'Proposta deletada com sucesso',
      deletedId: req.params.id
    });
  } catch (error) {
    console.error('Erro ao deletar proposta:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Importar e usar as rotas de clientes
const clientsRouter = require('./routes/clients');
app.use('/api/clients', clientsRouter);

// Importar e usar as rotas de eventos
const eventsRouter = require('./routes/events');
app.use('/api/events', eventsRouter);

// Importar e usar as rotas de metas
const goalsRouter = require('./routes/goals');
app.use('/api/goals', goalsRouter);

const notificationsRouter = require('./routes/notifications');
app.use('/api/notifications', notificationsRouter);

const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API funcionando' });
});

// Rota de teste para verificar se o servidor está funcionando
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend funcionando!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor SellOne funcionando na porta ${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(`🔐 Login: admin@sellone.com / 123456`);
});
