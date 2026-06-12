import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { permissionsApi, CreatePermissionDto } from '@/lib/api/permissions';

export const usePermissions = (params?: { status?: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['permissions', params],
    queryFn: () => permissionsApi.getAll(params),
    staleTime: 2 * 60 * 1000,
  });
};

export const usePermission = (id: string | undefined) => {
  return useQuery({
    queryKey: ['permission', id],
    queryFn: () => permissionsApi.getById(id!),
    enabled: !!id,
  });
};

export const useCreatePermission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePermissionDto) => permissionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
  });
};
