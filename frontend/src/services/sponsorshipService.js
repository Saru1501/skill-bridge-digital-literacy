import api from "./api";

export const getActivePrograms = async () => {
  const response = await api.get("/sponsorship/programs");
  return response.data;
};

export const applyForSponsorship = async (formData) => {
  const response = await api.post("/sponsorship/applications", formData);
  return response.data;
};