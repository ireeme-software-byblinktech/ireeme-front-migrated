import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

type BadgeVariant =
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "purple"
  | "neutral"
  | "primary";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

const variantMap: Record<BadgeVariant, string> = {
  success: "badge-success",
  danger: "badge-danger",
  warning: "badge-warning",
  info: "badge-info",
  purple: "badge-purple",
  neutral: "badge-neutral",
  primary: "badge-primary",
};

export function Badge({
  variant = "neutral",
  dot = false,
  children,
  className,
  ...props
}: BadgeProps) {
  return (
    <span className={cn("badge", variantMap[variant], className)} {...props}>
      {dot && <span className="badge-dot" />}
      {children}
    </span>
  );
}

// Convenience status badge that maps common status strings to variants
type StatusValue =
  | "passed"
  | "failed"
  | "pending"
  | "active"
  | "inactive"
  | "present"
  | "absent"
  | "late"
  | "excellent"
  | "good"
  | "fair"
  | "approved"
  | "rejected"
  | "submitted"
  | "graded"
  | "overdue";

const STATUS_MAP: Record<StatusValue, BadgeVariant> = {
  passed: "success",
  active: "success",
  present: "success",
  excellent: "success",
  good: "info",
  approved: "success",
  graded: "primary",
  submitted: "info",
  failed: "danger",
  inactive: "danger",
  absent: "danger",
  rejected: "danger",
  overdue: "danger",
  pending: "warning",
  late: "warning",
  fair: "warning",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const lower = status.toLowerCase() as StatusValue;
  const variant = STATUS_MAP[lower] ?? "neutral";
  return (
    <Badge variant={variant} dot className={className}>
      {status}
    </Badge>
  );
}

