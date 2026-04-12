"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
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
  User,
  BriefcaseMedical,
  Pill,
  Calendar,
  Briefcase,
  FolderOpen,
  Heart,
  Trophy,
  Globe
} from "lucide-react";

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
      { label: "Assignments", href: "/teacher/assignments", icon: <ClipboardList size={18} /> },
      { label: "Grades", href: "/teacher/grades", icon: <BarChart2 size={18} /> },
      { label: "Attendance", href: "/teacher/attendance", icon: <UserCheck size={18} /> },
      { label: "Notes", href: "/teacher/notes", icon: <StickyNote size={18} /> },
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
      { label: "Campus Ai", href: "/teacher/ai", icon: <Bot size={18} /> },
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
      { label: "Alumni", href: "/admin/alumni", icon: <GraduationCap size={18} /> },
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
      { label: "Documents", href: "/student/documents", icon: <FolderOpen size={18} /> },
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
      { label: "Career Guidance", href: "/student/career-guidance", icon: <Briefcase size={18} /> },
    ],
  },
  {
    id: "engagement",
    label: "Engagement",
    icon: <Users size={18} />,
    collapsible: true,
    items: [
      { label: "Appeals", href: "/student/appeals", icon: <MessageSquare size={18} /> },
      { label: "Elections", href: "/student/elections", icon: <UserCheck size={18} /> },
    ],
  },
  {
    id: "campus-ai",
    label: "Campus Ai",
    icon: <Bot size={18} />,
    collapsible: false,
    items: [
      { label: "Campus Ai", href: "/student/ai", icon: <Bot size={18} /> },
    ],
  },
  {
    id: "communication",
    label: "",
    collapsible: false,
    items: [
      { label: "Messages", href: "/student/messages", icon: <MessageSquare size={18} /> },
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

const ALUMNI_GROUPS: NavGroup[] = [
  {
    id: "main",
    label: "",
    collapsible: false,
    items: [
      { label: "Dashboard", href: "/alumni", icon: <LayoutDashboard size={18} /> },
      { label: "Alumni Directory", href: "/alumni/directory", icon: <Users size={18} /> },
      { label: "Report Cards", href: "/alumni/report-cards", icon: <GraduationCap size={18} /> },
      { label: "Applications", href: "/alumni/applications", icon: <Globe size={18} /> },
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
      { label: "Alumni", href: "/super-admin/alumni", icon: <GraduationCap size={18} /> },
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

];

const NURSE_GROUPS: NavGroup[] = [
  {
    id: "main",
    label: "",
    collapsible: false,
    items: [
      { label: "Dashboard", href: "/nurse", icon: <LayoutDashboard size={20} /> },
      { label: "Health Records", href: "/nurse/records", icon: <User size={20} /> },
      { label: "Home Permissions", href: "/nurse/permissions", icon: <GraduationCap size={20} /> },
      { label: "Appointments", href: "/nurse/appointments", icon: <FileText size={20} /> },
      { label: "Medical Case", href: "/nurse/cases", icon: <Briefcase size={20} /> },
      { label: "Medications", href: "/nurse/medications", icon: <Pill size={20} /> },
      { label: "Documents", href: "/nurse/documents", icon: <FolderOpen size={20} /> },
      { label: "Reports", href: "/nurse/reports", icon: <BarChart2 size={20} /> },
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
  alumni: ALUMNI_GROUPS,
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
  alumni: "Alumni / Graduate",
};


function NavGroupSection({
  group,
  isActive,
  defaultOpen,
}: {
  group: NavGroup;
  isActive: (href: string) => boolean;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);

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
  const [mounted, setMounted] = useState(false);
  const groups = NAV_MAP[role] ?? ADMIN_GROUPS;
  const roleLabel = ROLE_LABELS[role] ?? role;

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (href: string) => {
    if (!mounted) return false;
    if (href === `/${role}`) return pathname === href;
    return pathname.startsWith(href);
  };

  if (!mounted) return <div className="app-sidebar" />; // Render placeholder or empty sidebar during hydration

  return (
    <aside className={`app-sidebar ${!isOpen ? 'app-sidebar--hidden' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo flex flex-col items-center pt-2 pb-0 -mt-6">
        <img
          src="/icons/logo.png"
          alt="iremee"
          className="sidebar-logo-image"
          style={{ height: "128px", width: "auto" }}
        />
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
        <Link href={`/${role}/settings`} className="sidebar-nav-item sidebar-footer-item">
          <Settings size={20} className="sidebar-nav-icon" />
          <span className="sidebar-nav-label">Settings</span>
        </Link>
        <Link href="/login" className="sidebar-nav-item sidebar-footer-item">
          <LogOut size={20} className="sidebar-nav-icon" />
          <span className="sidebar-nav-label">Logout</span>
        </Link>
      </div>
    </aside>
  );
}
