const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const api = {
  async createParticipant(nome, setor) {
    const res = await fetch(`${BASE_URL}/api/participants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, setor })
    });
    if (!res.ok) throw new Error('Erro ao criar participante');
    return res.json();
  },

  async finalizeParticipant(id) {
    const res = await fetch(`${BASE_URL}/api/participants?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Erro ao finalizar');
    return res.json();
  },

  async getQuestions() {
    const res = await fetch(`${BASE_URL}/api/questions`);
    if (!res.ok) throw new Error('Erro ao buscar perguntas');
    return res.json();
  },

  async submitAnswer(payload) {
    const res = await fetch(`${BASE_URL}/api/answers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Erro ao enviar resposta');
    return res.json();
  },

  async getDashboard(setor) {
    const url = setor
      ? `${BASE_URL}/api/dashboard?setor=${encodeURIComponent(setor)}`
      : `${BASE_URL}/api/dashboard`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Erro ao buscar dashboard');
    return res.json();
  }
};
