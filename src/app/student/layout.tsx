"use client";

import { useStudentProfile } from "@/hooks/api/useStudentAPI";
import { AppLayout } from "@/components/layout/AppLayout";
import { Loader2, AlertCircle } from "lucide-react";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { data: student, isLoading, error } = useStudentProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  // Show error state if API call fails
  if (error || !student) {
    console.error("Failed to load student profile:", error);
    // Still render the layout with default values
    return (
      <AppLayout
        role="student"
        userName="Student"
        userEmail=""
        notificationCount={0}
      >
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Profile</h2>
            <p className="text-gray-600 mb-4">{error?.message || "Please try refreshing the page"}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Safely extract user data with fallbacks
  const userName = student?.user?.firstName && student?.user?.lastName
    ? `${student.user.firstName} ${student.user.lastName}`
    : "Student";
  const userEmail = student?.user?.email || "";
  const avatarUrl = (student as any)?.user?.avatarUrl || undefined;

  return (
    <AppLayout
      role="student"
      userName={userName}
      userEmail={userEmail}
      avatarUrl={avatarUrl}
      notificationCount={3}
    >
      {children}
    </AppLayout>
  );
}

