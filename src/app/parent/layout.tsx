import { AppLayout } from "@/components/layout/AppLayout";

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout 
      role="parent" 
      userName="Emily Rodriguez" 
      userEmail="emily.rodriguez@iremee.ac"
      notificationCount={2}
    >
      {children}
    </AppLayout>
  );
}
