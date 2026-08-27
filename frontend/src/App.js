import React, { useState, useCallback, useEffect } from 'react';
import './index.css';
import WelcomeScreen from './components/WelcomeScreen';
import QuestionCard from './components/QuestionCard';
import ResultScreen from './components/ResultScreen';
import BrandLogo from './components/BrandLogo';
import Dashboard from './pages/Dashboard';
import { api } from './api';
import { QUESTIONS } from './data';

const SCREENS = { WELCOME: 'welcome', QUIZ: 'quiz', RESULT: 'result', DASHBOARD: 'dashboard' };
const COMPLETED_QUIZ_PREFIX = 'sipat:completed-quiz:';
const COMPLETED_QUIZ_RESULT_KEY = 'sipat:completed-quiz-result';

const normalizeParticipantValue = value => value.trim().replace(/\s+/g, ' ').toLocaleLowerCase('pt-BR');
const getCompletedQuizKey = (nome, setor) => `${COMPLETED_QUIZ_PREFIX}${encodeURIComponent(normalizeParticipantValue(nome))}:${encodeURIComponent(normalizeParticipantValue(setor))}`;

const getCompletedQuiz = () => {
  try {
    const storedQuiz = window.sessionStorage.getItem(COMPLETED_QUIZ_RESULT_KEY);
    if (!storedQuiz) return null;

    const completedQuiz = JSON.parse(storedQuiz);
    if (!completedQuiz?.completedQuizKey || !completedQuiz?.participant || !completedQuiz?.results) return null;
    return completedQuiz;
  } catch (_) {
    return null;
  }
};

export default function App() {
  const [completedQuiz, setCompletedQuiz] = useState(getCompletedQuiz);
  const [screen, setScreen] = useState(() => getCompletedQuiz() ? SCREENS.RESULT : SCREENS.WELCOME);
  const [participant, setParticipant] = useState(() => getCompletedQuiz()?.participant || null);
  const [questions, setQuestions] = useState(QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [pendingAnswer, setPendingAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startError, setStartError] = useState('');

  // Verificar rota oculta
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#/vanessa-admin') {
        setScreen(SCREENS.DASHBOARD);
      } else if (window.location.hash === '') {
        setScreen(getCompletedQuiz() ? SCREENS.RESULT : SCREENS.WELCOME);
      }
    };
    
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleStart = async (nome, setor) => {
    const completedQuizKey = getCompletedQuizKey(nome, setor);
    if (window.sessionStorage.getItem(completedQuizKey)) {
      setStartError('Este usuário já concluiu o quiz nesta sessão do navegador. Cada usuário pode jogar apenas uma vez por sessão.');
      return;
    }

    setStartError('');
    setLoading(true);
    try {
      let qs = QUESTIONS;
      try {
        qs = await api.getQuestions();
        if (!qs || qs.length === 0) qs = QUESTIONS;
      } catch (_) { /* use local fallback */ }

      let p = { id: null, nome, setor, completedQuizKey };
      try {
        p = { ...(await api.createParticipant(nome, setor)), completedQuizKey };
      } catch (_) { /* continue without API */ }

      setQuestions(qs);
      setParticipant(p);
      setCurrentIndex(0);
      setAnswers([]);
      setScreen(SCREENS.QUIZ);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = useCallback(async (resposta, tempoEsgotado, tempoResposta, advance) => {
    if (advance) {
      // Move to next question or result
      const next = currentIndex + 1;
      if (next >= questions.length) {
        // Finalize
        if (participant?.id) {
          try { await api.finalizeParticipant(participant.id); } catch (_) {}
        }
        const results = computeResults();
        const completedQuiz = { participant, results, completedQuizKey: participant?.completedQuizKey };
        if (participant?.completedQuizKey) window.sessionStorage.setItem(participant.completedQuizKey, 'true');
        window.sessionStorage.setItem(COMPLETED_QUIZ_RESULT_KEY, JSON.stringify(completedQuiz));
        setCompletedQuiz(completedQuiz);
        setScreen(SCREENS.RESULT);
      } else {
        setCurrentIndex(next);
      }
      return;
    }

    // Store answer
    const q = questions[currentIndex];
    const answer = {
      question_id: q.id,
      resposta_dada: resposta,
      correta: resposta === q.resposta_correta,
      tempo_esgotado: tempoEsgotado,
      tempo_resposta_segundos: tempoResposta
    };
    setAnswers(prev => [...prev, answer]);
    setPendingAnswer(answer);

    // Submit to API
    if (participant?.id) {
      try {
        await api.submitAnswer({
          participant_id: participant.id,
          question_id: q.id,
          resposta_dada: resposta,
          tempo_esgotado: tempoEsgotado,
          tempo_resposta_segundos: tempoResposta
        });
      } catch (_) {}
    }
  }, [currentIndex, questions, participant, answers]);

  const computeResults = () => {
    const acertos = answers.filter(a => a.correta).length;
    const naoRespondidas = answers.filter(a => a.tempo_esgotado).length;
    const erros = answers.filter(a => !a.correta && !a.tempo_esgotado).length;
    return { acertos, erros, naoRespondidas, total: questions.length };
  };

  return (
    <>
      {screen === SCREENS.WELCOME && (
        <WelcomeScreen onStart={handleStart} loading={loading} startError={startError} />
      )}

      {screen === SCREENS.QUIZ && questions[currentIndex] && (
        <QuestionCard
          key={currentIndex}
          question={questions[currentIndex]}
          questionIndex={currentIndex}
          totalQuestions={questions.length}
          onAnswer={handleAnswer}
          participantName={participant?.nome || ''}
        />
      )}

      {screen === SCREENS.RESULT && (
        <ResultScreen
          results={completedQuiz?.results || computeResults()}
          participantName={completedQuiz?.participant?.nome || participant?.nome || ''}
          setor={completedQuiz?.participant?.setor || participant?.setor || ''}
        />
      )}

      {screen === SCREENS.DASHBOARD && (
        <>
          <button 
            onClick={() => window.location.hash = ''}
            style={styles.backBtn}
          >
            ← Voltar
          </button>
          <Dashboard BrandLogo={BrandLogo} />
        </>
      )}
    </>
  );
}

const styles = {
  backBtn: {
    position: 'fixed', top: 16, left: 16, zIndex: 200,
    background: 'rgba(15,94,65,0.9)', backdropFilter: 'blur(8px)',
    color: '#fff', border: '1.5px solid rgba(255,255,255,0.3)',
    borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600,
    cursor: 'pointer', transition: 'all 0.2s'
  }
};
