import { AppLayout } from "@/components/layout/AppLayout";

export default function AlumniLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout 
      role="alumni" 
      userName="John Alumni" 
      userEmail="john.alumni@alumni.net"
      notificationCount={5}
    >
      {children}
    </AppLayout>
  );
}
