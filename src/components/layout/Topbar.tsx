"use client";

import { Bell, PanelLeft, Search } from "lucide-react";
import { Avatar } from "@/components/ui/Shared";
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
        {role === "accountant" && title ? (
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
      <div className="topbar-user-section">
        {/* Notifications */}
        <button className="topbar-notification-btn" aria-label="Notifications">
          <Bell size={role === "accountant" ? 14 : 16} />
          {notificationCount > 0 && (
            <span className="topbar-notification-dot-modern" />
          )}
        </button>

        {/* User Info */}
        <div className="topbar-user-info">
          <div className="topbar-user-avatar">
            <Avatar name={userName} size={role === "accountant" ? "sm" : "md"} />
          </div>
          <div className="topbar-user-text">
            <span className="topbar-user-name">{userName}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
