#!/bin/bash

echo "🚀 Fazendo deploy para a Vercel..."

# Verificar se o Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI não encontrado. Instalando..."
    npm install -g vercel
fi

# Fazer login na Vercel (se necessário)
echo "🔐 Verificando autenticação..."
vercel whoami

# Fazer deploy
echo "📦 Fazendo deploy..."
vercel --prod

echo "✅ Deploy concluído!"
echo "🌐 API disponível em: https://backend-sell.vercel.app"
