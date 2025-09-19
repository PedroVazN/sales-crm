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
    // Adicionar alguns usuários de exemplo
    this.users = [
      {
        _id: '68c1afbcf906c14a8e7e8ff7',
        name: 'Admin SellOne',
        email: 'admin@sellone.com',
        role: 'admin',
        phone: '(11) 99999-9999',
        address: {
          street: 'Av. Paulista',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01310-100',
          country: 'Brasil'
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: '2',
        name: 'Vendedor Teste',
        email: 'vendedor@teste.com',
        role: 'vendedor',
        phone: '(11) 88888-8888',
        address: {
          street: 'Rua das Flores',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567',
          country: 'Brasil'
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

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

  // Métodos para usuários
  createUser(data) {
    const newUser = {
      _id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }

  getUsers(query = {}) {
    let filtered = [...this.users];
    
    if (query.search) {
      const search = query.search.toLowerCase();
      filtered = filtered.filter(u => 
        u.name?.toLowerCase().includes(search) ||
        u.email?.toLowerCase().includes(search)
      );
    }
    
    if (query.role) {
      filtered = filtered.filter(u => u.role === query.role);
    }
    
    return filtered;
  }

  getUserById(id) {
    return this.users.find(u => u._id === id);
  }

  updateUser(id, data) {
    const index = this.users.findIndex(u => u._id === id);
    if (index !== -1) {
      this.users[index] = {
        ...this.users[index],
        ...data,
        updatedAt: new Date()
      };
      return this.users[index];
    }
    return null;
  }

  deleteUser(id) {
    const index = this.users.findIndex(u => u._id === id);
    if (index !== -1) {
      return this.users.splice(index, 1)[0];
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

  // Métodos para produtos
  createProduct(data) {
    const newProduct = {
      _id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.products.push(newProduct);
    return newProduct;
  }

  getProducts(query = {}) {
    let filtered = [...this.products];
    
    if (query.search) {
      const search = query.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(search) ||
        p.description?.toLowerCase().includes(search) ||
        p.category?.toLowerCase().includes(search) ||
        p.brand?.toLowerCase().includes(search)
      );
    }
    
    if (query.category) {
      filtered = filtered.filter(p => p.category === query.category);
    }
    
    if (query.brand) {
      filtered = filtered.filter(p => p.brand === query.brand);
    }
    
    if (query.isActive !== undefined) {
      filtered = filtered.filter(p => p.isActive === (query.isActive === 'true'));
    }
    
    return filtered;
  }

  getProductById(id) {
    return this.products.find(p => p._id === id);
  }

  updateProduct(id, data) {
    const index = this.products.findIndex(p => p._id === id);
    if (index !== -1) {
      this.products[index] = {
        ...this.products[index],
        ...data,
        updatedAt: new Date()
      };
      return this.products[index];
    }
    return null;
  }

  deleteProduct(id) {
    const index = this.products.findIndex(p => p._id === id);
    if (index !== -1) {
      return this.products.splice(index, 1)[0];
    }
    return null;
  }

  // Métodos para vendas
  createSale(data) {
    const newSale = {
      _id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.sales.push(newSale);
    return newSale;
  }

  getSales(query = {}) {
    let filtered = [...this.sales];
    
    if (query.search) {
      const search = query.search.toLowerCase();
      filtered = filtered.filter(s => 
        s.saleNumber?.toLowerCase().includes(search) ||
        s.customer?.name?.toLowerCase().includes(search) ||
        s.customer?.email?.toLowerCase().includes(search)
      );
    }
    
    if (query.status) {
      filtered = filtered.filter(s => s.status === query.status);
    }
    
    if (query.paymentStatus) {
      filtered = filtered.filter(s => s.paymentStatus === query.paymentStatus);
    }
    
    return filtered;
  }

  getSaleById(id) {
    return this.sales.find(s => s._id === id);
  }

  updateSale(id, data) {
    const index = this.sales.findIndex(s => s._id === id);
    if (index !== -1) {
      this.sales[index] = {
        ...this.sales[index],
        ...data,
        updatedAt: new Date()
      };
      return this.sales[index];
    }
    return null;
  }

  deleteSale(id) {
    const index = this.sales.findIndex(s => s._id === id);
    if (index !== -1) {
      return this.sales.splice(index, 1)[0];
    }
    return null;
  }

  // Métodos para notificações
  createNotification(data) {
    const newNotification = {
      _id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.notifications.push(newNotification);
    return newNotification;
  }

  getNotifications(query = {}) {
    let filtered = [...this.notifications];
    
    if (query.recipient) {
      filtered = filtered.filter(n => n.recipient === query.recipient);
    }
    
    if (query.isRead !== undefined) {
      filtered = filtered.filter(n => n.isRead === (query.isRead === 'true'));
    }
    
    if (query.type) {
      filtered = filtered.filter(n => n.type === query.type);
    }
    
    return filtered;
  }

  getNotificationById(id) {
    return this.notifications.find(n => n._id === id);
  }

  updateNotification(id, data) {
    const index = this.notifications.findIndex(n => n._id === id);
    if (index !== -1) {
      this.notifications[index] = {
        ...this.notifications[index],
        ...data,
        updatedAt: new Date()
      };
      return this.notifications[index];
    }
    return null;
  }

  deleteNotification(id) {
    const index = this.notifications.findIndex(n => n._id === id);
    if (index !== -1) {
      return this.notifications.splice(index, 1)[0];
    }
    return null;
  }

  getUnreadNotificationCount(recipient) {
    return this.notifications.filter(n => n.recipient === recipient && !n.isRead).length;
  }
}

// Instância global
const memoryStore = new MemoryStore();

module.exports = memoryStore;
