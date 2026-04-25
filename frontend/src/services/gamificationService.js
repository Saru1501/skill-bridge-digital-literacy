import api from "./api";

export const gamificationService = {
  // Points
  getMyPoints: () => api.get("/points/my"),
  createPointRule: (data) => api.post("/points/rules", data),
  getPointRules: () => api.get("/points/rules"),
  updatePointRule: (id, data) => api.put(`/points/rules/${id}`, data),
  deletePointRule: (id) => api.delete(`/points/rules/${id}`),

  // Badges
  getMyBadges: () => api.get("/badges/my"),
  getAllBadges: () => api.get("/badges"),
  createBadge: (data) => api.post("/badges", data),
  updateBadge: (id, data) => api.put(`/badges/${id}`, data),
  deleteBadge: (id) => api.delete(`/badges/${id}`),

  // Certificates
  getMyCertificates: () => api.get("/certificates/my"),
  generateCertificate: (courseId) => api.post(`/certificates/generate/${courseId}`),
  getAllCertificates: () => api.get("/certificates"),

  // Leaderboard
  getLeaderboard: (limit = 10) => api.get(`/leaderboard?limit=${limit}`),
  getMyRank: () => api.get("/leaderboard/my-rank"),

  // Fee Reduction
  getMyFeeReductions: () => api.get("/fee-reduction/my"),
  applyFeeReduction: (id) => api.post(`/fee-reduction/apply/${id}`),
  getAllFeeReductions: () => api.get("/fee-reduction"),

  // Gamification Config
  getGamificationConfig: (courseId) => api.get(`/gamification/config/${courseId}`),
  setGamificationConfig: (courseId, data) => api.put(`/gamification/config/${courseId}`, data),

  // Achievement Vault
  getAchievementVault: () => api.get("/gamification/achievements"),

  // Events (triggered by backend, but can be called for testing)
  triggerCourseCompletion: (studentId, courseId) =>
    api.post("/gamification/course-completed", { studentId, courseId }),
  triggerQuizCompletion: (studentId, courseId, passed, score) =>
    api.post("/gamification/quiz-completed", { studentId, courseId, passed, score }),
};

export const getGamificationData = () => gamificationService.getAchievementVault();

export default gamificationService;
