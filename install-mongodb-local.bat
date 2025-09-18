@echo off
echo ========================================
echo    INSTALACAO MONGODB LOCAL
echo ========================================
echo.

echo 📥 Baixando MongoDB Community Server...
echo.

echo 1. Abrindo página de download...
start https://www.mongodb.com/try/download/community

echo.
echo 2. Instruções de instalação:
echo    - Selecione: Windows x64
echo    - Baixe o arquivo .msi
echo    - Execute como administrador
echo    - Durante a instalação:
echo      * Marque "Install MongoDB as a Service"
echo      * Marque "Install MongoDB Compass" (opcional)
echo      * Mantenha a porta padrão: 27017
echo.

echo 3. Após a instalação, execute este script novamente para verificar.
echo.

echo Verificando se MongoDB já está instalado...
where mongod >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ MongoDB já está instalado!
    echo.
    echo Iniciando o servidor MongoDB...
    start "MongoDB" mongod --dbpath ./data/db
    echo.
    echo ✅ MongoDB iniciado com sucesso!
    echo 📍 Dados salvos em: ./data/db
    echo.
    echo Agora você pode executar: node complete-server.js
    echo.
    pause
) else (
    echo ❌ MongoDB não encontrado!
    echo.
    echo Siga as instruções acima para instalar o MongoDB.
    echo.
    pause
)
