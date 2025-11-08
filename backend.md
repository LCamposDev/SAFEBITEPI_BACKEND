# 🚀 Tarefas para Implementação do Backend - SafeBite

## 📋 Visão Geral

Este documento lista todas as tarefas necessárias para implementar o backend da aplicação SafeBite, uma plataforma de receitas com foco em restrições alimentares.

---

## 🎯 Fase 1: Configuração e Infraestrutura

### 1.1 Escolha da Stack Tecnológica

- [ ] **Definir tecnologia do backend**
  - Opção 1: Node.js + Express.js (recomendado - JavaScript)
  - Opção 2: Python + Flask/FastAPI
  - Opção 3: PHP + Laravel
  - Opção 4: Java + Spring Boot

- [ ] **Definir banco de dados**
  - Opção 1: PostgreSQL (recomendado - robusto e gratuito)
  - Opção 2: MySQL/MariaDB
  - Opção 3: MongoDB (NoSQL)
  - Opção 4: SQLite (apenas para desenvolvimento)

- [ ] **Definir ORM/Query Builder** (se usar SQL)
  - Node.js: Sequelize, TypeORM, Prisma
  - Python: SQLAlchemy
  - PHP: Eloquent (Laravel)

### 1.2 Configuração do Projeto

- [ ] Criar estrutura de pastas do backend
- [ ] Inicializar projeto (npm/pip/composer)
- [ ] Configurar arquivo de variáveis de ambiente (.env)
- [ ] Configurar Git ignore
- [ ] Configurar ESLint/Prettier (se Node.js)
- [ ] Criar arquivo README.md do backend

### 1.3 Configuração do Banco de Dados

- [ ] Instalar e configurar banco de dados
- [ ] Criar arquivo de configuração de conexão
- [ ] Testar conexão com banco de dados
- [ ] Criar script de migração inicial

---

## 🗄️ Fase 2: Modelagem de Dados e Banco de Dados

### 2.1 Design do Schema do Banco de Dados

- [ ] **Criar tabela `users` (usuários)**
  - id (PK, auto-increment)
  - nome_completo (VARCHAR)
  - email (VARCHAR, UNIQUE)
  - senha_hash (VARCHAR) - hash da senha
  - telefone (VARCHAR, nullable)
  - idade (INTEGER, nullable)
  - foto_perfil (VARCHAR, nullable) - caminho da imagem
  - email_verificado (BOOLEAN, default false)
  - token_verificacao_email (VARCHAR, nullable)
  - token_recuperacao_senha (VARCHAR, nullable)
  - data_expiracao_token (TIMESTAMP, nullable)
  - created_at (TIMESTAMP)
  - updated_at (TIMESTAMP)

- [ ] **Criar tabela `restrictions` (restrições alimentares)**
  - id (PK, auto-increment)
  - nome (VARCHAR) - ex: "Diabetes tipo 1", "Intolerância à lactose"
  - categoria (VARCHAR) - ex: "Diabetes", "Alergias", "Intolerâncias"
  - palavras_chave (TEXT) - palavras-chave relacionadas (JSON array)
  - created_at (TIMESTAMP)
  - updated_at (TIMESTAMP)

- [ ] **Criar tabela `user_restrictions` (relação usuário-restrições)**
  - id (PK, auto-increment)
  - user_id (FK -> users.id)
  - restriction_id (FK -> restrictions.id)
  - palavras_chave_personalizadas (TEXT, nullable) - palavras-chave do usuário
  - created_at (TIMESTAMP)

- [ ] **Criar tabela `recipes` (receitas)**
  - id (PK, auto-increment)
  - user_id (FK -> users.id) - autor da receita
  - nome (VARCHAR)
  - descricao (TEXT, nullable)
  - ingredientes (TEXT) - JSON array ou texto
  - modo_preparo (TEXT)
  - tempo_preparo (VARCHAR, nullable) - ex: "5 a 10 minutos"
  - rendimento (VARCHAR, nullable) - ex: "1 copo de 400 ml"
  - propriedades (TEXT, nullable) - informações nutricionais
  - imagem_url (VARCHAR, nullable) - caminho da imagem
  - status (VARCHAR) - "publicada", "rascunho"
  - visualizacoes (INTEGER, default 0)
  - created_at (TIMESTAMP)
  - updated_at (TIMESTAMP)

- [ ] **Criar tabela `recipe_restrictions` (ingredientes/restrições da receita)**
  - id (PK, auto-increment)
  - recipe_id (FK -> recipes.id)
  - ingrediente_restritivo (VARCHAR) - ingrediente que causa restrição
  - palavras_chave (TEXT) - palavras-chave relacionadas
  - created_at (TIMESTAMP)

- [ ] **Criar tabela `recipe_ratings` (avaliações de receitas)**
  - id (PK, auto-increment)
  - recipe_id (FK -> recipes.id)
  - user_id (FK -> users.id)
  - rating (INTEGER) - 1 a 5 estrelas
  - comentario (TEXT, nullable)
  - created_at (TIMESTAMP)
  - updated_at (TIMESTAMP)

- [ ] **Criar tabela `recipe_favorites` (receitas favoritas)**
  - id (PK, auto-increment)
  - recipe_id (FK -> recipes.id)
  - user_id (FK -> users.id)
  - created_at (TIMESTAMP)
  - UNIQUE(recipe_id, user_id)

### 2.2 Criação das Migrações

- [ ] Criar migração para tabela `users`
- [ ] Criar migração para tabela `restrictions`
- [ ] Criar migração para tabela `user_restrictions`
- [ ] Criar migração para tabela `recipes`
- [ ] Criar migração para tabela `recipe_restrictions`
- [ ] Criar migração para tabela `recipe_ratings`
- [ ] Criar migração para tabela `recipe_favorites`
- [ ] Criar índices para melhor performance
- [ ] Executar migrações no banco de dados

### 2.3 Dados Iniciais (Seed)

- [ ] Criar seed para tabela `restrictions` (população inicial de restrições)
- [ ] Criar seed para receitas de exemplo (opcional)
- [ ] Executar seeds

---

## 🔐 Fase 3: Autenticação e Autorização

### 3.1 Sistema de Autenticação

- [ ] Implementar hash de senhas (bcrypt/argon2)
- [ ] Criar endpoint de registro (`POST /api/auth/register`)
  - Validar dados de entrada
  - Verificar se email já existe
  - Hash da senha
  - Criar usuário
  - Retornar token JWT
- [ ] Criar endpoint de login (`POST /api/auth/login`)
  - Validar email e senha
  - Verificar hash da senha
  - Gerar token JWT
  - Retornar token e dados do usuário
- [ ] Implementar JWT (JSON Web Tokens)
  - Gerar tokens
  - Verificar tokens
  - Middleware de autenticação
  - Refresh tokens (opcional)

### 3.2 Recuperação de Senha

- [ ] Criar endpoint de solicitação de recuperação (`POST /api/auth/forgot-password`)
  - Gerar token de recuperação
  - Salvar token no banco
  - Enviar email com token
- [ ] Criar endpoint de verificação de token (`POST /api/auth/verify-reset-token`)
  - Validar token
  - Verificar expiração
- [ ] Criar endpoint de redefinição de senha (`POST /api/auth/reset-password`)
  - Validar token
  - Atualizar senha
  - Invalidar token

### 3.3 Verificação de Email

- [ ] Criar endpoint de envio de email de verificação (`POST /api/auth/send-verification-email`)
  - Gerar token de verificação
  - Enviar email
- [ ] Criar endpoint de verificação de email (`POST /api/auth/verify-email`)
  - Validar token
  - Marcar email como verificado

### 3.4 Middleware de Autenticação

- [ ] Criar middleware para verificar JWT
- [ ] Criar middleware para verificar permissões (autorização)
- [ ] Implementar proteção de rotas

---

## 👤 Fase 4: Gestão de Usuários

### 4.1 Perfil do Usuário

- [ ] Criar endpoint para obter perfil (`GET /api/users/profile`)
  - Retornar dados do usuário autenticado
- [ ] Criar endpoint para atualizar perfil (`PUT /api/users/profile`)
  - Atualizar nome, telefone, idade
  - Validação de dados
- [ ] Criar endpoint para atualizar foto de perfil (`PUT /api/users/profile/photo`)
  - Upload de imagem
  - Validar tipo e tamanho de arquivo
  - Salvar imagem
  - Atualizar caminho no banco

### 4.2 Gestão de Restrições do Usuário

- [ ] Criar endpoint para obter restrições do usuário (`GET /api/users/restrictions`)
- [ ] Criar endpoint para adicionar restrição (`POST /api/users/restrictions`)
  - Validar restrição
  - Associar ao usuário
- [ ] Criar endpoint para remover restrição (`DELETE /api/users/restrictions/:id`)
- [ ] Criar endpoint para atualizar palavras-chave (`PUT /api/users/restrictions/:id`)
- [ ] Criar endpoint para obter todas as restrições disponíveis (`GET /api/restrictions`)

### 4.3 Logout

- [ ] Criar endpoint de logout (`POST /api/auth/logout`)
  - Invalidar token (se usar blacklist)
  - Limpar sessão

---

## 🍳 Fase 5: Gestão de Receitas

### 5.1 CRUD de Receitas

- [ ] Criar endpoint para listar receitas (`GET /api/recipes`)
  - Paginação
  - Filtros (busca, categoria, etc.)
  - Ordenação
- [ ] Criar endpoint para obter receita por ID (`GET /api/recipes/:id`)
  - Incluir dados do autor
  - Incluir avaliações
  - Verificar restrições do usuário
- [ ] Criar endpoint para criar receita (`POST /api/recipes`)
  - Validação de dados
  - Upload de imagem
  - Associar ao usuário
  - Processar ingredientes e restrições
- [ ] Criar endpoint para atualizar receita (`PUT /api/recipes/:id`)
  - Verificar se usuário é o autor
  - Validação de dados
  - Atualizar imagem (opcional)
- [ ] Criar endpoint para deletar receita (`DELETE /api/recipes/:id`)
  - Verificar se usuário é o autor
  - Deletar imagem associada
  - Deletar relacionamentos

### 5.2 Busca e Filtros

- [ ] Implementar busca por nome (`GET /api/recipes?search=termo`)
- [ ] Implementar filtro por restrições (`GET /api/recipes?restrictions=id1,id2`)
- [ ] Implementar filtro para usuário autenticado (receitas compatíveis)
- [ ] Implementar ordenação (mais recentes, mais populares, melhor avaliadas)

### 5.3 Upload de Imagens

- [ ] Configurar middleware de upload (Multer se Node.js)
- [ ] Validar tipo de arquivo (apenas imagens)
- [ ] Validar tamanho do arquivo
- [ ] Processar e redimensionar imagens (opcional)
- [ ] Salvar imagem no servidor ou cloud storage (AWS S3, Cloudinary)
- [ ] Retornar URL da imagem

### 5.4 Processamento de Restrições

- [ ] Criar função para extrair ingredientes do texto
- [ ] Criar função para identificar restrições baseadas em ingredientes
- [ ] Criar função para comparar restrições da receita com restrições do usuário
- [ ] Marcar receitas com alertas de restrição

---

## ⭐ Fase 6: Avaliações e Interações

### 6.1 Avaliações de Receitas

- [ ] Criar endpoint para criar avaliação (`POST /api/recipes/:id/ratings`)
  - Validar rating (1-5)
  - Verificar se usuário já avaliou
  - Calcular média de avaliações
- [ ] Criar endpoint para atualizar avaliação (`PUT /api/recipes/:id/ratings`)
- [ ] Criar endpoint para deletar avaliação (`DELETE /api/recipes/:id/ratings`)
- [ ] Criar endpoint para obter avaliações (`GET /api/recipes/:id/ratings`)

### 6.2 Favoritos

- [ ] Criar endpoint para adicionar favorito (`POST /api/recipes/:id/favorite`)
- [ ] Criar endpoint para remover favorito (`DELETE /api/recipes/:id/favorite`)
- [ ] Criar endpoint para listar favoritos (`GET /api/users/favorites`)

### 6.3 Receitas do Usuário

- [ ] Criar endpoint para listar receitas do usuário (`GET /api/users/recipes`)
- [ ] Criar endpoint para receitas publicadas pelo usuário (`GET /api/users/published-recipes`)

---

## 📧 Fase 7: Sistema de Email

### 7.1 Configuração de Email

- [ ] Escolher serviço de email (SendGrid, Mailgun, Nodemailer, etc.)
- [ ] Configurar credenciais de email
- [ ] Criar templates de email
  - Email de boas-vindas
  - Email de verificação
  - Email de recuperação de senha

### 7.2 Envio de Emails

- [ ] Implementar função de envio de email
- [ ] Integrar com endpoints de autenticação
- [ ] Testar envio de emails

---

## 🛡️ Fase 8: Segurança e Validação

### 8.1 Validação de Dados

- [ ] Implementar validação de entrada (Joi, Yup, Zod)
- [ ] Validar todos os endpoints
- [ ] Retornar mensagens de erro apropriadas

### 8.2 Segurança

- [ ] Implementar rate limiting (limitar requisições)
- [ ] Implementar CORS (Cross-Origin Resource Sharing)
- [ ] Implementar sanitização de dados
- [ ] Implementar proteção contra SQL Injection
- [ ] Implementar proteção contra XSS (Cross-Site Scripting)
- [ ] Implementar HTTPS (em produção)

### 8.3 Tratamento de Erros

- [ ] Criar middleware de tratamento de erros
- [ ] Criar mensagens de erro padronizadas
- [ ] Logging de erros

---

## 🧪 Fase 9: Testes

### 9.1 Testes Unitários

- [ ] Configurar framework de testes (Jest, Mocha, Pytest)
- [ ] Criar testes para funções de autenticação
- [ ] Criar testes para funções de receitas
- [ ] Criar testes para funções de restrições

### 9.2 Testes de Integração

- [ ] Criar testes para endpoints de autenticação
- [ ] Criar testes para endpoints de receitas
- [ ] Criar testes para endpoints de usuários

### 9.3 Testes E2E (Opcional)

- [ ] Configurar ferramenta de testes E2E
- [ ] Criar testes de fluxo completo

---

## 📡 Fase 10: API e Documentação

### 10.1 Documentação da API

- [ ] Escolher ferramenta de documentação (Swagger, Postman, etc.)
- [ ] Documentar todos os endpoints
- [ ] Documentar modelos de dados
- [ ] Documentar códigos de erro
- [ ] Criar exemplos de requisições/respostas

### 10.2 Integração Frontend-Backend

- [ ] Criar serviço de API no frontend
- [ ] Substituir localStorage por chamadas à API
- [ ] Implementar tratamento de erros no frontend
- [ ] Implementar loading states
- [ ] Testar integração completa

---

## 🚀 Fase 11: Deploy e Produção

### 11.1 Preparação para Deploy

- [ ] Configurar variáveis de ambiente de produção
- [ ] Configurar banco de dados de produção
- [ ] Otimizar queries do banco de dados
- [ ] Configurar cache (Redis - opcional)

### 11.2 Deploy

- [ ] Escolher plataforma de deploy (Heroku, AWS, DigitalOcean, etc.)
- [ ] Configurar CI/CD (opcional)
- [ ] Fazer deploy do backend
- [ ] Configurar domínio
- [ ] Configurar SSL/HTTPS

### 11.3 Monitoramento

- [ ] Configurar logging de produção
- [ ] Configurar monitoramento de erros (Sentry, etc.)
- [ ] Configurar monitoramento de performance

---

## 📝 Notas Adicionais

### Tecnologias Recomendadas (Stack Node.js)

- **Backend**: Node.js + Express.js
- **Banco de Dados**: PostgreSQL
- **ORM**: Prisma ou Sequelize
- **Autenticação**: JWT (jsonwebtoken)
- **Validação**: Joi ou Zod
- **Upload**: Multer
- **Email**: Nodemailer + SendGrid
- **Testes**: Jest
- **Documentação**: Swagger

### Estrutura de Pastas Recomendada

```
backend/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   └── config/
├── tests/
├── migrations/
├── seeds/
├── uploads/
└── .env
```

### Prioridades

1. **Alta Prioridade**: Autenticação, CRUD de Receitas, Gestão de Restrições
2. **Média Prioridade**: Upload de Imagens, Busca e Filtros, Avaliações
3. **Baixa Prioridade**: Favoritos, Email, Testes E2E

---

## ✅ Checklist Final

- [ ] Todas as funcionalidades implementadas
- [ ] Testes passando
- [ ] Documentação completa
- [ ] Código revisado
- [ ] Deploy realizado
- [ ] Monitoramento configurado

---

**Última atualização**: [Data]
**Versão**: 1.0
