"use client";

import { Bell, ChevronDown, Settings, Menu, Search } from "lucide-react";
import { Avatar } from "@/components/ui/Shared";
import { useState } from "react";
import Link from "next/link";

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
    <header className="app-topbar-modern">
      {/* Left Section */}
      <div className="topbar-left-section">
        {/* Sidebar Toggle */}
        <button 
          className="topbar-sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Search */}
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
      </div>

      {/* User Section */}
      <div className="topbar-user-section">
        {/* Notifications */}
        <button className="topbar-notification-btn" aria-label="Notifications">
          <Bell size={20} />
          {notificationCount > 0 && (
            <span className="topbar-notification-dot-modern" />
          )}
        </button>

        {/* User Info */}
        <div className="topbar-user-info">
          <div className="topbar-user-text">
            <span className="topbar-user-name">{userName}</span>
            <span className="topbar-user-role">{roleDisplay}</span>
          </div>
          <div className="topbar-user-avatar">
            <Avatar name={userName} size="md" />
          </div>
        </div>
      </div>
    </header>
  );
}
