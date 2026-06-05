import { apiClient } from "./client";

export interface Candidate {
  id: string;
  positionId: string;
  studentId: string;
  bio: string | null;
  photoUrl: string | null;
  student: {
    id: string;
    studentNumber: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

export interface Position {
  id: string;
  electionId: string;
  name: string;
  maxCandidates: number;
  candidates: Candidate[];
}

export interface Election {
  id: string;
  title: string;
  description: string | null;
  startAt: string;
  endAt: string;
  status: "UPCOMING" | "ACTIVE" | "COMPLETED";
  resultsPublished: boolean;
  positions: Position[];
  createdAt: string;
}

export interface VotingStatus {
  hasVoted: boolean;
  votedAt?: string;
  votedPositions?: number;
  totalPositions?: number;
}

export interface ElectionResults {
  electionId: string;
  totalVotes: number;
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
}

export interface CreateElectionDto {
  title: string;
  description?: string;
  startAt: string;
  endAt: string;
}

export interface AddCandidateDto {
  positionId: string;
  studentId: string;
  bio?: string;
  photoUrl?: string;
}

export interface CastVoteDto {
  positionId: string;
  candidateId: string;
  electionId?: string;
}

export const electionsApi = {
  getAll: () => apiClient<Election[]>("/api/v1/elections"),

  getElections: () => apiClient<Election[]>("/api/v1/elections"),

  getById: (id: string) => apiClient<Election>(`/api/v1/elections/${id}`),

  getElection: (id: string) => apiClient<Election>(`/api/v1/elections/${id}`),

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

  getVotingStatus: (electionId: string) =>
    apiClient<VotingStatus>(`/api/v1/elections/${electionId}/voting-status`),

  castVote: (data: CastVoteDto) =>
    apiClient<{ success: boolean; message: string }>("/api/v1/elections/vote", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  vote: (data: { electionId: string; candidateId: string }) =>
    apiClient<{ message: string }>("/api/v1/elections/vote", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getResults: (electionId: string) =>
    apiClient<ElectionResults>(`/api/v1/elections/${electionId}/results`),

  publishResults: (electionId: string) =>
    apiClient<Election>(`/api/v1/elections/${electionId}/publish-results`, {
      method: "POST",
    }),

  unpublishResults: (electionId: string) =>
    apiClient<Election>(`/api/v1/elections/${electionId}/unpublish-results`, {
      method: "POST",
    }),
};
