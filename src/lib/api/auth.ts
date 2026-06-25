import { apiClient } from "./client";

export interface CurrentUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  avatarUrl: string | null;
  roles: string[];
  schoolId: string | null;
}

export const authApi = {
  getCurrentUser: () => apiClient<CurrentUser>("/auth/me"),

  login: (email: string, password: string) =>
    apiClient<{ accessToken: string; refreshToken: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (data: {
    institutionName: string;
    type: string;
    country: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) =>
    apiClient<{ accessToken: string; refreshToken: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: () =>
    apiClient<void>("/auth/logout", {
      method: "POST",
    }),
};

