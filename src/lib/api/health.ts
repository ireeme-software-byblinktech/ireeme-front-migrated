import { apiClient } from "./client";

// ─── Types ────────────────────────────────────────────────────────────────

export type CaseStatus = "OPEN" | "CLOSED";
export type AppointmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface HealthRecord {
  id: string;
  schoolId: string;
  studentId: string;
  nurseId: string;
  visitDate: string;
  diagnosis: string;
  treatment: string | null;
  nurse: {
    firstName: string;
    lastName: string;
  };
  student: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
    studentNumber: string;
  };
}

export interface MedicalCase {
  id: string;
  schoolId: string;
  studentId: string;
  diagnosis: string;
  symptoms: string;
  openedAt: string;
  status: CaseStatus;
  student: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
    studentNumber: string;
  };
}

export interface Appointment {
  id: string;
  schoolId: string;
  studentId: string;
  nurseId: string;
  scheduledAt: string;
  reason: string;
  status: AppointmentStatus;
  nurse: {
    firstName: string;
    lastName: string;
  };
  student: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
    studentNumber: string;
  };
}

export interface HealthRecordsResponse {
  data: HealthRecord[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateHealthRecordDto {
  studentId: string;
  diagnosis: string;
  treatment?: string;
}

export interface CreateMedicalCaseDto {
  studentId: string;
  diagnosis: string;
  symptoms: string;
}

export interface CreateAppointmentDto {
  studentId: string;
  nurseId: string;
  scheduledAt: string;
  reason: string;
}

// ─── Dashboard Statistics ─────────────────────────────────────────────────

export interface DashboardStats {
  todayVisits: number;
  activeCases: number;
  todayAppointments: number;
  criticalCases: number;
}

// ─── API Client ───────────────────────────────────────────────────────────

export const healthApi = {
  // Health Records
  createHealthRecord: (data: CreateHealthRecordDto) =>
    apiClient<HealthRecord>("/health/records", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getAllHealthRecords: (page = 1, limit = 100) =>
    apiClient<HealthRecord[]>(`/health/records?page=${page}&limit=${limit}`),

  getHealthRecords: (studentId: string, page = 1, limit = 25) =>
    apiClient<HealthRecordsResponse>(
      `/health/records/student/${studentId}?page=${page}&limit=${limit}`
    ),

  // Medical Cases
  createMedicalCase: (data: CreateMedicalCaseDto) =>
    apiClient<MedicalCase>("/health/medical-cases", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMedicalCases: (studentId: string) =>
    apiClient<MedicalCase[]>(`/health/medical-cases/student/${studentId}`),

  closeMedicalCase: (id: string) =>
    apiClient<MedicalCase>(`/health/medical-cases/${id}/close`, {
      method: "PATCH",
    }),

  // Appointments
  createAppointment: (data: CreateAppointmentDto) =>
    apiClient<Appointment>("/health/appointments", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getAppointments: (studentId: string, page = 1, limit = 25) =>
    apiClient<Appointment[]>(
      `/health/appointments/student/${studentId}?page=${page}&limit=${limit}`
    ),

  updateAppointmentStatus: (id: string, status: AppointmentStatus) =>
    apiClient<Appointment>(`/health/appointments/${id}/status?status=${status}`, {
      method: "PATCH",
    }),
};

