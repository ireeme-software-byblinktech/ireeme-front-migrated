import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn("bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.06)]", className)}>
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
    <div className={cn("flex items-center justify-between p-3.5 border-b border-gray-50 bg-white rounded-t-[12px]", className)}>
      <div>
        <h3 className="text-[15px] font-bold text-gray-900 leading-tight">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 mt-1.5">{subtitle}</p>}
      </div>
      {(action || children) && <div className="flex items-center gap-2.5">{action || children}</div>}
    </div>
  );
}

interface CardBodyProps {
  children?: React.ReactNode;
  className?: string;
}

export function CardBody({ children, className }: CardBodyProps) {
  return <div className={cn("py-6 px-4", className)}>{children}</div>;
}

interface CardFooterProps {
  children?: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn("p-3 border-t border-gray-50 bg-gray-50/30 rounded-b-[12px]", className)}>
      {children}
    </div>
  );
}

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
  progress = 80,
  className,
  meta,
}: StatCardProps) {
  const circumference = 2 * Math.PI * 35.5; 
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={cn(
        "bg-white py-5 px-4 rounded-[12px] border border-gray-200 h-full min-h-[115px] min-w-[220px] shrink-0 group flex items-center gap-4 shadow-[0_5px_15px_rgba(0,0,0,0.08)] transition-all hover:shadow-[0_8px_25px_rgba(0,0,0,0.12)]",
        className
      )}
    >
      <div className="relative w-[78px] h-[78px] shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90 relative">
          <circle
            cx="40"
            cy="40"
            r="35.5"
            fill="none"
            stroke="#F1F5F9"
            strokeWidth="3.2"
          />
          <circle
            cx="40"
            cy="40"
            r="35.5"
            fill="none"
            stroke="#000000"
            strokeWidth="3.8"
            strokeDasharray={`${circumference * 0.65} ${circumference * 0.35}`}
            strokeDashoffset={-circumference * 0.30}
            strokeLinecap="butt"
          />
          <circle
            cx="40"
            cy="40"
            r="35.5"
            fill="none"
            stroke="#00000080" 
            strokeWidth="3.4"
            strokeDasharray={`${circumference * 0.30} ${circumference * 0.70}`}
            strokeDashoffset={0}
            strokeLinecap="butt"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[54px] h-[54px] rounded-full bg-white shadow-[0_4px_14px_rgba(0,0,0,0.15)] flex items-center justify-center text-gray-900 border border-gray-100 transition-transform duration-300 group-hover:scale-105 pointer-events-auto">
            {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement, { size: 24 } as any) : icon}
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 pl-1">
        <p className="text-[14px] font-semibold text-black mb-1.5">{label}</p>
        <div className="flex items-center gap-2.5">
          <h3 className="text-[22px] font-bold text-gray-900 leading-none">{value}</h3>
          {trend && (
            <div className="grid items-center gap-1 shrink-0 whitespace-nowrap pt-1">
              <svg 
                className={cn("w-3 h-3", trend.direction === "up" ? "text-emerald-600" : "text-rose-500")} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className={cn("text-[9px] font-bold", trend.direction === "up" ? "text-emerald-600" : "text-rose-500")}>
                {trend.value}
              </span>
              <div className="flex items-center gap-1">
                {trend.label && <span className="text-[9px] text-black font-medium">{trend.label}</span>}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
