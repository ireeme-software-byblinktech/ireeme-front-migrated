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
  trend?: { value: string; direction: "up" | "down"; label?: string };
  progress?: number; // Progress percentage (0-100)
  className?: string;
}

export function StatCard({
  label,
  value,
  icon,
  color = "blue",
  trend,
  progress = 75,
  className,
}: StatCardProps) {
  const circumference = 2 * Math.PI * 35; // radius = 35 for even larger circle
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("stat-card-horizontal", className)}>
      {/* Circular Progress with Icon */}
      <div className="stat-card-circle-small">
        <svg width="80" height="80" viewBox="0 0 80 80">
          {/* Background circle */}
          <circle
            cx="40"
            cy="40"
            r="35"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="4"
          />
          {/* Progress circle */}
          <circle
            cx="40"
            cy="40"
            r="35"
            fill="none"
            stroke="#000000"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 40 40)"
            className="stat-card-progress-small"
          />
        </svg>
        <div className="stat-card-icon-small">
          {icon}
        </div>
      </div>

      {/* Content */}
      <div className="stat-card-content-horizontal">
        <h3 className="stat-card-title-small">{label}</h3>
        <div className="stat-card-number-row">
          <p className="stat-card-number-small">{value}</p>
          {trend && (
            <div className={cn("stat-card-trend-small", trend.direction)}>
              <span className="stat-card-trend-arrow">
                {trend.direction === "up" ? "↗" : "↘"}
              </span>
              <span className="stat-card-trend-text">
                {trend.value} {trend.label || "This month"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
