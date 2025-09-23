# 🚀 SellOne API v2.0 - Setup Instructions

## 📋 Variáveis de Ambiente Necessárias

Configure estas variáveis na Vercel:

### 1. MONGODB_URI
```
mongodb+srv://usuario:senha@cluster.mongodb.net/nome-do-banco?retryWrites=true&w=majority
```

### 2. NODE_ENV
```
production
```

### 3. JWT_SECRET (opcional)
```
sua_chave_secreta_super_segura_aqui
```

## 🔧 Como Configurar na Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Vá para o projeto
3. Clique em "Settings" > "Environment Variables"
4. Adicione cada variável acima
5. Faça um novo deploy

## 🧪 Testando a API

### Rotas Disponíveis:

- `GET /` - Informações da API
- `GET /api/test` - Teste básico
- `GET /api/test-db` - Teste de conexão com MongoDB
- `GET /api/reconnect` - Reconectar ao MongoDB
- `GET /api/clients` - Listar clientes
- `GET /api/products` - Listar produtos
- `GET /api/sales` - Listar vendas
- `GET /health` - Health check

### Exemplo de Teste:

```bash
# Testar API
curl https://seu-projeto.vercel.app/api/test

# Testar banco de dados
curl https://seu-projeto.vercel.app/api/test-db

# Listar clientes
curl https://seu-projeto.vercel.app/api/clients
```

## ✅ Vantagens do Novo Backend

- ✅ **Otimizado para serverless**
- ✅ **Conexão MongoDB eficiente**
- ✅ **Rotas simples e funcionais**
- ✅ **Fácil de manter e expandir**
- ✅ **Configuração mínima necessária**

## 🔄 Próximos Passos

1. Configure as variáveis de ambiente na Vercel
2. Faça o deploy
3. Teste as rotas
4. Integre com o frontend
5. Adicione mais funcionalidades conforme necessário
