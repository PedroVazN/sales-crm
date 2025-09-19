const mongoose = require('mongoose');
const { Proposal } = require('./models');
require('dotenv').config();

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sellone');

async function checkProposals() {
  try {
    console.log('🔍 Verificando propostas no banco...');
    
    const proposals = await Proposal.find({}).limit(5);
    
    console.log(`📊 Encontradas ${proposals.length} propostas:`);
    
    proposals.forEach((proposal, index) => {
      console.log(`\n--- Proposta ${index + 1} ---`);
      console.log(`ID: ${proposal._id}`);
      console.log(`Número: ${proposal.proposalNumber}`);
      console.log(`Status: ${proposal.status}`);
      console.log(`CreatedBy:`, proposal.createdBy);
    });
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkProposals();
