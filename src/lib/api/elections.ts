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
        apiClient<Election[]>("/api/v1/elections"),

    getElection: (id: string) =>
        apiClient<Election>(`/api/v1/elections/${id}`),

    createElection: (data: CreateElectionDto) =>
        apiClient<Election>("/api/v1/elections", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    addPosition: (electionId: string, data: { name: string; minVotes?: number; maxVotes?: number }) =>
        apiClient<Position>(`/api/v1/elections/${electionId}/positions`, {
            method: "POST",
            body: JSON.stringify(data),
        }),

    addCandidate: (data: AddCandidateDto) =>
        apiClient<Candidate>("/api/v1/elections/candidates", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    openVoting: (electionId: string) =>
        apiClient<Election>(`/api/v1/elections/${electionId}/open`, {
            method: "POST",
        }),

    closeVoting: (electionId: string) =>
        apiClient<Election>(`/api/v1/elections/${electionId}/close`, {
            method: "POST",
        }),

    castVote: (data: CastVoteDto) =>
        apiClient<{ success: boolean; message: string }>("/api/v1/elections/vote", {
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
        }>(`/api/v1/elections/${electionId}/results`),

    publishResults: (electionId: string) =>
        apiClient<Election>(`/api/v1/elections/${electionId}/publish-results`, {
            method: "POST",
        }),

    unpublishResults: (electionId: string) =>
        apiClient<Election>(`/api/v1/elections/${electionId}/unpublish-results`, {
            method: "POST",
        }),

    getVotingStatus: (electionId: string) =>
        apiClient<{
            hasVoted: boolean;
            votedPositions: number;
            totalPositions: number;
        }>(`/api/v1/elections/${electionId}/voting-status`),
};
