import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
});

api.interceptors.request.use((config) => {
  const storedAuth = localStorage.getItem("skillbridge_auth");

  if (storedAuth) {
    const { token } = JSON.parse(storedAuth);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default api;