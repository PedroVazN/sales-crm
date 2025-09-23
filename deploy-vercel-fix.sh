#!/bin/bash

echo "🚀 Deploy da correção do MongoDB para Vercel"
echo "=============================================="

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Execute este script na raiz do projeto"
    exit 1
fi

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Testar localmente primeiro
echo "🧪 Testando localmente..."
node test-vercel-connection.js

# Fazer commit das mudanças
echo "📝 Fazendo commit das mudanças..."
git add .
git commit -m "fix: Corrigir conexão MongoDB na Vercel

- Melhorar configuração de conexão para serverless
- Adicionar rota de diagnóstico detalhada
- Implementar conexão real com MongoDB nas rotas
- Adicionar script de teste de conexão"

# Fazer push para GitHub
echo "⬆️ Fazendo push para GitHub..."
git push origin main

echo "✅ Deploy iniciado!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure as variáveis de ambiente na Vercel:"
echo "   - MONGODB_URI"
echo "   - JWT_SECRET" 
echo "   - NODE_ENV=production"
echo ""
echo "2. Aguarde o deploy completar (2-3 minutos)"
echo ""
echo "3. Teste a API:"
echo "   - https://backend-sell.vercel.app/api/test-db"
echo "   - https://backend-sell.vercel.app/api/clients"
echo ""
echo "4. Execute o teste: node test-vercel-connection.js"
echo ""
echo "📖 Veja o guia completo em: CONFIGURAR_VERCEL.md"
