# 🌐 GSaude Frontend - React

Interface web moderna para o sistema de agendamento médico GSaude, desenvolvida em React com Vite.

## 📋 Índice

- [🛠️ Tecnologias](#️-tecnologias)
- [📋 Pré-requisitos](#-pré-requisitos)
- [🚀 Instalação](#-instalação)
- [⚙️ Configuração](#️-configuração)
- [🏃 Executar](#-executar)
- [🏗️ Build](#️-build)
- [📱 Deploy](#-deploy)
- [🧪 Testes](#-testes)
- [🐛 Troubleshooting](#-troubleshooting)

## 🛠️ Tecnologias

- **React 19** - Biblioteca JavaScript para interfaces
- **Vite 6** - Build tool e dev server
- **Material-UI (MUI)** - Biblioteca de componentes
- **Axios** - Cliente HTTP para API
- **React Router Dom** - Roteamento SPA
- **Day.js** - Manipulação de datas
- **ESLint** - Linting de código

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta GitHub (para deploy no GitHub Pages)

## 🚀 Instalação

### 1. Clonar o repositório
```bash
git clone https://github.com/thaysonorlandi/gsaude-frontV3.git
cd gsaude-frontV3
```

### 2. Instalar dependências
```bash
npm install
# ou
yarn install
```

## ⚙️ Configuração

### Variáveis de Ambiente

#### Desenvolvimento (.env)
```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_DEV_SERVER_HOST=0.0.0.0
VITE_DEV_SERVER_PORT=5174
```

#### Produção (.env.production)
```env
VITE_API_URL=https://api.seu-dominio.com/api/v1
VITE_BUILD_TARGET=es2015
```

### Configuração da API

O arquivo `src/services/api.js` centraliza a configuração do Axios:

```javascript
// Configuração automática baseada no ambiente
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});
```

## 🏃 Executar

### Desenvolvimento
```bash
npm run dev
# Aplicação disponível em: http://localhost:5174
```

### Preview (Build local)
```bash
npm run build
npm run preview
```

## 🏗️ Build

### Build para Produção
```bash
npm run build
# Arquivos gerados na pasta: dist/
```

### Verificar Build
```bash
npm run preview
# Serve os arquivos da pasta dist/
```

## 📱 Deploy

### GitHub Pages (Automático)

1. **Configure as variáveis no repositório:**
   - Vá em Settings > Secrets and variables > Actions
   - Adicione: `VITE_API_URL` com a URL da sua API

2. **Push para main disparará deploy automático**

### GitHub Pages (Manual)
```bash
# Configurar URL da API
echo "VITE_API_URL=https://api.seu-dominio.com/api/v1" > .env.production

# Build e deploy
npm run build
npm run deploy
```

### Outros Provedores
```bash
# Build
npm run build

# Subir pasta dist/ para:
# - Netlify
# - Vercel  
# - AWS S3
# - Firebase Hosting
```

## 🧪 Testes

```bash
# Executar testes
npm run test

# Testes em modo watch
npm run test:watch

# Coverage
npm run test:coverage
```

## 📁 Estrutura do Projeto

```
src/
├── components/         # Componentes reutilizáveis
├── pages/             # Páginas da aplicação
├── services/          # Serviços de API
├── hooks/             # Custom hooks
├── utils/             # Utilitários e formatadores
├── styles/            # Estilos globais
└── main.jsx           # Ponto de entrada
```

### Componentes Principais

- **`pages/login/`** - Tela de login
- **`pages/agendamento/`** - Sistema de agendamento
- **`pages/dashboard/`** - Dashboard principal
- **`components/layout/`** - Layout da aplicação
- **`components/forms/`** - Formulários

### Serviços

- **`api.js`** - Configuração base do Axios
- **`authService.js`** - Autenticação
- **`agendamentoService.js`** - Agendamentos
- **`userService.js`** - Usuários
- **`financeiroService.js`** - Dados financeiros

## 🎨 Customização

### Tema Material-UI
```javascript
// src/theme.js
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});
```

### Cores e Estilos
```css
/* src/index.css */
:root {
  --primary-color: #1976d2;
  --secondary-color: #dc004e;
  --background-color: #f5f5f5;
}
```

## 🐛 Troubleshooting

### Problemas Comuns

#### 1. Erro de CORS
```javascript
// Verificar configuração da API
console.log('API URL:', import.meta.env.VITE_API_URL);
```

#### 2. Erro de Build
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 3. Erro de Deploy no GitHub Pages
```bash
# Verificar se a branch gh-pages existe
git branch -a

# Forçar novo deploy
npm run deploy
```

#### 4. Variáveis de Ambiente não carregam
```bash
# Verificar se o arquivo .env existe
ls -la .env*

# Verificar se as variáveis começam com VITE_
echo $VITE_API_URL
```

### Comandos de Debug

```bash
# Verificar variáveis de ambiente
npm run dev -- --debug

# Build com informações detalhadas
npm run build -- --debug

# Analisar bundle
npm run build -- --analyze
```

## 📊 Performance

### Otimizações Aplicadas

- **Code Splitting** - Divisão automática do código
- **Tree Shaking** - Remoção de código não utilizado
- **Minificação** - Compressão dos arquivos
- **Lazy Loading** - Carregamento sob demanda

### Métricas

```bash
# Analisar tamanho do bundle
npm run build
# Verificar pasta dist/ e console output
```

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Verificar código
npm run test         # Executar testes
npm run deploy       # Deploy GitHub Pages
```

## 🌍 URLs

### Desenvolvimento
- **App**: http://localhost:5174
- **API**: http://localhost:8000/api/v1

### Produção
- **App**: https://thaysonorlandi.github.io/gsaude-frontV3/
- **API**: Configure sua URL

## 📞 Suporte

- **Documentação React**: https://react.dev
- **Documentação Vite**: https://vitejs.dev
- **Documentação MUI**: https://mui.com
- **Issues**: Abra uma issue no GitHub
- **Desenvolvedor**: Thayson Orlandi

---

**🚀 Interface moderna e responsiva!**
**⚡ Build otimizado com Vite**
**📱 Deploy automático no GitHub Pages**

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
