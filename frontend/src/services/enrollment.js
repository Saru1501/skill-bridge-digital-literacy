import api from "./api";

export const getMyEnrollments = async () => {
  const res = await api.get("/enrollments/my");
  return res.data.data || [];
};
