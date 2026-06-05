import { apiClient, API_BASE_URL } from "./client";

export interface FileUploadResponse {
  key: string;
  url: string;
  fileName: string;
  size: number;
  mimeType: string;
}

export interface Document {
  id: string;
  key: string;
  fileName: string;
  fileType: string;
  size: number;
  category: string;
  uploadedAt: string;
  uploadedBy: string;
  status: "PRIVATE" | "PUBLIC" | "SHARED";
  url?: string;
}

const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token") || localStorage.getItem("accessToken");
};

export const filesApi = {
  // Upload a file
  upload: async (file: File): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/v1/files/upload`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "File upload failed");
    }

    return response.json();
  },

  // Get file download URL
  getFileUrl: (key: string) =>
    apiClient<{ url: string; expiresIn: number }>(`/api/v1/files/${key}/url`),

  // Delete a file (if backend supports it)
  deleteFile: (key: string) =>
    apiClient<void>(`/api/v1/files/${key}`, {
      method: "DELETE",
    }),
};
