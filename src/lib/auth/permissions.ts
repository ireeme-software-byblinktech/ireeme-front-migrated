import { UserRole } from "@/features/auth/types";

export function hasPermission(role: UserRole, permission: string): boolean {
  // Implement permission logic based on role
  return true;
}

