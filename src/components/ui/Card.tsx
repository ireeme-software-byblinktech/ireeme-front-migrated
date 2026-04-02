import { cn } from "@/lib/utils";
import { CSSProperties, HTMLAttributes } from "react";

// ─── Card Root ────────────────────────────────────────────────
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  style?: CSSProperties;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div className={cn("card", className)} {...props}>
      {children}
    </div>
  );
}

// ─── Card Header ──────────────────────────────────────────────
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function CardHeader({
  title,
  subtitle,
  action,
  children,
  className,
  ...props
}: CardHeaderProps) {
  return (
    <div className={cn("card-header", className)} {...props}>
      <div>
        {title && <h3 className="card-title">{title}</h3>}
        {subtitle && <p className="card-subtitle">{subtitle}</p>}
        {children}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}

// ─── Card Body ────────────────────────────────────────────────
export function CardBody({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("card-body", className)} {...props}>
      {children}
    </div>
  );
}

// ─── Card Footer ──────────────────────────────────────────────
export function CardFooter({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("card-footer", className)} {...props}>
      {children}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────
type StatCardColor = "blue" | "green" | "orange" | "purple" | "red";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: StatCardColor;
  trend?: { value: string; direction: "up" | "down" };
  className?: string;
}

export function StatCard({
  label,
  value,
  icon,
  color = "blue",
  trend,
  className,
}: StatCardProps) {
  return (
    <div className={cn("stat-card", className)}>
      <div className={cn("stat-card-icon", color)}>{icon}</div>
      <div className="stat-card-info">
        <p className="stat-card-label">{label}</p>
        <p className="stat-card-value">{value}</p>
        {trend && (
          <div className={cn("stat-card-trend", trend.direction)}>
            <span>{trend.direction === "up" ? "↑" : "↓"}</span>
            <span>{trend.value}</span>
          </div>
        )}
      </div>
    </div>
  );
}
