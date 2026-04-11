import api from "./api";

export const registerUser = async (formData) => {
  const response = await api.post("/auth/register", formData);
  return { user: response.data.data, token: response.data.token };
};

export const loginUser = async (formData) => {
  const response = await api.post("/auth/login", formData);
  return { user: response.data.data, token: response.data.token };
};

export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data.data;
};