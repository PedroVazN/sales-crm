#!/bin/bash

echo "🚀 Deploy SellOne API v2.0 para Vercel"
echo "======================================"

# Verificar se Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "📦 Instalando Vercel CLI..."
    npm install -g vercel
fi

# Verificar se está logado
echo "🔐 Verificando autenticação..."
vercel whoami

if [ $? -ne 0 ]; then
    echo "❌ Não está logado na Vercel. Faça login primeiro:"
    echo "   vercel login"
    exit 1
fi

# Fazer deploy
echo "📤 Fazendo deploy para produção..."
vercel --prod --yes

# Verificar se o deploy foi bem-sucedido
if [ $? -eq 0 ]; then
    echo "✅ Deploy realizado com sucesso!"
    echo ""
    echo "🧪 Testando API..."
    
    # Aguardar um pouco para a API ficar disponível
    sleep 10
    
    # Testar API
    echo "Testando: GET /api/test"
    curl -s https://backend-sell.vercel.app/api/test | jq .
    
    echo ""
    echo "Testando: GET /api/clients"
    curl -s https://backend-sell.vercel.app/api/clients | jq .
    
    echo ""
    echo "🎉 Deploy concluído!"
    echo "🌐 API disponível em: https://backend-sell.vercel.app"
    echo "📊 Dashboard: https://vercel.com/dashboard"
else
    echo "❌ Erro no deploy. Verifique os logs acima."
    exit 1
fi