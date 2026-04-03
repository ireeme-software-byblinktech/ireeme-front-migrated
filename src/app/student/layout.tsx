import { AppLayout } from "@/components/layout/AppLayout";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout 
      role="student" 
      userName="John Doe" 
      userEmail="john.doe@iremee.ac"
      notificationCount={3}
    >
      {children}
    </AppLayout>
  );
}
