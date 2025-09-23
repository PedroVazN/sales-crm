const mongoose = require('mongoose');
const { Proposal, Sale, User, Product, Client, Distributor } = require('./models');
require('dotenv').config();

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sellone');

async function seedProposalsAndSales() {
  try {
    console.log('🌱 Iniciando seed de propostas e vendas...');

    // Buscar dados existentes
    const adminUser = await User.findOne({ email: 'admin@sellone.com' });
    const products = await Product.find().limit(3);
    const clients = await Client.find().limit(2);
    const distributors = await Distributor.find().limit(2);

    if (!adminUser) {
      console.log('❌ Usuário admin não encontrado. Execute seed-data.js primeiro.');
      return;
    }

    if (products.length === 0) {
      console.log('❌ Nenhum produto encontrado. Execute seed-data.js primeiro.');
      return;
    }

    if (clients.length === 0) {
      console.log('❌ Nenhum cliente encontrado. Execute seed-data.js primeiro.');
      return;
    }

    if (distributors.length === 0) {
      console.log('❌ Nenhum distribuidor encontrado. Execute seed-data.js primeiro.');
      return;
    }

    // Limpar dados existentes
    await Proposal.deleteMany({});
    await Sale.deleteMany({});
    console.log('🧹 Dados antigos de propostas e vendas removidos');

    // Criar propostas de exemplo
    const proposals = [
      {
        proposalNumber: 'PROP-2024-001',
        client: {
          name: clients[0].contato.nome,
          email: clients[0].contato.email,
          phone: clients[0].contato.telefone,
          company: clients[0].razaoSocial
        },
        seller: {
          _id: adminUser._id.toString(),
          name: adminUser.name,
          email: adminUser.email
        },
        distributor: {
          _id: distributors[0]._id.toString(),
          apelido: distributors[0].apelido,
          razaoSocial: distributors[0].razaoSocial
        },
        items: [
          {
            product: {
              _id: products[0]._id.toString(),
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
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
        createdBy: {
          _id: adminUser._id.toString(),
          name: adminUser.name,
          email: adminUser.email
        }
      },
      {
        proposalNumber: 'PROP-2024-002',
        client: {
          name: clients[1] ? clients[1].contato.nome : clients[0].contato.nome,
          email: clients[1] ? clients[1].contato.email : clients[0].contato.email,
          phone: clients[1] ? clients[1].contato.telefone : clients[0].contato.telefone,
          company: clients[1] ? clients[1].razaoSocial : clients[0].razaoSocial
        },
        seller: {
          _id: adminUser._id.toString(),
          name: adminUser.name,
          email: adminUser.email
        },
        distributor: {
          _id: distributors[1] ? distributors[1]._id.toString() : distributors[0]._id.toString(),
          apelido: distributors[1] ? distributors[1].apelido : distributors[0].apelido,
          razaoSocial: distributors[1] ? distributors[1].razaoSocial : distributors[0].razaoSocial
        },
        items: [
          {
            product: {
              _id: products[1] ? products[1]._id.toString() : products[0]._id.toString(),
              name: products[1] ? products[1].name : products[0].name,
              description: products[1] ? products[1].description : products[0].description,
              category: products[1] ? products[1].category : products[0].category,
              price: products[1] ? products[1].price : products[0].price
            },
            quantity: 1,
            unitPrice: products[1] ? products[1].price : products[0].price,
            discount: 50,
            total: (products[1] ? products[1].price : products[0].price) - 50
          }
        ],
        subtotal: products[1] ? products[1].price : products[0].price,
        discount: 50,
        total: (products[1] ? products[1].price : products[0].price) - 50,
        paymentCondition: 'À vista',
        observations: 'Proposta com desconto especial',
        status: 'accepted',
        validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 dias
        createdBy: {
          _id: adminUser._id.toString(),
          name: adminUser.name,
          email: adminUser.email
        }
      }
    ];

    // Salvar propostas
    for (const proposalData of proposals) {
      const proposal = new Proposal(proposalData);
      await proposal.save();
      console.log(`✅ Proposta ${proposalData.proposalNumber} criada`);
    }

    // Criar vendas de exemplo
    const sales = [
      {
        saleNumber: 'VENDA-2024-001',
        customer: {
          _id: clients[0]._id.toString(),
          name: clients[0].contato.nome,
          email: clients[0].contato.email,
          phone: clients[0].contato.telefone
        },
        seller: {
          _id: adminUser._id.toString(),
          name: adminUser.name,
          email: adminUser.email
        },
        items: [
          {
            product: {
              _id: products[0]._id.toString(),
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
        tax: products[0].price * 0.1, // 10% de imposto
        total: products[0].price * 1.1,
        paymentMethod: 'pix',
        paymentStatus: 'pago',
        status: 'finalizada',
        notes: 'Venda realizada com sucesso',
        createdBy: {
          _id: adminUser._id.toString(),
          name: adminUser.name,
          email: adminUser.email
        }
      },
      {
        saleNumber: 'VENDA-2024-002',
        customer: {
          _id: clients[1] ? clients[1]._id.toString() : clients[0]._id.toString(),
          name: clients[1] ? clients[1].contato.nome : clients[0].contato.nome,
          email: clients[1] ? clients[1].contato.email : clients[0].contato.email,
          phone: clients[1] ? clients[1].contato.telefone : clients[0].contato.telefone
        },
        seller: {
          _id: adminUser._id.toString(),
          name: adminUser.name,
          email: adminUser.email
        },
        items: [
          {
            product: {
              _id: products[1] ? products[1]._id.toString() : products[0]._id.toString(),
              name: products[1] ? products[1].name : products[0].name,
              description: products[1] ? products[1].description : products[0].description,
              category: products[1] ? products[1].category : products[0].category,
              price: products[1] ? products[1].price : products[0].price
            },
            quantity: 2,
            unitPrice: products[1] ? products[1].price : products[0].price,
            discount: 100,
            total: ((products[1] ? products[1].price : products[0].price) * 2) - 100
          }
        ],
        subtotal: (products[1] ? products[1].price : products[0].price) * 2,
        discount: 100,
        tax: (((products[1] ? products[1].price : products[0].price) * 2) - 100) * 0.1,
        total: (((products[1] ? products[1].price : products[0].price) * 2) - 100) * 1.1,
        paymentMethod: 'cartao_credito',
        paymentStatus: 'pago',
        status: 'finalizada',
        notes: 'Venda com desconto especial',
        createdBy: {
          _id: adminUser._id.toString(),
          name: adminUser.name,
          email: adminUser.email
        }
      }
    ];

    // Salvar vendas
    for (const saleData of sales) {
      const sale = new Sale(saleData);
      await sale.save();
      console.log(`✅ Venda ${saleData.saleNumber} criada`);
    }

    console.log('🎉 Seed de propostas e vendas concluído!');
    console.log(`📊 Criadas ${proposals.length} propostas e ${sales.length} vendas`);

  } catch (error) {
    console.error('❌ Erro no seed:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedProposalsAndSales();
