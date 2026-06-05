import { useMutation, useQuery } from "@tanstack/react-query";
import { filesApi } from "./api";

export const fileKeys = {
  all: ["files"] as const,
  url: (key: string) => [...fileKeys.all, "url", key] as const,
};

export function useUploadFile() {
  return useMutation({
    mutationFn: (file: File) => filesApi.upload(file),
  });
}

export function useFileUrl(key: string | null) {
  return useQuery({
    queryKey: fileKeys.url(key || ""),
    queryFn: () => filesApi.getDownloadUrl(key!),
    enabled: !!key,
    staleTime: 10 * 60 * 1000, // 10 minutes (pre-signed URL expiry is usually 15 min)
  });
}

