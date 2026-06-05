import { AppLayout } from "@/components/layout/AppLayout";

export default function LibrarianLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout role="librarian" userName="Librarian" userEmail="library@iremee.ac">
      {children}
    </AppLayout>
  );
}

