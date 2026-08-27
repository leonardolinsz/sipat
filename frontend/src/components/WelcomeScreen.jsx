import React, { useState } from 'react';
import { QUESTIONS, SETORES } from '../data';
import BrandLogo from './BrandLogo';

export default function WelcomeScreen({ onStart, loading, startError }) {
  const [nome, setNome] = useState('');
  const [setor, setSetor] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    const nextErrors = {};
    if (!nome.trim()) nextErrors.nome = 'Informe seu nome';
    if (!setor) nextErrors.setor = 'Selecione seu setor';
    setErrors(nextErrors);
    if (!Object.keys(nextErrors).length) onStart(nome.trim(), setor);
  };

  return (
    <main className="screen screen--centered">
      <section className="quiz-card welcome-card">
        <header className="brand-header">
          <BrandLogo />
          <div>
            <p className="eyebrow">CIPAA 2026</p>
            <h1>Blitz da CIPAA</h1>
          </div>
        </header>
        <div className="welcome-intro">
          <span className="quiz-count">{QUESTIONS.length} perguntas</span>
          <h2>Segurança se constrói em equipe.</h2>
          <p>Teste seus conhecimentos sobre prevenção, saúde e um ambiente de trabalho respeitoso.</p>
        </div>
        <div className="form-grid">
          {startError && <div className="start-error" role="alert" aria-live="assertive">{startError}</div>}
          <label>Seu nome
            <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Como podemos te chamar?" disabled={loading} />
            {errors.nome && <small className="field-error">{errors.nome}</small>}
          </label>
          <label>Seu setor
            <select value={setor} onChange={e => setSetor(e.target.value)} disabled={loading}>
              <option value="">Selecione seu setor</option>
              {SETORES.map(item => <option key={item} value={item}>{item}</option>)}
            </select>
            {errors.setor && <small className="field-error">{errors.setor}</small>}
          </label>
        </div>
        <div className="welcome-footer">
          <span>30 segundos por pergunta</span>
          <button className="button button--primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Carregando quiz...' : 'Iniciar blitz'}
          </button>
        </div>
      </section>
    </main>
  );
}
