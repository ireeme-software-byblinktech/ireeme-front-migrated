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
  User,
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
  icon?: React.ReactNode;
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
    icon: <GraduationCap size={18} />,
    collapsible: true,
    items: [
      { label: "Grades", href: "/teacher/grades", icon: <BarChart2 size={18} /> },
      { label: "Assignments", href: "/teacher/assignments", icon: <ClipboardList size={18} /> },
      { label: "Attendance", href: "/teacher/attendance", icon: <UserCheck size={18} /> },
      { label: "Timetable", href: "/teacher/timetable", icon: <CalendarDays size={18} /> },
      { label: "Notes", href: "/teacher/notes", icon: <StickyNote size={18} /> },
      { label: "Report Card", href: "/teacher/report-card", icon: <FileText size={18} /> },
    ],
  },
  {
    id: "student",
    label: "Students",
    icon: <Users size={18} />,
    collapsible: false,
    items: [
      { label: "Students", href: "/teacher/students", icon: <Users size={18} /> },
    ],
  },
  {
    id: "schedule",
    label: "Schedule",
    icon: <CalendarDays size={18} />,
    collapsible: false,
    items: [
      { label: "Schedule", href: "/teacher/schedule", icon: <CalendarDays size={18} /> },
    ],
  },
  {
    id: "appeals",
    label: "Appeals",
    icon: <ShieldAlert size={18} />,
    collapsible: false,
    items: [
      { label: "Appeals", href: "/teacher/appeals", icon: <ShieldAlert size={18} /> },
    ],
  },
  {
    id: "campus-ai",
    label: "Campus Ai",
    icon: <Bot size={18} />,
    collapsible: false,
    items: [
      { label: "Campus Ai", href: "/teacher/campus-ai", icon: <Bot size={18} />},
    ],
  },
  {
    id: "messages",
    label: "Messages",
    icon: <MessageSquare size={18} />,
    collapsible: false,
    items: [
      { label: "Messages", href: "/teacher/messages", icon: <MessageSquare size={18} /> },
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
      { label: "Teachers", href: "/admin/teachers", icon: <User size={18} /> },
      { label: "Students", href: "/admin/students", icon: <Users size={18} /> },
      { label: "Timetables", href: "/admin/timetables", icon: <CalendarDays size={18} /> },
      { label: "Attendances", href: "/admin/attendances", icon: <UserCheck size={18} /> },
      { label: "Elections", href: "/admin/elections", icon: <FileText size={18} /> },
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
    icon: <GraduationCap size={18} />,
    collapsible: true,
    items: [
      { label: "Assignments", href: "/student/assignments", icon: <ClipboardList size={18} /> },
      { label: "Grades", href: "/student/grades", icon: <BarChart2 size={18} /> },
      { label: "Notes", href: "/student/notes", icon: <StickyNote size={18} /> },
      { label: "Report Card", href: "/student/report-card", icon: <FileText size={18} /> },
      { label: "Attendance", href: "/student/attendance", icon: <UserCheck size={18} /> },
    ],
  },
  {
    id: "resources",
    label: "Resources",
    icon: <Library size={18} />,
    collapsible: true,
    items: [
      { label: "Library", href: "/student/library", icon: <BookOpen size={18} /> },
      { label: "Timetable", href: "/student/timetable", icon: <CalendarDays size={18} /> },
      { label: "Projects", href: "/student/projects", icon: <ClipboardList size={18} /> },
    ],
  },
  {
    id: "services",
    label: "Services",
    icon: <Stethoscope size={18} />,
    collapsible: true,
    items: [
      { label: "Health", href: "/student/health", icon: <Stethoscope size={18} /> },
      { label: "Permissions", href: "/student/permissions", icon: <ShieldAlert size={18} /> },
      { label: "Discipline", href: "/student/discipline", icon: <ShieldAlert size={18} /> },
    ],
  },
  {
    id: "engagement",
    label: "Engagement",
    icon: <Users size={18} />,
    collapsible: true,
    items: [
      { label: "Appeals", href: "/student/appeals", icon: <MessageSquare size={18} /> },
      { label: "Elections", href: "/student/elections", icon: <Users size={18} /> },
      { label: "Campus AI", href: "/student/ai", icon: <Bot size={18} /> },
    ],
  },
  {
    id: "communication",
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
      { label: "Attendance", href: "/parent/attendance", icon: <UserCheck size={18} /> },
      { label: "Grades", href: "/parent/grades", icon: <BarChart2 size={18} /> },
      { label: "Teachers", href: "/parent/teachers", icon: <Users size={18} /> },
      { label: "Chats", href: "/parent/chats", icon: <MessageSquare size={18} /> },
      { label: "Report Card", href: "/parent/report-card", icon: <FileText size={18} /> },
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
      { label: "Parents", href: "/accountant/parents", icon: <User size={18} /> },
      { label: "Students", href: "/accountant/students", icon: <Users size={18} /> },
      { label: "Staff", href: "/accountant/staff", icon: <Users size={18} /> },
      { label: "Stock", href: "/accountant/stock", icon: <FileText size={18} /> },
      { label: "Documents", href: "/accountant/documents", icon: <FileText size={18} /> },
      { label: "Transactions", href: "/accountant/transactions", icon: <DollarSign size={18} /> },
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
      { label: "Schools", href: "/super-admin/schools", icon: <User size={18} /> },
      { label: "Admins", href: "/super-admin/admins", icon: <Users size={18} /> },
      { label: "Documents", href: "/super-admin/documents", icon: <FileText size={18} /> },
      { label: "Reports", href: "/super-admin/reports", icon: <BarChart2 size={18} /> },
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
    ],
  },
  {
    id: "discipline",
    label: "Discipline",
    icon: <ShieldAlert size={18} />,
    collapsible: true,
    items: [
      { label: "Incidents", href: "/discipline/incidents", icon: <ShieldAlert size={18} /> },
      { label: "Students", href: "/discipline/students", icon: <Users size={18} /> },
      { label: "Reports", href: "/discipline/reports", icon: <FileText size={18} /> },
    ],
  },
  {
    id: "system",
    label: "",
    collapsible: false,
    items: [
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
    ],
  },
  {
    id: "library",
    label: "Library",
    icon: <Library size={18} />,
    collapsible: true,
    items: [
      { label: "Books", href: "/librarian/books", icon: <BookOpen size={18} /> },
      { label: "Loans", href: "/librarian/loans", icon: <Library size={18} /> },
      { label: "Members", href: "/librarian/members", icon: <Users size={18} /> },
    ],
  },
  {
    id: "system",
    label: "",
    collapsible: false,
    items: [
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
    ],
  },
  {
    id: "health",
    label: "Health",
    icon: <Stethoscope size={18} />,
    collapsible: true,
    items: [
      { label: "Health Records", href: "/nurse/records", icon: <Stethoscope size={18} /> },
      { label: "Students", href: "/nurse/students", icon: <Users size={18} /> },
      { label: "Reports", href: "/nurse/reports", icon: <FileText size={18} /> },
    ],
  },
  {
    id: "system",
    label: "",
    collapsible: false,
    items: [
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
  const [open, setOpen] = useState(defaultOpen ?? false); // Changed to false by default

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

  // If group has an icon, render it like a nav item with dropdown
  if (group.icon) {
    return (
      <div className="sidebar-group">
        <button
          className="sidebar-nav-item sidebar-group-nav-header"
          onClick={() => {
            setInitialized(true);
            setOpen((v) => !v);
          }}
          aria-expanded={isOpen}
        >
          <span className="sidebar-nav-icon">{group.icon}</span>
          <span className="sidebar-nav-label">{group.label}</span>
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

  // Default group header style (for groups without icons)
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
  isOpen?: boolean;
}

export function Sidebar({ role, userName = "User", userEmail, isOpen = true }: SidebarProps) {
  const pathname = usePathname();
  const groups = NAV_MAP[role] ?? ADMIN_GROUPS;
  const roleLabel = ROLE_LABELS[role] ?? role;

  const isActive = (href: string) => {
    if (href === `/${role}`) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className={`app-sidebar ${!isOpen ? 'app-sidebar--hidden' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <img src="/icons/logo.png" alt="iremee" className="sidebar-logo-image" />
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {groups.map((group) => (
          <NavGroupSection
            key={group.id}
            group={group}
            isActive={isActive}
          />
        ))}
      </nav>

      {/* User footer */}
      <div className="sidebar-footer">
        <Link href={`/${role}/profile`} className="sidebar-nav-item sidebar-footer-item">
          <User size={20} className="sidebar-nav-icon" />
          <span className="sidebar-nav-label">Profile</span>
        </Link>
        <Link href="/login" className="sidebar-nav-item sidebar-footer-item">
          <LogOut size={20} className="sidebar-nav-icon" />
          <span className="sidebar-nav-label">Logout</span>
        </Link>
      </div>
    </aside>
  );
}
