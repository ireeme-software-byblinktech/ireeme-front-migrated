export type UserRole =
  | "SUPER_ADMIN"
  | "SCHOOL_ADMIN"
  | "TEACHER"
  | "STUDENT"
  | "PARENT"
  | "ACCOUNTANT"
  | "LIBRARIAN"
  | "NURSE"
  | "DISCIPLINE_OFFICER";

export interface User {
  id?: string;
  sub?: string;
  email: string;
  schoolId?: string;
  roles?: string[];
  role?: UserRole;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string | null;
  jti?: string;
  iat?: number;
  exp?: number;
}
