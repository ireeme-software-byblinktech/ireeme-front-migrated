import { AppLayout } from "@/components/layout/AppLayout";

export default function AccountantLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout role="accountant" userName="Accountant" userEmail="accounts@iremee.ac">
      {children}
    </AppLayout>
  );
}
