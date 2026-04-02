import { AppLayout } from "@/components/layout/AppLayout";

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout role="parent" userName="Parent" userEmail="parent@iremee.ac">
      {children}
    </AppLayout>
  );
}
