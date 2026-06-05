import { apiClient } from "./client";

// ─── Types ────────────────────────────────────────────────────────────────

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  genre?: string;
  totalCopies: number;
  availableCopies: number;
  available?: number; // Backend field (for compatibility)
  coverUrl?: string;
  schoolId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Borrowing {
  id: string;
  bookId: string;
  studentId: string;
  borrowedAt: string;
  dueDate: string;
  returnedAt?: string;
  schoolId: string;
  book?: Book;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateBookDto {
  title: string;
  author: string;
  isbn?: string;
  genre?: string;
  totalCopies: number;
  coverUrl?: string;
}

export interface UpdateBookDto {
  title?: string;
  author?: string;
  isbn?: string;
  genre?: string;
  totalCopies?: number;
  coverUrl?: string;
}

export interface CreateBorrowingDto {
  bookId: string;
  studentId: string;
  dueDate: string;
}

export interface QueryBooksDto {
  search?: string;
  genre?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── API ──────────────────────────────────────────────────────────────────

export const libraryApi = {
  // Books
  getBooks: (params?: QueryBooksDto) => {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiClient<PaginatedResponse<Book>>(`/library/books${queryString}`);
  },

  getBook: (id: string) =>
    apiClient<Book>(`/library/books/${id}`),

  createBook: (data: CreateBookDto) =>
    apiClient<Book>("/library/books", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateBook: (id: string, data: UpdateBookDto) =>
    apiClient<Book>(`/library/books/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteBook: (id: string) =>
    apiClient<void>(`/library/books/${id}`, {
      method: "DELETE",
    }),

  // Borrowings
  getBorrowings: (params?: { status?: string; page?: number; limit?: number }) => {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiClient<PaginatedResponse<Borrowing>>(`/library/borrowings${queryString}`);
  },

  createBorrowing: (data: CreateBorrowingDto) =>
    apiClient<Borrowing>("/library/borrowings", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  returnBook: (id: string) =>
    apiClient<Borrowing>(`/library/borrowings/${id}/return`, {
      method: "PATCH",
    }),

  getStudentBorrowings: (studentId: string) =>
    apiClient<Borrowing[]>(`/library/borrowings/student/${studentId}`),
};

