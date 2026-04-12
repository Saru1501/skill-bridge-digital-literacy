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

  if (loading) return <div className="page-loading">Loading performance...</div>;
  if (error)   return <div className="page-error">{error}</div>;

  const allPassed = data.length > 0 && data.every((d) => d.isPassed);

  return (
    <div className="performance-page">
      <div className="performance-page__header">
        <h1>My Performance</h1>
        <p>Your best scores across all course quizzes</p>
      </div>
      {allPassed && (
        <div className="performance-page__banner">
          🎓 You've passed all assessments in this course! Certificate may now be available.
        </div>
      )}
      <PerformanceSummary data={data} />
    </div>
  );
}