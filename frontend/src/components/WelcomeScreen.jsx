import React, { useState } from 'react';
import { SETORES } from '../data';

export default function WelcomeScreen({ onStart, loading }) {
  const [nome, setNome] = useState('');
  const [setor, setSetor] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!nome.trim()) e.nome = 'Informe seu nome';
    if (!setor) e.setor = 'Selecione seu setor';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onStart(nome.trim(), setor);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoRow}>
            <span style={styles.helmetIcon}>⛑️</span>
            <div>
              <div style={styles.sipatLabel}>SIPAT 2025</div>
              <div style={styles.sipatSub}>Semana Interna de Prevenção de Acidentes</div>
            </div>
          </div>
          <div style={styles.shieldBadge}>🛡️</div>
        </div>

        {/* Title */}
        <div style={styles.titleBlock}>
          <h1 style={styles.title}>Integrar para Prevenir</h1>
          <p style={styles.subtitle}>Um time, uma cultura de segurança</p>
        </div>

        {/* Badges */}
        <div style={styles.badges}>
          <span style={styles.badge}><span>⏱️</span> 30s por pergunta</span>
          <span style={styles.badge}><span>❓</span> 5 perguntas</span>
          <span style={styles.badge}><span>✔️</span> Feedback imediato</span>
        </div>

        {/* Divider */}
        <div style={styles.divider} />

        {/* Form */}
        <div style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>👤 Seu nome completo</label>
            <input
              style={{ ...styles.input, ...(errors.nome ? styles.inputError : {}) }}
              type="text"
              placeholder="Ex: João da Silva"
              value={nome}
              onChange={e => { setNome(e.target.value); setErrors(p => ({ ...p, nome: '' })); }}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              maxLength={100}
            />
            {errors.nome && <span style={styles.errorMsg}>⚠️ {errors.nome}</span>}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>🏢 Seu setor</label>
            <select
              style={{ ...styles.input, ...styles.select, ...(errors.setor ? styles.inputError : {}) }}
              value={setor}
              onChange={e => { setSetor(e.target.value); setErrors(p => ({ ...p, setor: '' })); }}
            >
              <option value="">Selecione o setor...</option>
              {SETORES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.setor && <span style={styles.errorMsg}>⚠️ {errors.setor}</span>}
          </div>
        </div>

        {/* CTA */}
        <button
          style={{ ...styles.btn, ...(loading ? styles.btnLoading : {}) }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <span style={styles.loadingRow}>
              <span style={styles.spinner} /> Carregando quiz...
            </span>
          ) : (
            '🚀 Iniciar Quiz'
          )}
        </button>

        <p style={styles.hint}>Boa sorte! Lembre-se: segurança começa em você. 💪</p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
    animation: 'fadeIn 0.5s ease'
  },
  card: {
    background: '#FFFFFF',
    borderRadius: 24,
    padding: '40px 40px 36px',
    width: '100%',
    maxWidth: 520,
    boxShadow: '0 20px 60px rgba(7,26,74,0.30), 0 8px 24px rgba(7,26,74,0.15)',
    animation: 'scaleIn 0.4s ease'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28
  },
  logoRow: { display: 'flex', alignItems: 'center', gap: 12 },
  helmetIcon: { fontSize: 36 },
  sipatLabel: { fontSize: 18, fontWeight: 800, color: '#0F3080', letterSpacing: '-0.3px' },
  sipatSub: { fontSize: 11, color: '#64748B', fontWeight: 500, marginTop: 1 },
  shieldBadge: { fontSize: 32 },
  titleBlock: { marginBottom: 20, textAlign: 'center' },
  title: { fontSize: 26, fontWeight: 800, color: '#071A4A', lineHeight: 1.2, letterSpacing: '-0.5px' },
  subtitle: { fontSize: 15, color: '#64748B', marginTop: 6, fontWeight: 500 },
  badges: { display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    background: '#EEF4FF', color: '#1540A0', fontSize: 12,
    fontWeight: 600, padding: '5px 12px', borderRadius: 20,
    border: '1px solid #DBEAFE'
  },
  divider: { height: 1, background: '#E2E8F0', marginBottom: 28 },
  form: { display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 24 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 700, color: '#334155', letterSpacing: '0.2px' },
  input: {
    border: '2px solid #E2E8F0', borderRadius: 10, padding: '13px 16px',
    fontSize: 15, color: '#0F172A', background: '#F8FAFC',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    width: '100%'
  },
  select: { appearance: 'none', cursor: 'pointer' },
  inputError: { borderColor: '#EF4444', background: '#FEF2F2' },
  errorMsg: { fontSize: 12, color: '#DC2626', fontWeight: 600 },
  btn: {
    width: '100%', padding: '16px', borderRadius: 12,
    background: 'linear-gradient(135deg, #1B4FBA 0%, #0F3080 100%)',
    color: '#FFFFFF', fontSize: 16, fontWeight: 700,
    cursor: 'pointer', border: 'none',
    transition: 'transform 0.15s, box-shadow 0.15s',
    boxShadow: '0 4px 16px rgba(27,79,186,0.40)',
    letterSpacing: '0.2px'
  },
  btnLoading: { opacity: 0.75, cursor: 'not-allowed' },
  loadingRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 },
  spinner: {
    display: 'inline-block', width: 18, height: 18,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff', borderRadius: '50%',
    animation: 'spin 0.7s linear infinite'
  },
  hint: { textAlign: 'center', fontSize: 13, color: '#94A3B8', marginTop: 16, fontWeight: 500 }
};
