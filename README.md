# SellOne - Sistema de Vendas

Sistema completo de vendas desenvolvido com Node.js, Express e MongoDB.

## 🚀 Funcionalidades

- **Gestão de Usuários**: Cadastro, login e controle de acesso por roles
- **Gestão de Produtos**: CRUD completo com controle de estoque
- **Gestão de Vendas**: Criação, listagem e controle de vendas
- **Autenticação**: Sistema seguro com JWT
- **API RESTful**: Endpoints organizados e documentados

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- MongoDB (local ou MongoDB Atlas)
- npm ou yarn

## 🛠️ Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd sellone
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
Crie um arquivo `.env` na raiz do projeto:
```env
MONGODB_URI=mongodb://localhost:27017/sellone
PORT=3000
NODE_ENV=development
JWT_SECRET=sua_chave_secreta_aqui_123456789
```

4. **Inicie o servidor**
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📚 API Endpoints

### Usuários
- `POST /api/users/register` - Registrar novo usuário
- `POST /api/users/login` - Login do usuário
- `GET /api/users` - Listar usuários (Admin)
- `GET /api/users/:id` - Buscar usuário por ID
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Desativar usuário (Admin)

### Produtos
- `POST /api/products` - Criar produto (Admin/Vendedor)
- `GET /api/products` - Listar produtos
- `GET /api/products/:id` - Buscar produto por ID
- `PUT /api/products/:id` - Atualizar produto (Admin/Vendedor)
- `DELETE /api/products/:id` - Desativar produto (Admin)
- `PUT /api/products/:id/stock` - Atualizar estoque (Admin/Vendedor)
- `GET /api/products/categories/list` - Listar categorias

### Vendas
- `POST /api/sales` - Criar venda (Admin/Vendedor)
- `GET /api/sales` - Listar vendas
- `GET /api/sales/:id` - Buscar venda por ID
- `PUT /api/sales/:id/status` - Atualizar status da venda (Admin/Vendedor)
- `GET /api/sales/stats/summary` - Estatísticas de vendas (Admin/Vendedor)

## 🔐 Autenticação

O sistema usa JWT para autenticação. Inclua o token no header:
```
Authorization: Bearer <seu_token>
```

## 👥 Roles de Usuário

- **admin**: Acesso total ao sistema
- **vendedor**: Pode gerenciar produtos e vendas
- **cliente**: Pode visualizar produtos e suas próprias vendas

## 🗄️ Estrutura do Banco de Dados

### Collections:
- **users**: Dados dos usuários
- **products**: Catálogo de produtos
- **sales**: Registro de vendas

## 🧪 Testando a API

Você pode usar ferramentas como Postman, Insomnia ou curl para testar os endpoints.

### Exemplo de registro de usuário:
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "123456",
    "role": "admin"
  }'
```

## 📊 Próximos Passos

- [ ] Interface web (Frontend)
- [ ] Relatórios avançados
- [ ] Integração com gateway de pagamento
- [ ] Sistema de notificações
- [ ] Backup automático
- [ ] Testes automatizados

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.
