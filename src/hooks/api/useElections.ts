import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { electionsApi } from '@/lib/api/elections';

export const useElections = () => {
  return useQuery({
    queryKey: ['elections'],
    queryFn: electionsApi.getAll,
    staleTime: 5 * 60 * 1000,
  });
};

export const useElection = (id: string | undefined) => {
  return useQuery({
    queryKey: ['election', id],
    queryFn: () => electionsApi.getById(id!),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
};

export const useElectionResults = (electionId: string | undefined) => {
  return useQuery({
    queryKey: ['election-results', electionId],
    queryFn: () => electionsApi.getResults(electionId!),
    enabled: !!electionId,
    staleTime: 1 * 60 * 1000,
  });
};

export const useVote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: electionsApi.vote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['elections'] });
      queryClient.invalidateQueries({ queryKey: ['election'] });
      queryClient.invalidateQueries({ queryKey: ['election-results'] });
    },
  });
};
