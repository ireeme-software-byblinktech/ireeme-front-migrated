import { apiClient } from "./client";

export interface Student {
    id: string;
    userId: string;
    studentNumber: string;
    dateOfBirth: string | null;
    gender: string | null;
    enrollmentDate?: string;
    isActive: boolean;
    classId?: string | null;
    user: {
        id?: string;
        email: string;
        firstName: string;
        lastName: string;
        phoneNumber?: string | null;
        avatarUrl?: string | null;
    };
    classes?: Array<{
        class: {
            id: string;
            name: string;
            year?: number;
            stream?: string | null;
        };
    }>;
    // Computed property for easier access
    class?: {
        id: string;
        name: string;
        year?: number;
        stream?: string | null;
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
    getStudents: async (params?: {
        page?: number;
        limit?: number;
        search?: string;
        classId?: string;
        isActive?: boolean;
    }) => {
        // Filter out undefined values
        const cleanParams: Record<string, string> = {};
        if (params?.page) cleanParams.page = String(params.page);
        if (params?.limit) cleanParams.limit = String(params.limit);
        if (params?.search) cleanParams.search = params.search;
        if (params?.classId) cleanParams.classId = params.classId;
        if (params?.isActive !== undefined) cleanParams.isActive = String(params.isActive);

        const queryString = new URLSearchParams(cleanParams).toString();
        const url = `/api/v1/students${queryString ? `?${queryString}` : ''}`;

        const response = await apiClient<StudentsResponse>(url);

        // Transform the data to add a computed 'class' property for easier access
        if (response.data) {
            response.data = response.data.map(student => ({
                ...student,
                class: student.classes && student.classes.length > 0
                    ? student.classes[0].class
                    : undefined
            }));
        }

        return response;
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
