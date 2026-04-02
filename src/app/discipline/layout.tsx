import { AppLayout } from "@/components/layout/AppLayout";

export default function DisciplineLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout role="discipline" userName="Discipline Officer" userEmail="discipline@iremee.ac">
      {children}
    </AppLayout>
  );
}
