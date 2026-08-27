-- Blitz da CIPAA - PostgreSQL Schema
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  ordem INTEGER NOT NULL,
  enunciado TEXT NOT NULL,
  alternativa_a TEXT NOT NULL,
  alternativa_b TEXT NOT NULL,
  alternativa_c TEXT NOT NULL,
  alternativa_d TEXT NOT NULL,
  resposta_correta CHAR(1) NOT NULL CHECK (resposta_correta IN ('A','B','C','D')),
  explicacao TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS participants (
  id SERIAL PRIMARY KEY, nome VARCHAR(150) NOT NULL, setor VARCHAR(100) NOT NULL,
  iniciado_em TIMESTAMP DEFAULT NOW(), finalizado_em TIMESTAMP, concluido BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS answers (
  id SERIAL PRIMARY KEY, participant_id INTEGER REFERENCES participants(id) ON DELETE CASCADE,
  question_id INTEGER REFERENCES questions(id), resposta_dada CHAR(1) CHECK (resposta_dada IN ('A','B','C','D')),
  correta BOOLEAN, tempo_esgotado BOOLEAN DEFAULT FALSE, tempo_resposta_segundos INTEGER,
  respondido_em TIMESTAMP DEFAULT NOW()
);

-- Mantém perguntas e respostas históricas fora da campanha atual, sem apagá-las.
ALTER TABLE questions ADD COLUMN IF NOT EXISTS ativo BOOLEAN NOT NULL DEFAULT TRUE;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM questions WHERE ativo AND ordem = 10) THEN
    UPDATE questions SET ordem = ordem + 1000, ativo = FALSE
    WHERE ativo AND ordem BETWEEN 1 AND 5;
  END IF;
END $$;

-- Seed idempotente da Blitz da CIPAA 2026. As questões 19 e 20 do DOCX são 9 e 10 aqui.
INSERT INTO questions (ordem, enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, resposta_correta, explicacao, ativo)
SELECT v.ordem, v.enunciado, v.alternativa_a, v.alternativa_b, v.alternativa_c, v.alternativa_d, v.resposta_correta, v.explicacao, TRUE
FROM (VALUES
  (1, 'Qual é o principal objetivo da CIPA?', 'Fiscalizar os funcionários', 'Promover a prevenção de acidentes e doenças relacionadas ao trabalho', 'Aplicar advertências', 'Controlar o horário dos funcionários', 'B', 'A CIPA promove a prevenção de acidentes e doenças relacionadas ao trabalho.'),
  (2, 'Qual atitude ajuda na prevenção de acidentes?', 'Deixar objetos espalhados', 'Ignorar pequenas situações de risco', 'Manter o ambiente organizado e comunicar condições inseguras', 'Fazer atividades com pressa', 'C', 'Organização e comunicação de condições inseguras ajudam a prevenir acidentes.'),
  (3, 'Sobre ergonomia, qual atitude é adequada?', 'Permanecer na mesma posição durante todo o expediente', 'Ajustar cadeira e monitor de forma adequada', 'Trabalhar sempre com o monitor muito baixo', 'Evitar pausas durante o trabalho', 'B', 'Ajustar cadeira e monitor adequadamente contribui para a ergonomia.'),
  (4, 'Um colaborador percebe que uma tomada está aquecendo e apresenta sinais de dano. Qual a atitude mais segura?', 'Continuar utilizando até parar de funcionar', 'Colocar fita adesiva e continuar usando', 'Comunicar o problema e evitar a utilização até avaliação adequada', 'Tentar desmontar a tomada', 'C', 'O problema deve ser comunicado e a tomada não deve ser usada até avaliação adequada.'),
  (5, 'Durante uma evacuação de emergência, o correto é:', 'Correr e empurrar as pessoas', 'Voltar para buscar objetos pessoais', 'Seguir as orientações e utilizar as rotas de saída indicadas', 'Utilizar qualquer elevador disponível', 'C', 'Siga as orientações e use as rotas de saída indicadas.'),
  (6, 'Qual é a diferença entre acidente e incidente?', 'Não existe diferença', 'Incidente é sempre mais grave que acidente', 'Acidente pode causar dano; incidente é uma ocorrência que poderia ter causado dano, mas não causou', 'Incidente acontece somente fora do trabalho', 'C', 'O acidente pode causar dano; o incidente poderia ter causado dano, mas não causou.'),
  (7, 'Um piso molhado sem sinalização pode causar:', 'Queda e lesões', 'Problemas elétricos', 'Doenças respiratórias', 'Problemas de visão', 'A', 'Pisos molhados sem sinalização podem causar quedas e lesões.'),
  (8, 'Qual atitude contribui para um ambiente de trabalho seguro?', 'Manter materiais espalhados', 'Deixar objetos nas áreas de circulação', 'Manter o ambiente organizado e livre de obstáculos', 'Ignorar pequenas situações de risco', 'C', 'Manter o ambiente organizado e livre de obstáculos contribui para a segurança.'),
  (9, 'A prevenção de assédio e violência no trabalho também está relacionada à atuação da CIPA. Qual atitude contribui para um ambiente saudável?', 'Fazer comentários constrangedores como brincadeira', 'Ignorar situações inadequadas', 'Respeitar os colegas e comunicar situações de assédio ou violência pelos canais apropriados', 'Compartilhar situações pessoais dos colegas', 'C', 'Respeite os colegas e comunique situações de assédio ou violência pelos canais apropriados.'),
  (10, 'Um colaborador percebe que um colega está sendo constantemente alvo de comentários constrangedores. O que deve fazer?', 'Participar para não criar conflito', 'Ignorar', 'Buscar orientação e comunicar a situação pelos canais apropriados', 'Compartilhar a situação com outros colegas', 'C', 'Busque orientação e comunique a situação pelos canais apropriados.')
) AS v(ordem, enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, resposta_correta, explicacao)
WHERE NOT EXISTS (SELECT 1 FROM questions q WHERE q.ativo AND q.ordem = v.ordem);
