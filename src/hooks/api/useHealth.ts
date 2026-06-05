import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { healthApi } from '@/lib/api/health';

export const useHealthRecords = (studentId: string | undefined) => {
  return useQuery({
    queryKey: ['health-records', studentId],
    queryFn: () => healthApi.getStudentHealthRecords(studentId!),
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useMedicalCases = (studentId: string | undefined) => {
  return useQuery({
    queryKey: ['medical-cases', studentId],
    queryFn: () => healthApi.getStudentMedicalCases(studentId!),
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useHealthAppointments = (studentId: string | undefined) => {
  return useQuery({
    queryKey: ['health-appointments', studentId],
    queryFn: () => healthApi.getStudentAppointments(studentId!),
    enabled: !!studentId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: healthApi.createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-appointments'] });
    },
  });
};

export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      healthApi.updateAppointmentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-appointments'] });
    },
  });
};
