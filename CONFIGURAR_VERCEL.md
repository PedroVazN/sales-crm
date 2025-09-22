# 🔧 Como Configurar as Variáveis de Ambiente na Vercel

## Problema Identificado
Sua API está funcionando localmente mas não na Vercel porque as variáveis de ambiente não estão configuradas corretamente.

## Solução Passo a Passo

### 1. Acesse o Dashboard da Vercel
1. Vá para [vercel.com](https://vercel.com)
2. Faça login na sua conta
3. Encontre o projeto `backend-sell` ou `sales-crm`

### 2. Configure as Variáveis de Ambiente
1. Clique no projeto
2. Vá para **Settings** (Configurações)
3. Clique em **Environment Variables** (Variáveis de Ambiente)
4. Adicione as seguintes variáveis:

#### Variável 1: MONGODB_URI
- **Name**: `MONGODB_URI`
- **Value**: Sua string de conexão do MongoDB Atlas
- **Environment**: Production (marque esta opção)
- **Exemplo**: `mongodb+srv://usuario:senha@cluster.mongodb.net/nome-do-banco?retryWrites=true&w=majority`

#### Variável 2: JWT_SECRET
- **Name**: `JWT_SECRET`
- **Value**: Uma string secreta para JWT (ex: `meu_jwt_secret_super_seguro_123`)
- **Environment**: Production

#### Variável 3: NODE_ENV
- **Name**: `NODE_ENV`
- **Value**: `production`
- **Environment**: Production

### 3. Faça um Novo Deploy
Após configurar as variáveis:
1. Vá para a aba **Deployments**
2. Clique em **Redeploy** no último deployment
3. Ou faça um novo commit e push para o GitHub

### 4. Teste a Configuração
Execute o script de teste:
```bash
node test-vercel-connection.js
```

## Verificação Manual
Acesse estas URLs para verificar:

1. **API Principal**: https://backend-sell.vercel.app/
2. **Teste de Banco**: https://backend-sell.vercel.app/api/test-db
3. **Clientes**: https://backend-sell.vercel.app/api/clients
4. **Health Check**: https://backend-sell.vercel.app/health

## Possíveis Problemas

### Se MONGODB_URI não estiver configurada:
- A rota `/api/test-db` mostrará `hasMongoUri: false`
- As rotas de dados retornarão erro 503

### Se a string de conexão estiver incorreta:
- A rota `/api/test-db` mostrará `testPassed: false`
- Verifique se a string está correta no MongoDB Atlas

### Se o cluster não permitir conexões externas:
- Configure o IP 0.0.0.0/0 no MongoDB Atlas Network Access
- Ou adicione o IP da Vercel (se disponível)

## Logs da Vercel
Para ver os logs em tempo real:
1. Vá para **Functions** no dashboard da Vercel
2. Clique em **View Function Logs**
3. Monitore as mensagens de conexão com MongoDB

## Contato
Se ainda houver problemas, verifique:
1. Se o MongoDB Atlas está ativo
2. Se a string de conexão está correta
3. Se as variáveis estão configuradas para "Production"
4. Se fez um novo deploy após configurar as variáveis
