import { apiClient } from "./client";

export interface AcademicTerm {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    schoolId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTermDto {
    name: string;
    startDate: string;
    endDate: string;
}

export const academicTermsApi = {
    getTerms: () =>
        apiClient<AcademicTerm[]>("/api/v1/academic-terms"),

    getActiveTerm: () =>
        apiClient<AcademicTerm>("/api/v1/academic-terms/active"),

    createTerm: (data: CreateTermDto) =>
        apiClient<AcademicTerm>("/api/v1/academic-terms", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    updateTerm: (id: string, data: Partial<CreateTermDto>) =>
        apiClient<AcademicTerm>(`/api/v1/academic-terms/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),

    deleteTerm: (id: string) =>
        apiClient<void>(`/api/v1/academic-terms/${id}`, {
            method: "DELETE",
        }),

    setActive: (id: string) =>
        apiClient<AcademicTerm>(`/api/v1/academic-terms/${id}/active`, {
            method: "POST",
        }),
};
