import { apiClient } from "./client";

export interface Student {
    id: string;
    userId: string;
    studentNumber: string;
    dateOfBirth: string | null;
    gender: string | null;
    enrollmentDate: string;
    isActive: boolean;
    classId: string | null;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phoneNumber: string | null;
        avatarUrl: string | null;
    };
    class?: {
        id: string;
        name: string;
        year: number;
        stream: string | null;
    };
}

export interface StudentsResponse {
    data: Student[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}

export interface CreateStudentDto {
    email: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
    dateOfBirth?: string;
    gender?: string;
    classId?: string;
    enrollmentDate: string;
    avatarUrl?: string;
}

export interface UpdateStudentDto {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: string;
    classId?: string;
    avatarUrl?: string;
}

export const studentsApi = {
    getStudents: (params?: {
        page?: number;
        limit?: number;
        search?: string;
        classId?: string;
        isActive?: boolean;
    }) =>
        apiClient<StudentsResponse>(
            `/api/v1/students?${new URLSearchParams(params as any).toString()}`
        ),

    getStudent: (id: string) =>
        apiClient<Student>(`/api/v1/students/${id}`),

    createStudent: (data: CreateStudentDto) =>
        apiClient<Student>("/api/v1/students", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    updateStudent: (id: string, data: UpdateStudentDto) =>
        apiClient<Student>(`/api/v1/students/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),

    deleteStudent: (id: string) =>
        apiClient<void>(`/api/v1/students/${id}`, {
            method: "DELETE",
        }),
};
