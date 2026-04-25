const FALLBACK_API_URL = "http://localhost:3001/api";

const rawApiBaseUrl = process.env.REACT_APP_API_URL || FALLBACK_API_URL;

export const API_BASE_URL = rawApiBaseUrl.replace(/\/+$/, "");

export const buildApiUrl = (path = "") => {
  if (!path) return API_BASE_URL;
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};
