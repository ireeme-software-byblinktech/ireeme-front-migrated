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
        apiClient<AcademicTerm[]>("/academic-terms"),

    getActiveTerm: () =>
        apiClient<AcademicTerm>("/academic-terms/active"),

    createTerm: (data: CreateTermDto) =>
        apiClient<AcademicTerm>("/academic-terms", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    updateTerm: (id: string, data: Partial<CreateTermDto>) =>
        apiClient<AcademicTerm>(`/academic-terms/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),

    deleteTerm: (id: string) =>
        apiClient<void>(`/academic-terms/${id}`, {
            method: "DELETE",
        }),

    setActive: (id: string) =>
        apiClient<AcademicTerm>(`/academic-terms/${id}/active`, {
            method: "POST",
        }),
};

