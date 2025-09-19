#!/bin/bash

echo "🚀 Iniciando processo de deploy para Vercel..."

# Verificar se o Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI não encontrado. Instalando..."
    npm install -g vercel
fi

echo "📦 Fazendo deploy do Backend..."
cd .
vercel --prod

echo "📦 Fazendo deploy do Frontend..."
cd sales-crm
vercel --prod

echo "✅ Deploy concluído!"
echo "🔗 Acesse o dashboard da Vercel para obter as URLs dos projetos"
