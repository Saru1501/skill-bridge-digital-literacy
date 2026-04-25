import API from './axiosInstance';

// ── Admin ──────────────────────────────────────────────────────────────────
export const createQuiz           = (data)                    => API.post('/quizzes', data);
export const updateQuiz           = (id, data)                => API.put(`/quizzes/${id}`, data);
export const deleteQuiz           = (id)                      => API.delete(`/quizzes/${id}`);
export const toggleQuizPublish    = (id)                      => API.patch(`/quizzes/${id}/publish`);
export const getAllAttempts        = (quizId)                  => API.get(`/quizzes/${quizId}/attempts/all`);

// ── Shared ─────────────────────────────────────────────────────────────────
export const getQuizzesByCourse   = (courseId)                => API.get(`/quizzes?course=${courseId}`);
export const getQuizById          = (id)                      => API.get(`/quizzes/${id}`);

// ── Student ────────────────────────────────────────────────────────────────
export const startAttempt         = (quizId)                  => API.post(`/quizzes/${quizId}/attempt/start`);
export const submitAttempt        = (quizId, attemptId, data) => API.post(`/quizzes/${quizId}/attempt/${attemptId}/submit`, data);
export const getMyAttempts        = (quizId)                  => API.get(`/quizzes/${quizId}/attempts`);
export const getCoursePerformance = (courseId)                => API.get(`/performance/courses/${courseId}/performance`);
