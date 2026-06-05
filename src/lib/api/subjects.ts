import { apiClient } from "./client";

export interface Subject {
    id: string;
    name: string;
    code: string;
    description: string | null;
    schoolId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateSubjectDto {
    name: string;
    code: string;
    description?: string;
}

export const subjectsApi = {
    getSubjects: (classId?: string) => {
        const params = classId ? `?classId=${classId}` : '';
        return apiClient<Subject[]>(`/subjects${params}`);
    },

    getSubject: (id: string) =>
        apiClient<Subject>(`/subjects/${id}`),

    createSubject: (data: CreateSubjectDto) =>
        apiClient<Subject>("/subjects", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    updateSubject: (id: string, data: Partial<CreateSubjectDto>) =>
        apiClient<Subject>(`/subjects/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),

    deleteSubject: (id: string) =>
        apiClient<void>(`/subjects/${id}`, {
            method: "DELETE",
        }),

    assignTeacher: (subjectId: string, teacherId: string) =>
        apiClient<void>(`/subjects/${subjectId}/teachers`, {
            method: "POST",
            body: JSON.stringify({ teacherId }),
        }),

    removeTeacher: (subjectId: string, teacherId: string) =>
        apiClient<void>(`/subjects/${subjectId}/teachers/${teacherId}`, {
            method: "DELETE",
        }),
};

