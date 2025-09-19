# Teste GAC

## 🚀 Como Executar o Projeto

### 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Docker e Docker Compose (para executar os serviços de banco de dados)

### 🔧 Instalação

1. Clone o repositório.
2. Instale as dependências:`npm install`.
3. Crie um arquivo `.env` baseado no `.env.example` na raiz do projeto.
4. Execute os containers:`docker-compose up -d`
5. Faça o build do projeto:`npm run build`
6. Inicie o servidor:`npm run start:prod`

Anternativamente ao invés de realizar a build e executar o servidor pode se executar ele em modo de desenvolvimento `npm run start:dev`

### 🏗️ Scripts Disponíveis

No diretório do projeto, você pode executar:

#### 🛠️ Desenvolvimento

`npm run start:dev` - Inicia o servidor em modo de desenvolvimento com hot-reload

`npm run start:debug` - Inicia o servidor em modo de depuração

#### 🏭 Produção

`npm run build` - Compila o código TypeScript para JavaScript

`npm run start:prod` - Inicia o servidor em produção (após o build)

#### 🧪 Testes

`npm run test` - Executa os testes unitários

`npm run test:watch` - Executa os testes em modo watch

`npm run test:cov` - Gera relatório de cobertura de testes

`npm run test:debug` - Executa testes em modo de depuração

`npm run test:e2e` - Executa testes end-to-end

#### 📦 Migrações de Banco de Dados

`npm run migration-generate` - Gera uma nova migração baseada nas alterações do schema

`npm run migrate` - Executa as migrações pendentes

#### 🧹 Formatação e Linting

`npm run format` - Formata o código usando Prettier

`npm run lint` - Executa o ESLint para verificar e corrigir problemas de estilo

### 🌐 Acessando a Aplicação

API: <http://localhost:3000> (após iniciar o servidor)

Jaeger UI: <http://localhost:16686> (para visualizar traces)
