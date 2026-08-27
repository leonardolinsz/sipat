# ⛑️ Quiz SIPAT 2026 — Integrar para Prevenir

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

*⛑️ SIPAT 2026 — Segurança começa em cada um de nós.*
