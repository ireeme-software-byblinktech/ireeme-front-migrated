import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { libraryApi, BooksQueryParams } from '@/lib/api/library';

export const useBooks = (params?: BooksQueryParams) => {
  return useQuery({
    queryKey: ['books', params],
    queryFn: () => libraryApi.getBooks(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useBook = (id: string) => {
  return useQuery({
    queryKey: ['book', id],
    queryFn: () => libraryApi.getBookById(id),
    enabled: !!id,
  });
};

export const useStudentBorrowings = (studentId: string | undefined) => {
  return useQuery({
    queryKey: ['borrowings', studentId],
    queryFn: () => libraryApi.getStudentBorrowings(studentId!),
    enabled: !!studentId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useBorrowBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: libraryApi.borrowBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['borrowings'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};

export const useReturnBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: libraryApi.returnBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['borrowings'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};
