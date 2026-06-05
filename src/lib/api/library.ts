import { apiClient } from "./client";

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string | null;
  publisher: string | null;
  publishedYear: number | null;
  category: string;
  quantity: number;
  availableQuantity: number;
  description: string | null;
  coverImage: string | null;
  location: string | null;
  createdAt: string;
}

export interface Borrowing {
  id: string;
  bookId: string;
  studentId: string;
  borrowedAt: string;
  dueDate: string;
  returnedAt: string | null;
  status: "BORROWED" | "RETURNED" | "OVERDUE";
  book: {
    id: string;
    title: string;
    author: string;
    category: string;
    coverImage: string | null;
  };
  student: {
    studentNumber: string;
    user: {
      firstName: string;
      lastName: string;
    };
  };
}

export interface BooksQueryParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface BooksResponse {
  data: Book[];
  total: number;
  page: number;
  limit: number;
}

export const libraryApi = {
  // Books
  getBooks: (params?: BooksQueryParams) => {
    const query = new URLSearchParams();
    if (params?.search) query.append("search", params.search);
    if (params?.category) query.append("category", params.category);
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());

    return apiClient<BooksResponse>(`/api/v1/library/books?${query.toString()}`);
  },

  getBookById: (id: string) => apiClient<Book>(`/api/v1/library/books/${id}`),

  createBook: (data: {
    title: string;
    author: string;
    isbn?: string;
    publisher?: string;
    publishedYear?: number;
    category: string;
    quantity: number;
    description?: string;
    coverImage?: string;
    location?: string;
  }) =>
    apiClient<Book>("/api/v1/library/books", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateBook: (id: string, data: Partial<Book>) =>
    apiClient<Book>(`/api/v1/library/books/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteBook: (id: string) =>
    apiClient<void>(`/api/v1/library/books/${id}`, {
      method: "DELETE",
    }),

  // Borrowings
  borrowBook: (data: { bookId: string; studentId: string; dueDate: string }) =>
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
