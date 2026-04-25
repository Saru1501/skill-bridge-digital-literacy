import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  getQuizzesByCourse, getQuizById,
  startAttempt, submitAttempt, getMyAttempts,
} from '../../api/quizService';
import QuizTimer      from '../../components/assessment/QuizTimer';
import QuizQuestion   from '../../components/assessment/QuizQuestion';
import AttemptHistory from '../../components/assessment/AttemptHistory';

const SCREEN = { LIST: 'list', CONFIRM: 'confirm', ACTIVE: 'active', RESULT: 'result' };

export default function QuizPage() {
  const { courseId } = useParams();

  const [quizzes,    setQuizzes]    = useState([]);
  const [selected,   setSelected]   = useState(null);
  const [attempts,   setAttempts]   = useState([]);
  const [attempt,    setAttempt]    = useState(null);
  const [quizDetail, setQuizDetail] = useState(null);
  const [answers,    setAnswers]    = useState({});
  const [result,     setResult]     = useState(null);
  const [screen,     setScreen]     = useState(SCREEN.LIST);
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState('');

  // ── Load quiz list ──────────────────────────────────────────────────────
  const loadQuizzes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getQuizzesByCourse(courseId);
      setQuizzes(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load quizzes.');
    } finally { setLoading(false); }
  }, [courseId]);

  useEffect(() => { loadQuizzes(); }, [loadQuizzes]);

  // ── Select quiz ─────────────────────────────────────────────────────────
  const handleSelectQuiz = async (quiz) => {
    setSelected(quiz);
    setError('');
    try {
      const { data } = await getMyAttempts(quiz._id);
      setAttempts(data.data);
    } catch { setAttempts([]); }
    setScreen(SCREEN.CONFIRM);
  };

  // ── Start attempt ───────────────────────────────────────────────────────
  const handleStart = async () => {
    setError('');
    try {
      const [attemptRes, quizRes] = await Promise.all([
        startAttempt(selected._id),
        getQuizById(selected._id),
      ]);
      setAttempt(attemptRes.data.data);
      setQuizDetail(quizRes.data.data);
      setAnswers({});
      setScreen(SCREEN.ACTIVE);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not start quiz.');
    }
  };

  // ── Answer change ───────────────────────────────────────────────────────
  const handleAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  // ── Submit attempt ──────────────────────────────────────────────────────
  const handleSubmit = async (timedOut = false) => {
    if (submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        answers: Object.entries(answers).map(([questionId, givenAnswer]) => ({
          questionId,
          givenAnswer,
        })),
      };
      const { data } = await submitAttempt(selected._id, attempt._id, payload);
      setResult(data.data);
      setScreen(SCREEN.RESULT);
      if (timedOut) setError('Time ran out — your answers were auto-submitted.');
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed.');
    } finally { setSubmitting(false); }
  };

  const handleBack = () => {
    setSelected(null); setAttempt(null);
    setQuizDetail(null); setResult(null);
    setAnswers({}); setError('');
    setScreen(SCREEN.LIST);
  };

  const answeredCount = Object.keys(answers).length;

  if (loading) return <div className="page-loading">Loading quizzes...</div>;

  // ── LIST ────────────────────────────────────────────────────────────────
  if (screen === SCREEN.LIST) return (
    <div style={{ background: '#fff', minHeight: '100vh', padding: 32 }}>
      <div style={{ background: '#1E293B', borderRadius: 18, padding: 24, marginBottom: 32 }}>
        <h1 style={{ color: '#fff', fontWeight: 700, fontSize: 28 }}>Quiz</h1>
      </div>
      {error && <div className="page-error">{error}</div>}
      {quizzes.length === 0 && <div className="empty-state">No quizzes available yet.</div>}
      <div className="quiz-list">
        {quizzes.map((q) => (
          <div key={q._id} className="quiz-list__item" onClick={() => handleSelectQuiz(q)}>
            <div className="quiz-list__info">
              <h3>{q.title}</h3>
              <p>{q.description}</p>
            </div>
            <div className="quiz-list__meta">
              <span>⏱ {q.timeLimitMinutes ? `${q.timeLimitMinutes} min` : 'No limit'}</span>
              <span>🔁 {q.maxAttempts === -1 ? 'Unlimited' : `${q.maxAttempts} attempts`}</span>
              <span>🎯 Pass: {q.passMark}%</span>
            </div>
            <span className="quiz-list__arrow">→</span>
          </div>
        ))}
      </div>
    </div>
  );

  // ── CONFIRM ─────────────────────────────────────────────────────────────
  if (screen === SCREEN.CONFIRM) return (
    <div style={{ background: '#fff', minHeight: '100vh', padding: 32 }}>
      <div style={{ background: '#1E293B', borderRadius: 18, padding: 24, marginBottom: 32 }}>
        <h1 style={{ color: '#fff', fontWeight: 700, fontSize: 28 }}>Quiz</h1>
      </div>
      <button className="btn btn--ghost" onClick={handleBack}>← Back to Quizzes</button>
      <div className="quiz-confirm">
        <h2>{selected.title}</h2>
        {selected.description && <p>{selected.description}</p>}
        <div className="quiz-confirm__rules">
          <div className="rule-item">
            <span>⏱ Time Limit</span>
            <strong>{selected.timeLimitMinutes ? `${selected.timeLimitMinutes} minutes` : 'None'}</strong>
          </div>
          <div className="rule-item">
            <span>🔁 Max Attempts</span>
            <strong>{selected.maxAttempts === -1 ? 'Unlimited' : selected.maxAttempts}</strong>
          </div>
          <div className="rule-item">
            <span>🎯 Pass Mark</span>
            <strong>{selected.passMark}%</strong>
          </div>
          <div className="rule-item">
            <span>📝 Questions</span>
            <strong>{selected.questions?.length ?? '—'}</strong>
          </div>
          <div className="rule-item">
            <span>✅ Attempts Used</span>
            <strong>{attempts.length}</strong>
          </div>
        </div>
        {error && <div className="page-error">{error}</div>}
        <AttemptHistory attempts={attempts} />
        <button className="btn btn--primary btn--large" onClick={handleStart}>
          {attempts.length > 0 ? 'Retake Quiz' : 'Start Quiz'} →
        </button>
      </div>
    </div>
  );

  // ── ACTIVE ──────────────────────────────────────────────────────────────
  if (screen === SCREEN.ACTIVE && quizDetail) return (
    <div style={{ background: '#fff', minHeight: '100vh', padding: 32 }}>
      <div style={{ background: '#1E293B', borderRadius: 18, padding: 24, marginBottom: 32 }}>
        <h1 style={{ color: '#fff', fontWeight: 700, fontSize: 28 }}>Quiz</h1>
      </div>
      <div className="quiz-active">
        <div className="quiz-active__topbar">
          <span className="quiz-active__title">{quizDetail.title}</span>
          <span className="quiz-active__progress">
            {answeredCount} / {quizDetail.questions.length} answered
          </span>
          {quizDetail.timeLimitMinutes && (
            <QuizTimer
              timeLimitMinutes={quizDetail.timeLimitMinutes}
              startedAt={attempt.startedAt}
              onTimeUp={() => handleSubmit(true)}
            />
          )}
        </div>

        <div className="quiz-active__body">
          {quizDetail.questions.map((q, i) => (
            <QuizQuestion
              key={q._id}
              question={q}
              index={i}
              total={quizDetail.questions.length}
              answer={answers[q._id] || ''}
              onChange={(val) => handleAnswer(q._id, val)}
            />
          ))}
        </div>

        {error && <div className="page-error" style={{ margin: '0 2rem' }}>{error}</div>}

        <div className="quiz-active__footer">
          <span>{quizDetail.questions.length - answeredCount} questions unanswered</span>
          <button
            className="btn btn--primary"
            onClick={() => handleSubmit(false)}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        </div>
      </div>
    </div>
  );

  // ── RESULT ──────────────────────────────────────────────────────────────
  if (screen === SCREEN.RESULT && result) return (
    <div style={{ background: '#fff', minHeight: '100vh', padding: 32 }}>
      <div style={{ background: '#1E293B', borderRadius: 18, padding: 24, marginBottom: 32 }}>
        <h1 style={{ color: '#fff', fontWeight: 700, fontSize: 28 }}>Quiz</h1>
      </div>
      <div className={`quiz-result ${result.isPassed ? 'quiz-result--pass' : 'quiz-result--fail'}`}>
        <div className="quiz-result__icon">{result.isPassed ? '🎉' : '😔'}</div>
        <h2>{result.isPassed ? 'You Passed!' : 'Not Quite'}</h2>
        <div className="quiz-result__score">{result.percentage}%</div>
        <p>{result.totalMarksAwarded} out of {result.totalMarks} marks</p>
        <p>Pass mark: {result.passMark}% · Attempt #{result.attemptNumber}</p>

        <div className="quiz-result__breakdown">
          {result.answers?.map((a, i) => (
            <div
              key={i}
              className={`result-answer ${a.isCorrect ? 'result-answer--correct' : 'result-answer--wrong'}`}
            >
              <span>Q{i + 1}</span>
              <span>{a.isCorrect ? '✅' : '❌'}</span>
              <span>{a.marksAwarded} mark{a.marksAwarded !== 1 ? 's' : ''}</span>
            </div>
          ))}
        </div>

        <div className="quiz-result__actions">
          <button className="btn btn--ghost" onClick={handleBack}>Back to Quizzes</button>
          {!result.isPassed && (
            <button
              className="btn btn--primary"
              onClick={() => { setScreen(SCREEN.CONFIRM); setResult(null); }}
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return null;
}