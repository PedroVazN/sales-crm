@echo off
echo ========================================
echo    SELLONE CRM - SERVIDOR UNIFICADO
echo ========================================
echo.
echo Iniciando servidor...
echo.

REM Verificar se o Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao encontrado!
    echo Por favor, instale o Node.js primeiro.
    pause
    exit /b 1
)

REM Verificar se o build do frontend existe
if not exist "sales-crm\build" (
    echo Construindo frontend...
    cd sales-crm
    call npm run build
    cd ..
)

REM Iniciar o servidor unificado
echo Servidor iniciado com sucesso!
echo.
echo Frontend: http://localhost:3000
echo API: http://localhost:3000/api
echo.
echo Login: admin@sellone.com / 123456
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

node unified-server.js
