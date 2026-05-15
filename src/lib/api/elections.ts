import { apiClient } from "./client";

export interface Election {
    id: string;
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    status: "DRAFT" | "ACTIVE" | "CLOSED";
}

export interface Candidate {
    id: string;
    studentId: string;
    positionId: string;
    biography?: string;
    student: { user: { firstName: string; lastName: string } };
}

export interface ElectionResult {
    positionName: string;
    candidates: {
        candidateName: string;
        voteCount: number;
        percentage: number;
    }[];
}

export const electionsApi = {
    getAll: () => apiClient<Election[]>("/elections"),

    getById: (id: string) => apiClient<any>(`/elections/${id}`),

    create: (dto: {
        title: string;
        description?: string;
        startDate: string;
        endDate: string;
    }) => apiClient<Election>("/elections", {
        method: "POST",
        body: JSON.stringify(dto),
    }),

    addCandidate: (dto: {
        electionId: string;
        studentId: string;
        positionId: string;
        biography?: string;
    }) => apiClient("/elections/candidates", {
        method: "POST",
        body: JSON.stringify(dto),
    }),

    vote: (dto: {
        electionId: string;
        positionId: string;
        candidateId: string;
    }) => apiClient("/elections/vote", {
        method: "POST",
        body: JSON.stringify(dto),
    }),

    getResults: (id: string) => apiClient<ElectionResult[]>(`/elections/${id}/results`),
};
