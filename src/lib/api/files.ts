import { API_BASE_URL } from "./client";

// ─── Types ────────────────────────────────────────────────────────────────

export interface UploadedFile {
  key: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
}

export interface UploadFileResponse {
  key: string;
  url: string;
}

export interface GetFileUrlResponse {
  url: string;
}

// ─── API Client ───────────────────────────────────────────────────────────

const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
};

export const filesApi = {
  // Upload a file to S3/MinIO
  uploadFile: async (file: File): Promise<UploadFileResponse> => {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error("Not authenticated. Please log in again.");
    }

    const formData = new FormData();
    formData.append("file", file);

    console.log("Uploading file:", file.name, "Size:", file.size, "Type:", file.type);
    console.log("Auth token present:", !!token);

    const response = await fetch(`${API_BASE_URL}/files/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    console.log("Upload response status:", response.status);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      console.error("Upload error:", error);
      throw new Error(error.message || "Failed to upload file");
    }

    return response.json();
  },

  // Get a pre-signed URL for a file
  getFileUrl: async (key: string): Promise<GetFileUrlResponse> => {
    const token = getAuthToken();
    // URL encode the key to handle slashes in the path
    const encodedKey = encodeURIComponent(key);

    const response = await fetch(`${API_BASE_URL}/files/${encodedKey}/url`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || "Failed to get file URL");
    }

    return response.json();
  },
};

