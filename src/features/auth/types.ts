export type UserRole =
  | "STUDENT"
  | "TEACHER"
  | "SCHOOL_ADMIN"
  | "SUPER_ADMIN"
  | "NURSE"
  | "DISCIPLINE_OFFICER"
  | "ACCOUNTANT"
  | "PARENT"
  | "LIBRARIAN";

export interface User {
  id: string;
  schoolId?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}
