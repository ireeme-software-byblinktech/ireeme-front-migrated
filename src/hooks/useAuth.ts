"use client";

import { useEffect, useState } from "react";
import { User } from "@/features/auth/types";
import { apiClient } from "@/lib/api/client";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await apiClient<User>("/auth/me");
        setUser(userData);
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("access_token");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  return { user, isLoading, setUser };
}

