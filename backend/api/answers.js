const pool = require('../db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { participant_id, question_id, resposta_dada, tempo_esgotado, tempo_resposta_segundos } = req.body;

    if (!participant_id || !question_id) {
      return res.status(400).json({ error: 'participant_id e question_id são obrigatórios' });
    }

    try {
      const qResult = await pool.query(
        'SELECT resposta_correta FROM questions WHERE id = $1',
        [question_id]
      );
      if (qResult.rows.length === 0) {
        return res.status(404).json({ error: 'Pergunta não encontrada' });
      }

      const correta = !tempo_esgotado && resposta_dada === qResult.rows[0].resposta_correta;

      const result = await pool.query(
        `INSERT INTO answers (participant_id, question_id, resposta_dada, correta, tempo_esgotado, tempo_resposta_segundos)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [participant_id, question_id, resposta_dada || null, correta, tempo_esgotado || false, tempo_resposta_segundos || null]
      );

      return res.status(201).json({ ...result.rows[0], resposta_correta: qResult.rows[0].resposta_correta });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao registrar resposta' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
};
