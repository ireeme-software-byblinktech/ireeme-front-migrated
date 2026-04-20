"use client";

import { PageHeader } from "@/components/ui/Shared";
import { StatCard, Card, CardHeader, CardBody } from "@/components/ui/Card";
import { DataTable, TableUser, Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
    Stethoscope,
    Users,
    CalendarDays,
    AlertCircle,
    Plus,
    Search,
    History,
    Pill,
    FileText,
    BarChart2,
    Clock,
    Bell,
    GraduationCap,
    BriefcaseMedical
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── MOCK DATA ────────────────────────────────────────────────

const recentCases = [
    { id: 1, student: "John Doe", case: "Headache", class: "S5MCB", status: "completed" },
    { id: 2, student: "John Doe", case: "Headache", class: "S5MCB", status: "In Progress" },
    { id: 3, student: "John Doe", case: "Headache", class: "S5MCB", status: "Pending" },
    { id: 4, student: "John Doe", case: "Headache", class: "S5MCB", status: "completed" },
    { id: 5, student: "John Doe", case: "Headache", class: "S5MCB", status: "completed" },
    { id: 6, student: "John Doe", case: "Headache", class: "S5MCB", status: "completed" },
    { id: 7, student: "John Doe", case: "Headache", class: "S5MCB", status: "completed" },
    { id: 8, student: "John Doe", case: "Headache", class: "S5MCB", status: "completed" },
    { id: 9, student: "John Doe", case: "Headache", class: "S5MCB", status: "completed" },
];

type CaseRow = typeof recentCases[number];

const caseCols: Column<CaseRow>[] = [
    { key: "student", header: "Recent Cases", render: (v) => <span className="font-bold">{String(v)}</span> },
    { key: "case", header: "Case" },
    { key: "class", header: "Class" },
    {
        key: "status",
        header: "Status",
        render: (v) => (
            <span className={cn(
                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider block text-center max-w-[80px]",
                v === "completed" ? "bg-black text-white" :
                    v === "In Progress" ? "bg-gray-800 text-white" : "bg-gray-400 text-white"
            )}>
                {String(v)}
            </span>
        )
    },
];

const upcomingAppointments = [
    { id: 1, name: "John Smith", type: "Check-up", time: "02:00 PM" },
    { id: 2, name: "John Doe", type: "Follow-up", time: "04:00 PM" },
    { id: 3, name: "John Smith", type: "Vaccinate", time: "10:00 AM" },
    { id: 4, name: "John Doe", type: "Check-up", time: "04:00 PM" },
    { id: 5, name: "John Smith", type: "Follow-up", time: "10:00 AM" },
];

const commonCases = [
    { label: "Fever", many: 30, onlyAFew: 23 },
    { label: "Injury", many: 20, onlyAFew: 7 },
    { label: "Headache", many: 9, onlyAFew: 1 },
    { label: "Stomach", many: 35, onlyAFew: 34 },
    { label: "Injury", many: 22, onlyAFew: 12 },
    { label: "Malaria", many: 31, onlyAFew: 4 },
    { label: "Other", many: 34, onlyAFew: 14 },
];

export default function NurseDashboard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6 pb-10"
        >
            {/* Custom Welcome Section matching image */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl border border-gray-50 shadow-sm gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome back Nurse</h1>
                </div>
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-100 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all text-sm shadow-inner"
                    />
                </div>
            </div>

            {/* Stat Cards Grid - Using Teacher Style layout & trend props */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    label="Today's Visits"
                    value="308"
                    icon={<Stethoscope size={28} />}
                    progress={75}
                    trend={{ value: "+12", label: "from yesterday", direction: "up" }}
                />
                <StatCard
                    label="Active Cases"
                    value="42"
                    icon={<BriefcaseMedical size={28} />}
                    progress={45}
                    trend={{ value: "-3", label: "from yesterday", direction: "down" }}
                />
                <StatCard
                    label="Appointments"
                    value="15"
                    icon={<CalendarDays size={28} />}
                    progress={60}
                    trend={{ value: "4", label: "completed", direction: "up" }}
                />
                <StatCard
                    label="Critical Cases"
                    value="2"
                    icon={<AlertCircle size={28} />}
                    progress={25}
                    trend={{ value: "-1", label: "this week", direction: "down" }}
                />
            </div>

            {/* Monthly Visits Chart Container */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <Card className="p-10 border border-gray-100 shadow-sm rounded-[32px] bg-white overflow-hidden">
                    <div className="flex justify-between items-center mb-12 px-2">
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Monthly Visits</h1>
                    </div>
                    <CardBody className="h-[320px] relative mt-4 overflow-visible">
                        {/* Grid Lines - Match Image 1 vertical separation */}
                        <div className="absolute inset-0 flex flex-col justify-between py-10 pr-0">
                            {[20, 15, 10, 5, 0].map(y => (
                                <div key={y} className="flex items-center gap-6">
                                    <span className="text-[14px] text-gray-400 w-6 text-left font-medium">{y}</span>
                                    <div className="flex-1 h-[1px] bg-gray-100"></div>
                                </div>
                            ))}
                        </div>

                        {/* Months Labels - Centered under grid sections */}
                        <div className="absolute bottom-0 left-12 right-0 flex justify-between px-0 pt-8">
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
                                <span key={month} className="text-[13px] text-gray-500 font-medium tracking-tight w-[calc(100%/12)] text-center">{month}</span>
                            ))}
                        </div>

                        {/* The Actual Graph */}
                        <div className="absolute inset-0 left-12 pt-10 pb-10 pr-0">
                            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 200">
                                <defs>
                                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.7" />
                                        <stop offset="100%" stopColor="white" stopOpacity="0.0" />
                                    </linearGradient>
                                </defs>
                                {/* Area fill - Precisely matching Image 1 curve */}
                                <motion.path
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 1 }}
                                    d="M0,55 C80,45 160,35 240,40 S320,55 400,85 S480,75 560,65 S640,60 720,55 S800,195 880,185 S960,30 1000,20 L1000,200 L0,200 Z"
                                    fill="url(#areaGradient)"
                                />
                                {/* Double Thick Black Line (Effect from image) */}
                                <motion.path
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                    d="M0,53 C80,43 160,33 240,38 S320,53 400,83 S480,73 560,63 S640,58 720,53 S800,193 880,183 S960,28 1000,18"
                                    fill="none"
                                    stroke="black"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                                <motion.path
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1.5, ease: "easeInOut", delay: 0.1 }}
                                    d="M0,57 C80,47 160,37 240,42 S320,57 400,87 S480,77 560,67 S640,62 720,57 S800,197 880,187 S960,32 1000,22"
                                    fill="none"
                                    stroke="black"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                                {/* Tooltip anchor point at May vertex */}
                                <motion.circle
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 1.5 }}
                                    cx="400" cy="85" r="4.5" fill="white" stroke="black" strokeWidth="2.5"
                                />
                                {/* Refined Tooltip Box from Image 1 */}
                                <motion.g
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.7 }}
                                    transform="translate(380, 25)"
                                >
                                    <rect width="40" height="30" rx="8" fill="black" />
                                    <text x="20" y="20" fill="white" fontSize="13" textAnchor="middle" fontWeight="bold">30</text>
                                    <path d="M14,30 L20,38 L26,30 Z" fill="black" />
                                </motion.g>
                            </svg>
                        </div>
                    </CardBody>
                </Card>
            </motion.div>

            {/* Common Cases Chart Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
            >
                <Card className="p-10 border-none shadow-xl shadow-gray-100/50 rounded-2xl bg-white">
                    <CardHeader title="Common Cases This Week" className="mb-10" />
                    <CardBody>
                        <div className="flex items-end justify-around h-[240px] mb-12 gap-6">
                            {commonCases.map((c, i) => (
                                <div key={i} className="flex flex-col items-center gap-4 group cursor-default flex-1">
                                    <div className="flex gap-2.5 items-end h-[200px] w-full justify-center">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            whileInView={{ height: `${c.many * 4.5}px` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.8, delay: i * 0.08, ease: "easeOut" }}
                                            className="w-12 bg-black rounded-md hover:bg-gray-900 transition-colors shadow-lg shadow-black/5"
                                        ></motion.div>
                                        <motion.div
                                            initial={{ height: 0 }}
                                            whileInView={{ height: `${c.onlyAFew * 4.5}px` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.8, delay: 0.3 + i * 0.08, ease: "easeOut" }}
                                            className="w-12 bg-gray-700 rounded-md hover:bg-gray-800 transition-colors shadow-lg shadow-gray-700/5"
                                        ></motion.div>
                                    </div>
                                    <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-tighter text-center">{c.label}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-10 border-t border-gray-50 pt-8 px-6">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-black rounded-lg shadow-md shadow-black/10"></div>
                                <span className="text-[12px] font-black uppercase text-gray-600 tracking-widest">Many</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-gray-700 rounded-lg shadow-md shadow-gray-700/10"></div>
                                <span className="text-[12px] font-black uppercase text-gray-600 tracking-widest">Only A Few</span>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-8">
                {/* Recent Cases Table */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="xl:col-span-2"
                >
                    <Card className="border-none shadow-xl shadow-gray-100/50 rounded-2xl overflow-hidden bg-white">
                        <CardBody className="p-0">
                            <DataTable
                                columns={caseCols}
                                data={recentCases}
                                keyField="id"
                            />
                            <div className="p-6 flex items-center justify-between border-t border-gray-50 text-[11px] font-black text-gray-400 uppercase tracking-wider">
                                <span>Showing 1 to 4 of 247 results</span>
                                <div className="flex gap-3">
                                    <Button variant="outline" size="sm" className="px-5 h-10 text-[11px] border-gray-100 font-black hover:bg-black hover:text-white transition-all rounded-lg">Previous</Button>
                                    <div className="flex gap-2">
                                        <Button size="sm" className="w-10 h-10 p-0 bg-black text-white text-[11px] font-black shadow-lg shadow-black/20 rounded-lg">1</Button>
                                        <Button variant="outline" size="sm" className="w-10 h-10 p-0 text-[11px] font-black border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">2</Button>
                                    </div>
                                    <Button variant="outline" size="sm" className="px-5 h-10 text-[11px] border-gray-100 font-black hover:bg-black hover:text-white transition-all rounded-lg">Next</Button>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </motion.div>

                {/* Upcoming Appointments */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <Card className="h-full border-none shadow-xl shadow-gray-100/50 rounded-2xl bg-white p-2">
                        <CardHeader title="Upcoming Appointments" className="p-4" />
                        <CardBody className="space-y-4 p-4 mt-2">
                            {upcomingAppointments.map((app, i) => (
                                <motion.div
                                    key={app.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ x: 5 }}
                                    className="flex items-center gap-5 p-5 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all cursor-pointer group border border-transparent hover:border-gray-100"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center text-white shrink-0 shadow-lg shadow-black/20">
                                        <Clock size={22} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-[14px] font-black truncate text-gray-900">{app.name}</h4>
                                        <p className="text-[11px] font-bold text-gray-400 group-hover:text-gray-500 transition-colors uppercase mt-0.5">{app.type}</p>
                                    </div>
                                    <div className="text-[11px] font-black text-blue-600 whitespace-nowrap bg-blue-50/50 px-4 py-2 rounded-lg border border-blue-100/50">
                                        {app.time}
                                    </div>
                                </motion.div>
                            ))}
                        </CardBody>
                    </Card>
                </motion.div>
            </div>

            {/* Quick Actions */}
            <div>
                <div className="dashboard-section-header">
                    <h2 className="dashboard-section-title">Quick Actions</h2>
                </div>
                <div className="quick-actions-grid">
                    {[
                        { label: "New Visit", sub: "Add health record", icon: <Users size={24} className="quick-action-icon" />, href: "/nurse/records" },
                        { label: "Schedule", sub: "View appointments", icon: <CalendarDays size={24} className="quick-action-icon" />, href: "/nurse/appointments" },
                        { label: "Medications", sub: "Manage inventory", icon: <Pill size={24} className="quick-action-icon" />, href: "/nurse/medications" },
                        { label: "Reports", sub: "View analytics", icon: <FileText size={24} className="quick-action-icon" />, href: "/nurse/reports" },
                    ].map((action, i) => (
                        <Link key={i} href={action.href}>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="quick-action-card"
                            >
                                {action.icon}
                                <h3 className="quick-action-title">{action.label}</h3>
                                <p className="quick-action-desc">{action.sub}</p>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
