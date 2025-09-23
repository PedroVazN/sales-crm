# 🔧 Configuração do Frontend para Nova API

## 📡 URLs da API

### **Produção (Vercel):**
```
https://backend-sell.vercel.app/api
```

### **Desenvolvimento (Local):**
```
http://localhost:3000/api
```

## 🔄 Atualizar Frontend

### **1. Atualizar sales-crm/src/services/api.ts**

Substitua a linha da API_BASE_URL:

```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://backend-sell.vercel.app/api' 
  : 'http://localhost:3000/api';
```

### **2. Rotas Disponíveis**

#### **✅ Funcionando:**
- `GET /api/test` - Teste básico
- `GET /api/clients` - Listar clientes
- `GET /api/products` - Listar produtos  
- `GET /api/sales` - Listar vendas
- `GET /api/test-db` - Teste de conexão MongoDB
- `GET /health` - Health check

#### **🔄 Em desenvolvimento:**
- `POST /api/clients` - Criar cliente
- `PUT /api/clients/:id` - Atualizar cliente
- `DELETE /api/clients/:id` - Deletar cliente
- E outras rotas CRUD...

## 🧪 **Testando a Integração**

### **1. Teste Manual:**
```bash
# Testar API básica
curl https://backend-sell.vercel.app/api/test

# Testar clientes
curl https://backend-sell.vercel.app/api/clients

# Testar produtos
curl https://backend-sell.vercel.app/api/products
```

### **2. Teste no Frontend:**
1. Abra o frontend
2. Vá para a página de clientes
3. Verifique se os dados estão carregando
4. Teste outras páginas

## 📊 **Estrutura de Resposta da API**

### **Resposta de Sucesso:**
```json
{
  "success": true,
  "data": [...],
  "message": "Dados carregados com sucesso"
}
```

### **Resposta de Erro:**
```json
{
  "success": false,
  "error": "Mensagem de erro",
  "message": "Descrição do erro"
}
```

## 🔧 **Configurações CORS**

A API já está configurada para aceitar requisições de:
- `http://localhost:3000`
- `http://localhost:3001`
- `https://sales-crm-wine.vercel.app`
- `https://sales-crm-frontend.vercel.app`
- `https://*.vercel.app`

## 🚀 **Próximos Passos**

1. **Deploy da API** ✅
2. **Atualizar frontend** para usar nova API
3. **Testar integração** completa
4. **Adicionar mais rotas** conforme necessário
5. **Conectar com MongoDB** (opcional)

## 📞 **Suporte**

Se houver problemas:
1. Verifique os logs da Vercel
2. Teste as URLs manualmente
3. Verifique as configurações CORS
4. Confirme se as variáveis de ambiente estão corretas
