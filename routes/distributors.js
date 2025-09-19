const express = require('express');
const router = express.Router();
const Distributor = require('../models/DistributorNew');
const { auth } = require('../middleware/auth');
const memoryStore = require('../data/memory-store');

// GET /api/distributors - Listar todos os distribuidores
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, origem, isActive } = req.query;
    
    // Usar dados em memória se o banco não estiver conectado
    if (req.useMemoryStore) {
      const distributors = memoryStore.getDistributors({ search, origem, isActive });
      const skip = (page - 1) * limit;
      const paginatedDistributors = distributors.slice(skip, skip + parseInt(limit));
      
      return res.json({
        data: paginatedDistributors,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(distributors.length / limit),
          total: distributors.length,
          limit: parseInt(limit)
        }
      });
    }

    const skip = (page - 1) * limit;

    let query = { $or: [
      { 'createdBy._id': req.user.id },
      { createdBy: req.user.id }
    ]};
    
    if (search) {
      query.$and = [
        { $or: [
          { 'createdBy._id': req.user.id },
          { createdBy: req.user.id }
        ]},
        { $or: [
          { apelido: { $regex: search, $options: 'i' } },
          { razaoSocial: { $regex: search, $options: 'i' } },
          { idDistribuidor: { $regex: search, $options: 'i' } },
          { 'contato.nome': { $regex: search, $options: 'i' } },
          { 'contato.telefone': { $regex: search, $options: 'i' } }
        ]}
      ];
    }
    
    if (origem) {
      query.origem = origem;
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const distributors = await Distributor.find(query)
      .populate('createdBy', 'name email')
      .sort({ apelido: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Distributor.countDocuments(query);

    res.json({
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

// GET /api/distributors/:id - Buscar distribuidor específico
router.get('/:id', auth, async (req, res) => {
  try {
    const distributor = await Distributor.findOne({
      _id: req.params.id,
      $or: [
        { 'createdBy._id': req.user.id },
        { createdBy: req.user.id }
      ]
    }).populate('createdBy', 'name email');

    if (!distributor) {
      return res.status(404).json({ error: 'Distribuidor não encontrado' });
    }

    res.json({ data: distributor });
  } catch (error) {
    console.error('Erro ao buscar distribuidor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/distributors - Criar novo distribuidor
router.post('/', auth, async (req, res) => {
  try {
    const {
      apelido,
      razaoSocial,
      idDistribuidor,
      contato,
      origem,
      atendimento,
      frete,
      pedidoMinimo,
      endereco,
      observacoes
    } = req.body;

    // Validações básicas
    if (!apelido || !razaoSocial || !idDistribuidor || !contato?.nome || !contato?.telefone || !origem || pedidoMinimo?.valor === undefined || pedidoMinimo?.valor === null || pedidoMinimo.valor < 0) {
      return res.status(400).json({ 
        error: 'Apelido, razão social, ID do distribuidor, contato, origem e pedido mínimo são obrigatórios' 
      });
    }

    // Usar dados em memória se o banco não estiver conectado
    if (req.useMemoryStore) {
      // Verificar se já existe distribuidor com mesmo apelido ou ID
      const existingDistributor = memoryStore.getDistributors().find(d => 
        d.apelido === apelido || d.idDistribuidor === idDistribuidor
      );

      if (existingDistributor) {
        return res.status(400).json({ 
          error: 'Apelido ou ID do distribuidor já cadastrado' 
        });
      }

      const distributorData = {
        apelido,
        razaoSocial,
        idDistribuidor,
        contato,
        origem,
        atendimento,
        frete,
        pedidoMinimo,
        endereco,
        observacoes,
        createdBy: {
          _id: req.user.id,
          name: req.user.name,
          email: req.user.email
        }
      };

      const distributor = memoryStore.createDistributor(distributorData);
      return res.status(201).json({ data: distributor });
    }

    const distributor = new Distributor({
      apelido,
      razaoSocial,
      idDistribuidor,
      contato,
      origem,
      atendimento,
      frete,
      pedidoMinimo,
      endereco,
      observacoes,
      createdBy: req.user.id
    });

    await distributor.save();
    await distributor.populate('createdBy', 'name email');

    res.status(201).json({ data: distributor });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Apelido ou ID do distribuidor já cadastrado' });
    }
    console.error('Erro ao criar distribuidor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/distributors/:id - Atualizar distribuidor
router.put('/:id', auth, async (req, res) => {
  try {
    const {
      apelido,
      razaoSocial,
      idDistribuidor,
      contato,
      origem,
      atendimento,
      frete,
      pedidoMinimo,
      endereco,
      isActive,
      observacoes
    } = req.body;

    const distributor = await Distributor.findOne({
      _id: req.params.id,
      createdBy: {
        _id: req.user.id,
        name: req.user.name,
        email: req.user.email
      }
    });

    if (!distributor) {
      return res.status(404).json({ error: 'Distribuidor não encontrado' });
    }

    // Atualizar campos se fornecidos
    if (apelido) distributor.apelido = apelido;
    if (razaoSocial) distributor.razaoSocial = razaoSocial;
    if (idDistribuidor) distributor.idDistribuidor = idDistribuidor;
    if (contato) distributor.contato = contato;
    if (origem) distributor.origem = origem;
    if (atendimento) distributor.atendimento = atendimento;
    if (frete) distributor.frete = frete;
    if (pedidoMinimo) distributor.pedidoMinimo = pedidoMinimo;
    if (endereco) distributor.endereco = endereco;
    if (isActive !== undefined) distributor.isActive = isActive;
    if (observacoes !== undefined) distributor.observacoes = observacoes;

    await distributor.save();
    await distributor.populate('createdBy', 'name email');

    res.json({ data: distributor });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Apelido ou ID do distribuidor já cadastrado' });
    }
    console.error('Erro ao atualizar distribuidor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/distributors/:id - Deletar distribuidor
router.delete('/:id', auth, async (req, res) => {
  try {
    // Usar dados em memória se o banco não estiver conectado
    if (req.useMemoryStore) {
      const distributor = memoryStore.deleteDistributor(req.params.id);
      
      if (!distributor) {
        return res.status(404).json({ error: 'Distribuidor não encontrado' });
      }

      return res.json({ message: 'Distribuidor deletado com sucesso' });
    }

    const distributor = await Distributor.findOneAndDelete({
      _id: req.params.id,
      createdBy: {
        _id: req.user.id,
        name: req.user.name,
        email: req.user.email
      }
    });

    if (!distributor) {
      return res.status(404).json({ error: 'Distribuidor não encontrado' });
    }

    res.json({ message: 'Distribuidor deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar distribuidor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
