import { apiClient } from "./client";

export interface Class {
    id: string;
    name: string;
    year: number;
    stream: string | null;
    capacity: number;
    schoolId: string;
}

export interface ClassesResponse {
    data: Class[];
    total: number;
}

export const classesApi = {
    getClasses: () => apiClient<Class[]>("/classes"),
};

