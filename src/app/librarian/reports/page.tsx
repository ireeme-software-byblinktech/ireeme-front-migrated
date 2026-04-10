"use client";

import { motion } from "framer-motion";
import {
    BookOpen,
    ClipboardList,
    FileText,
    StickyNote,
    Download,
    Calendar,
    BarChart,
    PieChart,
    Users,
    TrendingUp,
    Clock,
    DollarSign
} from "lucide-react";
import { Card, CardBody, StatCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useState } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────

const reportTypes = [
    { id: 1, title: "Circulation Report", desc: "Books issued and returned statistics", icon: <BookOpen className="text-blue-600" />, color: "bg-blue-50" },
    { id: 2, title: "Overdue Books Report", desc: "List of overdue books and fines", icon: <Clock className="text-rose-600" />, color: "bg-rose-50" },
    { id: 3, title: "Member Activity Report", desc: "Member registration and activity stats", icon: <Users className="text-emerald-600" />, color: "bg-emerald-50" },
    { id: 4, title: "Collection Report", desc: "Book inventory and availability", icon: <FileText className="text-purple-600" />, color: "bg-purple-50" },
    { id: 5, title: "Financial Report", desc: "Fines collected and pending", icon: <DollarSign className="text-amber-600" />, color: "bg-amber-50" },
    { id: 6, title: "Popular Books Report", desc: "Most issued and requested books", icon: <TrendingUp className="text-orange-600" />, color: "bg-orange-50" },
];

const recentReports = [
    { id: 1, name: "Monthly Circulation Report - March 2024", date: "3/15/2024", size: "2.4 MB", type: "PDF" },
    { id: 2, name: "Overdue Books Report - Week 11", date: "3/14/2024", size: "856 KB", type: "Excel" },
    { id: 3, name: "Member Activity Report - Q1 2024", date: "3/10/2024", size: "1.8 MB", type: "PDF" },
    { id: 4, name: "Collection Inventory Report", date: "3/1/2024", size: "3.2 MB", type: "Excel" },
];

export default function LibraryReports() {
    const [reportPeriod, setReportPeriod] = useState("Month");

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8 pb-10"
        >
            {/* Header Section */}
            <div>
                <h1 className="text-[28px] font-black text-gray-900 tracking-tight">Reports & Analytics</h1>
                <p className="text-gray-500 text-sm font-medium mt-1">Generate and download library reports</p>
            </div>

            {/* Period Selector */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 w-fit">
                <div className="flex items-center gap-2 px-3 border-r border-gray-100 mr-2">
                    <Calendar size={18} className="text-gray-400" />
                    <span className="text-[12px] font-black text-gray-500 uppercase tracking-widest">Report Period:</span>
                </div>
                <div className="flex bg-gray-50 p-1 rounded-xl">
                    {["Week", "Month", "Quarter", "Year"].map((p) => (
                        <button
                            key={p}
                            onClick={() => setReportPeriod(p)}
                            className={cn(
                                "px-6 py-2 rounded-lg text-xs font-black transition-all",
                                reportPeriod === p ? "bg-black text-white shadow-md shadow-black/10 scale-105" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    label="Total Subjects"
                    value="15"
                    icon={<BookOpen />}
                    trend={{ value: "+3.6", direction: "up", label: "This month" }}
                />
                <StatCard
                    label="Total Assignments"
                    value="30"
                    icon={<ClipboardList />}
                    trend={{ value: "+3.6", direction: "up", label: "This month" }}
                />
                <StatCard
                    label="Total Notes"
                    value="30"
                    icon={<StickyNote />}
                    trend={{ value: "+3.6", direction: "up", label: "This month" }}
                />
                <StatCard
                    label="Total reports"
                    value="30"
                    icon={<FileText />}
                    trend={{ value: "+3.6", direction: "up", label: "This month" }}
                />
            </div>

            {/* Generate Reports Grid */}
            <section className="space-y-6">
                <h2 className="text-lg font-black text-gray-900 px-1">Generate Reports</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reportTypes.map((report, i) => (
                        <motion.div
                            key={report.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm space-y-4 group hover:shadow-xl hover:shadow-gray-100/50 transition-all cursor-pointer"
                        >
                            <div className="flex items-start justify-between">
                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", report.color)}>
                                    {report.icon}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{report.title}</h3>
                                <p className="text-xs text-gray-400 font-medium mt-1 leading-relaxed">{report.desc}</p>
                            </div>
                            <Button className="w-full bg-black text-white h-11 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-900 transition-all">
                                <BarChart size={16} className="mr-2" /> Generate Report
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Recent Reports Table */}
            <section className="space-y-6">
                <div className="flex justify-between items-center px-1">
                    <h2 className="text-lg font-black text-gray-900">Recent Reports</h2>
                    <Button variant="ghost" className="text-blue-600 font-bold text-sm">View All</Button>
                </div>
                <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
                    {recentReports.map((report, i) => (
                        <div
                            key={report.id}
                            className={cn(
                                "p-5 flex items-center justify-between group hover:bg-gray-50/50 transition-colors",
                                i !== recentReports.length - 1 && "border-b border-gray-50"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900">{report.name}</h4>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">{report.date}</span>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">{report.size}</span>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter text-blue-500">{report.type}</span>
                                    </div>
                                </div>
                            </div>
                            <Button variant="outline" className="h-10 px-6 rounded-lg border-gray-100 font-bold text-xs text-gray-600 hover:bg-black hover:text-white transition-all">
                                <Download size={16} className="mr-2" /> Download
                            </Button>
                        </div>
                    ))}
                </div>
            </section>
        </motion.div>
    );
}
