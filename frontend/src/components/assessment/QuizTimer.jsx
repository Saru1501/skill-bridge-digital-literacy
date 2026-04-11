import React, { useEffect, useState, useCallback } from 'react';

export default function QuizTimer({ timeLimitMinutes, startedAt, onTimeUp }) {
  const calcRemaining = useCallback(() => {
    const elapsed = (Date.now() - new Date(startedAt).getTime()) / 1000;
    return Math.max(0, timeLimitMinutes * 60 - elapsed);
  }, [timeLimitMinutes, startedAt]);

  const [remaining, setRemaining] = useState(calcRemaining);

  useEffect(() => {
    const interval = setInterval(() => {
      const r = calcRemaining();
      setRemaining(r);
      if (r <= 0) { clearInterval(interval); onTimeUp(); }
    }, 1000);
    return () => clearInterval(interval);
  }, [calcRemaining, onTimeUp]);

  const mins  = Math.floor(remaining / 60);
  const secs  = Math.floor(remaining % 60);
  const pct   = (remaining / (timeLimitMinutes * 60)) * 100;
  const isLow = remaining < 60;

  return (
    <div className={`quiz-timer ${isLow ? 'quiz-timer--low' : ''}`}>
      <div className="quiz-timer__bar" style={{ width: `${pct}%` }} />
      <span className="quiz-timer__label">
        ⏱ {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </span>
    </div>
  );
}