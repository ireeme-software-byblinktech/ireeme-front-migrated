import { AppLayout } from "@/components/layout/AppLayout";

export default function AccountantLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout 
      role="accountant" 
      userName="David Wilson" 
      userEmail="david.wilson@iremee.ac"
      notificationCount={4}
    >
      {children}
    </AppLayout>
  );
}
