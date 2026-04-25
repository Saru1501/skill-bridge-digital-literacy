import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getMissionsByCourse, getMySubmission } from '../../api/missionService';
import MissionCard       from '../../components/assessment/MissionCard';
import MissionSubmitForm from '../../components/assessment/MissionSubmitForm';

export default function MissionsPage() {
  const { courseId } = useParams();

  const [missions,    setMissions]    = useState([]);
  const [submissions, setSubmissions] = useState({});  // missionId → submission
  const [selected,    setSelected]    = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getMissionsByCourse(courseId);
      const list = data.data;
      setMissions(list);

      // fetch each student's own submission in parallel
      const results = await Promise.allSettled(
        list.map((m) => getMySubmission(m._id))
      );
      const subMap = {};
      results.forEach((r, i) => {
        if (r.status === 'fulfilled' && r.value.data.data) {
          subMap[list[i]._id] = r.value.data.data;
        }
      });
      setSubmissions(subMap);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load missions.');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => { load(); }, [load]);

  const handleSubmissionSuccess = (newSub) => {
    setSubmissions((prev) => ({ ...prev, [newSub.mission]: newSub }));
    setSelected((prev) => prev ? { ...prev, submission: newSub } : prev);
  };

  const completed = Object.values(submissions).filter((s) => s.isCompleted).length;
  const submitted = Object.values(submissions).filter((s) => !s.isCompleted).length;

  if (loading) return <div className="page-loading">Loading missions...</div>;
  if (error)   return <div className="page-error">{error}</div>;

  return (
    <div style={{ background: '#fff', minHeight: '100vh', padding: 32 }}>
      <div style={{ background: '#1E293B', borderRadius: 18, padding: 24, marginBottom: 32 }}>
        <h1 style={{ color: '#fff', fontWeight: 700, fontSize: 28 }}>Missions</h1>
      </div>

      {/* Header */}
      <div className="missions-page__header">
        <div>
          <h1>Practice Missions</h1>
          <p className="missions-page__sub">Complete missions to unlock quizzes</p>
        </div>
        <div className="missions-page__stats">
          <div className="stat-chip stat-chip--green">{completed} Completed</div>
          <div className="stat-chip stat-chip--blue">{submitted} Pending Review</div>
          <div className="stat-chip stat-chip--dim">
            {missions.length - completed - submitted} Not Started
          </div>
        </div>
      </div>

      {missions.length === 0 && (
        <div className="empty-state">No missions available for this course yet.</div>
      )}

      {/* Mission Grid */}
      <div className="missions-grid">
        {missions.map((m) => (
          <MissionCard
            key={m._id}
            mission={m}
            submission={submissions[m._id]}
            onOpen={(mission) =>
              setSelected({ mission, submission: submissions[mission._id] })
            }
          />
        ))}
      </div>

      {/* Slide-over Detail Panel */}
      {selected && (
        <div className="panel-overlay" onClick={() => setSelected(null)}>
          <div className="panel" onClick={(e) => e.stopPropagation()}>
            <button className="panel__close" onClick={() => setSelected(null)}>✕</button>
            <div className="panel__header">
              <h2>{selected.mission.title}</h2>
              <span className="panel__type">
                {selected.mission.submissionType.replace('_', ' ')}
              </span>
            </div>
            <MissionSubmitForm
              mission={selected.mission}
              existingSubmission={selected.submission}
              onSuccess={handleSubmissionSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
}