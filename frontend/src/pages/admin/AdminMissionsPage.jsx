import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  getMissionsByCourse, createMission, updateMission,
  deleteMission, toggleMissionPublish,
  getAllSubmissions, gradeSubmission,
} from '../../api/missionService';

const EMPTY_FORM = {
  title: '', description: '', instructions: '',
  submissionType: 'text', options: ['', '', '', ''],
  correctOption: 0, maxScore: 100, order: 0,
};

export default function AdminMissionsPage() {
  const { courseId } = useParams();

  const [missions,        setMissions]        = useState([]);
  const [form,            setForm]            = useState(EMPTY_FORM);
  const [editing,         setEditing]         = useState(null);
  const [submissions,     setSubmissions]     = useState([]);
  const [gradingMission,  setGradingMission]  = useState(null);
  const [gradeForm,       setGradeForm]       = useState({});
  const [showForm,        setShowForm]        = useState(false);
  const [loading,         setLoading]         = useState(true);
  const [saving,          setSaving]          = useState(false);
  const [error,           setError]           = useState('');
  const [success,         setSuccess]         = useState('');

  const flash = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getMissionsByCourse(courseId);
      setMissions(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load missions.');
    } finally { setLoading(false); }
  }, [courseId]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      const payload = { ...form, course: courseId };
      if (form.submissionType !== 'multiple_choice') {
        delete payload.options; delete payload.correctOption;
      }
      if (editing) { await updateMission(editing._id, payload); flash('Mission updated.'); }
      else         { await createMission(payload);               flash('Mission created.'); }
      setShowForm(false); setEditing(null); setForm(EMPTY_FORM); load();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed.');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this mission?')) return;
    try { await deleteMission(id); flash('Mission deleted.'); load(); }
    catch (err) { setError(err.response?.data?.message || 'Delete failed.'); }
  };

  const handleTogglePublish = async (id) => {
    try { await toggleMissionPublish(id); load(); }
    catch (err) { setError(err.response?.data?.message || 'Toggle failed.'); }
  };

  const openGrading = async (mission) => {
    setGradingMission(mission);
    try {
      const { data } = await getAllSubmissions(mission._id);
      setSubmissions(data.data);
      const gf = {};
      data.data.forEach((s) => {
        gf[s._id] = { score: s.score ?? '', feedback: s.feedback ?? '' };
      });
      setGradeForm(gf);
    } catch { setSubmissions([]); }
  };

  const handleGrade = async (subId) => {
    try {
      await gradeSubmission(subId, gradeForm[subId]);
      flash('Graded successfully.');
      openGrading(gradingMission);
    } catch (err) {
      setError(err.response?.data?.message || 'Grade failed.');
    }
  };

  const startEdit = (m) => {
    setEditing(m);
    setForm({
      title: m.title, description: m.description,
      instructions: m.instructions, submissionType: m.submissionType,
      options: m.options?.length ? m.options : ['', '', '', ''],
      correctOption: m.correctOption ?? 0,
      maxScore: m.maxScore, order: m.order,
    });
    setShowForm(true);
  };

  if (loading) return <div className="page-loading">Loading...</div>;

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1>Manage Missions</h1>
        <button className="btn btn--primary"
          onClick={() => { setEditing(null); setForm(EMPTY_FORM); setShowForm(true); }}>
          + New Mission
        </button>
      </div>

      {error   && <div className="page-error">{error}</div>}
      {success && <div className="page-success">{success}</div>}

      {/* Mission List */}
      <div className="admin-list">
        {missions.length === 0 && <div className="empty-state">No missions yet.</div>}
        {missions.map((m) => (
          <div key={m._id} className="admin-list__item">
            <div className="admin-list__info">
              <h3>{m.title}</h3>
              <span className="badge badge--type">{m.submissionType.replace('_', ' ')}</span>
              <span className={`badge ${m.isPublished ? 'badge--green' : 'badge--dim'}`}>
                {m.isPublished ? 'Published' : 'Draft'}
              </span>
              <span className="badge badge--dim">Max: {m.maxScore} pts</span>
            </div>
            <div className="admin-list__actions">
              <button className="btn btn--sm btn--ghost" onClick={() => openGrading(m)}>
                📋 Submissions
              </button>
              <button className="btn btn--sm btn--ghost" onClick={() => handleTogglePublish(m._id)}>
                {m.isPublished ? '🔒 Unpublish' : '🌐 Publish'}
              </button>
              <button className="btn btn--sm btn--ghost" onClick={() => startEdit(m)}>✏️ Edit</button>
              <button className="btn btn--sm btn--danger" onClick={() => handleDelete(m._id)}>🗑 Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Form Panel */}
      {showForm && (
        <div className="panel-overlay" onClick={() => setShowForm(false)}>
          <div className="panel panel--wide" onClick={(e) => e.stopPropagation()}>
            <button className="panel__close" onClick={() => setShowForm(false)}>✕</button>
            <h2>{editing ? 'Edit Mission' : 'New Mission'}</h2>
            <div className="form-grid">
              <div className="form-field">
                <label>Title *</label>
                <input value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="form-field">
                <label>Submission Type *</label>
                <select value={form.submissionType}
                  onChange={(e) => setForm({ ...form, submissionType: e.target.value })}>
                  <option value="text">Text</option>
                  <option value="file">File</option>
                  <option value="url">URL</option>
                  <option value="multiple_choice">Multiple Choice</option>
                </select>
              </div>
              <div className="form-field form-field--full">
                <label>Description *</label>
                <textarea value={form.description} rows={2}
                  onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="form-field form-field--full">
                <label>Instructions *</label>
                <textarea value={form.instructions} rows={3}
                  onChange={(e) => setForm({ ...form, instructions: e.target.value })} />
              </div>
              <div className="form-field">
                <label>Max Score</label>
                <input type="number" value={form.maxScore}
                  onChange={(e) => setForm({ ...form, maxScore: +e.target.value })} />
              </div>
              <div className="form-field">
                <label>Order</label>
                <input type="number" value={form.order}
                  onChange={(e) => setForm({ ...form, order: +e.target.value })} />
              </div>
              {form.submissionType === 'multiple_choice' && (
                <>
                  {form.options.map((opt, i) => (
                    <div key={i} className="form-field">
                      <label>Option {i + 1}</label>
                      <input value={opt} onChange={(e) => {
                        const opts = [...form.options]; opts[i] = e.target.value;
                        setForm({ ...form, options: opts });
                      }} />
                    </div>
                  ))}
                  <div className="form-field">
                    <label>Correct Option (0-indexed)</label>
                    <input type="number" min={0} max={3} value={form.correctOption}
                      onChange={(e) => setForm({ ...form, correctOption: +e.target.value })} />
                  </div>
                </>
              )}
            </div>
            {error && <div className="page-error">{error}</div>}
            <div className="form-actions">
              <button className="btn btn--ghost" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn btn--primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editing ? 'Update Mission' : 'Create Mission'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grading Panel */}
      {gradingMission && (
        <div className="panel-overlay" onClick={() => setGradingMission(null)}>
          <div className="panel panel--wide" onClick={(e) => e.stopPropagation()}>
            <button className="panel__close" onClick={() => setGradingMission(null)}>✕</button>
            <h2>Submissions — {gradingMission.title}</h2>
            <p className="panel__sub">{submissions.length} submission{submissions.length !== 1 ? 's' : ''}</p>
            {submissions.length === 0 && <div className="empty-state">No submissions yet.</div>}
            {submissions.map((sub) => (
              <div key={sub._id} className="grade-item">
                <div className="grade-item__student">
                  <strong>{sub.student?.name || 'Student'}</strong>
                  <span>{sub.student?.email}</span>
                  <span className={`badge ${sub.status === 'graded' ? 'badge--green' : 'badge--blue'}`}>
                    {sub.status}
                  </span>
                </div>
                {sub.responseText && (
                  <div className="grade-item__response">
                    <label>Response:</label><p>{sub.responseText}</p>
                  </div>
                )}
                {sub.responseUrl && (
                  <div className="grade-item__response">
                    <label>URL:</label>
                    <a href={sub.responseUrl} target="_blank" rel="noreferrer">{sub.responseUrl}</a>
                  </div>
                )}
                {sub.selectedOption !== null && (
                  <div className="grade-item__response">
                    <label>Selected Option:</label>
                    <p>{gradingMission.options?.[sub.selectedOption]}</p>
                  </div>
                )}
                {sub.status !== 'graded' ? (
                  <div className="grade-item__form">
                    <input type="number" placeholder="Score"
                      min={0} max={gradingMission.maxScore}
                      value={gradeForm[sub._id]?.score || ''}
                      onChange={(e) => setGradeForm({
                        ...gradeForm, [sub._id]: { ...gradeForm[sub._id], score: +e.target.value }
                      })} />
                    <input placeholder="Feedback (optional)"
                      value={gradeForm[sub._id]?.feedback || ''}
                      onChange={(e) => setGradeForm({
                        ...gradeForm, [sub._id]: { ...gradeForm[sub._id], feedback: e.target.value }
                      })} />
                    <button className="btn btn--primary btn--sm" onClick={() => handleGrade(sub._id)}>
                      Grade
                    </button>
                  </div>
                ) : (
                  <div className="grade-item__result">
                    Score: <strong>{sub.score} / {gradingMission.maxScore}</strong>
                    {sub.feedback && <span> · {sub.feedback}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}