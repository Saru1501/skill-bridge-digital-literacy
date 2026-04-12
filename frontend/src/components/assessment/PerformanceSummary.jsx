import React from 'react';

export default function PerformanceSummary({ data }) {
  if (!data?.length) return (
    <div className="perf-summary perf-summary--empty">No quiz performance data yet.</div>
  );

  const totalPassed = data.filter((d) => d.isPassed).length;
  const overallAvg  = (data.reduce((s, d) => s + d.bestPercentage, 0) / data.length).toFixed(1);
  const allPassed   = totalPassed === data.length;

  return (
    <div className="perf-summary">
      <div className="perf-summary__header">
        <div className="perf-summary__stat">
          <span>Quizzes Passed</span>
          <strong style={{ color: '#2EA043' }}>{totalPassed} / {data.length}</strong>
        </div>
        <div className="perf-summary__stat">
          <span>Average Score</span>
          <strong>{overallAvg}%</strong>
        </div>
        <div className="perf-summary__stat">
          <span>Assessment Status</span>
          <strong style={{ color: allPassed ? '#2EA043' : '#D29922' }}>
            {allPassed ? '🎓 Complete' : '⏳ In Progress'}
          </strong>
        </div>
      </div>

      <div className="perf-summary__list">
        {data.map((item) => (
          <div key={item.quizId} className="perf-row">
            <span className="perf-row__title">{item.quizTitle}</span>
            <div className="perf-row__bar-wrap">
              <div
                className="perf-row__bar"
                style={{
                  width: `${item.bestPercentage}%`,
                  background: item.isPassed ? '#2EA043' : '#DA3633',
                }}
              />
            </div>
            <span className="perf-row__pct">{item.bestPercentage}%</span>
            <span className={`perf-row__status ${item.isPassed ? 'pass' : 'fail'}`}>
              {item.isPassed ? 'Passed' : 'Failed'}
            </span>
            <span className="perf-row__attempts">
              {item.totalAttempts} attempt{item.totalAttempts !== 1 ? 's' : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}