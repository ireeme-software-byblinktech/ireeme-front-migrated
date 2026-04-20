"use client";

import { PageHeader } from "@/components/ui/Shared";
import { StatCard, Card, CardHeader, CardBody } from "@/components/ui/Card";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import {
    LayoutDashboard,
    Users,
    AlertTriangle,
    FileText,
    Briefcase,
    Search,
    Plus,
    CalendarDays,
    Clock,
    User,
    ChevronRight,
    Calendar
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── MOCK DATA ────────────────────────────────────────────────

const recentIncidents = [
    { id: "12090857063-1", studentId: "Term 1 payment", incident: "12090857063", severity: "30,000", status: "completed" },
    { id: "12090857063-2", studentId: "Term 1 payment", incident: "12090857063", severity: "30,000", status: "completed" },
    { id: "12090857063-3", studentId: "Term 1 payment", incident: "12090857063", severity: "30,000", status: "completed" },
    { id: "12090857063-4", studentId: "Term 1 payment", incident: "12090857063", severity: "30,000", status: "completed" },
    { id: "12090857063-5", studentId: "Term 1 payment", incident: "12090857063", severity: "30,000", status: "completed" },
    { id: "12090857063-6", studentId: "Term 1 payment", incident: "12090857063", severity: "30,000", status: "completed" },
    { id: "12090857063-7", studentId: "Term 1 payment", incident: "12090857063", severity: "30,000", status: "completed" },
    { id: "12090857063-8", studentId: "Term 1 payment", incident: "12090857063", severity: "30,000", status: "completed" },
    { id: "12090857063-9", studentId: "Term 1 payment", incident: "12090857063", severity: "30,000", status: "completed" },
    { id: "12090857063-10", studentId: "Term 1 payment", incident: "12090857063", severity: "30,000", status: "completed" },
];

type IncidentRow = typeof recentIncidents[number];

const incidentCols: Column<IncidentRow>[] = [
    { key: "studentId", header: "StudentId", render: (v) => <span className="font-medium text-gray-600">{String(v)}</span> },
    { key: "incident", header: "Incident", render: (v) => <span className="font-medium text-gray-500">{String(v)}</span> },
    { key: "severity", header: "Severity", render: (v) => <span className="font-medium text-gray-600">{String(v)}</span> },
    {
        key: "status",
        header: "Status",
        render: (v) => (
            <span className="px-6 py-1.5 rounded-lg bg-black text-white text-[10px] font-bold uppercase tracking-widest block text-center max-w-[110px]">
                {String(v)}
            </span>
        )
    },
];

const upcomingEvents = [
    { id: 1, name: "John Smith", type: "Mr Smith", time: "02:00 PM" },
    { id: 2, name: "John Doe", type: "Principal", time: "04:00 PM" },
    { id: 3, name: "John Smith", type: "Mother", time: "10:00 AM" },
    { id: 4, name: "John Doe", type: "Guardian", time: "04:00 PM" },
    { id: 5, name: "John Smith", type: "Mrs Smith", time: "10:00 AM" },
];

export default function DisciplineDashboard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 p-1"
        >
            {/* Premium Welcome & Search Section */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm gap-4 mb-2">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Welcome back Discipline Officer</h1>
                </div>
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search incidents, students..."
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-100 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all text-sm font-bold"
                    />
                </div>
            </div>

            {/* Stat Cards Grid - Values from Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Active Cases"
                    value="23"
                    icon={<Briefcase />}
                    trend={{ value: "1.5", direction: "up", label: "last week" }}
                    progress={65}
                />
                <StatCard
                    label="Resolved Cases"
                    value="156"
                    icon={<Briefcase />}
                    trend={{ value: "1.5", direction: "up", label: "this month" }}
                    progress={80}
                />
                <StatCard
                    label="Students Monitored"
                    value="30K"
                    icon={<Users />}
                    trend={{ value: "2.5", direction: "up", label: "this month" }}
                    progress={45}
                />
                <StatCard
                    label="Pending Reviews"
                    value="30K"
                    icon={<LayoutDashboard />}
                    trend={{ value: "1.5", direction: "up", label: "last week" }}
                    progress={30}
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Table Section */}
                <div className="xl:col-span-2 space-y-8">
                    <Card className="border-none shadow-2xl shadow-gray-200/40 rounded-[24px] overflow-hidden bg-white">
                        <CardBody className="p-0">
                            <DataTable
                                columns={incidentCols}
                                data={recentIncidents}
                                keyField="id"
                                className="discipline-table"
                            />
                            <div className="p-6 flex items-center justify-between border-t border-gray-50 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                                <span>Showing 1 to 4 of 247 results</span>
                                <div className="flex gap-3">
                                    <Button variant="outline" size="sm" className="px-6 h-10 text-[11px] border-none bg-gray-50 font-black hover:bg-black hover:text-white transition-all rounded-xl">Previous</Button>
                                    <div className="flex gap-2">
                                        <Button size="sm" className="w-10 h-10 p-0 bg-black text-white text-[11px] font-black shadow-lg shadow-black/20 rounded-xl">1</Button>
                                        <Button variant="outline" size="sm" className="w-10 h-10 p-0 text-[11px] font-black border-none bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">2</Button>
                                        <Button variant="outline" size="sm" className="px-6 h-10 text-[11px] border-none bg-gray-100 font-black hover:bg-black hover:text-white transition-all rounded-xl">Next</Button>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                </div>

                {/* Right Panel: Upcoming Events */}

                {/* Right Panel: Upcoming Events */}
                <div>
                    <Card className="h-full border-none shadow-2xl shadow-gray-200/40 rounded-[24px] bg-white p-2">
                        <CardHeader title="Upcoming Events" className="p-6 border-none" />
                        <CardBody className="space-y-4 px-4 pb-6">
                            {upcomingEvents.map((event, i) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center gap-4 p-5 rounded-[20px] bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all cursor-pointer border border-transparent hover:border-gray-100 group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                                        <Calendar size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-[14px] font-black text-gray-900 truncate">{event.name}</h4>
                                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight mt-0.5">{event.type}</p>
                                        <p className="text-[11px] text-blue-600 font-black mt-1.5 tracking-tight">{event.time}</p>
                                    </div>
                                </motion.div>
                            ))}
                            <Button variant="outline" className="w-full mt-6 text-[12px] font-black py-7 rounded-2xl border-gray-100 hover:bg-black hover:text-white transition-all shadow-sm">
                                View All Events
                            </Button>
                        </CardBody>
                    </Card>
                </div>
            </div>

            {/* Quick Actions at bottom */}
            <div className="mt-8">
                <h2 className="text-xl font-black mb-6 text-gray-900 tracking-tight">Quick Actions</h2>
                <div className="quick-actions-grid">
                    {[
                        { title: "Report Incident", desc: "Create new case", icon: <AlertTriangle className="text-red-500" size={20} /> },
                        { title: "Schedule Meeting", desc: "Schedule with parents/ students", icon: <AlertTriangle className="text-red-500" size={20} /> },
                        { title: "Generate Incident", desc: "Create new case", icon: <AlertTriangle className="text-red-500" size={20} /> },
                        { title: "View Students", desc: "Monitor list", icon: <AlertTriangle className="text-red-500" size={20} /> },
                    ].map((action, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            className="quick-action-card"
                        >
                            <div className="mb-1">{action.icon}</div>
                            <h4 className="quick-action-title">{action.title}</h4>
                            <p className="quick-action-desc">{action.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
