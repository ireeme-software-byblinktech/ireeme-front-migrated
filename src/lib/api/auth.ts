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
    getCurrentUser: () => apiClient<CurrentUser>("/api/v1/auth/me"),

    login: (email: string, password: string) =>
        apiClient<{ accessToken: string; refreshToken: string }>("/api/v1/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        }),

    logout: () =>
        apiClient<void>("/api/v1/auth/logout", {
            method: "POST",
        }),
};
