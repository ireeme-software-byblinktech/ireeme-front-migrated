"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardList,
  CalendarDays,
  Library,
  FileText,
  MessageSquare,
  Bell,
  BarChart2,
  Settings,
  LogOut,
  Bot,
  ShieldAlert,
  Stethoscope,
  DollarSign,
  ChevronDown,
  StickyNote,
  UserCheck,
  TrendingUp,
} from "lucide-react";
import { Avatar } from "@/components/ui/Shared";

// ─── TYPES ────────────────────────────────────────────────────

export type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
};

export type NavGroup = {
  id: string;
  label: string;
  items: NavItem[];
  collapsible?: boolean;
};

// ─── NAVIGATION CONFIGS per role ──────────────────────────────

const TEACHER_GROUPS: NavGroup[] = [
  {
    id: "main",
    label: "",
    collapsible: false,
    items: [
      { label: "Dashboard", href: "/teacher", icon: <LayoutDashboard size={18} /> },
    ],
  },
  {
    id: "academics",
    label: "Academics",
    collapsible: true,
    items: [
      { label: "Grades", href: "/teacher/grades", icon: <GraduationCap size={18} /> },
      { label: "Assignments", href: "/teacher/assignments", icon: <ClipboardList size={18} /> },
      { label: "Attendance", href: "/teacher/attendance", icon: <UserCheck size={18} /> },
      { label: "Timetable", href: "/teacher/timetable", icon: <CalendarDays size={18} /> },
      { label: "Notes", href: "/teacher/notes", icon: <StickyNote size={18} /> },
      { label: "Report Card", href: "/teacher/report-card", icon: <FileText size={18} /> },
      { label: "Library", href: "/teacher/library", icon: <Library size={18} /> },
    ],
  },
  {
    id: "students",
    label: "Students",
    collapsible: false,
    items: [
      { label: "Students", href: "/teacher/students", icon: <Users size={18} /> },
    ],
  },
  {
    id: "schedule",
    label: "",
    collapsible: false,
    items: [
      { label: "Schedule", href: "/teacher/timetable", icon: <CalendarDays size={18} /> },
    ],
  },
  {
    id: "tools",
    label: "",
    collapsible: false,
    items: [
      { label: "Appeals", href: "/teacher/appeals", icon: <ShieldAlert size={18} /> },
      { label: "Campus AI", href: "/teacher/ai", icon: <Bot size={18} /> },
      { label: "Messages", href: "/teacher/messages", icon: <MessageSquare size={18} />, badge: 3 },
    ],
  },
];

const ADMIN_GROUPS: NavGroup[] = [
  {
    id: "main",
    label: "",
    collapsible: false,
    items: [
      { label: "Dashboard", href: "/admin", icon: <LayoutDashboard size={18} /> },
    ],
  },
  {
    id: "academics",
    label: "Academics",
    collapsible: true,
    items: [
      { label: "Students", href: "/admin/students", icon: <Users size={18} /> },
      { label: "Teachers", href: "/admin/teachers", icon: <GraduationCap size={18} /> },
      { label: "Classes", href: "/admin/classes", icon: <BookOpen size={18} /> },
      { label: "Attendance", href: "/admin/attendance", icon: <UserCheck size={18} /> },
      { label: "Grades", href: "/admin/grades", icon: <BarChart2 size={18} /> },
      { label: "Timetable", href: "/admin/timetable", icon: <CalendarDays size={18} /> },
      { label: "Library", href: "/admin/library", icon: <Library size={18} /> },
    ],
  },
  {
    id: "communication",
    label: "Communication",
    collapsible: true,
    items: [
      { label: "Announcements", href: "/admin/announcements", icon: <Bell size={18} /> },
      { label: "Messages", href: "/admin/messages", icon: <MessageSquare size={18} /> },
    ],
  },
  {
    id: "system",
    label: "",
    collapsible: false,
    items: [
      { label: "Reports", href: "/admin/reports", icon: <TrendingUp size={18} /> },
      { label: "Settings", href: "/admin/settings", icon: <Settings size={18} /> },
    ],
  },
];

const STUDENT_GROUPS: NavGroup[] = [
  {
    id: "main",
    label: "",
    collapsible: false,
    items: [
      { label: "Dashboard", href: "/student", icon: <LayoutDashboard size={18} /> },
    ],
  },
  {
    id: "academics",
    label: "Academics",
    collapsible: true,
    items: [
      { label: "My Grades", href: "/student/grades", icon: <GraduationCap size={18} /> },
      { label: "Assignments", href: "/student/assignments", icon: <ClipboardList size={18} /> },
      { label: "Timetable", href: "/student/timetable", icon: <CalendarDays size={18} /> },
      { label: "Attendance", href: "/student/attendance", icon: <UserCheck size={18} /> },
      { label: "Library", href: "/student/library", icon: <Library size={18} /> },
      { label: "Report Card", href: "/student/report-card", icon: <FileText size={18} /> },
    ],
  },
  {
    id: "tools",
    label: "",
    collapsible: false,
    items: [
      { label: "Messages", href: "/student/messages", icon: <MessageSquare size={18} /> },
      { label: "Settings", href: "/student/settings", icon: <Settings size={18} /> },
    ],
  },
];

const PARENT_GROUPS: NavGroup[] = [
  {
    id: "main",
    label: "",
    collapsible: false,
    items: [
      { label: "Dashboard", href: "/parent", icon: <LayoutDashboard size={18} /> },
      { label: "My Children", href: "/parent/children", icon: <Users size={18} /> },
    ],
  },
  {
    id: "academics",
    label: "Academics",
    collapsible: true,
    items: [
      { label: "Grades", href: "/parent/grades", icon: <GraduationCap size={18} /> },
      { label: "Attendance", href: "/parent/attendance", icon: <UserCheck size={18} /> },
      { label: "Timetable", href: "/parent/timetable", icon: <CalendarDays size={18} /> },
    ],
  },
  {
    id: "tools",
    label: "",
    collapsible: false,
    items: [
      { label: "Messages", href: "/parent/messages", icon: <MessageSquare size={18} /> },
      { label: "Settings", href: "/parent/settings", icon: <Settings size={18} /> },
    ],
  },
];

const ACCOUNTANT_GROUPS: NavGroup[] = [
  {
    id: "main",
    label: "",
    collapsible: false,
    items: [
      { label: "Dashboard", href: "/accountant", icon: <LayoutDashboard size={18} /> },
      { label: "Payments", href: "/accountant/payments", icon: <DollarSign size={18} /> },
      { label: "Invoices", href: "/accountant/invoices", icon: <FileText size={18} /> },
      { label: "Reports", href: "/accountant/reports", icon: <BarChart2 size={18} /> },
      { label: "Settings", href: "/accountant/settings", icon: <Settings size={18} /> },
    ],
  },
];

const SUPER_ADMIN_GROUPS: NavGroup[] = [
  {
    id: "main",
    label: "",
    collapsible: false,
    items: [
      { label: "Dashboard", href: "/super-admin", icon: <LayoutDashboard size={18} /> },
      { label: "Schools", href: "/super-admin/schools", icon: <BookOpen size={18} /> },
      { label: "Users", href: "/super-admin/users", icon: <Users size={18} /> },
      { label: "Analytics", href: "/super-admin/analytics", icon: <BarChart2 size={18} /> },
      { label: "Reports", href: "/super-admin/reports", icon: <TrendingUp size={18} /> },
      { label: "Settings", href: "/super-admin/settings", icon: <Settings size={18} /> },
    ],
  },
];

const DISCIPLINE_GROUPS: NavGroup[] = [
  {
    id: "main",
    label: "",
    collapsible: false,
    items: [
      { label: "Dashboard", href: "/discipline", icon: <LayoutDashboard size={18} /> },
      { label: "Incidents", href: "/discipline/incidents", icon: <ShieldAlert size={18} /> },
      { label: "Students", href: "/discipline/students", icon: <Users size={18} /> },
      { label: "Reports", href: "/discipline/reports", icon: <FileText size={18} /> },
      { label: "Settings", href: "/discipline/settings", icon: <Settings size={18} /> },
    ],
  },
];

const LIBRARIAN_GROUPS: NavGroup[] = [
  {
    id: "main",
    label: "",
    collapsible: false,
    items: [
      { label: "Dashboard", href: "/librarian", icon: <LayoutDashboard size={18} /> },
      { label: "Books", href: "/librarian/books", icon: <BookOpen size={18} /> },
      { label: "Loans", href: "/librarian/loans", icon: <Library size={18} /> },
      { label: "Members", href: "/librarian/members", icon: <Users size={18} /> },
      { label: "Settings", href: "/librarian/settings", icon: <Settings size={18} /> },
    ],
  },
];

const NURSE_GROUPS: NavGroup[] = [
  {
    id: "main",
    label: "",
    collapsible: false,
    items: [
      { label: "Dashboard", href: "/nurse", icon: <LayoutDashboard size={18} /> },
      { label: "Health Records", href: "/nurse/records", icon: <Stethoscope size={18} /> },
      { label: "Students", href: "/nurse/students", icon: <Users size={18} /> },
      { label: "Reports", href: "/nurse/reports", icon: <FileText size={18} /> },
      { label: "Settings", href: "/nurse/settings", icon: <Settings size={18} /> },
    ],
  },
];

const NAV_MAP: Record<string, NavGroup[]> = {
  teacher: TEACHER_GROUPS,
  admin: ADMIN_GROUPS,
  "super-admin": SUPER_ADMIN_GROUPS,
  student: STUDENT_GROUPS,
  parent: PARENT_GROUPS,
  accountant: ACCOUNTANT_GROUPS,
  discipline: DISCIPLINE_GROUPS,
  librarian: LIBRARIAN_GROUPS,
  nurse: NURSE_GROUPS,
};

const ROLE_LABELS: Record<string, string> = {
  teacher: "Teacher",
  admin: "Administrator",
  "super-admin": "Super Admin",
  student: "Student",
  parent: "Parent / Guardian",
  accountant: "Accountant",
  discipline: "Discipline Officer",
  librarian: "Librarian",
  nurse: "School Nurse",
};

// ─── Collapsible Group Component ─────────────────────────────

function NavGroupSection({
  group,
  isActive,
  defaultOpen,
}: {
  group: NavGroup;
  isActive: (href: string) => boolean;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? true);

  // If a child is active, start open
  const hasActiveChild = group.items.some((i) => isActive(i.href));

  const [initialized, setInitialized] = useState(false);
  const isOpen = !initialized ? hasActiveChild || open : open;

  if (!group.collapsible) {
    return (
      <ul className="sidebar-nav-list">
        {group.items.map((item) => (
          <NavLink key={item.href} item={item} isActive={isActive(item.href)} />
        ))}
      </ul>
    );
  }

  return (
    <div className="sidebar-group">
      <button
        className="sidebar-group-header"
        onClick={() => {
          setInitialized(true);
          setOpen((v) => !v);
        }}
        aria-expanded={isOpen}
      >
        <span className="sidebar-group-label">{group.label}</span>
        <ChevronDown
          size={14}
          className={cn("sidebar-group-chevron", isOpen && "sidebar-group-chevron--open")}
        />
      </button>
      {isOpen && (
        <ul className="sidebar-nav-list sidebar-nav-list--indented">
          {group.items.map((item) => (
            <NavLink key={item.href} item={item} isActive={isActive(item.href)} />
          ))}
        </ul>
      )}
    </div>
  );
}

function NavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <li>
      <Link
        href={item.href}
        className={cn("sidebar-nav-item", isActive && "active")}
      >
        <span className="sidebar-nav-icon">{item.icon}</span>
        <span className="sidebar-nav-label">{item.label}</span>
        {item.badge !== undefined && (
          <span className="sidebar-nav-badge">{item.badge}</span>
        )}
      </Link>
    </li>
  );
}

// ─── Sidebar Component ────────────────────────────────────────

interface SidebarProps {
  role: string;
  userName?: string;
  userEmail?: string;
}

export function Sidebar({ role, userName = "User", userEmail }: SidebarProps) {
  const pathname = usePathname();
  const groups = NAV_MAP[role] ?? ADMIN_GROUPS;
  const roleLabel = ROLE_LABELS[role] ?? role;

  const isActive = (href: string) => {
    if (href === `/${role}`) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="app-sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <span className="sidebar-logo-wordmark">iremee</span>
      </div>

      {/* Role label */}
      <div className="sidebar-role-badge">{roleLabel}</div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {groups.map((group) => (
          <NavGroupSection
            key={group.id}
            group={group}
            isActive={isActive}
            defaultOpen={true}
          />
        ))}
      </nav>

      {/* User footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <Avatar name={userName} size="sm" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="sidebar-user-name truncate">{userName}</div>
            {userEmail && (
              <div className="sidebar-user-email truncate">{userEmail}</div>
            )}
          </div>
        </div>
        <Link href="/login" className="sidebar-nav-item sidebar-logout">
          <LogOut size={16} className="sidebar-nav-icon" />
          <span className="sidebar-nav-label">Sign Out</span>
        </Link>
      </div>
    </aside>
  );
}
