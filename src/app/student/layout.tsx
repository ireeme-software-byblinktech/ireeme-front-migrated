import { AppLayout } from "@/components/layout/AppLayout";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout role="student" userName="Student" userEmail="student@iremee.ac">
      {children}
    </AppLayout>
  );
}
