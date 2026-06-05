import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagesApi, SendMessageDto } from '@/lib/api/messages';

export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: messagesApi.getConversations,
    staleTime: 1 * 60 * 1000,
    refetchInterval: 15 * 1000, // Refetch every 15 seconds for real-time feel
  });
};

export const useMessages = (conversationId: string | undefined, params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['messages', conversationId, params],
    queryFn: () => messagesApi.getMessages(conversationId!, params),
    enabled: !!conversationId,
    staleTime: 30 * 1000,
    refetchInterval: 10 * 1000, // Refetch every 10 seconds
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SendMessageDto) => messagesApi.sendMessage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
};
