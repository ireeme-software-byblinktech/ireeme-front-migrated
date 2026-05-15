import { apiClient } from "@/lib/api/client";
import { 
  AuthResponse, 
  LoginDto, 
  RegisterDto, 
  User 
} from "./types";

export const authApi = {
  login: (data: LoginDto) => 
    apiClient<AuthResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  register: (data: RegisterDto) =>
    apiClient<AuthResponse>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: () =>
    apiClient<void>("/api/v1/auth/logout", {
      method: "POST",
    }),

  getMe: () =>
    apiClient<User>("/api/v1/auth/me", {
      method: "GET",
    }),

  refresh: (refreshToken?: string) =>
    apiClient<AuthResponse>("/api/v1/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    }),

  unlock: (userId: string) =>
    apiClient<void>(`/api/v1/auth/unlock/${userId}`, {
      method: "POST",
    }),
};
