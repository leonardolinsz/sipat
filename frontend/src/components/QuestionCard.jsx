import React, { useEffect, useState } from 'react';
import Timer from './Timer';
import BrandLogo from './BrandLogo';

const letters = ['A', 'B', 'C', 'D'];

export default function QuestionCard({ question, questionIndex, totalQuestions, onAnswer, participantName }) {
  const [selected, setSelected] = useState(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => { setSelected(null); setExpired(false); }, [question]);

  const getText = letter => question[`alternativa_${letter.toLowerCase()}`];
  const submit = letter => {
    if (selected || expired) return;
    setSelected(letter);
    onAnswer(letter, false, null, false);
  };
  const expire = () => {
    if (selected || expired) return;
    setExpired(true);
    onAnswer(null, true, 30, false);
  };
  const answered = Boolean(selected || expired);
  const progress = (questionIndex / totalQuestions) * 100;

  return (
    <main className="screen screen--centered">
      <section className="quiz-card question-card">
        <div className="question-topbar">
          <div>
            <p className="eyebrow">Blitz da CIPAA · CIPAA 2026</p>
            <p className="participant-name">Olá, {participantName}</p>
            <strong>Pergunta {questionIndex + 1} de {totalQuestions}</strong>
          </div>
          <div className="question-actions"><BrandLogo /><Timer running={!answered} onExpire={expire} /></div>
        </div>
        <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
        <div className="question-heading">
          <span>Questão {questionIndex + 1}</span>
          <h1>{question.enunciado}</h1>
        </div>
        <div className="options">
          {letters.map(letter => {
            const correct = letter === question.resposta_correta;
            const state = !answered ? '' : correct ? ' option--correct' : letter === selected ? ' option--wrong' : ' option--muted';
            return <button key={letter} className={`option${state}`} onClick={() => submit(letter)} disabled={answered}>
              <span className="option-letter">{letter}</span><span>{getText(letter)}</span>
            </button>;
          })}
        </div>
        {answered && (
          <div className={`feedback ${expired ? 'feedback--alert' : selected === question.resposta_correta ? 'feedback--correct' : 'feedback--wrong'}`}>
            <strong>{expired ? 'Tempo esgotado' : selected === question.resposta_correta ? 'Resposta correta' : 'Resposta incorreta'}</strong>
            <p>{question.explicacao}</p>
          </div>
        )}
        {answered && <button className="button button--primary" onClick={() => onAnswer(null, null, null, true)}>
          {questionIndex + 1 < totalQuestions ? 'Próxima pergunta' : 'Ver resultado final'}
        </button>}
      </section>
    </main>
  );
}
