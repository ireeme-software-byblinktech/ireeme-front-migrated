"use client";

import { Bell, ChevronDown, Settings } from "lucide-react";
import { SearchInput } from "@/components/ui/FormElements";
import { Avatar } from "@/components/ui/Shared";
import { useState } from "react";
import Link from "next/link";

interface TopbarProps {
  title?: string;
  role: string;
  userName?: string;
  userEmail?: string;
  notificationCount?: number;
}

export function Topbar({
  title,
  role,
  userName = "User",
  notificationCount = 0,
}: TopbarProps) {
  const [search, setSearch] = useState("");

  return (
    <header className="app-topbar">
      {/* Title */}
      {title && <h2 className="topbar-title">{title}</h2>}

      {/* Spacer if no title */}
      {!title && <div style={{ flex: 1 }} />}

      {/* Search */}
      <SearchInput
        containerClassName="topbar-search"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Global search"
      />

      {/* Actions */}
      <div className="topbar-actions">
        {/* Notifications */}
        <button className="topbar-icon-btn" aria-label="Notifications">
          <Bell size={18} />
          {notificationCount > 0 && (
            <span className="topbar-notification-dot" />
          )}
        </button>

        {/* Settings */}
        <Link
          href={`/${role}/settings`}
          className="topbar-icon-btn"
          aria-label="Settings"
        >
          <Settings size={18} />
        </Link>

        {/* User Menu */}
        <button
          className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors"
          aria-label="User menu"
        >
          <div className="topbar-avatar">
            <Avatar name={userName} size="sm" />
          </div>
          <span
            className="text-sm font-medium hidden sm:block"
            style={{ color: "var(--color-text-primary)", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          >
            {userName}
          </span>
          <ChevronDown size={14} style={{ color: "var(--color-text-muted)" }} />
        </button>
      </div>
    </header>
  );
}
