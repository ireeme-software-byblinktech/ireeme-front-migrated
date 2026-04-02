import { AppLayout } from "@/components/layout/AppLayout";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout role="super-admin" userName="Super Admin" userEmail="superadmin@iremee.ac">
      {children}
    </AppLayout>
  );
}
