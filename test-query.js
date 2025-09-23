const mongoose = require('mongoose');
const { Proposal } = require('./models');
require('dotenv').config();

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sellone');

async function testQuery() {
  try {
    console.log('🔍 Testando consulta de propostas...');
    
    const userId = '68c1afbcf906c14a8e7e8ff7';
    
    // Testar consulta atual
    const query1 = { 'createdBy._id': userId };
    const proposals1 = await Proposal.find(query1);
    console.log(`\n📊 Consulta 1 (createdBy._id): ${proposals1.length} propostas`);
    
    // Testar consulta alternativa
    const query2 = { 'createdBy._id': new mongoose.Types.ObjectId(userId) };
    const proposals2 = await Proposal.find(query2);
    console.log(`📊 Consulta 2 (ObjectId): ${proposals2.length} propostas`);
    
    // Testar consulta sem filtro
    const allProposals = await Proposal.find({});
    console.log(`📊 Todas as propostas: ${allProposals.length}`);
    
    if (allProposals.length > 0) {
      console.log('\n🔍 Estrutura do createdBy:');
      console.log(JSON.stringify(allProposals[0].createdBy, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    mongoose.connection.close();
  }
}

testQuery();
