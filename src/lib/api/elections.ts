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

export const electionsApi = {
  getAll: () => apiClient<Election[]>("/api/v1/elections"),
  
  getElections: () => apiClient<Election[]>("/api/v1/elections"),

  getById: (id: string) => apiClient<Election>(`/api/v1/elections/${id}`),

  getVotingStatus: (electionId: string) =>
    apiClient<VotingStatus>(`/api/v1/elections/${electionId}/voting-status`),

  castVote: (data: { positionId: string; candidateId: string }) =>
    apiClient<{ message: string }>("/api/v1/elections/vote", {
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
};
