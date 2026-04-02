import { cn } from "@/lib/utils";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

// ─── Avatar ───────────────────────────────────────────────────
type AvatarSize = "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  name?: string;
  src?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeClass: Record<AvatarSize, string> = {
  sm: "avatar-sm",
  md: "avatar-md",
  lg: "avatar-lg",
  xl: "avatar-xl",
};

export function Avatar({ name = "", src, size = "md", className }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn("avatar", sizeClass[size], className)}
        style={{ objectFit: "cover" }}
      />
    );
  }

  return (
    <div className={cn("avatar", sizeClass[size], className)}>
      {initials || "?"}
    </div>
  );
}

// ─── Breadcrumbs ──────────────────────────────────────────────
interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav className={cn("breadcrumbs", className)} aria-label="Breadcrumb">
      <Link href="/" className="breadcrumb-item">
        <Home size={13} />
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight size={13} className="breadcrumb-separator" />
          {item.href && i < items.length - 1 ? (
            <Link href={item.href} className="breadcrumb-item">
              {item.label}
            </Link>
          ) : (
            <span className="breadcrumb-item current">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

// ─── PageHeader ───────────────────────────────────────────────
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("", className)}>
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
        {actions && <div className="page-header-actions">{actions}</div>}
      </div>
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────
interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn("tabs", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={cn("tab-item", activeTab === tab.id ? "active" : "")}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span
              className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-semibold"
              style={{
                background: activeTab === tab.id ? "var(--color-primary)" : "var(--color-border)",
                color: activeTab === tab.id ? "white" : "var(--color-text-secondary)",
              }}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state-icon">{icon}</div>}
      <p className="empty-state-title">{title}</p>
      {description && <p className="empty-state-description">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ─── SkeletonRow ──────────────────────────────────────────────
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("card p-5 flex flex-col gap-3", className)}>
      <div className="skeleton h-4 w-1/2 rounded" />
      <div className="skeleton h-8 w-3/4 rounded" />
      <div className="skeleton h-3 w-1/3 rounded" />
    </div>
  );
}
