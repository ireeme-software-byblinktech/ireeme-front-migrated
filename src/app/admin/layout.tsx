import { AppLayout } from "@/components/layout/AppLayout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout role="admin" userName="Admin" userEmail="admin@iremee.ac">
      {children}
    </AppLayout>
  );
}
