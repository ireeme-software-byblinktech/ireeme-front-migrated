import { apiClient } from "./client";

export interface Teacher {
    id: string;
    userId: string;
    employeeNum: string;
    department: string | null;
    qualification: string | null;
    joiningDate: string;
    isActive: boolean;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phoneNumber: string | null;
        avatarUrl: string | null;
    };
    subjects?: Array<{
        id: string;
        subject: {
            id: string;
            name: string;
            code: string;
        };
    }>;
}

export interface TeachersResponse {
    data: Teacher[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}

export interface CreateTeacherDto {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    password: string;
    employeeNum: string;
    department?: string;
    qualification?: string;
    avatarUrl?: string;
}

export interface UpdateTeacherDto {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    department?: string;
    qualification?: string;
    avatarUrl?: string;
}

export const teachersApi = {
    getTeachers: (params?: { page?: number; limit?: number; search?: string }) =>
        apiClient<TeachersResponse>(
            `/teachers?${new URLSearchParams(params as any).toString()}`
        ),

    getTeacher: (id: string) =>
        apiClient<Teacher>(`/teachers/${id}`),

    createTeacher: (data: CreateTeacherDto) =>
        apiClient<Teacher>("/teachers", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    updateTeacher: (id: string, data: UpdateTeacherDto) =>
        apiClient<Teacher>(`/teachers/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),

    deleteTeacher: (id: string) =>
        apiClient<void>(`/teachers/${id}`, {
            method: "DELETE",
        }),

    assignSubject: (teacherId: string, subjectId: string) =>
        apiClient<void>(`/teachers/${teacherId}/subjects/${subjectId}`, {
            method: "POST",
        }),

    removeSubject: (teacherId: string, subjectId: string) =>
        apiClient<void>(`/teachers/${teacherId}/subjects/${subjectId}`, {
            method: "DELETE",
        }),
};

