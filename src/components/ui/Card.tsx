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



