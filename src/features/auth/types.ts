export type UserRole =
  | "student"
  | "teacher"
  | "admin"
  | "super-admin"
  | "nurse"
  | "discipline"
  | "accountant"
  | "parent"
  | "librarian";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
