import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// ─── Card Components ──────────────────────────────────────────

interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn("bg-white rounded-2xl border border-gray-100 shadow-sm", className)}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function CardHeader({
  title,
  subtitle,
  action,
  children,
  className,
}: CardHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between p-4 border-b border-gray-50 bg-white rounded-t-xl", className)}>
      <div>
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {(action || children) && <div className="flex items-center gap-2">{action || children}</div>}
    </div>
  );
}

interface CardBodyProps {
  children?: React.ReactNode;
  className?: string;
}

export function CardBody({ children, className }: CardBodyProps) {
  return <div className={cn("p-4", className)}>{children}</div>;
}

interface CardFooterProps {
  children?: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn("p-4 border-t border-gray-50 bg-gray-50/30 rounded-b-xl", className)}>
      {children}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: string; direction: "up" | "down"; label?: string };
  progress?: number;
  className?: string;
  meta?: {
    male: string;
    female: string;
  };
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  progress = 75,
  className,
  meta,
}: StatCardProps) {
  const circumference = 2 * Math.PI * 32; // Reduced radius from 42 to 32
  const strokeDasharray = `${(progress / 100) * circumference} ${circumference}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={cn(
        "bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 h-full min-h-[120px]",
        className
      )}
    >
      {/* Visual: Circular Progress with recessed icon - Reduced size */}
      <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
          <circle
            cx="40"
            cy="40"
            r="32"
            fill="none"
            stroke="#F1F5F9"
            strokeWidth="3"
          />
          <motion.circle
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="40"
            cy="40"
            r="32"
            fill="none"
            stroke="#000000"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[52px] h-[52px] rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-900">
            {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement, { size: 24 } as any) : icon}
          </div>
        </div>
      </div>

      {/* Content: Labels and value */}
      <div className="flex-1 min-w-0">
        <h3 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.1em] truncate mb-1.5">{label}</h3>

        <div className="flex items-baseline gap-2 mb-3">
          <p className="text-[28px] font-black text-gray-900 leading-none">{value}</p>
          {trend && (
            <span className={cn(
              "text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter",
              trend.direction === "up" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
            )}>
              {trend.value}%
            </span>
          )}
        </div>

        {meta && (
          <div className="flex gap-3 items-center">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-black rounded-[1px]" />
              <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">Male: {meta.male}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-[1px]" />
              <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">Female: {meta.female}</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
