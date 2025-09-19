// Armazenamento em memória para dados reais (temporário)
// Este é um substituto temporário até a conexão com MongoDB ser resolvida

class MemoryStore {
  constructor() {
    this.distributors = [];
    this.clients = [];
    this.products = [];
    this.sales = [];
    this.proposals = [];
    this.events = [];
    this.goals = [];
    this.notifications = [];
    this.users = [];
    this.priceLists = [];
    
    // Inicializar com alguns dados de exemplo
    this.initializeData();
  }

  initializeData() {
    // Adicionar alguns distribuidores de exemplo
    this.distributors = [
      {
        _id: '1',
        apelido: 'Distribuidor Principal',
        razaoSocial: 'Distribuidor Principal LTDA',
        idDistribuidor: 'DIST001',
        contato: {
          nome: 'João Silva',
          telefone: '(11) 99999-9999',
          cargo: 'Gerente'
        },
        origem: 'São Paulo/SP',
        atendimento: {
          horario: '08:00 às 18:00',
          dias: 'Segunda a Sexta',
          observacoes: 'Horário comercial'
        },
        frete: {
          tipo: 'CIF',
          valor: 100,
          prazo: 5,
          observacoes: 'Frete incluso'
        },
        pedidoMinimo: {
          valor: 500,
          observacoes: 'Pedido mínimo de R$ 500'
        },
        endereco: {
          cep: '01310-100',
          logradouro: 'Av. Paulista',
          numero: '1000',
          complemento: 'Sala 100',
          bairro: 'Bela Vista',
          cidade: 'São Paulo',
          uf: 'SP'
        },
        isActive: true,
        observacoes: 'Distribuidor principal da região',
        createdBy: {
          _id: '68c1afbcf906c14a8e7e8ff7',
          name: 'Admin SellOne',
          email: 'admin@sellone.com'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  // Métodos para distribuidores
  createDistributor(data) {
    const newDistributor = {
      _id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.distributors.push(newDistributor);
    return newDistributor;
  }

  getDistributors(query = {}) {
    let filtered = [...this.distributors];
    
    if (query.search) {
      const search = query.search.toLowerCase();
      filtered = filtered.filter(d => 
        d.apelido?.toLowerCase().includes(search) ||
        d.razaoSocial?.toLowerCase().includes(search) ||
        d.idDistribuidor?.toLowerCase().includes(search) ||
        d.contato?.nome?.toLowerCase().includes(search) ||
        d.contato?.telefone?.toLowerCase().includes(search)
      );
    }
    
    if (query.origem) {
      filtered = filtered.filter(d => d.origem === query.origem);
    }
    
    if (query.isActive !== undefined) {
      filtered = filtered.filter(d => d.isActive === (query.isActive === 'true'));
    }
    
    return filtered;
  }

  getDistributorById(id) {
    return this.distributors.find(d => d._id === id);
  }

  updateDistributor(id, data) {
    const index = this.distributors.findIndex(d => d._id === id);
    if (index !== -1) {
      this.distributors[index] = {
        ...this.distributors[index],
        ...data,
        updatedAt: new Date()
      };
      return this.distributors[index];
    }
    return null;
  }

  deleteDistributor(id) {
    const index = this.distributors.findIndex(d => d._id === id);
    if (index !== -1) {
      return this.distributors.splice(index, 1)[0];
    }
    return null;
  }

  // Métodos para clientes
  createClient(data) {
    const newClient = {
      _id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.clients.push(newClient);
    return newClient;
  }

  getClients(query = {}) {
    let filtered = [...this.clients];
    
    if (query.search) {
      const search = query.search.toLowerCase();
      filtered = filtered.filter(c => 
        c.razaoSocial?.toLowerCase().includes(search) ||
        c.nomeFantasia?.toLowerCase().includes(search) ||
        c.cnpj?.toLowerCase().includes(search) ||
        c.contato?.nome?.toLowerCase().includes(search) ||
        c.contato?.email?.toLowerCase().includes(search)
      );
    }
    
    if (query.uf) {
      filtered = filtered.filter(c => c.endereco?.uf === query.uf);
    }
    
    if (query.classificacao) {
      filtered = filtered.filter(c => c.classificacao === query.classificacao);
    }
    
    if (query.isActive !== undefined) {
      filtered = filtered.filter(c => c.isActive === (query.isActive === 'true'));
    }
    
    return filtered;
  }

  getClientById(id) {
    return this.clients.find(c => c._id === id);
  }

  updateClient(id, data) {
    const index = this.clients.findIndex(c => c._id === id);
    if (index !== -1) {
      this.clients[index] = {
        ...this.clients[index],
        ...data,
        updatedAt: new Date()
      };
      return this.clients[index];
    }
    return null;
  }

  deleteClient(id) {
    const index = this.clients.findIndex(c => c._id === id);
    if (index !== -1) {
      return this.clients.splice(index, 1)[0];
    }
    return null;
  }
}

// Instância global
const memoryStore = new MemoryStore();

module.exports = memoryStore;
