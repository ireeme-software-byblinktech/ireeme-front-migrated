import { AppLayout } from "@/components/layout/AppLayout";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout 
      role="teacher" 
      userName="Sarah Johnson" 
      userEmail="sarah.johnson@iremee.ac"
      notificationCount={5}
    >
      {children}
    </AppLayout>
  );
}

