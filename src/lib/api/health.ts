import { apiClient } from "./client";

export interface HealthRecord {
  id: string;
  studentId: string;
  date: string;
  chiefComplaint: string;
  diagnosis: string | null;
  treatment: string | null;
  prescriptions: string | null;
  followUpDate: string | null;
  nurseId: string;
  nurse: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
  createdAt: string;
}

export interface MedicalCase {
  id: string;
  studentId: string;
  title: string;
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  openedBy: string;
  openedAt: string;
  closedAt: string | null;
  closedBy: string | null;
}

export interface HealthAppointment {
  id: string;
  studentId: string;
  appointmentDate: string;
  reason: string;
  type: string;
  description: string | null;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  createdAt: string;
}

export interface HealthInfo {
  bloodType: string | null;
  height: number | null;
  weight: number | null;
  allergies: string | null;
  medicalConditions: string | null;
}

export const healthApi = {
  // Health Records
  createHealthRecord: (data: {
    studentId: string;
    chiefComplaint: string;
    diagnosis?: string;
    treatment?: string;
    prescriptions?: string;
    followUpDate?: string;
  }) =>
    apiClient<HealthRecord>("/api/v1/health/records", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getStudentHealthRecords: (studentId: string) =>
    apiClient<HealthRecord[]>(`/api/v1/health/records/student/${studentId}`),

  // Medical Cases
  createMedicalCase: (data: {
    studentId: string;
    title: string;
    description: string;
    severity: string;
  }) =>
    apiClient<MedicalCase>("/api/v1/health/medical-cases", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getStudentMedicalCases: (studentId: string) =>
    apiClient<MedicalCase[]>(`/api/v1/health/medical-cases/student/${studentId}`),

  closeMedicalCase: (caseId: string) =>
    apiClient<MedicalCase>(`/api/v1/health/medical-cases/${caseId}/close`, {
      method: "PATCH",
    }),

  // Appointments
  createAppointment: (data: {
    studentId: string;
    appointmentDate: string;
    reason: string;
    type: string;
    description?: string;
  }) =>
    apiClient<HealthAppointment>("/api/v1/health/appointments", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getStudentAppointments: (studentId: string) =>
    apiClient<HealthAppointment[]>(`/api/v1/health/appointments/student/${studentId}`),

  updateAppointmentStatus: (appointmentId: string, status: string) =>
    apiClient<HealthAppointment>(`/api/v1/health/appointments/${appointmentId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};
