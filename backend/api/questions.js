const pool = require('../db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    try {
      const result = await pool.query(
        'SELECT id, ordem, enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, resposta_correta, explicacao FROM questions ORDER BY ordem'
      );
      return res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao buscar perguntas' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
};
