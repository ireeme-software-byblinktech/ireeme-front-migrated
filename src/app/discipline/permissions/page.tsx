"use client";

import { Card, CardBody } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/Shared";
import {
    Search,
    Filter,
    Eye,
    TrendingDown,
    TrendingUp,
    Minus
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── MOCK DATA ────────────────────────────────────────────────

const permissionRequests = [
    {
        id: "STU2024001",
        name: "John Smith",
        grade: "Grade 10-A",
        risk: "Medium",
        totalIncidents: 5,
        recentIncidents: 2,
        lastIncident: "15/03/2024",
        trend: "down",
        trendLabel: "Declining"
    },
];

export default function PermissionsPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 p-1"
        >
            <PageHeader
                title="Permissions"
                subtitle="Review and process student leave and behavior-related permission requests"
            />

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full max-w-2xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="search student..."
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all bg-white font-medium shadow-none"
                    />
                </div>
                <Button variant="outline" className="w-full md:w-auto flex gap-3 items-center py-3.5 px-8 h-auto font-black border-gray-100 text-gray-400 rounded-xl">
                    <Filter size={18} /> All Requests
                </Button>
            </div>

            {/* Requests Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {permissionRequests.map((student, i) => (
                    <motion.div
                        key={student.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="border-none shadow-sm rounded-[24px] bg-white hover:shadow-xl transition-all border-transparent hover:border-gray-50 border group">
                            <CardBody className="p-8">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h3 className="font-black text-[18px] text-gray-900 leading-tight">{student.name}</h3>
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter mt-1">{student.id}</p>
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">{student.grade}</p>
                                    </div>
                                    <span className={cn(
                                        "px-4 py-1.5 rounded-full text-[10px] font-black",
                                        student.risk === "High" ? "bg-red-50 text-red-500" :
                                            student.risk === "Medium" ? "bg-amber-50 text-amber-500" :
                                                "bg-emerald-50 text-emerald-500"
                                    )}>
                                        {student.risk} Risk
                                    </span>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[13px] text-gray-700 font-bold uppercase tracking-tight">Total Incidents:</span>
                                        <span className="font-black text-gray-900 text-[14px]">{student.totalIncidents}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[13px] text-gray-700 font-bold uppercase tracking-tight">Recent (30 days):</span>
                                        <span className="font-black text-gray-900 text-[14px]">{student.recentIncidents}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[13px] text-gray-700 font-bold uppercase tracking-tight">Last Incident:</span>
                                        <span className="font-black text-gray-900 text-[14px]">{student.lastIncident}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[13px] text-gray-700 font-bold uppercase tracking-tight">Behavior Trend:</span>
                                        <span className={cn(
                                            "flex items-center gap-1 font-black text-[14px]",
                                            student.trend === "up" ? "text-emerald-500" :
                                                student.trend === "down" ? "text-red-500" :
                                                    "text-gray-400"
                                        )}>
                                            {student.trend === "up" && <TrendingUp size={16} />}
                                            {student.trend === "down" && <TrendingDown size={16} />}
                                            {student.trend === "stable" && <Minus size={16} />}
                                            {student.trendLabel}
                                        </span>
                                    </div>
                                </div>

                                <Button className="w-full bg-black text-white hover:bg-gray-800 rounded-2xl py-7 h-auto font-black flex gap-3 items-center justify-center transition-all hover:scale-[1.02] shadow-xl shadow-black/10">
                                    <Eye size={20} /> View Details
                                </Button>
                            </CardBody>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
