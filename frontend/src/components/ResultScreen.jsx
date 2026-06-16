import React from 'react';

export default function ResultScreen({ results, participantName, setor, onRestart }) {
  const { acertos, erros, naoRespondidas, total } = results;
  const pct = Math.round((acertos / total) * 100);

  const getRating = () => {
    if (pct === 100) return { emoji: '🏆', label: 'Campeão da Segurança!', color: '#16A34A', bg: '#ECFDF3', border: '#D1FAE5' };
    if (pct >= 80)  return { emoji: '🥇', label: 'Excelente desempenho!', color: '#1B4FBA', bg: '#EEF4FF', border: '#DBEAFE' };
    if (pct >= 60)  return { emoji: '✅', label: 'Bom trabalho!', color: '#CA8A04', bg: '#FEFCE8', border: '#FEF9C3' };
    return { emoji: '📚', label: 'Continue aprendendo!', color: '#DC2626', bg: '#FEF2F2', border: '#FEE2E2' };
  };

  const rating = getRating();

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Trophy header */}
        <div style={{ ...styles.ratingBanner, background: rating.bg, border: `2px solid ${rating.border}` }}>
          <div style={styles.ratingEmoji}>{rating.emoji}</div>
          <div style={{ color: rating.color, fontSize: 20, fontWeight: 800 }}>{rating.label}</div>
          <div style={{ color: rating.color, opacity: 0.7, fontSize: 14, fontWeight: 500, marginTop: 4 }}>
            {participantName} · {setor}
          </div>
        </div>

        {/* Big score */}
        <div style={styles.scoreBlock}>
          <div style={styles.scoreCircle}>
            <span style={styles.scoreNum}>{pct}%</span>
            <span style={styles.scoreLabel}>de acerto</span>
          </div>
        </div>

        {/* Stat cards */}
        <div style={styles.statsRow}>
          <div style={{ ...styles.statCard, ...styles.statGreen }}>
            <div style={styles.statIcon}>✔️</div>
            <div style={styles.statNum}>{acertos}</div>
            <div style={styles.statLabel}>Acertos</div>
          </div>
          <div style={{ ...styles.statCard, ...styles.statRed }}>
            <div style={styles.statIcon}>❌</div>
            <div style={styles.statNum}>{erros}</div>
            <div style={styles.statLabel}>Erros</div>
          </div>
          <div style={{ ...styles.statCard, ...styles.statYellow }}>
            <div style={styles.statIcon}>⏱️</div>
            <div style={styles.statNum}>{naoRespondidas}</div>
            <div style={styles.statLabel}>Não respondidas</div>
          </div>
        </div>

        {/* Message */}
        <div style={styles.message}>
          <div style={styles.messageIcon}>🛡️</div>
          <div>
            <div style={styles.messageTitle}>Segurança é responsabilidade de todos</div>
            <div style={styles.messageText}>
              A cultura de segurança começa com cada um de nós. Ao identificar riscos, usar EPIs corretamente
              e agir em equipe, criamos um ambiente de trabalho mais seguro para todos. Continue sempre
              prevenindo e orientando seus colegas!
            </div>
          </div>
        </div>

        {/* Helmet badges */}
        <div style={styles.badges}>
          <span style={styles.badge}>⛑️ SIPAT 2025</span>
          <span style={styles.badge}>🤝 Um time</span>
          <span style={styles.badge}>🔒 Uma cultura</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: '24px 16px', animation: 'fadeIn 0.4s ease'
  },
  card: {
    background: '#fff', borderRadius: 24, padding: '36px 32px',
    width: '100%', maxWidth: 540,
    boxShadow: '0 20px 60px rgba(7,26,74,0.28), 0 8px 24px rgba(7,26,74,0.12)',
    animation: 'scaleIn 0.4s ease'
  },
  ratingBanner: {
    textAlign: 'center', borderRadius: 16, padding: '24px 20px', marginBottom: 28
  },
  ratingEmoji: { fontSize: 52, marginBottom: 8 },
  scoreBlock: { display: 'flex', justifyContent: 'center', marginBottom: 28 },
  scoreCircle: {
    width: 120, height: 120, borderRadius: '50%',
    background: 'linear-gradient(135deg, #1B4FBA, #166534)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', color: '#fff',
    boxShadow: '0 8px 24px rgba(27,79,186,0.35)'
  },
  scoreNum: { fontSize: 30, fontWeight: 800, lineHeight: 1 },
  scoreLabel: { fontSize: 11, fontWeight: 600, opacity: 0.85, marginTop: 2 },
  statsRow: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 },
  statCard: {
    borderRadius: 14, padding: '18px 12px', textAlign: 'center', border: '1.5px solid transparent'
  },
  statGreen: { background: '#ECFDF3', border: '1.5px solid #D1FAE5' },
  statRed:   { background: '#FEF2F2', border: '1.5px solid #FEE2E2' },
  statYellow:{ background: '#FEFCE8', border: '1.5px solid #FEF9C3' },
  statIcon: { fontSize: 22, marginBottom: 6 },
  statNum: { fontSize: 26, fontWeight: 800, color: '#071A4A' },
  statLabel: { fontSize: 11, color: '#64748B', fontWeight: 600, marginTop: 2 },
  message: {
    display: 'flex', gap: 14, alignItems: 'flex-start',
    background: '#EEF4FF', borderRadius: 14, padding: '18px 16px', marginBottom: 20,
    border: '1px solid #DBEAFE'
  },
  messageIcon: { fontSize: 28, flexShrink: 0, marginTop: 2 },
  messageTitle: { fontSize: 14, fontWeight: 700, color: '#071A4A', marginBottom: 6 },
  messageText: { fontSize: 13, color: '#475569', lineHeight: 1.55 },
  badges: { display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 },
  badge: {
    background: '#F1F5F9', color: '#334155', fontSize: 12, fontWeight: 600,
    padding: '5px 12px', borderRadius: 20, border: '1px solid #E2E8F0'
  },
  restartBtn: {
    width: '100%', padding: '15px', borderRadius: 12,
    background: 'linear-gradient(135deg, #166534, #16A34A)',
    color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(22,101,52,0.35)', letterSpacing: '0.2px'
  }
};
