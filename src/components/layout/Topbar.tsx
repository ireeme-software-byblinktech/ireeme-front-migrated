"use client";

import { Bell, PanelLeft, Search } from "lucide-react";
import { Avatar } from "@/components/ui/Shared";
import Link from "next/link";
import { useState } from "react";


interface TopbarProps {
  title?: string;
  role: string;
  userName?: string;
  userEmail?: string;
  notificationCount?: number;
  onToggleSidebar?: () => void;
}


export function Topbar({
  title,
  role,
  userName = "User",
  notificationCount = 0,
  onToggleSidebar,
}: TopbarProps) {
  const [search, setSearch] = useState("");

  // Map role to display name
  const roleDisplayNames: Record<string, string> = {
    student: "Student",
    teacher: "Teacher",
    admin: "Administrator",
    parent: "Parent",
    "super-admin": "Super Admin",
    accountant: "Accountant",
    discipline: "Discipline Officer",
    librarian: "Librarian",
    nurse: "School Nurse"
  };

  const roleDisplay = roleDisplayNames[role] || "User";

  return (
    <header className={`app-topbar-modern ${role === "accountant" ? "accountant-topbar" : ""}`}>
      {/* Left Section */}
      <div className="topbar-left-section">
        {/* Sidebar Toggle */}
        <button
          className="topbar-sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <PanelLeft size={20} />
        </button>

        {/* Conditional: Page Title for Accountant or Search for others */}
        {title ? (
          <div>
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          </div>
        ) : (
          /* Search */
          <div className="topbar-search-modern">
            <Search size={18} className="topbar-search-icon" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="topbar-search-input"
            />
          </div>
        )}
      </div>

      {/* User Section */}
      <div className="flex items-center gap-5">
        {/* Bell Icon – circular border */}
        <button
          className="flex items-center justify-center w-[42px] h-[42px] rounded-full border border-[#DDE1E6] bg-white hover:bg-gray-50 transition-colors shrink-0"
          aria-label="Notifications"
        >
          <Bell size={19} className="text-[#4B5563]" strokeWidth={1.6} />
        </button>

        <Link href={`/${role}/profile`} className="flex items-center gap-4 hover:opacity-80 transition-opacity">
          {/* Name + Role text */}
          <div className="hidden sm:flex flex-col items-start text-left">
            <span className="text-[14px] font-medium text-[#111827] leading-snug">{userName}</span>
            <span className="text-[12px] font-normal text-[#9CA3AF] leading-snug">{roleDisplay}</span>
          </div>

          {/* Avatar */}
          <Avatar name={userName} size="md" className="w-[42px] h-[42px] rounded-full ring-2 ring-gray-100 shrink-0" />
        </Link>
      </div>
    </header>
  );
}
