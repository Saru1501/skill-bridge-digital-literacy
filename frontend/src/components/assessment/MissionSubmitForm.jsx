import React, { useState } from 'react';
import { submitMission } from '../../api/missionService';

export default function MissionSubmitForm({ mission, existingSubmission, onSuccess }) {
  const [responseText,    setResponseText]    = useState(existingSubmission?.responseText || '');
  const [responseUrl,     setResponseUrl]     = useState(existingSubmission?.responseUrl || '');
  const [selectedOption,  setSelectedOption]  = useState(existingSubmission?.selectedOption ?? null);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState('');

  const alreadyGraded = existingSubmission?.status === 'graded';

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const payload = {};
      if (mission.submissionType === 'text')            payload.responseText   = responseText;
      if (mission.submissionType === 'url')             payload.responseUrl    = responseUrl;
      if (mission.submissionType === 'multiple_choice') payload.selectedOption = selectedOption;

      const { data } = await submitMission(mission._id, payload);
      onSuccess(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submit-form">
      <div className="submit-form__instructions">
        <h4>Instructions</h4>
        <p>{mission.instructions}</p>
      </div>

      {/* Text */}
      {mission.submissionType === 'text' && (
        <div className="submit-form__field">
          <label>Your Response</label>
          <textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder="Write your response here..."
            rows={6}
            disabled={alreadyGraded}
          />
        </div>
      )}

      {/* URL */}
      {mission.submissionType === 'url' && (
        <div className="submit-form__field">
          <label>Submit a Link</label>
          <input
            type="url"
            value={responseUrl}
            onChange={(e) => setResponseUrl(e.target.value)}
            placeholder="https://..."
            disabled={alreadyGraded}
          />
        </div>
      )}

      {/* Multiple Choice */}
      {mission.submissionType === 'multiple_choice' && (
        <div className="submit-form__field">
          <label>Choose the correct answer</label>
          <div className="submit-form__options">
            {mission.options.map((opt, idx) => (
              <label
                key={idx}
                className={`submit-form__option ${selectedOption === idx ? 'submit-form__option--selected' : ''}`}
              >
                <input
                  type="radio"
                  name="mcq"
                  value={idx}
                  checked={selectedOption === idx}
                  onChange={() => setSelectedOption(idx)}
                  disabled={alreadyGraded}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* File */}
      {mission.submissionType === 'file' && (
        <div className="submit-form__field submit-form__field--info">
          <span>📎 File upload is handled via the mobile app or upload portal.</span>
        </div>
      )}

      {error && <div className="submit-form__error">{error}</div>}

      {!alreadyGraded && (
        <button className="btn btn--primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Submitting...' : existingSubmission ? 'Resubmit' : 'Submit Mission'}
        </button>
      )}

      {alreadyGraded && (
        <div className="submit-form__graded-note">
          ✅ This mission has been graded. Score: <strong>{existingSubmission.score}</strong>
          {existingSubmission.feedback && <p>💬 {existingSubmission.feedback}</p>}
        </div>
      )}
    </div>
  );
}