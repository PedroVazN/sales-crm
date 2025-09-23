# Instruções de Deploy na Vercel

## Backend (API)

### 1. Configuração do Projeto
- O backend já está configurado com `vercel.json`
- O arquivo principal é `complete-server.js`
- As rotas estão organizadas na pasta `routes/`

### 2. Deploy do Backend
1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em "New Project"
4. Selecione o repositório do seu projeto
5. Configure as seguintes opções:
   - **Framework Preset**: Other
   - **Root Directory**: `/` (raiz do projeto)
   - **Build Command**: `npm run build`
   - **Output Directory**: `./` (deixar vazio)

### 3. Variáveis de Ambiente do Backend
Configure as seguintes variáveis na Vercel:
- `MONGODB_URI`: Sua string de conexão do MongoDB Atlas
- `JWT_SECRET`: Uma chave secreta para JWT (ex: `sua_chave_super_secreta_123`)
- `NODE_ENV`: `production`

## Frontend (React)

### 1. Configuração do Projeto
- O frontend está na pasta `sales-crm/`
- Já configurado com `vercel.json`
- Porta configurada para 3001

### 2. Deploy do Frontend
1. Acesse [vercel.com](https://vercel.com)
2. Clique em "New Project"
3. Selecione o mesmo repositório
4. Configure as seguintes opções:
   - **Framework Preset**: Create React App
   - **Root Directory**: `/sales-crm`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### 3. Variáveis de Ambiente do Frontend
- `REACT_APP_API_URL`: URL do seu backend na Vercel (ex: `https://seu-backend.vercel.app`)

## Passos Finais

### 1. Atualizar URL da API
Após fazer o deploy do backend, atualize o arquivo `sales-crm/src/services/api.ts`:
```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://SEU-BACKEND-URL.vercel.app/api' 
  : 'http://localhost:3000/api';
```

### 2. Configurar CORS no Backend
O backend já está configurado para aceitar requisições do frontend, mas você pode ajustar as origens no arquivo `complete-server.js` se necessário.

### 3. Testar a Aplicação
1. Acesse o frontend na Vercel
2. Teste o login e funcionalidades
3. Verifique se as requisições estão funcionando

## Estrutura dos Projetos na Vercel

### Backend
- **URL**: `https://seu-backend.vercel.app`
- **API Endpoints**: `https://seu-backend.vercel.app/api/...`

### Frontend  
- **URL**: `https://seu-frontend.vercel.app`
- **Build**: Automático a cada push no GitHub

## Troubleshooting

### Problemas Comuns
1. **CORS Error**: Verifique se as origens estão configuradas corretamente no backend
2. **API não encontrada**: Verifique se a URL da API está correta no frontend
3. **MongoDB Connection**: Verifique se a string de conexão está correta
4. **Build Error**: Verifique se todas as dependências estão no package.json

### Logs
- Acesse o dashboard da Vercel para ver logs de build e runtime
- Use `vercel logs` no terminal para logs em tempo real
