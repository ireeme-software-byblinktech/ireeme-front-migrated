"use client";

import { StatCard } from "@/components/ui/Card";
import { Plus, Calendar as CalendarIcon, Pencil, Trash2, Search, Eye, ListFilter } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
    AddAppointmentModal,
    UpdateAppointmentModal,
    ViewAppointmentModal,
    DeleteConfirmationModal
} from "@/components/nurse/HealthRecordModals";

const STATS = [
    { label: "Today's Appoints", value: "308", icon: <CalendarIcon size={24} />, progress: 75, trend: { value: "+12", label: "from yesterday", direction: "up" as const } },
    { label: "Confirmed", value: "308", icon: <CalendarIcon size={24} />, progress: 45, trend: { value: "-3", label: "from yesterday", direction: "down" as const } },
    { label: "Pending", value: "308", icon: <CalendarIcon size={24} />, progress: 60, trend: { value: "4", label: "completed", direction: "up" as const } },
    { label: "Cancelled", value: "308", icon: <CalendarIcon size={24} />, progress: 25, trend: { value: "-1", label: "this week", direction: "down" as const } },
];

const SCHEDULE = [
    { time: "09:00 AM", name: "John Doe", type: "S5 MCB • Check-up", status: "Confirmed" },
    { time: "10:00 AM", name: "Jane Smith", type: "S4 PCM • Follow-up", status: "Confirmed" },
    { time: "11:00 AM", name: "Mark Johnson", type: "S6 MEG • Vaccination", status: "Pending" },
    { time: "02:00 PM", name: "Sarah Lee", type: "S3 PCB • Consultation", status: "Confirmed" },
    { time: "03:30 PM", name: "Emma Brown", type: "S5 MCB • Check-up", status: "Confirmed" },
    { time: "04:00 PM", name: "Alex Turner", type: "S4 PCM • Follow-up", status: "Cancelled" },
];

export default function AppointmentsPage() {
    const [schedule, setSchedule] = useState(SCHEDULE);
    const [activeModal, setActiveModal] = useState<"add" | "edit" | "view" | "delete" | null>(null);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);

    const handleAdd = () => {
        const newAppointment = {
            time: "10:30 AM",
            name: "New Student " + (schedule.length + 1),
            type: "S1 A • General Check-up",
            status: "Confirmed"
        };
        setSchedule([newAppointment, ...schedule]);
    };

    const handleUpdate = () => {
        setSchedule(schedule.map(item =>
            item.name === selectedRecord.name ? { ...item, name: item.name + " (Updated)" } : item
        ));
    };

    const handleDelete = () => {
        setSchedule(schedule.filter(item => item.name !== selectedRecord.name));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 p-1"
        >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {STATS.map((stat, i) => (
                    <StatCard
                        key={i}
                        label={stat.label}
                        value={stat.value}
                        icon={stat.icon}
                        progress={stat.progress}
                        trend={stat.trend}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Calendar & New Appointment */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm space-y-6">
                        <h2 className="text-xl font-black text-gray-900 tracking-tight">Calendar</h2>

                        <div className="relative">
                            <input
                                type="text"
                                defaultValue="01/19/2025"
                                className="w-full pl-6 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black transition-all"
                            />
                            <CalendarIcon className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        </div>

                        <button
                            onClick={() => setActiveModal("add")}
                            className="w-full bg-black text-white py-5 rounded-[20px] font-black text-[15px] flex items-center justify-center gap-3 shadow-xl shadow-black/10 hover:shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            <Plus size={20} strokeWidth={3} />
                            New Appointment
                        </button>

                        <div className="pt-4 h-[300px] border-t border-gray-50 bg-gray-50/20 rounded-2xl mt-4">
                        </div>
                    </div>
                </div>

                {/* Right Column: Today's Schedule */}
                <div className="lg:col-span-8 bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-black text-gray-900 tracking-tight">Today's Schedule</h2>
                        <div className="relative group flex items-center gap-2 px-6 py-2.5 bg-gray-50/50 border border-transparent hover:border-gray-100 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all cursor-pointer">
                            <ListFilter size={16} />
                            <span>Filter Status</span>
                            <select className="absolute inset-0 opacity-0 cursor-pointer w-full h-full">
                                <option value="">All Status</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Pending">Pending</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {schedule.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group flex items-center justify-between p-6 bg-gray-50/50 hover:bg-white border border-transparent hover:border-gray-100 rounded-[20px] transition-all hover:shadow-lg hover:shadow-gray-100/50"
                            >
                                <div className="flex items-center gap-10">
                                    <span className="text-[14px] font-black text-gray-900 w-[100px] shrink-0 tracking-tight">
                                        {item.time}
                                    </span>
                                    <div className="space-y-1">
                                        <p className="text-[15px] font-black text-gray-900 leading-none">
                                            {item.name}
                                        </p>
                                        <p className="text-[12px] font-bold text-gray-400 leading-none">
                                            {item.type}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <span className={cn(
                                        "px-5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider",
                                        item.status === "Confirmed" ? "bg-green-100/50 text-green-700" :
                                            item.status === "Pending" ? "bg-yellow-100/50 text-yellow-700" :
                                                "bg-red-100/50 text-red-700"
                                    )}>
                                        {item.status}
                                    </span>

                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => { setSelectedRecord(item); setActiveModal("view"); }}
                                            className="p-2.5 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-black transition-all"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            onClick={() => { setSelectedRecord(item); setActiveModal("edit"); }}
                                            className="p-2.5 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-black transition-all"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => { setSelectedRecord(item); setActiveModal("delete"); }}
                                            className="p-2.5 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AddAppointmentModal open={activeModal === "add"} onClose={() => setActiveModal(null)} onConfirm={handleAdd} />
            <UpdateAppointmentModal open={activeModal === "edit"} onClose={() => setActiveModal(null)} record={selectedRecord} onConfirm={handleUpdate} />
            <ViewAppointmentModal open={activeModal === "view"} onClose={() => setActiveModal(null)} record={selectedRecord} />
            <DeleteConfirmationModal open={activeModal === "delete"} onClose={() => setActiveModal(null)} onConfirm={handleDelete} />
        </motion.div>
    );
}
