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
    }) => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.append("page", params.page.toString());
        if (params?.limit) searchParams.append("limit", params.limit.toString());
        if (params?.search) searchParams.append("search", params.search);
        if (params?.classId) searchParams.append("classId", params.classId);
        if (params?.isActive !== undefined) searchParams.append("isActive", params.isActive.toString());
        
        const query = searchParams.toString();
        return apiClient<StudentsResponse>(
            `/api/v1/students${query ? `?${query}` : ""}`
        );
    },

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
