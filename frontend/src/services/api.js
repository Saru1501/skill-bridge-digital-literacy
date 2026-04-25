import axios from "axios";
import { API_BASE_URL } from "../config/api";

const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ── AUTH ────────────────────────────────────────────────────────────────────
export const authLogin    = (email, password) => api.post("/auth/login", { email, password });
export const authRegister = (name, email, password, role) => api.post("/auth/register", { name, email, password, role });
export const authMe       = () => api.get("/auth/me");

// ── COURSES (Component 1) ───────────────────────────────────────────────────
export const getCourses    = (params) => api.get("/courses", { params });
export const getCourseById = (id)     => api.get(`/courses/${id}`);
export const createCourse  = (data)   => api.post("/courses", data);
export const updateCourse  = (id, d)  => api.put(`/courses/${id}`, d);
export const deleteCourse  = (id)     => api.delete(`/courses/${id}`);
export const togglePublish = (id)     => api.patch(`/courses/${id}/publish`);

// ── LESSONS (Component 1) ───────────────────────────────────────────────────
export const getLessons     = (courseId)     => api.get(`/courses/${courseId}/lessons`);
export const getLessonById  = (id)           => api.get(`/lessons/${id}`);
export const addLesson      = (courseId, d)  => api.post(`/courses/${courseId}/lessons`, d);
export const updateLesson   = (id, d)        => api.put(`/lessons/${id}`, d);
export const deleteLesson   = (id)           => api.delete(`/lessons/${id}`);
export const uploadResource = (lessonId, fd) =>
  api.post(`/lessons/${lessonId}/resources`, fd, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteResource = (lessonId, rid) => api.delete(`/lessons/${lessonId}/resources/${rid}`);

// ── ENROLLMENTS (Component 1) ───────────────────────────────────────────────
export const enrollCourse         = (courseId) => api.post(`/enrollments/${courseId}`);
export const getMyEnrollments     = ()         => api.get("/enrollments/my");
export const checkEnrollment      = (courseId) => api.get(`/enrollments/${courseId}/status`);
export const getCourseEnrollments = (courseId) => api.get(`/enrollments/course/${courseId}`);

// ── PROGRESS (Component 1) ──────────────────────────────────────────────────
export const markLessonComplete = (courseId, lessonId) =>
  api.patch(`/progress/${courseId}/lessons/${lessonId}`);
export const getCourseProgress  = (courseId) =>
  api.get(`/progress/${courseId}`);
export const trackDownload      = (courseId, url) =>
  api.post(`/progress/${courseId}/download`, { resourceUrl: url });
export const syncOffline        = (courseId, completedLessons) =>
  api.post(`/progress/${courseId}/sync`, { completedLessons });

// ── SAVED COURSES (Component 1) ─────────────────────────────────────────────

// Saved Courses
export const toggleSave = (courseId) => api.post(`/saved/${courseId}`);
export const getMySaved = ()         => api.get("/saved");

// Saved Resources
export const toggleSaveResource = (lessonId, resourceId) => api.post(`/saved-resources/${lessonId}/resources/${resourceId}`);
export const getMySavedResources = () => api.get("/saved-resources/my");

// Resource Download
export const downloadResource = (lessonId, resourceId) => api.get(`/lessons/${lessonId}/resources/${resourceId}/download`, { responseType: 'blob' });

export default api;
