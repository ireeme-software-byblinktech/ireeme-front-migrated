import { AppLayout } from "@/components/layout/AppLayout";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout 
      role="super-admin" 
      userName="Robert Anderson" 
      userEmail="robert.anderson@iremee.ac"
      notificationCount={12}
    >
      {children}
    </AppLayout>
  );
}
