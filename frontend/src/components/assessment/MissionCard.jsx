import React from 'react';

const statusMeta = {
  submitted:   { label: 'Submitted',    color: '#388BFD', bg: 'rgba(56,139,253,0.12)'  },
  graded:      { label: 'Graded',       color: '#2EA043', bg: 'rgba(46,160,67,0.12)'   },
  resubmitted: { label: 'Resubmitted',  color: '#D29922', bg: 'rgba(210,153,34,0.12)'  },
};

const typeIcon = {
  text:            '✏️',
  file:            '📎',
  url:             '🔗',
  multiple_choice: '🔘',
};

export default function MissionCard({ mission, submission, onOpen }) {
  const meta = submission ? statusMeta[submission.status] : null;

  return (
    <div className="mission-card" onClick={() => onOpen(mission)}>
      <div className="mission-card__header">
        <span className="mission-card__icon">{typeIcon[mission.submissionType] || '📋'}</span>
        <div className="mission-card__meta">
          <span className="mission-card__type">{mission.submissionType.replace('_', ' ')}</span>
          <span className="mission-card__score">Max: {mission.maxScore} pts</span>
        </div>
        {meta && (
          <span className="mission-card__status" style={{ color: meta.color, background: meta.bg }}>
            {meta.label}
          </span>
        )}
        {!submission && (
          <span className="mission-card__status mission-card__status--pending">Not Started</span>
        )}
      </div>

      <h3 className="mission-card__title">{mission.title}</h3>
      <p className="mission-card__desc">{mission.description}</p>

      {submission?.score !== null && submission?.score !== undefined && (
        <div className="mission-card__result">
          <span>Score</span>
          <strong style={{ color: '#2EA043' }}>{submission.score} / {mission.maxScore}</strong>
        </div>
      )}

      {submission?.feedback && (
        <div className="mission-card__feedback">
          <span>💬 Feedback:</span> {submission.feedback}
        </div>
      )}

      <div className="mission-card__cta">
        {!submission
          ? 'Start Mission →'
          : submission.status === 'graded'
          ? 'View Result →'
          : 'View Submission →'}
      </div>
    </div>
  );
}