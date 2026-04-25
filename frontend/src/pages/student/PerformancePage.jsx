import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCoursePerformance } from '../../api/quizService';
import PerformanceSummary from '../../components/assessment/PerformanceSummary';

export default function PerformancePage() {
  const { courseId }          = useParams();
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data: res } = await getCoursePerformance(courseId);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load performance data.');
      } finally { setLoading(false); }
    })();
  }, [courseId]);

  if (loading) return <div style={{ background: '#fff', minHeight: '100vh', padding: 32 }}>
    <div style={{ background: '#1E293B', borderRadius: 18, padding: 24, marginBottom: 32 }}>
      <h1 style={{ color: '#fff', fontWeight: 700, fontSize: 28 }}>Performance</h1>
    </div>
    <div className="page-loading">Loading performance...</div>
  </div>;
  if (error)   return <div style={{ background: '#fff', minHeight: '100vh', padding: 32 }}>
    <div style={{ background: '#1E293B', borderRadius: 18, padding: 24, marginBottom: 32 }}>
      <h1 style={{ color: '#fff', fontWeight: 700, fontSize: 28 }}>Performance</h1>
    </div>
    <div className="page-error">{error}</div>
  </div>;

  const allPassed = data.length > 0 && data.every((d) => d.isPassed);

  return (
    <div style={{ background: '#fff', minHeight: '100vh', padding: 32 }}>
      <div style={{ background: '#1E293B', borderRadius: 18, padding: 24, marginBottom: 32 }}>
        <h1 style={{ color: '#fff', fontWeight: 700, fontSize: 28 }}>Performance</h1>
      </div>
      {allPassed && (
        <div style={{ background: '#fff', borderRadius: 18, padding: 24, marginBottom: 32 }}>
          🎓 You've passed all assessments in this course! Certificate may now be available.
        </div>
      )}
      <PerformanceSummary data={data} />
    </div>
  );
}