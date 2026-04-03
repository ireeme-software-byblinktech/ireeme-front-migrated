import { AppLayout } from "@/components/layout/AppLayout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout 
      role="admin" 
      userName="Michael Chen" 
      userEmail="michael.chen@iremee.ac"
      notificationCount={8}
    >
      {children}
    </AppLayout>
  );
}
