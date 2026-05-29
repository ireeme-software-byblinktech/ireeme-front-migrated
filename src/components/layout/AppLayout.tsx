"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { useState } from "react";

interface AppLayoutProps {
  children: React.ReactNode;
  role: string;
  pageTitle?: string;
  userName?: string;
  userEmail?: string;
  avatarUrl?: string;
  notificationCount?: number;
}

export function AppLayout({
  children,
  role,
  pageTitle,
  userName = "User",
  userEmail,
  avatarUrl,
  notificationCount = 0,
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="app-layout">
      <Sidebar 
        role={role} 
        userName={userName}
        avatarUrl={avatarUrl} 
        userEmail={userEmail}
        isOpen={sidebarOpen}
      />
      <main className={`app-main ${!sidebarOpen ? 'app-main--sidebar-closed' : ''}`}>
        <Topbar
          title={pageTitle}
          role={role}
          userName={userName}
          avatarUrl={avatarUrl}
          notificationCount={notificationCount}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="app-content">{children}</div>
      </main>
    </div>
  );
}
