import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: string; direction: "up" | "down"; label?: string };
  progress?: number;
  className?: string;
  onClick?: () => void;
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  progress = 80,
  className,
  onClick,
}: StatCardProps) {
  const circumference = 2 * Math.PI * 35.5;

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "bg-white py-5 px-8 rounded-[12px] border border-[#F1F5F9] h-full min-h-[120px] shrink-0 group flex items-center gap-7 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all duration-500",
        onClick && "cursor-pointer",
        className
      )}
    >
      {/* progress ring section */}
      <div className="relative w-[64px] h-[64px] shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90 relative">
          <circle
            cx="40"
            cy="40"
            r="35.5"
            fill="none"
            stroke="#F8FAFC"
            strokeWidth="3"
          />
          <circle
            cx="40"
            cy="40"
            r="35.5"
            fill="none"
            stroke="#000000"
            strokeWidth="4"
            strokeDasharray={`${circumference * 0.65} ${circumference * 0.35}`}
            strokeDashoffset={-circumference * 0.30}
            strokeLinecap="round"
          />
          <circle
            cx="40"
            cy="40"
            r="35.5"
            fill="none"
            stroke="#00000020"
            strokeWidth="3.6"
            strokeDasharray={`${circumference * 0.25} ${circumference * 0.75}`}
            strokeDashoffset={0}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[54px] h-[54px] rounded-full bg-white shadow-[0_6px_16px_rgba(0,0,0,0.08)] flex items-center justify-center text-gray-900 border border-[#F1F5F9] transition-transform duration-300 group-hover:scale-105">
            {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement, { size: 26 } as any) : icon}
          </div>
        </div>
      </div>

      {/* text information - perfectly left aligned */}
      <div className="flex flex-col flex-1 justify-center">
        <p className="text-[13px] font-medium text-[#1E293B] mb-1.5 tracking-tight leading-none">{label}</p>
        <h3 className="text-[24px] font-bold text-black leading-none mb-2">{value}</h3>

        {trend && (
          <div className="flex flex-col items-start gap-1 shrink-0 whitespace-nowrap">
            <span className={cn(
              "text-[13px] font-bold flex items-center gap-1",
              trend.direction === "up" ? "text-[#059669]" : "text-[#E11D48]"
            )}>
              {trend.value}
              <Activity size={12} className="opacity-80" />
            </span>

            {trend.label && (
              <span className="text-[13px] text-[#64748B] font-medium tracking-tight">
                {trend.label}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

