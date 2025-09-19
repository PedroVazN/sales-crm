const express = require('express');
const router = express.Router();
const Distributor = require('../models/DistributorNew');
const DistributorOld = require('../models/Distributor');
const { auth } = require('../middleware/auth');

// GET /api/distributors - Listar todos os distribuidores
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, origem, isActive } = req.query;
    const skip = (page - 1) * limit;

    // Buscar distribuidores novos (estrutura atual)
    let queryNew = { 'createdBy._id': req.user.id };
    
    if (search) {
      queryNew.$or = [
        { apelido: { $regex: search, $options: 'i' } },
        { razaoSocial: { $regex: search, $options: 'i' } },
        { idDistribuidor: { $regex: search, $options: 'i' } },
        { 'contato.nome': { $regex: search, $options: 'i' } },
        { 'contato.telefone': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (origem) {
      queryNew.origem = origem;
    }
    
    if (isActive !== undefined) {
      queryNew.isActive = isActive === 'true';
    }

    // Buscar distribuidores antigos (estrutura antiga)
    let queryOld = {};
    
    if (search) {
      queryOld.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (isActive !== undefined) {
      queryOld.isActive = isActive === 'true';
    }

    // Buscar em ambos os modelos
    const [distributorsNew, distributorsOld] = await Promise.all([
      Distributor.find(queryNew).populate('createdBy', 'name email'),
      DistributorOld.find(queryOld)
    ]);

    // Converter distribuidores antigos para formato novo
    const convertedOld = distributorsOld.map(dist => ({
      _id: dist._id,
      apelido: dist.name || 'N/A',
      razaoSocial: dist.name || 'N/A',
      idDistribuidor: dist._id.toString().slice(-6).toUpperCase(),
      contato: {
        nome: dist.contactPerson?.name || dist.name || 'N/A',
        email: dist.email || 'N/A',
        telefone: dist.phone || 'N/A',
        cargo: dist.contactPerson?.position || 'N/A'
      },
      origem: 'Sistema Antigo',
      atendimento: {
        horario: 'N/A',
        dias: 'N/A',
        observacoes: 'Migrado do sistema antigo'
      },
      frete: {
        tipo: 'CIF',
        valor: 0,
        prazo: 0,
        observacoes: 'N/A'
      },
      pedidoMinimo: {
        valor: 0,
        observacoes: 'N/A'
      },
      endereco: {
        cep: dist.address?.zipCode || 'N/A',
        logradouro: dist.address?.street || 'N/A',
        numero: dist.address?.number || 'N/A',
        complemento: dist.address?.complement || 'N/A',
        bairro: dist.address?.neighborhood || 'N/A',
        cidade: dist.address?.city || 'N/A',
        uf: dist.address?.state || 'N/A'
      },
      isActive: dist.isActive,
      observacoes: dist.notes || 'Migrado do sistema antigo',
      createdBy: {
        _id: '68c1afbcf906c14a8e7e8ff7',
        name: 'Admin SellOne',
        email: 'admin@sellone.com'
      },
      createdAt: dist.createdAt,
      updatedAt: dist.updatedAt,
      __v: dist.__v
    }));

    // Combinar e ordenar todos os distribuidores
    const allDistributors = [...distributorsNew, ...convertedOld]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Aplicar paginação
    const total = allDistributors.length;
    const distributors = allDistributors.slice(skip, skip + parseInt(limit));

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
      'createdBy._id': req.user.id
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
    if (!apelido || !razaoSocial || !idDistribuidor || !contato?.nome || !contato?.telefone || !origem || !pedidoMinimo?.valor) {
      return res.status(400).json({ 
        error: 'Apelido, razão social, ID do distribuidor, contato, origem e pedido mínimo são obrigatórios' 
      });
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
      createdBy: {
        _id: req.user.id,
        name: req.user.name,
        email: req.user.email
      }
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
