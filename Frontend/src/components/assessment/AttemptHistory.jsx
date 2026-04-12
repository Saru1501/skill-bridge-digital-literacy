import React from 'react';

export default function AttemptHistory({ attempts }) {
  if (!attempts?.length) return (
    <div className="attempt-history attempt-history--empty">No attempts yet.</div>
  );

  return (
    <div className="attempt-history">
      <h4>Attempt History</h4>
      <div className="attempt-history__list">
        {attempts.map((a) => (
          <div
            key={a._id}
            className={`attempt-row ${a.isPassed ? 'attempt-row--pass' : 'attempt-row--fail'}`}
          >
            <span className="attempt-row__num">Attempt #{a.attemptNumber}</span>
            <span className="attempt-row__score">
              {a.totalMarksAwarded} / {a.quiz?.totalMarks ?? '?'} marks
            </span>
            <span className="attempt-row__pct">{a.percentage}%</span>
            <span className="attempt-row__badge">
              {a.isPassed ? '✅ Passed' : '❌ Failed'}
            </span>
            <span className="attempt-row__date">
              {a.submittedAt ? new Date(a.submittedAt).toLocaleDateString() : '—'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}