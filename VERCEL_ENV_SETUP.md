# Configuração de Variáveis de Ambiente na Vercel

## Variáveis Necessárias

Para que a API funcione corretamente na Vercel, você precisa configurar as seguintes variáveis de ambiente:

### 1. MONGODB_URI
```
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/nome-do-banco?retryWrites=true&w=majority
```

### 2. JWT_SECRET
```
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
```

### 3. NODE_ENV
```
NODE_ENV=production
```

## Como Configurar na Vercel

### Opção 1: Via Dashboard da Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Vá para o projeto `backend-sell`
3. Clique em "Settings"
4. Clique em "Environment Variables"
5. Adicione cada variável:
   - **Name**: `MONGODB_URI`
   - **Value**: Sua string de conexão do MongoDB
   - **Environment**: Production
6. Repita para `JWT_SECRET` e `NODE_ENV`

### Opção 2: Via Vercel CLI
```bash
# Instalar Vercel CLI
npm install -g vercel

# Fazer login
vercel login

# Configurar variáveis
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add NODE_ENV

# Fazer deploy
vercel --prod
```

## Verificação

Após configurar as variáveis, teste a API:

```bash
# Testar conexão com banco
curl https://backend-sell.vercel.app/api/test-db

# Testar rota de clientes
curl https://backend-sell.vercel.app/api/clients
```

## Troubleshooting

Se ainda houver problemas:

1. **Verifique se a MONGODB_URI está correta**
2. **Verifique se o cluster MongoDB permite conexões da Vercel**
3. **Verifique se as variáveis estão configuradas para "Production"**
4. **Faça um novo deploy após configurar as variáveis**
