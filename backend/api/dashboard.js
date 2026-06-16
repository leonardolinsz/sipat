const pool = require('../db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const { setor } = req.query;
    try {
      const sectorFilter = setor ? `AND p.setor = '${setor}'` : '';

      const [totais, porSetor, porPergunta, tempoMedio, setores] = await Promise.all([
        pool.query(`
          SELECT
            COUNT(DISTINCT p.id) AS total_participantes,
            COUNT(DISTINCT CASE WHEN p.concluido THEN p.id END) AS total_concluidos,
            ROUND(AVG(sub.acertos)::numeric, 2) AS media_acertos,
            ROUND(AVG(sub.erros)::numeric, 2) AS media_erros,
            ROUND(AVG(sub.nao_respondidas)::numeric, 2) AS media_nao_respondidas
          FROM participants p
          LEFT JOIN (
            SELECT a.participant_id,
              SUM(CASE WHEN a.correta THEN 1 ELSE 0 END) AS acertos,
              SUM(CASE WHEN NOT a.correta AND NOT a.tempo_esgotado THEN 1 ELSE 0 END) AS erros,
              SUM(CASE WHEN a.tempo_esgotado THEN 1 ELSE 0 END) AS nao_respondidas
            FROM answers a
            GROUP BY a.participant_id
          ) sub ON sub.participant_id = p.id
          WHERE 1=1 ${sectorFilter}
        `),

        pool.query(`
          SELECT
            p.setor,
            COUNT(DISTINCT p.id) AS participantes,
            ROUND(AVG(sub.acertos)::numeric, 2) AS media_acertos
          FROM participants p
          LEFT JOIN (
            SELECT participant_id,
              SUM(CASE WHEN correta THEN 1 ELSE 0 END) AS acertos
            FROM answers GROUP BY participant_id
          ) sub ON sub.participant_id = p.id
          GROUP BY p.setor
          ORDER BY media_acertos DESC NULLS LAST
        `),

        pool.query(`
          SELECT
            q.ordem,
            q.enunciado,
            COUNT(a.id) AS total_respostas,
            SUM(CASE WHEN a.correta THEN 1 ELSE 0 END) AS acertos,
            SUM(CASE WHEN NOT a.correta AND NOT a.tempo_esgotado THEN 1 ELSE 0 END) AS erros,
            SUM(CASE WHEN a.tempo_esgotado THEN 1 ELSE 0 END) AS tempo_esgotado,
            ROUND(100.0 * SUM(CASE WHEN NOT a.correta THEN 1 ELSE 0 END) / NULLIF(COUNT(a.id), 0), 1) AS taxa_erro
          FROM questions q
          LEFT JOIN answers a ON a.question_id = q.id
          LEFT JOIN participants p ON p.id = a.participant_id
          WHERE 1=1 ${sectorFilter.replace('p.setor', 'p.setor')}
          GROUP BY q.id, q.ordem, q.enunciado
          ORDER BY q.ordem
        `),

        pool.query(`
          SELECT ROUND(AVG(a.tempo_resposta_segundos)::numeric, 1) AS tempo_medio
          FROM answers a
          LEFT JOIN participants p ON p.id = a.participant_id
          WHERE a.tempo_resposta_segundos IS NOT NULL ${sectorFilter}
        `),

        pool.query(`SELECT DISTINCT setor FROM participants ORDER BY setor`)
      ]);

      return res.status(200).json({
        totais: totais.rows[0],
        por_setor: porSetor.rows,
        por_pergunta: porPergunta.rows,
        tempo_medio: tempoMedio.rows[0]?.tempo_medio,
        setores: setores.rows.map(r => r.setor)
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao buscar dados do dashboard' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
};
