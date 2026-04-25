import api from "./api";

export const unenrollCourse = async (courseId) => {
  return api.delete(`/enrollments/${courseId}`);
};
