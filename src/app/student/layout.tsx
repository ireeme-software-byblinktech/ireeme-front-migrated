"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { useStudentProfile } from "@/hooks/api/useStudentAPI";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { data: profile, isLoading, error } = useStudentProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error || !profile) {
    // Optionally redirect to login or show an error state
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col">
        <h2 className="textxl font-semibold mb-2">Error loading profile</h2>
        <p className="text-gray-500 mb-4">{error?.message || "Could not fetch user profile"}</p>
        <button onClick={() => window.location.href = '/login'} className="text-sm bg-black text-white px-4 py-2 rounded">
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <AppLayout
      role="student"
      userName={`${profile.user.firstName} ${profile.user.lastName}`}
      userEmail={profile.user.email}
      notificationCount={0} // To be implemented with real notification fetching 
    >
      {children}
    </AppLayout>
  );
}
