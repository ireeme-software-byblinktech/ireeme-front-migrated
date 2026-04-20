import { AppLayout } from "@/components/layout/AppLayout";

export default function DisciplineLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout role="discipline" pageTitle="Dashboard" userName="John Doe" userEmail="discipline@iremee.ac">
      {children}
    </AppLayout>
  );
}
