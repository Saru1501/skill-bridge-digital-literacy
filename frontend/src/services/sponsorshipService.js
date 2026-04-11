import api from "./api";

export const getActivePrograms = async () => {
  const response = await api.get("/sponsorship/programs");
  return response.data;
};