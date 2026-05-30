import { apiClient } from "./client";

export enum HomePermissionStatus {
  ACTIVE = "ACTIVE",
  RETURNED = "RETURNED",
  OVERDUE = "OVERDUE",
}

export interface HomePermission {
  id: string;
  schoolId: string;
  studentId: string;
  nurseId: string;
  healthIssue: string;
  parentGuardian: string;
  dateIssued: string;
  expectedReturn: string;
  actualReturn?: string;
  status: HomePermissionStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  student: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
    };
  };
  nurse: {
    firstName: string;
    lastName: string;
  };
}

export interface CreateHomePermissionDto {
  studentId: string;
  healthIssue: string;
  parentGuardian: string;
  expectedReturn: string;
  notes?: string;
}

export interface UpdateHomePermissionDto {
  healthIssue?: string;
  parentGuardian?: string;
  expectedReturn?: string;
  actualReturn?: string;
  status?: HomePermissionStatus;
  notes?: string;
}

export interface HomePermissionStats {
  active: number;
  returned: number;
  overdue: number;
  thisWeek: number;
}

export const homePermissionsApi = {
  getAll: (page = 1, limit = 50, status?: HomePermissionStatus) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) params.append("status", status);
    return apiClient<{ data: HomePermission[]; meta: any }>(`/api/v1/home-permissions?${params}`);
  },

  getById: (id: string) =>
    apiClient<HomePermission>(`/api/v1/home-permissions/${id}`),

  create: (data: CreateHomePermissionDto) =>
    apiClient<HomePermission>("/api/v1/home-permissions", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateHomePermissionDto) =>
    apiClient<HomePermission>(`/api/v1/home-permissions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiClient<void>(`/api/v1/home-permissions/${id}`, {
      method: "DELETE",
    }),

  getStats: () =>
    apiClient<HomePermissionStats>("/api/v1/home-permissions/stats"),
};
