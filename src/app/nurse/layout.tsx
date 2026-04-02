import { AppLayout } from "@/components/layout/AppLayout";

export default function NurseLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout role="nurse" userName="School Nurse" userEmail="nurse@iremee.ac">
      {children}
    </AppLayout>
  );
}
