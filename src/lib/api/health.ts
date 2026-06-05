import { apiClient } from "./client";

// ─── Types ────────────────────────────────────────────────────────────────

export type CaseStatus = "OPEN" | "CLOSED";
export type AppointmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface HealthRecord {
  id: string;
  schoolId?: string;
  studentId: string;
  nurseId: string;
  date?: string;
  visitDate?: string;
  chiefComplaint?: string;
  diagnosis: string;
  treatment: string | null;
  prescriptions?: string | null;
  followUpDate?: string | null;
  nurse: {
    firstName?: string;
    lastName?: string;
    user?: {
      firstName: string;
      lastName: string;
    };
  };
  student?: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
    studentNumber: string;
  };
  createdAt?: string;
}

export interface MedicalCase {
  id: string;
  schoolId?: string;
  studentId: string;
  title?: string;
  description?: string;
  diagnosis?: string;
  symptoms?: string;
  severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | CaseStatus;
  openedBy?: string;
  openedAt: string;
  closedAt: string | null;
  closedBy?: string | null;
  student?: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
    studentNumber: string;
  };
}

export interface HealthAppointment {
  id: string;
  schoolId?: string;
  studentId: string;
  nurseId?: string;
  appointmentDate?: string;
  scheduledAt?: string;
  reason: string;
  type?: string;
  description?: string | null;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW" | AppointmentStatus;
  nurse?: {
    firstName: string;
    lastName: string;
  };
  student?: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
    studentNumber: string;
  };
  createdAt?: string;
}

// Alias for compatibility
export type Appointment = HealthAppointment;

export interface HealthInfo {
  bloodType: string | null;
  height: number | null;
  weight: number | null;
  allergies: string | null;
  medicalConditions: string | null;
}

export interface HealthRecordsResponse {
  data: HealthRecord[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateHealthRecordDto {
  studentId: string;
  chiefComplaint?: string;
  diagnosis: string;
  treatment?: string;
  prescriptions?: string;
  followUpDate?: string;
}

export interface CreateMedicalCaseDto {
  studentId: string;
  title?: string;
  description?: string;
  diagnosis?: string;
  symptoms?: string;
  severity?: string;
}

export interface CreateAppointmentDto {
  studentId: string;
  nurseId?: string;
  appointmentDate?: string;
  scheduledAt?: string;
  reason: string;
  type?: string;
  description?: string;
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
    apiClient<HealthRecord>("/api/v1/health/records", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getAllHealthRecords: (page = 1, limit = 100) =>
    apiClient<HealthRecord[]>(`/api/v1/health/records?page=${page}&limit=${limit}`),

  getStudentHealthRecords: (studentId: string) =>
    apiClient<HealthRecord[]>(`/api/v1/health/records/student/${studentId}`),

  getHealthRecords: (studentId: string, page = 1, limit = 25) =>
    apiClient<HealthRecordsResponse>(
      `/api/v1/health/records/student/${studentId}?page=${page}&limit=${limit}`
    ),

  // Medical Cases
  createMedicalCase: (data: CreateMedicalCaseDto) =>
    apiClient<MedicalCase>("/api/v1/health/medical-cases", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getStudentMedicalCases: (studentId: string) =>
    apiClient<MedicalCase[]>(`/api/v1/health/medical-cases/student/${studentId}`),

  getMedicalCases: (studentId: string) =>
    apiClient<MedicalCase[]>(`/api/v1/health/medical-cases/student/${studentId}`),

  closeMedicalCase: (caseId: string) =>
    apiClient<MedicalCase>(`/api/v1/health/medical-cases/${caseId}/close`, {
      method: "PATCH",
    }),

  // Appointments
  createAppointment: (data: CreateAppointmentDto) =>
    apiClient<HealthAppointment>("/api/v1/health/appointments", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getStudentAppointments: (studentId: string) =>
    apiClient<HealthAppointment[]>(`/api/v1/health/appointments/student/${studentId}`),

  getAppointments: (studentId: string, page = 1, limit = 25) =>
    apiClient<HealthAppointment[]>(
      `/api/v1/health/appointments/student/${studentId}?page=${page}&limit=${limit}`
    ),

  updateAppointmentStatus: (appointmentId: string, status: string | AppointmentStatus) =>
    apiClient<HealthAppointment>(`/api/v1/health/appointments/${appointmentId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};
