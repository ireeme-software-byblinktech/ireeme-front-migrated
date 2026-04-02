import { AppLayout } from "@/components/layout/AppLayout";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout role="teacher" userName="Teacher" userEmail="teacher@iremee.ac">
      {children}
    </AppLayout>
  );
}
