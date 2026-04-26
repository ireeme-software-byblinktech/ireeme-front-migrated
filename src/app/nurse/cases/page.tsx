"use client";

import { StatCard } from "@/components/ui";
import { DataTable } from "@/components/ui/DataTable";
import { Search, ListFilter, Plus, Eye, Pencil, Trash2, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import {
    AddMedicalCaseModal,
    UpdateMedicalCaseModal,
    ViewMedicalCaseModal,
    DeleteConfirmationModal
} from "@/components/nurse/HealthRecordModals";

const STATS = [
    { label: "In Progress", value: "308", icon: <GraduationCap size={28} />, progress: 75, meta: { male: "61%", female: "39%" } },
    { label: "Critical", value: "308", icon: <GraduationCap size={28} />, progress: 45, meta: { male: "61%", female: "39%" } },
    { label: "Completed Today", value: "308", icon: <GraduationCap size={28} />, progress: 60, meta: { male: "61%", female: "39%" } },
    { label: "Waiting", value: "308", icon: <GraduationCap size={28} />, progress: 25, meta: { male: "61%", female: "39%" } },
];

const CASES = [
    { id: "MC-2025-001", student: "John Doe", class: "S5 MCB", date: "02-02-2026", diagnosis: "In Progress" },
    { id: "MC-2025-001", student: "John Doe", class: "S5 MCB", date: "02-02-2026", diagnosis: "Critical" },
    { id: "MC-2025-001", student: "John Doe", class: "S5 MCB", date: "02-02-2026", diagnosis: "Critical" },
    { id: "MC-2025-001", student: "John Doe", class: "S5 MCB", date: "02-02-2026", diagnosis: "Critical" },
    { id: "MC-2025-001", student: "John Doe", class: "S5 MCB", date: "02-02-2026", diagnosis: "Critical" },
    { id: "MC-2025-001", student: "John Doe", class: "S5 MCB", date: "02-02-2026", diagnosis: "Critical" },
    { id: "MC-2025-001", student: "John Doe", class: "S5 MCB", date: "02-02-2026", diagnosis: "Critical" },
    { id: "MC-2025-001", student: "John Doe", class: "S5 MCB", date: "02-02-2026", diagnosis: "Critical" },
    { id: "MC-2025-001", student: "John Doe", class: "S5 MCB", date: "02-02-2026", diagnosis: "Critical" },
    { id: "MC-2025-001", student: "John Doe", class: "S5 MCB", date: "02-02-2026", diagnosis: "Critical" },
];

export default function MedicalCasesPage() {
    const [cases, setCases] = useState(CASES);
    const [activeModal, setActiveModal] = useState<"add" | "edit" | "view" | "delete" | null>(null);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);

    const handleAdd = () => {
        const newCase = {
            id: `MC-2025-00${cases.length + 1}`,
            student: "New Case Student",
            class: "S1 A",
            date: new Date().toISOString().split('T')[0],
            diagnosis: "New Case"
        };
        setCases([newCase, ...cases]);
    };

    const handleUpdate = () => {
        setCases(cases.map(item =>
            item.id === selectedRecord.id ? { ...item, student: item.student + " (Updated)" } : item
        ));
    };

    const handleDelete = () => {
        setCases(cases.filter(item => item.id !== selectedRecord.id));
    };

    const COLUMNS = [
        { key: "checkbox", header: "", render: () => <input type="checkbox" className="rounded-md h-4 w-4 border-gray-300 accent-black cursor-pointer" /> },
        { key: "id", header: "CASE ID" },
        { key: "student", header: "STUDENT" },
        { key: "class", header: "CLASS" },
        { key: "date", header: "DATE" },
        {
            key: "diagnosis",
            header: "DIAGNOSIS",
            render: (v: any) => (
                <span className="bg-black text-white px-8 py-2 rounded-lg font-bold text-[10px] uppercase tracking-wider block text-center max-w-[140px]">
                    {String(v)}
                </span>
            )
        },
        {
            key: "actions",
            header: "Action",
            render: (_: any, row: any) => (
                <div className="flex items-center gap-4 text-gray-900">
                    <button
                        onClick={() => { setSelectedRecord(row); setActiveModal("view"); }}
                        className="hover:scale-110 transition-transform"
                    >
                        <Eye size={18} />
                    </button>
                    <button
                        onClick={() => { setSelectedRecord(row); setActiveModal("edit"); }}
                        className="hover:scale-110 transition-transform"
                    >
                        <Pencil size={18} />
                    </button>
                    <button
                        onClick={() => { setSelectedRecord(row); setActiveModal("delete"); }}
                        className="hover:scale-110 transition-transform"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            )
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="space-y-1">
                <h1 className="text-[28px] font-black text-gray-900 tracking-tight">Medical Cases</h1>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {STATS.map((stat, i) => (
                    <StatCard
                        key={i}
                        label={stat.label}
                        value={stat.value}
                        icon={stat.icon}
                        progress={stat.progress}
                        meta={stat.meta}
                    />
                ))}
            </div>

            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden min-h-[600px]">
                <div className="p-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Search Field */}
                    <div className="relative w-full max-w-lg">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input
                            type="text"
                            placeholder="Search by caseID or student name..."
                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-black text-sm transition-all shadow-inner"
                        />
                    </div>
                    {/* Filters & Actions */}
                    <div className="flex items-center gap-3">
                        <div className="relative group flex items-center gap-2 px-6 py-3.5 border border-gray-100 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all cursor-pointer">
                            <ListFilter size={18} />
                            <span>Filter Status</span>
                            <select className="absolute inset-0 opacity-0 cursor-pointer w-full h-full">
                                <option value="">All Status</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Critical">Critical</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <button
                            onClick={() => setActiveModal("add")}
                            className="bg-black text-white px-8 py-3.5 rounded-xl font-black text-sm flex items-center gap-2 shadow-xl shadow-black/10 hover:shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            New Case +
                        </button>
                    </div>
                </div>

                <div className="px-8 pb-8">
                    <DataTable
                        columns={COLUMNS}
                        data={cases}
                        className="assignments-table rounded-2xl overflow-hidden"
                    />
                </div>
            </div>

            {/* Modals */}
            <AddMedicalCaseModal open={activeModal === "add"} onClose={() => setActiveModal(null)} onConfirm={handleAdd} />
            <UpdateMedicalCaseModal open={activeModal === "edit"} onClose={() => setActiveModal(null)} record={selectedRecord} onConfirm={handleUpdate} />
            <ViewMedicalCaseModal open={activeModal === "view"} onClose={() => setActiveModal(null)} record={selectedRecord} />
            <DeleteConfirmationModal open={activeModal === "delete"} onClose={() => setActiveModal(null)} onConfirm={handleDelete} />
        </motion.div>
    );
}
