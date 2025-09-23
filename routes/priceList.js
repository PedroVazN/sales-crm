const express = require('express');
const router = express.Router();
const PriceList = require('../models/PriceList');
const Distributor = require('../models/DistributorNew');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

// GET /api/price-list - Listar lista de preços agrupada por distribuidor
router.get('/', auth, async (req, res) => {
  try {
    console.log('=== INÍCIO DA ROTA PRICE-LIST ===');
    console.log('Usuário:', req.user);
    
    const { page = 1, limit = 100, distributor, product, isActive } = req.query;
    const skip = (page - 1) * limit;

    let query = { createdBy: req.user.id };
    
    if (distributor) {
      query.distributor = distributor;
    }
    
    if (product) {
      query.product = product;
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    console.log('Query para buscar itens:', query);
    
    // BUSCAR DADOS REAIS DO BANCO DE DADOS
    const priceList = await PriceList.find(query)
      .populate({
        path: 'distributor',
        model: 'DistributorNew',
        select: 'apelido razaoSocial contato.nome contato.telefone'
      })
      .populate({
        path: 'product',
        model: 'Product',
        select: 'name description price category'
      })
      .populate({
        path: 'createdBy',
        model: 'User',
        select: 'name email'
      })
      .sort({ createdAt: -1 });
    
    console.log('Itens encontrados no banco:', priceList.length);
    
    if (priceList.length > 0) {
      console.log('Primeiro item (para debug):', JSON.stringify(priceList[0], null, 2));
      console.log('Distribuidor populado:', priceList[0].distributor);
      console.log('Produto populado:', priceList[0].product);
    }

    // Filtrar apenas itens com distribuidor válido
    const validItems = priceList.filter(item =>
      item.distributor &&
      item.distributor._id &&
      item.product &&
      item.product._id
    );

    console.log('Itens válidos após filtro:', validItems.length);

    // Se não há itens válidos, retornar array vazio
    if (validItems.length === 0) {
      return res.json({
        success: true,
        data: [],
        pagination: {
          current: parseInt(page),
          pages: 0,
          total: 0,
          limit: parseInt(limit)
        },
        message: 'Nenhum item válido encontrado'
      });
    }

    // Agrupar por distribuidor
    const groupedData = validItems.reduce((acc, item) => {
      const distributorId = item.distributor ? item.distributor._id.toString() : 'sem-distribuidor';

      if (!acc[distributorId]) {
        acc[distributorId] = {
          _id: distributorId,
          distributor: item.distributor || {
            _id: 'sem-id',
            apelido: 'Distribuidor não encontrado',
            razaoSocial: 'Distribuidor não encontrado',
            contato: {
              nome: 'N/A',
              telefone: 'N/A'
            }
          },
          products: []
        };
      }

      acc[distributorId].products.push({
        _id: item._id,
        product: item.product || {
          _id: 'sem-id',
          name: 'Produto não encontrado',
          description: 'Produto não encontrado',
          price: 0,
          category: 'N/A'
        },
        pricing: {
          aVista: item.pricing?.aVista || 0,
          cartao: item.pricing?.tresXCartao || 0,
          boleto: item.pricing?.tresXBoleto || 0
        },
        isActive: item.isActive,
        validFrom: item.validFrom,
        validUntil: item.validUntil,
        notes: item.notes || '',
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      });

      return acc;
    }, {});

    // Converter para array e aplicar paginação
    const groupedArray = Object.values(groupedData);
    const total = groupedArray.length;
    const paginatedData = groupedArray.slice(skip, skip + parseInt(limit));

    console.log('Dados agrupados por distribuidor enviados para o frontend:', paginatedData.length, 'distribuidores');

    res.json({
      success: true,
      data: paginatedData,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      },
      message: `Encontradas ${validItems.length} itens em ${groupedArray.length} distribuidores`
    });
  } catch (error) {
    console.error('=== ERRO NA ROTA PRICE-LIST ===');
    console.error('Erro completo:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      success: false,
      error: 'Erro interno do servidor',
      details: error.message 
    });
  }
});

// GET /api/price-list/:id - Buscar item específico da lista de preços
router.get('/:id', auth, async (req, res) => {
  try {
    const priceItem = await PriceList.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    })
    .populate('distributor', 'apelido razaoSocial contato.nome')
    .populate('product', 'name description price category')
    .populate('createdBy', 'name email');

    if (!priceItem) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }

    res.json({ data: priceItem });
  } catch (error) {
    console.error('Erro ao buscar item da lista de preços:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/price-list - Criar novo item na lista de preços
router.post('/', auth, async (req, res) => {
  try {
    console.log('=== POST /api/price-list ===');
    console.log('Body recebido:', JSON.stringify(req.body, null, 2));
    console.log('User:', req.user);
    
    const {
      distributor,
      product,
      pricing,
      validFrom,
      validUntil,
      notes
    } = req.body;

    // Validações básicas
    console.log('Validando campos obrigatórios...');
    console.log('distributor:', distributor);
    console.log('product:', product);
    console.log('pricing:', pricing);
    
    if (!distributor || !product || !pricing) {
      console.log('❌ Falha na validação: campos obrigatórios ausentes');
      return res.status(400).json({ 
        error: 'Distribuidor, produto e preços são obrigatórios' 
      });
    }

    if (!pricing.aVista || !pricing.tresXBoleto || !pricing.tresXCartao) {
      console.log('❌ Falha na validação: valores de preço ausentes');
      return res.status(400).json({ 
        error: 'Todos os valores de preço são obrigatórios' 
      });
    }
    
    console.log('✅ Validações passaram');

    // Verificar se já existe um item para este distribuidor e produto
    const existingItem = await PriceList.findOne({
      distributor,
      product,
      createdBy: req.user.id
    });

    if (existingItem) {
      console.log('❌ Item já existe:', existingItem._id);
      return res.status(400).json({ 
        error: 'Já existe um preço cadastrado para este distribuidor e produto' 
      });
    }

    console.log('✅ Criando novo item...');
    const priceItem = new PriceList({
      distributor,
      product,
      pricing,
      validFrom: validFrom ? new Date(validFrom) : undefined,
      validUntil: validUntil ? new Date(validUntil) : undefined,
      notes,
      createdBy: req.user.id
    });

    await priceItem.save();
    await priceItem.populate('distributor', 'apelido razaoSocial contato.nome');
    await priceItem.populate('product', 'name description price category');
    await priceItem.populate('createdBy', 'name email');

    res.status(201).json({ data: priceItem });
  } catch (error) {
    console.error('Erro ao criar item da lista de preços:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/price-list/:id - Atualizar item da lista de preços
router.put('/:id', auth, async (req, res) => {
  try {
    const {
      pricing,
      isActive,
      validFrom,
      validUntil,
      notes
    } = req.body;

    const priceItem = await PriceList.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!priceItem) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }

    // Atualizar campos se fornecidos
    if (pricing) priceItem.pricing = pricing;
    if (isActive !== undefined) priceItem.isActive = isActive;
    if (validFrom) priceItem.validFrom = new Date(validFrom);
    if (validUntil) priceItem.validUntil = new Date(validUntil);
    if (notes !== undefined) priceItem.notes = notes;

    await priceItem.save();
    await priceItem.populate('distributor', 'apelido razaoSocial contato.nome');
    await priceItem.populate('product', 'name description price category');
    await priceItem.populate('createdBy', 'name email');

    res.json({ data: priceItem });
  } catch (error) {
    console.error('Erro ao atualizar item da lista de preços:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/price-list/:id - Deletar item da lista de preços
router.delete('/:id', auth, async (req, res) => {
  try {
    console.log('Tentando deletar item:', req.params.id, 'para usuário:', req.user.id);
    
    // Primeiro, verificar se o item existe
    const existingItem = await PriceList.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });
    
    if (!existingItem) {
      console.log('Item não encontrado ou não pertence ao usuário');
      return res.status(404).json({ error: 'Item não encontrado' });
    }
    
    console.log('Item encontrado, procedendo com a exclusão:', existingItem);
    
    const priceItem = await PriceList.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!priceItem) {
      console.log('Falha na exclusão - item não foi deletado');
      return res.status(500).json({ error: 'Falha ao deletar item' });
    }

    console.log('Item deletado com sucesso do banco de dados:', priceItem._id);
    
    // Verificar se o item foi realmente deletado
    const verifyDeletion = await PriceList.findOne({ _id: req.params.id });
    console.log('Verificação pós-exclusão - item ainda existe?', !!verifyDeletion);
    
    // Verificar quantos itens restam no banco para este usuário
    const remainingItems = await PriceList.countDocuments({ createdBy: req.user.id });
    console.log('Total de itens restantes para o usuário:', remainingItems);
    
    res.json({ 
      success: true,
      message: 'Item da lista de preços deletado com sucesso',
      deletedItem: priceItem._id,
      remainingItems: remainingItems
    });
  } catch (error) {
    console.error('Erro ao deletar item da lista de preços:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/price-list/distributor/:distributorId - Listar preços por distribuidor
router.get('/distributor/:distributorId', auth, async (req, res) => {
  try {
    const { distributorId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const priceList = await PriceList.find({
      distributor: distributorId,
      createdBy: req.user.id,
      isActive: true
    })
    .populate('product', 'name description price category')
    .sort({ 'product.name': 1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await PriceList.countDocuments({
      distributor: distributorId,
      createdBy: req.user.id,
      isActive: true
    });

    res.json({
      data: priceList,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar preços por distribuidor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/price-list/create - Criar lista de preços completa
router.post('/create', auth, async (req, res) => {
  try {
    console.log('=== POST /api/price-list/create ===');
    console.log('Body recebido:', JSON.stringify(req.body, null, 2));
    console.log('User:', req.user);
    
    const { distributorId, products } = req.body;

    // Validações básicas
    if (!distributorId || !products || products.length === 0) {
      return res.status(400).json({ 
        error: 'Distribuidor e produtos são obrigatórios' 
      });
    }

    // Criar um item para cada produto
    const createdItems = [];
    
    for (const product of products) {
      const { productId, pricing, isActive, validFrom, validUntil, notes } = product;
      
      // Validações do produto
      if (!productId || !pricing) {
        continue; // Pular produtos inválidos
      }

      if (pricing.aVista <= 0 || pricing.cartao <= 0 || pricing.boleto <= 0) {
        console.log(`❌ Preços inválidos para produto ${productId}:`, pricing);
        continue; // Pular produtos com preços inválidos
      }

      // Verificar se já existe
      const existingItem = await PriceList.findOne({
        distributor: distributorId,
        product: productId,
        createdBy: req.user.id
      });

      if (existingItem) {
        console.log(`❌ Item já existe para produto ${productId}`);
        continue; // Pular itens duplicados
      }

      // Criar novo item
      const priceItem = new PriceList({
        distributor: distributorId,
        product: productId,
        pricing: {
          aVista: pricing.aVista,
          tresXBoleto: pricing.boleto,
          tresXCartao: pricing.cartao
        },
        isActive: isActive !== undefined ? isActive : true,
        validFrom: validFrom ? new Date(validFrom) : undefined,
        validUntil: validUntil ? new Date(validUntil) : undefined,
        notes: notes || '',
        createdBy: req.user.id
      });

      await priceItem.save();
      await priceItem.populate('distributor', 'apelido razaoSocial contato.nome');
      await priceItem.populate('product', 'name description price category');
      await priceItem.populate('createdBy', 'name email');

      createdItems.push(priceItem);
    }

    console.log(`✅ Criados ${createdItems.length} itens de ${products.length} produtos`);

    res.status(201).json({ 
      success: true,
      message: `Lista de preços criada com ${createdItems.length} produtos`,
      data: createdItems
    });
  } catch (error) {
    console.error('Erro ao criar lista de preços:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro interno do servidor',
      details: error.message
    });
  }
});

module.exports = router;
