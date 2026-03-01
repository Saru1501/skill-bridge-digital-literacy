// services/scoreService.js

/**
 * Auto-grade MCQ and true/false answers.
 * Short answer questions default to 0 — require manual grading.
 */
const calculateQuizScore = (questions, submittedAnswers) => {
    let totalMarksAwarded = 0;
  
    const gradedAnswers = questions.map((question) => {
      const qId = question._id.toString();
      const submitted = submittedAnswers.find(
        (a) => a.questionId.toString() === qId
      );
  
      let isCorrect = false;
      let marksAwarded = 0;
  
      if (submitted && question.questionType !== 'short_answer') {
        isCorrect =
          submitted.givenAnswer?.toString().trim().toLowerCase() ===
          question.correctAnswer?.toString().trim().toLowerCase();
        marksAwarded = isCorrect ? question.marks : 0;
      }
  
      totalMarksAwarded += marksAwarded;
  
      return {
        questionId: question._id,
        givenAnswer: submitted?.givenAnswer ?? null,
        isCorrect,
        marksAwarded
      };
    });
  
    return { gradedAnswers, totalMarksAwarded };
  };
  
  /**
   * Check pass/fail against the quiz's passMark (percentage threshold).
   */
  const evaluatePassFail = (totalMarksAwarded, totalMarks, passMark) => {
    if (totalMarks === 0) return { percentage: 0, isPassed: false };
    const percentage = parseFloat(
      ((totalMarksAwarded / totalMarks) * 100).toFixed(2)
    );
    const isPassed = percentage >= passMark;
    return { percentage, isPassed };
  };
  
  module.exports = { calculateQuizScore, evaluatePassFail };