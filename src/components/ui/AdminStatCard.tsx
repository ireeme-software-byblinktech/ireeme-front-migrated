"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Subtext {
    label: string;
    dotColor?: string;
}

interface AdminStatCardProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    subtext?: string | Subtext[];
    className?: string;
    progress?: number;
}

export function AdminStatCard({
    label,
    value,
    icon,
    subtext,
    className,
    progress = 65,
}: AdminStatCardProps) {
    const radius = 33;
    const circumference = 2 * Math.PI * radius;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={cn(
                "bg-white py-5 px-8 rounded-[12px] border border-[#F1F5F9] h-full flex items-center gap-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-500 group min-w-[220px]",
                className
            )}
        >
            {/* Ring Section */}
            <div className="relative w-[64px] h-[64px] shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90 relative z-10">
                    {/* Background Track */}
                    <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        fill="none"
                        stroke="#F8FAFC"
                        strokeWidth="5"
                    />
                    {/* Progress Layer */}
                    <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        fill="none"
                        stroke="#E2E8F0"
                        strokeWidth="5"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference * (1 - 0.9)} // subtle background ring
                        strokeLinecap="round"
                        className="opacity-40"
                    />
                    {/* Main Progress */}
                    <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        fill="none"
                        stroke="black"
                        strokeWidth="5"
                        strokeDasharray={circumference}
                        strokeDashoffset={String(circumference * (1 - (isNaN(progress) ? 0 : progress) / 100))}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>

                {/* Inner Circle / Icon Container */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[54px] h-[54px] rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08),inset_0_2px_4px_rgba(0,0,0,0.02)] flex items-center justify-center text-black border border-[#F1F5F9] transition-transform duration-300 group-hover:scale-105 z-20">
                        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement, { size: 26, strokeWidth: 2.2 } as any) : icon}
                    </div>
                </div>
            </div>

            {/* Info Section */}
            <div className="flex flex-col flex-1 justify-center py-1">
                <h4 className="text-[14px] font-medium text-gray-900 leading-none mb-2 tracking-tight">
                    {label}
                </h4>

                {/* Subtext Array */}
                <div className="flex items-center gap-x-3 gap-y-1 mb-2 overflow-hidden">
                    {Array.isArray(subtext) ? (
                        subtext.map((s, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                                <div className={cn("w-[7px] h-[7px] rounded-[1px] bg-black shrink-0", s.dotColor)} />
                                <span className="text-[11px] font-medium text-gray-400 whitespace-nowrap leading-none tracking-tight">
                                    {s.label}
                                </span>
                            </div>
                        ))
                    ) : (
                        subtext && (
                            <div className="flex items-center gap-1.5">
                                <div className="w-[7px] h-[7px] rounded-[1px] bg-black shrink-0" />
                                <span className="text-[12px] font-medium text-gray-400 leading-none tracking-tight">
                                    {subtext}
                                </span>
                            </div>
                        )
                    )}
                </div>

                {/* Large Value */}
                <div className="text-[24px] font-bold text-black leading-none tracking-tighter">
                    {value}
                </div>
            </div>
        </motion.div>
    );
}
