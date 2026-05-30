import { apiClient } from "./client";

export interface Medication {
  id: string;
  schoolId: string;
  name: string;
  type: string;
  quantity: string;
  expiryDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicationDto {
  name: string;
  type: string;
  quantity: string;
  expiryDate: string;
  status?: string;
}

export interface UpdateMedicationDto {
  name?: string;
  type?: string;
  quantity?: string;
  expiryDate?: string;
  status?: string;
}

export const medicationsApi = {
  getAll: (page = 1, limit = 100) =>
    apiClient<Medication[]>(`/api/v1/medications?page=${page}&limit=${limit}`),

  getById: (id: string) =>
    apiClient<Medication>(`/api/v1/medications/${id}`),

  create: (data: CreateMedicationDto) =>
    apiClient<Medication>("/api/v1/medications", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateMedicationDto) =>
    apiClient<Medication>(`/api/v1/medications/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiClient<void>(`/api/v1/medications/${id}`, {
      method: "DELETE",
    }),
};
