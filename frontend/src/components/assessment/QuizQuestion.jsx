import React from 'react';

export default function QuizQuestion({ question, index, total, answer, onChange }) {
  return (
    <div className="quiz-question">
      <div className="quiz-question__progress">Question {index + 1} of {total}</div>
      <h3 className="quiz-question__text">{question.questionText}</h3>
      <div className="quiz-question__marks">
        {question.marks} mark{question.marks > 1 ? 's' : ''}
      </div>

      {/* Multiple Choice */}
      {question.questionType === 'multiple_choice' && (
        <div className="quiz-question__options">
          {question.options.map((opt, i) => (
            <label
              key={i}
              className={`quiz-question__option ${answer === String(i) ? 'quiz-question__option--selected' : ''}`}
            >
              <input
                type="radio"
                name={`q-${question._id}`}
                value={String(i)}
                checked={answer === String(i)}
                onChange={() => onChange(String(i))}
              />
              <span className="quiz-question__option-letter">{String.fromCharCode(65 + i)}</span>
              <span>{opt}</span>
            </label>
          ))}
        </div>
      )}

      {/* True / False */}
      {question.questionType === 'true_false' && (
        <div className="quiz-question__options quiz-question__options--tf">
          {['true', 'false'].map((val) => (
            <label
              key={val}
              className={`quiz-question__option ${answer === val ? 'quiz-question__option--selected' : ''}`}
            >
              <input
                type="radio"
                name={`q-${question._id}`}
                value={val}
                checked={answer === val}
                onChange={() => onChange(val)}
              />
              <span>{val === 'true' ? '✅ True' : '❌ False'}</span>
            </label>
          ))}
        </div>
      )}

      {/* Short Answer */}
      {question.questionType === 'short_answer' && (
        <div className="quiz-question__short">
          <textarea
            rows={3}
            placeholder="Type your answer..."
            value={answer || ''}
            onChange={(e) => onChange(e.target.value)}
          />
          <small>This answer will be manually reviewed by the instructor.</small>
        </div>
      )}
    </div>
  );
}