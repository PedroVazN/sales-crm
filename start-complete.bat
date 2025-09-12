@echo off
echo ========================================
echo    SELLONE CRM - SERVIDOR COMPLETO
echo ========================================
echo.
echo Iniciando servidor com todas as funcionalidades...
echo.

REM Verificar se o Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao encontrado!
    echo Por favor, instale o Node.js primeiro.
    pause
    exit /b 1
)

REM Parar processos Node.js existentes
echo Parando servidores existentes...
taskkill /f /im node.exe >nul 2>&1

REM Verificar se o build do frontend existe
if not exist "sales-crm\build" (
    echo Construindo frontend...
    cd sales-crm
    call npm run build
    cd ..
)

REM Iniciar o servidor completo
echo.
echo ========================================
echo    SERVIDOR INICIADO COM SUCESSO!
echo ========================================
echo.
echo Frontend: http://localhost:3002
echo API: http://localhost:3002/api
echo.
echo Login: admin@sellone.com / 123456
echo.
echo Funcionalidades disponíveis:
echo - Dashboard com estatísticas
echo - Gestão de Distribuidores
echo - Gestão de Clientes
echo - Gestão de Produtos
echo - Gestão de Vendas
echo - Propostas e Lista de Preços
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

node complete-server.js
