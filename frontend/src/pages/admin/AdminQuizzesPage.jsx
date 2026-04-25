import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  getQuizzesByCourse, createQuiz, updateQuiz,
  deleteQuiz, toggleQuizPublish, getAllAttempts,
} from '../../api/quizService';
import { getMissionsByCourse } from '../../api/missionService';

const EMPTY_QUESTION = {
  questionText: '', questionType: 'multiple_choice',
  options: ['', '', '', ''], correctAnswer: '0', marks: 1,
};
const EMPTY_FORM = {
  title: '', description: '', passMark: 50,
  timeLimitMinutes: '', maxAttempts: 3,
  unlockAfterMission: '', questions: [],
};

export default function AdminQuizzesPage() {
  const { courseId } = useParams();

  const [quizzes,         setQuizzes]         = useState([]);
  const [missions,        setMissions]        = useState([]);
  const [form,            setForm]            = useState(EMPTY_FORM);
  const [editing,         setEditing]         = useState(null);
  const [attempts,        setAttempts]        = useState([]);
  const [viewingAttempts, setViewingAttempts] = useState(null);
  const [showForm,        setShowForm]        = useState(false);
  const [loading,         setLoading]         = useState(true);
  const [saving,          setSaving]          = useState(false);
  const [error,           setError]           = useState('');
  const [success,         setSuccess]         = useState('');

  const flash = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [qRes, mRes] = await Promise.all([
        getQuizzesByCourse(courseId),
        getMissionsByCourse(courseId),
      ]);
      setQuizzes(qRes.data.data);
      setMissions(mRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load.');
    } finally { setLoading(false); }
  }, [courseId]);

  useEffect(() => { load(); }, [load]);

  const addQuestion = () =>
    setForm({ ...form, questions: [...form.questions, { ...EMPTY_QUESTION, options: ['', '', '', ''] }] });

  const updateQuestion = (i, field, value) => {
    const qs = [...form.questions];
    qs[i] = { ...qs[i], [field]: value };
    setForm({ ...form, questions: qs });
  };

  const updateOption = (qi, oi, value) => {
    const qs = [...form.questions];
    const opts = [...qs[qi].options]; opts[oi] = value;
    qs[qi] = { ...qs[qi], options: opts };
    setForm({ ...form, questions: qs });
  };

  const removeQuestion = (i) =>
    setForm({ ...form, questions: form.questions.filter((_, idx) => idx !== i) });

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      const payload = {
        ...form, course: courseId,
        timeLimitMinutes: form.timeLimitMinutes ? +form.timeLimitMinutes : null,
        maxAttempts: +form.maxAttempts,
        unlockAfterMission: form.unlockAfterMission || null,
      };
      if (editing) { await updateQuiz(editing._id, payload); flash('Quiz updated.'); }
      else         { await createQuiz(payload);               flash('Quiz created.'); }
      setShowForm(false); setEditing(null); setForm(EMPTY_FORM); load();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed.');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this quiz?')) return;
    try { await deleteQuiz(id); flash('Quiz deleted.'); load(); }
    catch (err) { setError(err.response?.data?.message || 'Delete failed.'); }
  };

  const handleToggle = async (id) => {
    try { await toggleQuizPublish(id); load(); }
    catch (err) { setError(err.response?.data?.message || 'Toggle failed.'); }
  };

  const openAttempts = async (quiz) => {
    setViewingAttempts(quiz);
    try {
      const { data } = await getAllAttempts(quiz._id);
      setAttempts(data.data);
    } catch { setAttempts([]); }
  };

  const startEdit = (q) => {
    setEditing(q);
    setForm({
      title: q.title, description: q.description || '',
      passMark: q.passMark, timeLimitMinutes: q.timeLimitMinutes || '',
      maxAttempts: q.maxAttempts, unlockAfterMission: q.unlockAfterMission || '',
      questions: q.questions?.map((qq) => ({
        questionText: qq.questionText, questionType: qq.questionType,
        options: qq.options?.length ? qq.options : ['', '', '', ''],
        correctAnswer: qq.correctAnswer, marks: qq.marks,
      })) || [],
    });
    setShowForm(true);
  };

  if (loading) return <div className="page-loading">Loading...</div>;

  return (
    <div style={{ background: '#fff', minHeight: '100vh', padding: 32 }}>
      <div style={{ background: '#1E293B', borderRadius: 18, padding: 24, marginBottom: 32 }}>
        <h1 style={{ color: '#fff', fontWeight: 700, fontSize: 28 }}>Admin Quizzes</h1>
      </div>

      {error   && <div className="page-error">{error}</div>}
      {success && <div className="page-success">{success}</div>}

      {/* Quiz List */}
      <div className="admin-list">
        {quizzes.length === 0 && <div className="empty-state">No quizzes yet.</div>}
        {quizzes.map((q) => (
          <div key={q._id} className="admin-list__item">
            <div className="admin-list__info">
              <h3>{q.title}</h3>
              <span className={`badge ${q.isPublished ? 'badge--green' : 'badge--dim'}`}>
                {q.isPublished ? 'Published' : 'Draft'}
              </span>
              <span className="badge badge--dim">Pass: {q.passMark}%</span>
              <span className="badge badge--dim">{q.questions?.length || 0} Qs</span>
              <span className="badge badge--dim">
                {q.timeLimitMinutes ? `${q.timeLimitMinutes} min` : 'No limit'}
              </span>
              <span className="badge badge--dim">
                {q.maxAttempts === -1 ? 'Unlimited' : `${q.maxAttempts} attempts`}
              </span>
            </div>
            <div className="admin-list__actions">
              <button className="btn btn--sm btn--ghost" onClick={() => openAttempts(q)}>
                📊 Attempts
              </button>
              <button className="btn btn--sm btn--ghost" onClick={() => handleToggle(q._id)}>
                {q.isPublished ? '🔒 Unpublish' : '🌐 Publish'}
              </button>
              <button className="btn btn--sm btn--ghost" onClick={() => startEdit(q)}>✏️ Edit</button>
              <button className="btn btn--sm btn--danger" onClick={() => handleDelete(q._id)}>
                🗑 Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Form Panel */}
      {showForm && (
        <div className="panel-overlay" onClick={() => setShowForm(false)}>
          <div className="panel panel--wide" onClick={(e) => e.stopPropagation()}>
            <button className="panel__close" onClick={() => setShowForm(false)}>✕</button>
            <h2>{editing ? 'Edit Quiz' : 'New Quiz'}</h2>
            <div className="form-grid">
              <div className="form-field form-field--full">
                <label>Title *</label>
                <input value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="form-field form-field--full">
                <label>Description</label>
                <textarea value={form.description} rows={2}
                  onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="form-field">
                <label>Pass Mark (%)</label>
                <input type="number" min={0} max={100} value={form.passMark}
                  onChange={(e) => setForm({ ...form, passMark: +e.target.value })} />
              </div>
              <div className="form-field">
                <label>Time Limit (minutes) — blank = none</label>
                <input type="number" min={1} value={form.timeLimitMinutes}
                  onChange={(e) => setForm({ ...form, timeLimitMinutes: e.target.value })} />
              </div>
              <div className="form-field">
                <label>Max Attempts (-1 = unlimited)</label>
                <input type="number" min={-1} value={form.maxAttempts}
                  onChange={(e) => setForm({ ...form, maxAttempts: e.target.value })} />
              </div>
              <div className="form-field">
                <label>Unlock After Mission (optional)</label>
                <select value={form.unlockAfterMission}
                  onChange={(e) => setForm({ ...form, unlockAfterMission: e.target.value })}>
                  <option value="">— No condition —</option>
                  {missions.map((m) => (
                    <option key={m._id} value={m._id}>{m.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Questions */}
            <div className="questions-section">
              <div className="questions-section__header">
                <h3>Questions ({form.questions.length})</h3>
                <button className="btn btn--ghost btn--sm" onClick={addQuestion}>
                  + Add Question
                </button>
              </div>
              {form.questions.map((q, qi) => (
                <div key={qi} className="question-editor">
                  <div className="question-editor__header">
                    <span>Q{qi + 1}</span>
                    <button className="btn btn--danger btn--sm" onClick={() => removeQuestion(qi)}>
                      Remove
                    </button>
                  </div>
                  <div className="form-grid">
                    <div className="form-field form-field--full">
                      <label>Question Text *</label>
                      <input value={q.questionText}
                        onChange={(e) => updateQuestion(qi, 'questionText', e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label>Type</label>
                      <select value={q.questionType}
                        onChange={(e) => updateQuestion(qi, 'questionType', e.target.value)}>
                        <option value="multiple_choice">Multiple Choice</option>
                        <option value="true_false">True / False</option>
                        <option value="short_answer">Short Answer</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <label>Marks</label>
                      <input type="number" min={1} value={q.marks}
                        onChange={(e) => updateQuestion(qi, 'marks', +e.target.value)} />
                    </div>
                    {q.questionType === 'multiple_choice' && q.options.map((opt, oi) => (
                      <div key={oi} className="form-field">
                        <label>Option {oi + 1}</label>
                        <input value={opt}
                          onChange={(e) => updateOption(qi, oi, e.target.value)} />
                      </div>
                    ))}
                    {q.questionType !== 'short_answer' && (
                      <div className="form-field">
                        <label>
                          Correct Answer {q.questionType === 'multiple_choice' ? '(0-indexed)' : '(true/false)'}
                        </label>
                        <input value={q.correctAnswer}
                          onChange={(e) => updateQuestion(qi, 'correctAnswer', e.target.value)} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {error && <div className="page-error">{error}</div>}
            <div className="form-actions">
              <button className="btn btn--ghost" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn btn--primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editing ? 'Update Quiz' : 'Create Quiz'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attempts Panel */}
      {viewingAttempts && (
        <div className="panel-overlay" onClick={() => setViewingAttempts(null)}>
          <div className="panel panel--wide" onClick={(e) => e.stopPropagation()}>
            <button className="panel__close" onClick={() => setViewingAttempts(null)}>✕</button>
            <h2>Attempts — {viewingAttempts.title}</h2>
            <p className="panel__sub">
              {attempts.length} total attempt{attempts.length !== 1 ? 's' : ''}
            </p>
            {attempts.length === 0 && <div className="empty-state">No attempts yet.</div>}
            <div className="attempts-table">
              {attempts.map((a) => (
                <div key={a._id}
                  className={`attempt-row ${a.isPassed ? 'attempt-row--pass' : 'attempt-row--fail'}`}>
                  <span>{a.student?.name || '—'}</span>
                  <span>{a.student?.email || '—'}</span>
                  <span>Attempt #{a.attemptNumber}</span>
                  <span>{a.totalMarksAwarded} / {viewingAttempts.totalMarks} marks</span>
                  <span>{a.percentage}%</span>
                  <span>{a.isPassed ? '✅ Passed' : '❌ Failed'}</span>
                  <span>{a.submittedAt ? new Date(a.submittedAt).toLocaleDateString() : '—'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}