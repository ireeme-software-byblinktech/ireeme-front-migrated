"use client";

import { StatCard, Card, CardBody } from "@/components/ui/Card";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import {
    Plus,
    Search,
    Eye,
    Edit,
    Trash2,
    Filter,
    GraduationCap
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
    AddPermissionModal,
    UpdatePermissionModal,
    ViewPermissionModal,
    DeleteConfirmationModal
} from "@/components/nurse/HealthRecordModals";

const homePermissions = [
    { id: 1, name: "John Doe", issue: "High Fever (39°C)", parent: "Mrs. Jane Doe (Mother)", dateIssued: "02-02-2026", expectedReturn: "02-02-2026", status: "Active" },
    { id: 2, name: "John Doe", issue: "High Fever (39°C)", parent: "Mrs. Jane Doe (Mother)", dateIssued: "02-02-2026", expectedReturn: "02-02-2026", status: "Returned" },
    { id: 3, name: "John Doe", issue: "High Fever (39°C)", parent: "Mrs. Jane Doe (Mother)", dateIssued: "02-02-2026", expectedReturn: "02-02-2026", status: "Returned" },
    { id: 4, name: "John Doe", issue: "High Fever (39°C)", parent: "Mrs. Jane Doe (Mother)", dateIssued: "02-02-2026", expectedReturn: "02-02-2026", status: "Returned" },
    { id: 5, name: "John Doe", issue: "High Fever (39°C)", parent: "Mrs. Jane Doe (Mother)", dateIssued: "02-02-2026", expectedReturn: "02-02-2026", status: "Returned" },
    { id: 6, name: "John Doe", issue: "High Fever (39°C)", parent: "Mrs. Jane Doe (Mother)", dateIssued: "02-02-2026", expectedReturn: "02-02-2026", status: "Returned" },
    { id: 7, name: "John Doe", issue: "High Fever (39°C)", parent: "Mrs. Jane Doe (Mother)", dateIssued: "02-02-2026", expectedReturn: "02-02-2026", status: "Returned" },
    { id: 8, name: "John Doe", issue: "High Fever (39°C)", parent: "Mrs. Jane Doe (Mother)", dateIssued: "02-02-2026", expectedReturn: "02-02-2026", status: "Overdue" },
    { id: 9, name: "John Doe", issue: "High Fever (39°C)", parent: "Mrs. Jane Doe (Mother)", dateIssued: "02-02-2026", expectedReturn: "02-02-2026", status: "Active" },
];

type PermissionRow = typeof homePermissions[number];

export default function HomePermissionsPage() {
    const [permissions, setPermissions] = useState(homePermissions);
    const [activeModal, setActiveModal] = useState<"add" | "edit" | "view" | "delete" | null>(null);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);

    const handleAdd = () => {
        const newPermission = {
            id: permissions.length + 1,
            name: "New Student " + (permissions.length + 1),
            issue: "General Sickness",
            parent: "Mrs. Smith",
            dateIssued: new Date().toISOString().split('T')[0],
            expectedReturn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: "Active"
        };
        setPermissions([newPermission, ...permissions]);
    };

    const handleUpdate = () => {
        setPermissions(permissions.map(item =>
            item.id === selectedRecord.id ? { ...item, name: item.name + " (Updated)" } : item
        ));
    };

    const handleDelete = () => {
        setPermissions(permissions.filter(item => item.id !== selectedRecord.id));
    };

    const columns: Column<PermissionRow>[] = [
        {
            key: "checkbox",
            header: "",
            render: () => <input type="checkbox" className="rounded border-gray-300 h-4 w-4" />
        },
        { key: "name", header: "Student Name", render: (v) => <span className="font-bold">{String(v)}</span> },
        {
            key: "issue",
            header: "Health Issue",
            render: (_, row) => (
                <div>
                    <p className="font-black text-sm text-gray-900">{row.issue}</p>
                    <p className="text-[11px] text-gray-400 font-bold uppercase mt-0.5">{row.parent}</p>
                </div>
            )
        },
        { key: "dateIssued", header: "Date Issued" },
        { key: "expectedReturn", header: "Expected Return" },
        {
            key: "status",
            header: "Status",
            render: (v) => (
                <span className={cn(
                    "px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest block text-center max-w-[110px]",
                    v === "Active" ? "bg-black text-white" :
                        v === "Overdue" ? "bg-red-950 text-red-500 shadow-lg shadow-red-500/10" : "bg-gray-100 text-gray-800"
                )}>
                    {String(v)}
                </span>
            )
        },
        {
            key: "action",
            header: "Action",
            align: "right",
            render: (_, row) => (
                <div className="flex items-center justify-end gap-3 px-2">
                    <button
                        onClick={() => { setSelectedRecord(row); setActiveModal("view"); }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-black"
                    >
                        <Eye size={18} />
                    </button>
                    <button
                        onClick={() => { setSelectedRecord(row); setActiveModal("edit"); }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-black"
                    >
                        <Edit size={18} />
                    </button>
                    <button
                        onClick={() => { setSelectedRecord(row); setActiveModal("delete"); }}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-500"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { label: "Active Permission", value: "308", icon: <GraduationCap size={28} />, progress: 75, trend: { value: "+12", label: "from yesterday", direction: "up" as const } },
                    { label: "Returned Today", value: "308", icon: <GraduationCap size={28} />, progress: 45, trend: { value: "-3", label: "from yesterday", direction: "down" as const } },
                    { label: "Overdue Returns", value: "308", icon: <GraduationCap size={28} />, progress: 60, trend: { value: "4", label: "completed", direction: "up" as const } },
                    { label: "This Week", value: "308", icon: <GraduationCap size={28} />, progress: 25, trend: { value: "-1", label: "this week", direction: "down" as const } },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <StatCard
                            label={stat.label}
                            value={stat.value}
                            icon={stat.icon}
                            progress={stat.progress}
                            trend={stat.trend}
                        />
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50"
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="relative flex-1 max-w-2xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by student name..."
                            className="w-full pl-12 pr-4 py-3.5 border border-gray-100 rounded-2xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all text-sm shadow-inner"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative group flex items-center gap-3 border border-gray-100 rounded-2xl px-5 py-3 bg-white cursor-pointer hover:bg-gray-50 transition-all shadow-sm">
                            <Filter size={18} className="text-gray-400" />
                            <span className="text-sm font-black text-gray-700">Filter Class</span>
                            <select className="absolute inset-0 opacity-0 cursor-pointer w-full h-full font-black text-sm">
                                <option value="">All Classes</option>
                                <option value="S1">Senior 1</option>
                                <option value="S2">Senior 2</option>
                                <option value="S3">Senior 3</option>
                                <option value="S4">Senior 4</option>
                                <option value="S5">Senior 5</option>
                                <option value="S6">Senior 6</option>
                            </select>
                        </div>
                        <Button
                            icon={<Plus size={20} />}
                            onClick={() => setActiveModal("add")}
                            className="bg-black text-white hover:bg-gray-800 rounded-2xl h-12 px-10 font-black shadow-2xl shadow-black/20"
                        >
                            Add Record
                        </Button>
                    </div>
                </div>

                <Card className="mt-10 overflow-hidden border border-gray-50 rounded-2xl shadow-none">
                    <CardBody className="p-0">
                        <DataTable
                            columns={columns}
                            data={permissions}
                            keyField="id"
                            className="table-header-black"
                        />
                    </CardBody>
                </Card>
            </motion.div>

            {/* Modals */}
            <AddPermissionModal open={activeModal === "add"} onClose={() => setActiveModal(null)} onConfirm={handleAdd} />
            <UpdatePermissionModal open={activeModal === "edit"} onClose={() => setActiveModal(null)} record={selectedRecord} onConfirm={handleUpdate} />
            <ViewPermissionModal open={activeModal === "view"} onClose={() => setActiveModal(null)} record={selectedRecord} />
            <DeleteConfirmationModal open={activeModal === "delete"} onClose={() => setActiveModal(null)} onConfirm={handleDelete} />
        </motion.div>
    );
}
