"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useQuery({
    queryKey: ["current-user"],
    queryFn: authApi.getCurrentUser,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <AppLayout 
      role="admin" 
      userName={user ? `${user.firstName} ${user.lastName}` : "Admin"} 
      userEmail={user?.email || "admin@example.com"}
      notificationCount={0}
    >
      {children}
    </AppLayout>
  );
}

