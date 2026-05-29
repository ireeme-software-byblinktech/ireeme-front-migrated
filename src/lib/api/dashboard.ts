import { apiClient } from "./client";

export interface DashboardStats {
    totalStudents: number;
    totalTeachers: number;
    totalStaff: number;
    totalSubjects: number;
    maleStudents: number;
    femaleStudents: number;
    maleTeachers: number;
    femaleTeachers: number;
}

export const dashboardApi = {
    getStats: () => apiClient<DashboardStats>("/api/v1/dashboard/stats"),
};
