"use client";

import { User } from "@/features/auth/types";

export function useAuth() {
  // Mock implementation - replace with actual auth logic
  const user: User | null = null;
  const isLoading = false;

  return { user, isLoading };
}
