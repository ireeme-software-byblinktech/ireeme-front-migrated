import { apiClient } from "./client";

export interface Election {
    id: string;
    schoolId: string;
    title: string;
    startAt: string;
    endAt: string;
    status: "DRAFT" | "ACTIVE" | "CLOSED";
    resultsPublished: boolean;
    positions: Position[];
    createdAt: string;
    updatedAt: string;
}

export interface Position {
    id: string;
    electionId: string;
    name: string;
    minVotes: number;
    maxVotes: number;
    candidates: Candidate[];
}

export interface Candidate {
    id: string;
    positionId: string;
    studentId: string;
    bio: string | null;
    imageUrl: string | null;
    student: {
        studentNumber: string;
        user: {
            firstName: string;
            lastName: string;
            avatarUrl: string | null;
        };
    };
    voteCount?: number;
}

export interface CreateElectionDto {
    title: string;
    startAt: string;
    endAt: string;
    positions: {
        name: string;
        maxVotes: number;
    }[];
}

export interface AddCandidateDto {
    positionId: string;
    studentId: string;
    bio: string;
}

export interface CastVoteDto {
    positionId: string;
    candidateId: string;
}

export const electionsApi = {
    getElections: () =>
        apiClient<Election[]>("/elections"),

    getElection: (id: string) =>
        apiClient<Election>(`/elections/${id}`),

    createElection: (data: CreateElectionDto) =>
        apiClient<Election>("/elections", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    addPosition: (electionId: string, data: { name: string; minVotes?: number; maxVotes?: number }) =>
        apiClient<Position>(`/elections/${electionId}/positions`, {
            method: "POST",
            body: JSON.stringify(data),
        }),

    addCandidate: (data: AddCandidateDto) =>
        apiClient<Candidate>("/elections/candidates", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    openVoting: (electionId: string) =>
        apiClient<Election>(`/elections/${electionId}/open`, {
            method: "POST",
        }),

    closeVoting: (electionId: string) =>
        apiClient<Election>(`/elections/${electionId}/close`, {
            method: "POST",
        }),

    castVote: (data: CastVoteDto) =>
        apiClient<{ success: boolean; message: string }>("/elections/vote", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    getResults: (electionId: string) =>
        apiClient<{
            electionId: string;
            positions: Array<{
                positionId: string;
                positionTitle: string;
                totalVotes: number;
                candidates: Array<{
                    candidateId: string;
                    studentName: string;
                    voteCount: number;
                    percentage: number;
                }>;
            }>;
        }>(`/elections/${electionId}/results`),

    publishResults: (electionId: string) =>
        apiClient<Election>(`/elections/${electionId}/publish-results`, {
            method: "POST",
        }),

    unpublishResults: (electionId: string) =>
        apiClient<Election>(`/elections/${electionId}/unpublish-results`, {
            method: "POST",
        }),

    getVotingStatus: (electionId: string) =>
        apiClient<{
            hasVoted: boolean;
            votedPositions: number;
            totalPositions: number;
        }>(`/elections/${electionId}/voting-status`),

    // Remote fallback methods mapping for compatibility
    getAll: () => apiClient<Election[]>("/elections"),
    getById: (id: string) => apiClient<Election>(`/elections/${id}`),
};

