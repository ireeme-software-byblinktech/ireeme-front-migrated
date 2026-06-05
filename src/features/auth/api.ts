import { apiClient } from "@/lib/api/client";
import { 
  AuthResponse, 
  LoginDto, 
  RegisterDto, 
  User 
} from "./types";

export const authApi = {
  login: (data: LoginDto) => 
    apiClient<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  register: (data: RegisterDto) =>
    apiClient<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: () =>
    apiClient<void>("/auth/logout", {
      method: "POST",
    }),

  getMe: () =>
    apiClient<User>("/auth/me", {
      method: "GET",
    }),

  refresh: (refreshToken?: string) =>
    apiClient<AuthResponse>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    }),

  unlock: (userId: string) =>
    apiClient<void>(`/auth/unlock/${userId}`, {
      method: "POST",
    }),
};

