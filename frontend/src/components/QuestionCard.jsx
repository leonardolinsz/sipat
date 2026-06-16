import React, { useState, useEffect, useCallback, useRef } from 'react';
import Timer from './Timer';

const LETTERS = ['A', 'B', 'C', 'D'];

export default function QuestionCard({
  question,
  questionIndex,
  totalQuestions,
  onAnswer,
  participantName
}) {
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null); // null | 'correct' | 'wrong' | 'expired'
  const [timerRunning, setTimerRunning] = useState(true);
  const [showNext, setShowNext] = useState(false);
  const [showExpiredPopup, setShowExpiredPopup] = useState(false);
  const startTime = useRef(Date.now());

  useEffect(() => {
    setSelected(null);
    setFeedback(null);
    setTimerRunning(true);
    setShowNext(false);
    setShowExpiredPopup(false);
    startTime.current = Date.now();
  }, [question]);

  const handleExpire = useCallback(() => {
    if (feedback) return;
    setTimerRunning(false);
    setFeedback('expired');
    setShowExpiredPopup(true);
    onAnswer(null, true, null);
    setTimeout(() => {
      setShowExpiredPopup(false);
      setShowNext(true);
    }, 2800);
  }, [feedback, onAnswer]);

  const handleSelect = (letter) => {
    if (feedback) return;
    const elapsed = Math.round((Date.now() - startTime.current) / 1000);
    setSelected(letter);
    setTimerRunning(false);
    const isCorrect = letter === question.resposta_correta;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    onAnswer(letter, false, elapsed);
    setTimeout(() => setShowNext(true), 3000);
  };

  const getAlternativeText = (q, letter) => ({
    A: q.alternativa_a, B: q.alternativa_b, C: q.alternativa_c, D: q.alternativa_d
  })[letter];

  const getOptionStyle = (letter) => {
    const base = { ...styles.option };
    if (!feedback) return { ...base, ...styles.optionIdle };
    if (letter === question.resposta_correta) return { ...base, ...styles.optionCorrect };
    if (letter === selected && feedback === 'wrong') return { ...base, ...styles.optionWrong };
    return { ...base, ...styles.optionDimmed };
  };

  const getOptionIcon = (letter) => {
    if (!feedback) return <span style={styles.letterBadge}>{letter}</span>;
    if (letter === question.resposta_correta) return <span style={{ ...styles.letterBadge, ...styles.iconCorrect }}>✔</span>;
    if (letter === selected && feedback === 'wrong') return <span style={{ ...styles.letterBadge, ...styles.iconWrong }}>✗</span>;
    return <span style={{ ...styles.letterBadge, ...styles.letterDimmed }}>{letter}</span>;
  };

  const progress = ((questionIndex) / totalQuestions) * 100;

  return (
    <div style={styles.page}>
      {/* Expired Popup */}
      {showExpiredPopup && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <div style={styles.popupIcon}>⏱️</div>
            <div style={styles.popupTitle}>Tempo esgotado!</div>
            <div style={styles.popupSub}>A resposta correta era:</div>
            <div style={styles.popupAnswer}>
              <strong>{question.resposta_correta})</strong> {getAlternativeText(question, question.resposta_correta)}
            </div>
          </div>
        </div>
      )}

      <div style={styles.card}>
        {/* Top bar */}
        <div style={styles.topBar}>
          <div>
            <div style={styles.greeting}>Olá, {participantName}!</div>
            <div style={styles.progress}>
              Pergunta <strong>{questionIndex + 1}</strong> de <strong>{totalQuestions}</strong>
            </div>
          </div>
          <Timer
            key={question.id}
            duration={30}
            onExpire={handleExpire}
            running={timerRunning}
          />
        </div>

        {/* Progress bar */}
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>

        {/* Question */}
        <div style={styles.questionBlock}>
          <div style={styles.qNumber}>Questão {questionIndex + 1}</div>
          <h2 style={styles.qText}>{question.enunciado}</h2>
        </div>

        {/* Options */}
        <div style={styles.options}>
          {LETTERS.map(letter => (
            <button
              key={letter}
              style={getOptionStyle(letter)}
              onClick={() => handleSelect(letter)}
              disabled={!!feedback}
            >
              {getOptionIcon(letter)}
              <span style={styles.optionText}>{getAlternativeText(question, letter)}</span>
            </button>
          ))}
        </div>

        {/* Feedback explanation */}
        {feedback && feedback !== 'expired' && (
          <div style={feedback === 'correct' ? styles.explanationCorrect : styles.explanationWrong}>
            <div style={styles.explanationIcon}>{feedback === 'correct' ? '🎉' : '💡'}</div>
            <div>
              <div style={styles.explanationTitle}>
                {feedback === 'correct' ? 'Correto!' : 'Resposta incorreta'}
              </div>
              <div style={styles.explanationText}>{question.explicacao}</div>
            </div>
          </div>
        )}

        {/* Next button */}
        {showNext && (
          <button
            style={styles.nextBtn}
            onClick={() => onAnswer(null, null, null, true)}
          >
            {questionIndex + 1 < totalQuestions ? '➡️ Próxima Pergunta' : '🏁 Ver Resultado Final'}
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: '24px 16px', position: 'relative',
    animation: 'fadeIn 0.3s ease'
  },
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(7,26,74,0.75)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 100, animation: 'fadeIn 0.3s ease'
  },
  popup: {
    background: '#fff', borderRadius: 20, padding: '36px 40px',
    textAlign: 'center', maxWidth: 360, width: '90%',
    animation: 'bounceIn 0.5s ease', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  popupIcon: { fontSize: 56, marginBottom: 12 },
  popupTitle: { fontSize: 24, fontWeight: 800, color: '#EF4444', marginBottom: 8 },
  popupSub: { fontSize: 14, color: '#64748B', marginBottom: 12 },
  popupAnswer: {
    background: '#ECFDF3', borderRadius: 10, padding: '12px 16px',
    fontSize: 14, color: '#166534', fontWeight: 600, border: '1px solid #D1FAE5'
  },
  card: {
    background: '#fff', borderRadius: 24, padding: '32px',
    width: '100%', maxWidth: 600,
    boxShadow: '0 20px 60px rgba(7,26,74,0.28), 0 8px 24px rgba(7,26,74,0.12)',
    animation: 'scaleIn 0.35s ease'
  },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  greeting: { fontSize: 13, color: '#64748B', fontWeight: 500, marginBottom: 2 },
  progress: { fontSize: 14, color: '#1E293B', fontWeight: 600 },
  progressBar: {
    height: 6, background: '#E2E8F0', borderRadius: 99, marginBottom: 28, overflow: 'hidden'
  },
  progressFill: {
    height: '100%', background: 'linear-gradient(90deg, #1B4FBA, #16A34A)',
    borderRadius: 99, transition: 'width 0.5s ease'
  },
  questionBlock: { marginBottom: 24 },
  qNumber: {
    fontSize: 11, fontWeight: 700, color: '#1B4FBA', textTransform: 'uppercase',
    letterSpacing: '1px', marginBottom: 8,
    display: 'inline-block', background: '#EEF4FF', padding: '3px 10px',
    borderRadius: 20, border: '1px solid #DBEAFE'
  },
  qText: { fontSize: 18, fontWeight: 700, color: '#071A4A', lineHeight: 1.45 },
  options: { display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 },
  option: {
    display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
    borderRadius: 12, border: '2px solid transparent', cursor: 'pointer',
    transition: 'all 0.2s', textAlign: 'left', width: '100%'
  },
  optionIdle: {
    background: '#F8FAFC', border: '2px solid #E2E8F0',
    color: '#1E293B'
  },
  optionCorrect: {
    background: '#ECFDF3', border: '2px solid #16A34A',
    color: '#166534', animation: 'bounceIn 0.4s ease'
  },
  optionWrong: {
    background: '#FEF2F2', border: '2px solid #EF4444',
    color: '#B91C1C', animation: 'shake 0.4s ease'
  },
  optionDimmed: {
    background: '#F8FAFC', border: '2px solid #E2E8F0',
    color: '#94A3B8', opacity: 0.6
  },
  letterBadge: {
    minWidth: 32, height: 32, borderRadius: '50%', background: '#E2E8F0',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontWeight: 800, flexShrink: 0, color: '#475569'
  },
  iconCorrect: { background: '#16A34A', color: '#fff', fontSize: 16 },
  iconWrong: { background: '#EF4444', color: '#fff', fontSize: 16 },
  letterDimmed: { background: '#E2E8F0', color: '#CBD5E1' },
  optionText: { fontSize: 15, fontWeight: 500, lineHeight: 1.4 },
  explanationCorrect: {
    display: 'flex', gap: 12, alignItems: 'flex-start',
    background: '#ECFDF3', border: '1px solid #D1FAE5',
    borderRadius: 12, padding: '14px 16px', marginBottom: 20,
    animation: 'fadeInUp 0.4s ease'
  },
  explanationWrong: {
    display: 'flex', gap: 12, alignItems: 'flex-start',
    background: '#EEF4FF', border: '1px solid #DBEAFE',
    borderRadius: 12, padding: '14px 16px', marginBottom: 20,
    animation: 'fadeInUp 0.4s ease'
  },
  explanationIcon: { fontSize: 22, flexShrink: 0 },
  explanationTitle: { fontSize: 14, fontWeight: 700, color: '#166534', marginBottom: 4 },
  explanationText: { fontSize: 13, color: '#334155', lineHeight: 1.5 },
  nextBtn: {
    width: '100%', padding: '15px', borderRadius: 12,
    background: 'linear-gradient(135deg, #1B4FBA 0%, #0F3080 100%)',
    color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(27,79,186,0.35)', animation: 'fadeInUp 0.3s ease',
    letterSpacing: '0.2px'
  }
};
