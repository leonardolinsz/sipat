import React from 'react';
import BrandLogo from './BrandLogo';

export default function ResultScreen({ results, participantName, setor }) {
  const { acertos, erros, naoRespondidas, total } = results;
  const pct = total ? Math.round((acertos / total) * 100) : 0;
  const label = pct === 100 ? 'Conhecimento em dia' : pct >= 70 ? 'Bom desempenho' : 'Siga aprendendo';
  return <main className="screen screen--centered">
    <section className="quiz-card result-card">
      <p className="eyebrow">Blitz da CIPAA · CIPAA 2026</p>
      <div className="result-heading"><BrandLogo /><h1>{label}</h1><p>{participantName} · {setor}</p></div>
      <div className="score-circle"><strong>{pct}%</strong><span>de acerto</span></div>
      <div className="result-stats">
        <div><strong>{acertos}</strong><span>Acertos</span></div>
        <div><strong>{erros}</strong><span>Erros</span></div>
        <div><strong>{naoRespondidas}</strong><span>Não respondidas</span></div>
      </div>
      <div className="result-message"><strong>Segurança é responsabilidade de todos.</strong><p>Cada atitude de prevenção e respeito ajuda a tornar o ambiente de trabalho mais seguro e saudável.</p></div>
    </section>
  </main>;
}
