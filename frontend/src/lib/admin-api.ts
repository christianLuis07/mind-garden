import { api } from "./api";

export const adminAPI = {
  // TOTP Auth Flow
  setupTotp: (tempToken: string) => 
    api.post("/auth/totp/setup", {}, { headers: { Authorization: `Bearer ${tempToken}` } }),
  verifyTotp: (tempToken: string, token: string) => 
    api.post("/auth/totp/verify", { token }, { headers: { Authorization: `Bearer ${tempToken}` } }),
  validateTotpLogin: (tempToken: string, token: string) => 
    api.post("/auth/totp/validate", { tempToken, token }),
    
  // Admin Data
  getStats: () => api.get("/admin/stats"),
  getUsers: () => api.get("/admin/users"),
  toggleUserStatus: (id: string) => api.patch(`/admin/users/${id}/status`),
};
