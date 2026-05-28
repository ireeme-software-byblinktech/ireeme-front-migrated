export interface User {
  sub: string;
  email: string;
  schoolId: string;
  roles: string[];
  jti: string;
  iat: number;
  exp: number;
}

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

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  schoolName: string;
  schoolCode: string;
  region: string;
  type: string;
  country: string;
}
