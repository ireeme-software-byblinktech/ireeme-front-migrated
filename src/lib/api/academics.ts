import { apiClient } from "./client";

export interface Class {
    id: string;
    name: string;
    year: number;
    stream?: string;
    termId: string;
}

export const classesApi = {
    getAll: () => apiClient<Class[]>("/classes"),
    getById: (id: string) => apiClient<Class>(`/classes/${id}`),
};

export interface Subject {
    id: string;
    name: string;
    code: string;
    classId?: string;
}

export const subjectsApi = {
    getAll: () => apiClient<Subject[]>("/subjects"),
    getByClass: (classId: string) => apiClient<Subject[]>(`/subjects?classId=${classId}`),
};

export interface Student {
    id: string;
    userId: string;
    studentNumber: string;
    user: { firstName: string; lastName: string };
}

export const studentsApi = {
    getAll: () => apiClient<Student[]>("/students"),
    getByClass: (classId: string) => apiClient<Student[]>(`/students/class/${classId}`),
};

export const teachersApi = {
    getAll: () => apiClient<any[]>("/teachers"),
};
