# GeoMaps Admin Portal

Portal administrativo para gerenciamento de usuários e ocorrências do sistema GeoMaps.

## Sobre o Projeto

O GeoMaps Admin Portal é uma aplicação web moderna desenvolvida para administradores gerenciarem usuários e ocorrências geográficas. A interface conta com design limpo e intuitivo, proporcionando uma experiência de usuário fluida e profissional.

## Tecnologias

- **React 19** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset JavaScript com tipagem estática
- **Vite** - Build tool e dev server

## Funcionalidades

- Autenticação de administradores com JWT
- Gerenciamento de usuários
- Gerenciamento de ocorrências
- Interface moderna com gradientes e animações
- Design responsivo
- Sidebar com navegação intuitiva
- Sistema de logout seguro

## Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- API Backend em execução (padrão: http://127.0.0.1:8000)

## Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd geomaps_admin_portal
```

2. Instale as dependências:
```bash
cd app
npm install
```

3. Configure as variáveis de ambiente (se necessário):
```bash
cp .env.example .env
```

## Executando o Projeto

### Modo de Desenvolvimento
```bash
npm run dev
```
A aplicação estará disponível em `http://localhost:5173`

## Estrutura do Projeto

```
app/
├── src/
│   ├── components/        # Componentes reutilizáveis (Sidebar, etc)
│   ├── pages/            # Páginas da aplicação
│   │   ├── login/        # Página de login
│   │   ├── user/         # Gerenciamento de usuários
│   │   └── ocorrencia/   # Gerenciamento de ocorrências
│   ├── services/         # Serviços (API, autenticação)
│   └── routes/           # Configuração de rotas
├── public/               # Arquivos estáticos
└── package.json          # Dependências e scripts
```

## API

O projeto se conecta a uma API backend que deve estar rodando em:
- **Base URL**: `http://127.0.0.1:8000`

### Endpoints Principais
- `POST /admin/login` - Autenticação de administrador
- `GET /users` - Lista de usuários
- `GET /ocorrencias` - Lista de ocorrências

## Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação. O token é armazenado no `sessionStorage` após login bem-sucedido e incluído automaticamente em todas as requisições através de interceptors do Axios.

## Design

O portal conta com um design moderno utilizando:
- Fonte Poppins
- Gradientes (azul escuro #191a2e para roxo #33389b)
- Animações suaves
- Interface responsiva
- Tema escuro com elementos semi-transparentes
