const pool = require('../db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { nome, setor } = req.body;
    if (!nome || !setor) {
      return res.status(400).json({ error: 'Nome e setor são obrigatórios' });
    }
    try {
      const result = await pool.query(
        'INSERT INTO participants (nome, setor) VALUES ($1, $2) RETURNING *',
        [nome.trim(), setor.trim()]
      );
      return res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao criar participante' });
    }
  }

  if (req.method === 'PUT') {
    const { id } = req.query;
    try {
      const result = await pool.query(
        'UPDATE participants SET finalizado_em = NOW(), concluido = TRUE WHERE id = $1 RETURNING *',
        [id]
      );
      return res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao finalizar participante' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
};
