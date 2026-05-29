import { apiClient } from "@/lib/api/client";

export interface FileUploadResponse {
  key: string;
  url: string;
  mimetype: string;
  size: number;
}

export const filesApi = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    
    return apiClient<FileUploadResponse>("/api/v1/files/upload", {
      method: "POST",
      body: formData,
    });
  },

  getDownloadUrl: (key: string) =>
    apiClient<{ url: string }>(`/api/v1/files/${key}/url`, {
      method: "GET",
    }),
};
