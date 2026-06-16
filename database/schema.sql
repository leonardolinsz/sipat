-- SIPAT Quiz - PostgreSQL Schema
-- Compatible with Neon, Supabase, or any hosted PostgreSQL

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
  id SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  setor VARCHAR(100) NOT NULL,
  iniciado_em TIMESTAMP DEFAULT NOW(),
  finalizado_em TIMESTAMP,
  concluido BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS answers (
  id SERIAL PRIMARY KEY,
  participant_id INTEGER REFERENCES participants(id) ON DELETE CASCADE,
  question_id INTEGER REFERENCES questions(id),
  resposta_dada CHAR(1) CHECK (resposta_dada IN ('A','B','C','D')),
  correta BOOLEAN,
  tempo_esgotado BOOLEAN DEFAULT FALSE,
  tempo_resposta_segundos INTEGER,
  respondido_em TIMESTAMP DEFAULT NOW()
);

-- Seed questions from the SIPAT quiz image
INSERT INTO questions (ordem, enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, resposta_correta, explicacao) VALUES
(1,
 'Qual é a atitude mais segura ao identificar um risco no ambiente de trabalho?',
 'Ignorar, pois não é sua função',
 'Comunicar imediatamente e sinalizar o local',
 'Resolver sozinho sem avisar ninguém',
 'Esperar alguém perceber',
 'B',
 'Comunicar e sinalizar imediatamente é a atitude correta. Todo colaborador tem responsabilidade pela segurança coletiva.'
),
(2,
 'O uso de EPI deve ser feito quando?',
 'Apenas quando tem fiscalização',
 'Somente em atividades de alto risco',
 'Sempre que a atividade exigir',
 'Quando o colaborador achar necessário',
 'C',
 'O EPI deve ser usado sempre que a atividade exigir, independente de fiscalização ou percepção pessoal de risco.'
),
(3,
 'Trabalhar em equipe contribui para a segurança porque:',
 'Divide tarefas e reduz erros',
 'Diminui a responsabilidade individual',
 'Aumenta o tempo da atividade',
 'Evita o uso de procedimentos',
 'A',
 'A colaboração em equipe distribui responsabilidades, aumenta a atenção e reduz a chance de erros e acidentes.'
),
(4,
 'Antes de iniciar qualquer atividade, o mais importante é:',
 'Começar rápido para ganhar tempo',
 'Ver se alguém já fez antes',
 'Avaliar riscos e planejar',
 'Pedir ajuda só depois de errar',
 'C',
 'Avaliar riscos e planejar antes de iniciar qualquer atividade é fundamental para prevenir acidentes.'
),
(5,
 'O que fazer ao presenciar um colega em situação de risco?',
 'Ignorar para evitar conflito',
 'Registrar depois',
 'Alertar e orientar com respeito',
 'Esperar o gestor resolver',
 'C',
 'Alertar e orientar com respeito demonstra cuidado com o próximo e fortalece a cultura de segurança no trabalho.'
);
