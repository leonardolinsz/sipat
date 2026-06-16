# ⛑️ Quiz SIPAT 2025 — Integrar para Prevenir

> **Um time, uma cultura de segurança**
> Quiz interativo de segurança do trabalho com dashboard administrativo.

---

## 📦 Estrutura do Projeto

```
sipat-quiz/
├── frontend/          ← App React (hospedado na Vercel)
│   ├── src/
│   │   ├── App.js
│   │   ├── api.js
│   │   ├── data.js       ← Perguntas (fallback local)
│   │   ├── index.css
│   │   ├── components/
│   │   │   ├── WelcomeScreen.jsx
│   │   │   ├── QuestionCard.jsx
│   │   │   ├── ResultScreen.jsx
│   │   │   └── Timer.jsx
│   │   └── pages/
│   │       └── Dashboard.jsx
│   └── public/
├── backend/           ← API Node.js serverless (hospedado na Vercel)
│   ├── api/
│   │   ├── participants.js
│   │   ├── questions.js
│   │   ├── answers.js
│   │   └── dashboard.js
│   ├── db.js
│   └── vercel.json
└── database/
    └── schema.sql     ← Execute este arquivo no seu banco PostgreSQL
```

---

## 🚀 Deploy Passo a Passo

### PASSO 1 — Criar o Banco de Dados (Neon — recomendado, gratuito)

1. Acesse **https://neon.tech** e crie uma conta gratuita
2. Crie um novo projeto chamado `sipat-quiz`
3. Copie a **Connection String** (começa com `postgresql://...`)
4. Acesse o **SQL Editor** no painel do Neon
5. Cole e execute o conteúdo do arquivo `database/schema.sql`
6. As perguntas serão inseridas automaticamente ✅

> **Alternativa:** Supabase em https://supabase.com (também gratuito)
> No Supabase: Dashboard → SQL Editor → Cole o schema.sql → Run

---

### PASSO 2 — Deploy do Backend (API) na Vercel

1. Crie uma conta em **https://vercel.com**
2. Instale a CLI: `npm install -g vercel`
3. Entre na pasta do backend:
   ```bash
   cd backend
   npm install
   vercel
   ```
4. Siga o assistente (confirme o projeto, deixe configurações padrão)
5. Após o deploy, **adicione a variável de ambiente** no painel da Vercel:
   - Vá em: Projeto → Settings → Environment Variables
   - Adicione: `DATABASE_URL` = sua connection string do Neon/Supabase
6. Faça redeploy: `vercel --prod`
7. **Anote a URL** gerada (ex: `https://sipat-api.vercel.app`)

---

### PASSO 3 — Deploy do Frontend na Vercel

1. Entre na pasta do frontend:
   ```bash
   cd frontend
   ```
2. Crie o arquivo `.env` com a URL da sua API:
   ```
   REACT_APP_API_URL=https://sipat-api.vercel.app
   ```
3. Faça o deploy:
   ```bash
   vercel
   npm install   # se necessário
   vercel --prod
   ```
4. Acesse a URL gerada — seu quiz está no ar! 🎉

---

### PASSO 4 — Testar localmente (opcional)

**Backend:**
```bash
cd backend
cp .env.example .env
# Edite .env com sua DATABASE_URL
npm install
node api/questions.js   # ou use vercel dev
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
# Edite .env com a URL do backend local
npm install
npm start
# Acesse http://localhost:3000
```

---

## 🗂️ Perguntas do Quiz

As perguntas já estão inseridas via `schema.sql`. Elas são:

| # | Pergunta | Resp. Correta |
|---|----------|--------------|
| 1 | Qual é a atitude mais segura ao identificar um risco? | B |
| 2 | O uso de EPI deve ser feito quando? | C |
| 3 | Trabalhar em equipe contribui para a segurança porque: | A |
| 4 | Antes de iniciar qualquer atividade, o mais importante é: | C |
| 5 | O que fazer ao presenciar um colega em situação de risco? | C |

Para **adicionar ou editar perguntas**, execute no banco:
```sql
INSERT INTO questions (ordem, enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, resposta_correta, explicacao)
VALUES (6, 'Sua nova pergunta?', 'A', 'B', 'C', 'D', 'A', 'Explicação da resposta.');
```

---

## 📊 Dashboard Administrativo

Acesse pelo botão **"📊 Dashboard Admin"** no canto superior direito do quiz.

Mostra:
- Total de participantes e taxa de conclusão
- Média de acertos, erros e tempo por pergunta
- Ranking de setores
- Perguntas com maior índice de erro
- Gráficos de barras e pizza
- Filtro por setor

---

## 🔧 Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/api/participants` | Criar participante |
| `PUT`  | `/api/participants?id=X` | Finalizar participante |
| `GET`  | `/api/questions` | Listar perguntas |
| `POST` | `/api/answers` | Registrar resposta |
| `GET`  | `/api/dashboard` | Dados do dashboard |
| `GET`  | `/api/dashboard?setor=TI` | Filtrar por setor |

---

## ⚙️ Funcionalidades

- ✅ Tela de identificação (nome + setor)
- ✅ Timer de 30s por pergunta com anel animado
- ✅ Feedback visual imediato (verde/vermelho + explicação)
- ✅ Popup animado quando o tempo esgota
- ✅ Barra de progresso
- ✅ Tela de resultado com pontuação e mensagem educativa
- ✅ Dashboard com gráficos e KPIs
- ✅ Funciona offline (perguntas locais como fallback)
- ✅ Persistência no PostgreSQL

---

## 🛠️ Tecnologias

- **Frontend:** React 18, Recharts
- **Backend:** Node.js (serverless Vercel)
- **Banco:** PostgreSQL (Neon/Supabase)
- **Hospedagem:** Vercel (frontend + backend)

---

*⛑️ SIPAT 2025 — Segurança começa em cada um de nós.*
