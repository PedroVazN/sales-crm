# 🚀 SellOne CRM - Setup Completo

## ✅ Problema Resolvido!

O projeto foi completamente reorganizado para funcionar com **um único servidor** que serve tanto o frontend quanto o backend.

## 🎯 Como Executar

### Opção 1: Script Automático (Recomendado)
```bash
# Execute o arquivo start.bat
start.bat
```

### Opção 2: Manual
```bash
# 1. Construir o frontend
cd sales-crm
npm run build
cd ..

# 2. Iniciar o servidor unificado
node unified-server.js
```

## 🌐 Acesso

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3000/api

## 🔐 Login

- **Email**: admin@sellone.com
- **Senha**: 123456

## 📁 Estrutura do Projeto

```
Sales/
├── sales-crm/                 # Frontend React
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   │   └── DistributorModal/  # Modal de distribuidores
│   │   ├── pages/            # Páginas da aplicação
│   │   │   └── Distributors/ # Página de distribuidores
│   │   └── services/         # Serviços de API
│   └── build/                # Build do frontend
├── unified-server.js         # Servidor unificado
├── start.bat                 # Script de inicialização
└── README-SETUP.md          # Este arquivo
```

## ✨ Funcionalidades Implementadas

### 🏢 Gestão de Distribuidores
- ✅ **Cadastro de novos distribuidores** com formulário completo
- ✅ **Listagem de distribuidores** com busca em tempo real
- ✅ **Edição de distribuidores** existentes
- ✅ **Exclusão de distribuidores** com confirmação
- ✅ **Filtros e paginação** na listagem

### 📋 Campos do Formulário
- **Informações Básicas**: Apelido, Razão Social, ID Distribuidor, Origem
- **Contato**: Nome, Email, Telefone, Cargo
- **Endereço**: CEP, Logradouro, Número, Bairro, Cidade, UF
- **Frete**: Tipo (CIF/FOB/TERCEIRO), Valor, Prazo, Observações
- **Pedido Mínimo**: Valor e observações
- **Atendimento**: Horário, Dias, Observações
- **Status**: Ativo/Inativo e observações gerais

### 🔧 Recursos Técnicos
- **Validação de formulário** em tempo real
- **Formatação automática** de telefone e CEP
- **Mensagens de erro e sucesso** claras
- **Loading states** durante operações
- **Design responsivo** para desktop e mobile
- **Integração completa** com API

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** com TypeScript
- **Styled Components** para estilização
- **React Router** para navegação
- **Lucide React** para ícones

### Backend
- **Node.js** com Express
- **CORS** para comunicação entre frontend e backend
- **Dados mockados** para demonstração

## 🚨 Solução de Problemas

### Erro de Porta em Uso
```bash
# Parar todos os processos Node.js
taskkill /f /im node.exe

# Reiniciar o servidor
node unified-server.js
```

### Frontend Não Carrega
```bash
# Reconstruir o frontend
cd sales-crm
npm run build
cd ..
```

### API Não Responde
- Verifique se o servidor está rodando na porta 3000
- Acesse http://localhost:3000/api para testar

## 📞 Suporte

Se encontrar algum problema:
1. Verifique se todas as dependências estão instaladas
2. Execute o script `start.bat` para inicialização automática
3. Verifique se a porta 3000 está livre

---

**🎉 Projeto funcionando perfeitamente com servidor unificado!**
