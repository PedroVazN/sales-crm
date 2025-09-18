@echo off
echo ========================================
echo    INSTALACAO AUTOMATICA MONGODB
echo ========================================
echo.

echo 📥 Baixando e instalando MongoDB Community Server...
echo.

REM Verificar se já está instalado
where mongod >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ MongoDB já está instalado!
    goto :start_mongodb
)

echo 🔍 Verificando se Chocolatey está instalado...
where choco >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 📦 Instalando Chocolatey...
    powershell -Command "Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))"
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Erro ao instalar Chocolatey. Instalando manualmente...
        goto :manual_install
    )
)

echo 📦 Instalando MongoDB via Chocolatey...
choco install mongodb -y
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erro ao instalar via Chocolatey. Tentando instalação manual...
    goto :manual_install
)

:start_mongodb
echo.
echo 🚀 Iniciando MongoDB...
if not exist "data\db" mkdir data\db
start "MongoDB" mongod --dbpath ./data/db
echo.
echo ✅ MongoDB iniciado com sucesso!
echo 📍 Dados salvos em: ./data/db
echo.
echo 🎉 Agora você pode executar: node server-with-fallback.js
echo.
pause
exit

:manual_install
echo.
echo 📋 Instalação manual necessária:
echo.
echo 1. Acesse: https://www.mongodb.com/try/download/community
echo 2. Selecione: Windows x64
echo 3. Baixe o arquivo .msi
echo 4. Execute como administrador
echo 5. Durante a instalação:
echo    - Marque "Install MongoDB as a Service"
echo    - Marque "Install MongoDB Compass" (opcional)
echo    - Mantenha a porta padrão: 27017
echo.
echo 6. Após a instalação, execute este script novamente
echo.
pause
exit
