"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { usePathname } from "next/navigation";

export default function AccountantLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Map pathnames to page titles
  const getPageTitle = (path: string) => {
    if (path === "/accountant") return "Dashboard";
    if (path === "/accountant/students") return "Students";
    if (path === "/accountant/staff") return "Staff";
    if (path === "/accountant/parents") return "Parents";
    if (path === "/accountant/payments") return "Payments";
    if (path === "/accountant/invoices") return "Invoices";
    if (path === "/accountant/transactions") return "Transactions";
    if (path === "/accountant/reports") return "Reports";
    if (path === "/accountant/documents") return "Documents";
    if (path === "/accountant/stock") return "Stock";
    if (path === "/accountant/settings") return "Settings";
    return "Accountant";
  };

  return (
    <AppLayout 
      role="accountant" 
      userName="David Wilson" 
      userEmail="david.wilson@iremee.ac"
      notificationCount={4}
      pageTitle={getPageTitle(pathname)}
    >
      {children}
    </AppLayout>
  );
}
