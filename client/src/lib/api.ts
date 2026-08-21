import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { useGateStore } from "@/store/gateStore";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const api = axios.create({ baseURL: BASE_URL });

// Attaches whichever token is relevant: user JWT takes priority (logged-in
// resume generation/save), otherwise the studio gate token (guest generation).
api.interceptors.request.use((config) => {
  const userToken = useAuthStore.getState().token;
  const gateToken = useGateStore.getState().gateToken;
  const token = userToken || gateToken;
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Stale token: clear whichever store owns it so the UI can re-prompt.
      if (useAuthStore.getState().token) useAuthStore.getState().logout();
      if (useGateStore.getState().gateToken) useGateStore.getState().clearGate();
    }
    return Promise.reject(err);
  }
);

export function apiErrorMessage(err: unknown, fallback = "Something went wrong."): string {
  if (axios.isAxiosError(err)) {
    const detail = err.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (!err.response) return "Can't reach the server. Check your connection.";
  }
  return fallback;
}