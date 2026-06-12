import { apiClient } from "./client";

// ─── Types ────────────────────────────────────────────────────────────────

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string | null;
  genre?: string;
  category?: string;
  publisher?: string | null;
  publishedYear?: number | null;
  totalCopies?: number;
  availableCopies?: number;
  quantity?: number;
  availableQuantity?: number;
  available?: number;
  description?: string | null;
  coverImage?: string | null;
  coverUrl?: string;
  location?: string | null;
  schoolId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Borrowing {
  id: string;
  bookId: string;
  studentId: string;
  borrowedAt: string;
  dueDate: string;
  returnedAt?: string | null;
  schoolId?: string;
  status?: "BORROWED" | "RETURNED" | "OVERDUE";
  book?: {
    id: string;
    title: string;
    author: string;
    category?: string;
    coverImage?: string | null;
  } & Book;
  student?: {
    id?: string;
    studentNumber?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    user?: {
      firstName: string;
      lastName: string;
    };
  };
}

export interface CreateBookDto {
  title: string;
  author: string;
  isbn?: string;
  genre?: string;
  category?: string;
  publisher?: string;
  publishedYear?: number;
  totalCopies?: number;
  quantity?: number;
  description?: string;
  coverImage?: string;
  coverUrl?: string;
  location?: string;
}

export interface UpdateBookDto {
  title?: string;
  author?: string;
  isbn?: string;
  genre?: string;
  category?: string;
  totalCopies?: number;
  quantity?: number;
  coverUrl?: string;
  coverImage?: string;
}

export interface CreateBorrowingDto {
  bookId: string;
  studentId: string;
  dueDate: string;
}

export interface QueryBooksDto {
  search?: string;
  genre?: string;
  category?: string;
  page?: number;
  limit?: number;
}

// Alias for compatibility
export type BooksQueryParams = QueryBooksDto;

export interface BooksResponse {
  data: Book[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

// ─── API ──────────────────────────────────────────────────────────────────

export const libraryApi = {
  // Books
  getBooks: (params?: QueryBooksDto) => {
    const query = new URLSearchParams();
    if (params?.search) query.append("search", params.search);
    if (params?.genre) query.append("genre", params.genre);
    if (params?.category) query.append("category", params.category);
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    const queryStr = query.toString();
    return apiClient<PaginatedResponse<Book>>(`/api/v1/library/books${queryStr ? `?${queryStr}` : ""}`);
  },

  getBookById: (id: string) => apiClient<Book>(`/api/v1/library/books/${id}`),

  // Alias for compatibility
  getBook: (id: string) => apiClient<Book>(`/api/v1/library/books/${id}`),

  createBook: (data: CreateBookDto) =>
    apiClient<Book>("/api/v1/library/books", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateBook: (id: string, data: UpdateBookDto) =>
    apiClient<Book>(`/api/v1/library/books/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteBook: (id: string) =>
    apiClient<void>(`/api/v1/library/books/${id}`, {
      method: "DELETE",
    }),

  // Borrowings
  getBorrowings: (params?: { status?: string; page?: number; limit?: number }) => {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : "";
    return apiClient<PaginatedResponse<Borrowing>>(`/api/v1/library/borrowings${queryString}`);
  },

  borrowBook: (data: CreateBorrowingDto) =>
    apiClient<Borrowing>("/api/v1/library/borrowings", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Alias for compatibility
  createBorrowing: (data: CreateBorrowingDto) =>
    apiClient<Borrowing>("/api/v1/library/borrowings", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  returnBook: (borrowingId: string) =>
    apiClient<Borrowing>(`/api/v1/library/borrowings/${borrowingId}/return`, {
      method: "PATCH",
    }),

  getStudentBorrowings: (studentId: string) =>
    apiClient<Borrowing[]>(`/api/v1/library/borrowings/student/${studentId}`),
};
