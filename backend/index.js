require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Importar handlers das rotas
const participantsHandler = require('./api/participants');
const questionsHandler = require('./api/questions');
const answersHandler = require('./api/answers');
const dashboardHandler = require('./api/dashboard');

// Rotas
app.post('/api/participants', participantsHandler);
app.put('/api/participants', participantsHandler);
app.get('/api/participants', participantsHandler);

app.get('/api/questions', questionsHandler);

app.post('/api/answers', answersHandler);

app.get('/api/dashboard', dashboardHandler);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Porta
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
