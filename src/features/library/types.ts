export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  available: boolean;
}

export interface Borrowing {
  id: string;
  bookId: string;
  userId: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
}

