import { apiClient } from "./client";

export interface Permission {
  id: string;
  studentId: string;
  type: "LEAVE" | "GATE_PASS" | "SPECIAL" | "MEDICAL" | "OTHER";
  reason: string;
  startDate: string;
  endDate: string;
  description: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  requestedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  reviewerNotes: string | null;
  student: {
    studentNumber: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

export interface CreatePermissionDto {
  studentId: string;
  type: string;
  reason: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export const permissionsApi = {
  create: (data: CreatePermissionDto) =>
    apiClient<Permission>("/api/v1/permissions", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getAll: (params?: { status?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append("status", params.status);
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());

    return apiClient<{ data: Permission[]; total: number; page: number; limit: number }>(
      `/api/v1/permissions?${query.toString()}`
    );
  },

  getById: (id: string) => apiClient<Permission>(`/api/v1/permissions/${id}`),

  approve: (id: string, notes?: string) =>
    apiClient<Permission>(`/api/v1/permissions/${id}/approve`, {
      method: "PATCH",
      body: JSON.stringify({ notes }),
    }),

  reject: (id: string, notes?: string) =>
    apiClient<Permission>(`/api/v1/permissions/${id}/reject`, {
      method: "PATCH",
      body: JSON.stringify({ notes }),
    }),
};
