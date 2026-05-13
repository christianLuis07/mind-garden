import axios from "axios";
import { ApiResponse } from "@/types/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor untuk menambah token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    // Don't override manually-set Authorization headers (e.g. tempToken for admin TOTP)
    if (!config.headers.Authorization) {
      const token = localStorage.getItem("mindgarden_token");
      if (token && token !== "undefined") {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  }
  return config;
});

// Response interceptor untuk handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect if already on login/admin pages
      const path = typeof window !== "undefined" ? window.location.pathname : "";
      if (!path.startsWith("/login") && !path.startsWith("/admin")) {
        localStorage.removeItem("mindgarden_token");
        localStorage.removeItem("mindgarden_user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Auth API methods
export const authAPI = {
  // loginUser api
  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<{ user: any; token: string }>>("/auth/login", data),

  // registerUser api
  register: (data: { email: string; password: string; name: string }) =>
    api.post<ApiResponse<{ user: any; token: string }>>("/auth/register", data),

  // getUser api
  getMe: () => api.get<ApiResponse<{ user: any }>>("/auth/me"),

  // updateUser api
  updateProfile: (data: { name?: string; avatar?: string }) =>
    api.put<ApiResponse<{ user: any }>>("/auth/profile", data),

  // verifyUser api
  verifyEmail: (token: string) =>
    api.post<ApiResponse>("/email/verify-email", { token }),

  // resendVerify api
  resendVerification: (email: string) =>
    api.post<ApiResponse>("/email/resend-verification", { email }),

  // forgotPassword api
  forgotPassword: (email: string) =>
    api.post<ApiResponse>("/email/forgot-password", { email }),

  // resetPassword api
  resetPassword: (token: string, newPassword: string) =>
    api.post<ApiResponse>("/email/reset-password", { token, newPassword }),
};
