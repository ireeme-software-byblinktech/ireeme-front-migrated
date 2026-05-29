"use client";

import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/AppLayout";
import { studentsApi } from "@/lib/api/students";
import { Loader2, AlertCircle } from "lucide-react";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { data: student, isLoading, error } = useQuery({
    queryKey: ["student-profile"],
    queryFn: studentsApi.getMyProfile,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  // Show error state if API call fails
  if (error) {
    console.error("Failed to load student profile:", error);
    // Still render the layout with default values
    return (
      <AppLayout 
        role="student" 
        userName="Student"
        userEmail=""
        notificationCount={3}
      >
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Profile</h2>
            <p className="text-gray-600 mb-4">Please try refreshing the page</p>
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
  const avatarUrl = student?.user?.avatarUrl || undefined;

  // Transform classes data to get the first class
  const transformedStudent = student ? {
    ...student,
    class: student.classes && student.classes.length > 0
      ? student.classes[0].class
      : undefined
  } : undefined;

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
