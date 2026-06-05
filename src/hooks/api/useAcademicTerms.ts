import { useQuery } from '@tanstack/react-query';
import { academicTermsApi } from '@/lib/api/academic-terms';

export const useAcademicTerms = () => {
  return useQuery({
    queryKey: ['academic-terms'],
    queryFn: academicTermsApi.getTerms,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useActiveTerm = () => {
  return useQuery({
    queryKey: ['academic-term', 'active'],
    queryFn: academicTermsApi.getActiveTerm,
    staleTime: 30 * 60 * 1000,
    retry: 1,
  });
};
