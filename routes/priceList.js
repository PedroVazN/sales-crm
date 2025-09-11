const express = require('express');
const router = express.Router();
const PriceList = require('../models/PriceList');
const Distributor = require('../models/DistributorNew');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

// GET /api/price-list - Listar lista de preços
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, distributor, product, isActive } = req.query;
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

    const priceList = await PriceList.find(query)
      .populate('distributor', 'apelido razaoSocial contato.nome')
      .populate('product', 'name description price category')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await PriceList.countDocuments(query);

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
    console.error('Erro ao buscar lista de preços:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
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
    const {
      distributor,
      product,
      pricing,
      validFrom,
      validUntil,
      notes
    } = req.body;

    // Validações básicas
    if (!distributor || !product || !pricing) {
      return res.status(400).json({ 
        error: 'Distribuidor, produto e preços são obrigatórios' 
      });
    }

    if (!pricing.aVista || !pricing.tresXBoleto || !pricing.tresXCartao) {
      return res.status(400).json({ 
        error: 'Todos os valores de preço são obrigatórios' 
      });
    }

    // Verificar se já existe um item para este distribuidor e produto
    const existingItem = await PriceList.findOne({
      distributor,
      product,
      createdBy: req.user.id
    });

    if (existingItem) {
      return res.status(400).json({ 
        error: 'Já existe um preço cadastrado para este distribuidor e produto' 
      });
    }

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
    const priceItem = await PriceList.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!priceItem) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }

    res.json({ message: 'Item deletado com sucesso' });
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

module.exports = router;
