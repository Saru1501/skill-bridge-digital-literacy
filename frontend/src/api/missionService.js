import API from './axiosInstance';

// ── Admin ──────────────────────────────────────────────────────────────────
export const createMission        = (data)            => API.post('/missions', data);
export const updateMission        = (id, data)        => API.put(`/missions/${id}`, data);
export const deleteMission        = (id)              => API.delete(`/missions/${id}`);
export const toggleMissionPublish = (id)              => API.patch(`/missions/${id}/publish`);
export const getAllSubmissions     = (missionId)       => API.get(`/missions/${missionId}/submissions`);
export const gradeSubmission      = (subId, data)     => API.patch(`/submissions/${subId}/grade`, data);

// ── Shared ─────────────────────────────────────────────────────────────────
export const getMissionsByCourse  = (courseId)        => API.get(`/missions?course=${courseId}`);
export const getMissionById       = (id)              => API.get(`/missions/${id}`);

// ── Student ────────────────────────────────────────────────────────────────
export const submitMission        = (missionId, data) => API.post(`/missions/${missionId}/submit`, data);
export const getMySubmission      = (missionId)       => API.get(`/missions/${missionId}/submission`);