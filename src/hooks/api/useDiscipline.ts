import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { disciplineApi, QueryCasesDto } from '@/lib/api/discipline';

export const useDisciplineCases = (params?: QueryCasesDto) => {
  return useQuery({
    queryKey: ['discipline-cases', params],
    queryFn: () => disciplineApi.getCases(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useDisciplineCase = (id: string | undefined) => {
  return useQuery({
    queryKey: ['discipline-case', id],
    queryFn: () => disciplineApi.getCaseById(id!),
    enabled: !!id,
  });
};

export const useStudentDisciplineScore = (studentId: string | undefined) => {
  return useQuery({
    queryKey: ['discipline-score', studentId],
    queryFn: () => disciplineApi.getStudentScore(studentId!),
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useOffenseTypes = () => {
  return useQuery({
    queryKey: ['offense-types'],
    queryFn: disciplineApi.getOffenseTypes,
    staleTime: 30 * 60 * 1000,
  });
};

export const useSubmitAppeal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ caseId, reason }: { caseId: string; reason: string }) =>
      disciplineApi.submitAppeal(caseId, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discipline-cases'] });
      queryClient.invalidateQueries({ queryKey: ['discipline-case'] });
    },
  });
};
