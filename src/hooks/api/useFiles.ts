import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { filesApi } from '@/lib/api/files';

export const useUploadFile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: filesApi.upload,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
};

export const useFileUrl = (key: string | undefined) => {
  return useQuery({
    queryKey: ['file-url', key],
    queryFn: () => filesApi.getFileUrl(key!),
    enabled: !!key,
    staleTime: 10 * 60 * 1000, // 10 minutes (URLs expire in 15 min)
  });
};

export const useDeleteFile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: filesApi.deleteFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
};
