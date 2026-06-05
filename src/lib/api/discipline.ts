import { apiClient } from "./client";

// ─── Types ────────────────────────────────────────────────────────────────

export type CaseStatus = "OPEN" | "CLOSED";
export type AppealStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface OffenseType {
  id: string;
  schoolId: string;
  name: string;
  pointDeduction: number;
}

export interface DisciplineCase {
  id: string;
  schoolId: string;
  studentId: string;
  officerId: string;
  offenseTypeId: string;
  description: string;
  pointsDeduct: number;
  status: CaseStatus;
  evidenceUrls: string[];
  createdAt: string;
  student?: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
    studentNumber: string;
  };
  offenseType?: OffenseType;
  officer?: {
    firstName: string;
    lastName: string;
  };
  appeal?: {
    id: string;
    reason: string;
    status: AppealStatus;
    createdAt: string;
  };
}

export interface StudentScore {
  studentId: string;
  totalPointsDeducted: number;
  openCasesCount: number;
}

export interface CreateOffenseTypeDto {
  name: string;
  pointDeduction: number;
}

export interface CreateCaseDto {
  studentId: string;
  offenseTypeId: string;
  description: string;
  pointsDeduct: number;
  evidenceUrls?: string[];
}

export interface AppealCaseDto {
  reason: string;
}

export interface QueryCasesDto {
  page?: number;
  limit?: number;
  studentId?: string;
  status?: CaseStatus;
}

export interface CasesResponse {
  data: DisciplineCase[];
  total: number;
  page: number;
  limit: number;
}

// ─── API Client ───────────────────────────────────────────────────────────

export const disciplineApi = {
  // Offense Types
  getOffenseTypes: () =>
    apiClient<OffenseType[]>("/discipline/offense-types"),

  createOffenseType: (data: CreateOffenseTypeDto) =>
    apiClient<OffenseType>("/discipline/offense-types", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateOffenseType: (id: string, data: Partial<CreateOffenseTypeDto>) =>
    apiClient<OffenseType>(`/discipline/offense-types/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteOffenseType: (id: string) =>
    apiClient<void>(`/discipline/offense-types/${id}`, {
      method: "DELETE",
    }),

  // Cases
  getCases: (params?: QueryCasesDto) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.studentId) searchParams.append("studentId", params.studentId);
    if (params?.status) searchParams.append("status", params.status);

    const query = searchParams.toString();
    return apiClient<CasesResponse>(
      `/discipline/cases${query ? `?${query}` : ""}`
    );
  },

  getCaseById: (id: string) =>
    apiClient<DisciplineCase>(`/discipline/cases/${id}`),

  createCase: (data: CreateCaseDto) =>
    apiClient<DisciplineCase>("/discipline/cases", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  closeCase: (id: string) =>
    apiClient<DisciplineCase>(`/discipline/cases/${id}/close`, {
      method: "PATCH",
    }),

  deleteCase: (id: string) =>
    apiClient<void>(`/discipline/cases/${id}`, {
      method: "DELETE",
    }),

  // Student Score
  getStudentScore: (studentId: string) =>
    apiClient<StudentScore>(`/discipline/student/${studentId}/score`),

  // Appeals
  submitAppeal: (caseId: string, data: AppealCaseDto) =>
    apiClient<DisciplineCase>(`/discipline/cases/${caseId}/appeal`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  resolveAppeal: (caseId: string, status: "APPROVED" | "REJECTED") =>
    apiClient<DisciplineCase>(
      `/discipline/cases/${caseId}/appeal/${status}`,
      {
        method: "PATCH",
      }
    ),
};

