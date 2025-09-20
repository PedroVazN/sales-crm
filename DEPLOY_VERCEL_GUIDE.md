# 🚀 Guia Completo de Deploy na Vercel

## 📋 Configurações Necessárias na Vercel

### 1. **Configuração do Projeto**

#### **Build Settings:**
- **Framework Preset:** `Other`
- **Build Command:** `echo "Build completed"`
- **Output Directory:** `.` (ponto)
- **Install Command:** `npm install`

#### **Root Directory:**
- Deixe vazio (usar raiz do projeto)

### 2. **Environment Variables (Variáveis de Ambiente)**

Configure estas variáveis no dashboard da Vercel:

#### **Obrigatórias:**
```
NODE_ENV = production
```

#### **Opcionais (para conectar com MongoDB):**
```
MONGODB_URI = mongodb+srv://usuario:senha@cluster.mongodb.net/nome-do-banco?retryWrites=true&w=majority
JWT_SECRET = sua_chave_secreta_super_segura_aqui
```

### 3. **Configuração do vercel.json**

O arquivo `vercel.json` já está configurado corretamente:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "api/index.js": {
      "maxDuration": 30
    }
  },
  "regions": ["iad1"]
}
```

## 🔧 **Passo a Passo para Deploy**

### **Método 1: Deploy via Dashboard Vercel**

1. **Acesse [vercel.com](https://vercel.com)**
2. **Faça login** com sua conta
3. **Clique em "New Project"**
4. **Conecte com GitHub:**
   - Selecione o repositório `sales-crm`
   - Clique em "Import"

5. **Configure o projeto:**
   - **Project Name:** `backend-sell` (ou o nome que preferir)
   - **Framework Preset:** `Other`
   - **Root Directory:** `.` (deixe vazio)
   - **Build Command:** `echo "Build completed"`
   - **Output Directory:** `.` (ponto)

6. **Configure Environment Variables:**
   - Clique em "Environment Variables"
   - Adicione:
     - `NODE_ENV` = `production`
     - `MONGODB_URI` = sua string de conexão (opcional)

7. **Deploy:**
   - Clique em "Deploy"
   - Aguarde o processo terminar

### **Método 2: Deploy via Vercel CLI**

```bash
# 1. Instalar Vercel CLI (se não tiver)
npm install -g vercel

# 2. Fazer login
vercel login

# 3. Deploy para produção
vercel --prod

# 4. Configurar variáveis de ambiente
vercel env add NODE_ENV
vercel env add MONGODB_URI

# 5. Fazer novo deploy após configurar variáveis
vercel --prod
```

## 🧪 **Testando o Deploy**

Após o deploy, teste estas URLs:

### **URLs de Teste:**
```
https://seu-projeto.vercel.app/
https://seu-projeto.vercel.app/api/test
https://seu-projeto.vercel.app/api/clients
https://seu-projeto.vercel.app/api/products
https://seu-projeto.vercel.app/api/sales
https://seu-projeto.vercel.app/health
```

### **Exemplo de Teste:**
```bash
# Testar API básica
curl https://seu-projeto.vercel.app/api/test

# Testar clientes
curl https://seu-projeto.vercel.app/api/clients
```

## ⚙️ **Configurações Avançadas**

### **Regions (Opcional):**
- **iad1** - Virginia, EUA (padrão)
- **gru1** - São Paulo, Brasil
- **syd1** - Sydney, Austrália

### **Function Settings:**
- **Max Duration:** 30 segundos (padrão)
- **Memory:** 1024 MB (padrão)

### **Custom Domain (Opcional):**
1. Vá em Settings > Domains
2. Adicione seu domínio personalizado
3. Configure DNS conforme instruções

## 🔍 **Troubleshooting**

### **Problema: Deploy falha**
- Verifique se o `vercel.json` está correto
- Confirme se o arquivo `api/index.js` existe
- Verifique os logs de build

### **Problema: API não responde**
- Verifique se as variáveis de ambiente estão configuradas
- Confirme se o projeto está ativo
- Verifique os logs de função

### **Problema: CORS errors**
- O backend já está configurado para aceitar CORS
- Verifique se o frontend está usando a URL correta

## 📊 **Monitoramento**

### **Logs:**
- Acesse Functions > Logs no dashboard
- Veja logs em tempo real

### **Métricas:**
- Acesse Analytics no dashboard
- Monitore performance e uso

## ✅ **Checklist Final**

- [ ] Projeto criado na Vercel
- [ ] Repositório conectado
- [ ] Build settings configurados
- [ ] Environment variables configuradas
- [ ] Deploy realizado com sucesso
- [ ] URLs de teste funcionando
- [ ] Frontend configurado para usar nova API

## 🎯 **URLs Importantes**

- **Dashboard Vercel:** https://vercel.com/dashboard
- **Documentação Vercel:** https://vercel.com/docs
- **Sua API:** https://seu-projeto.vercel.app
