"use client";

import { StatCard } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { Search, ListFilter, Plus, Eye, Pencil, Trash2, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import {
    AddMedicationModal,
    UpdateMedicationModal,
    ViewMedicationModal,
    DeleteConfirmationModal
} from "@/components/nurse/HealthRecordModals";

const STATS = [
    { label: "Today's Appoints", value: "308", icon: <GraduationCap size={28} />, progress: 75, meta: { male: "61%", female: "39%" } },
    { label: "Confirmed", value: "308", icon: <GraduationCap size={28} />, progress: 45, meta: { male: "61%", female: "39%" } },
    { label: "Pending", value: "308", icon: <GraduationCap size={28} />, progress: 60, meta: { male: "61%", female: "39%" } },
    { label: "Cancelled", value: "308", icon: <GraduationCap size={28} />, progress: 25, meta: { male: "61%", female: "39%" } },
];

const MEDS = [
    { name: "Paracetamol", type: "Tablet", quantity: "500 tablets", date: "02-02-2026", status: "In Stock" },
    { name: "Ibuprofen", type: "Tablet", quantity: "500 tablets", date: "02-02-2026", status: "In Stock" },
    { name: "Paracetamol", type: "Tablet", quantity: "500 tablets", date: "02-02-2026", status: "In Stock" },
    { name: "Paracetamol", type: "Tablet", quantity: "500 tablets", date: "02-02-2026", status: "In Stock" },
    { name: "Paracetamol", type: "Tablet", quantity: "500 tablets", date: "02-02-2026", status: "In Stock" },
    { name: "Paracetamol", type: "Tablet", quantity: "500 tablets", date: "02-02-2026", status: "In Stock" },
    { name: "Paracetamol", type: "Tablet", quantity: "500 tablets", date: "02-02-2026", status: "In Stock" },
    { name: "Paracetamol", type: "Tablet", quantity: "500 tablets", date: "02-02-2026", status: "In Stock" },
    { name: "Paracetamol", type: "Tablet", quantity: "500 tablets", date: "02-02-2026", status: "In Stock" },
    { name: "Paracetamol", type: "Tablet", quantity: "500 tablets", date: "02-02-2026", status: "In Stock" },
    { name: "John Doe", type: "johndoe@gmail.com", quantity: "Male", date: "02-02-2026", status: "" },
];

export default function MedicationsPage() {
    const [meds, setMeds] = useState(MEDS);
    const [activeModal, setActiveModal] = useState<"add" | "edit" | "view" | "delete" | null>(null);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);

    const handleAdd = () => {
        const newItem = {
            name: "New Medicine " + (meds.length + 1),
            type: "Tablet",
            quantity: "100 tablets",
            date: "12-12-2026",
            status: "In Stock"
        };
        setMeds([newItem, ...meds]);
    };

    const handleUpdate = () => {
        setMeds(meds.map(item =>
            item.name === selectedRecord.name ? { ...item, name: item.name + " (Updated)" } : item
        ));
    };

    const handleDelete = () => {
        setMeds(meds.filter(item => item.name !== selectedRecord.name));
    };

    const COLUMNS = [
        { key: "checkbox", header: "", render: () => <input type="checkbox" className="rounded-md h-4 w-4 border-gray-300 accent-black cursor-pointer" /> },
        { key: "name", header: "Medication Name" },
        { key: "type", header: "Type" },
        { key: "quantity", header: "Quantity" },
        { key: "date", header: "Expiry Date" },
        {
            key: "status",
            header: "Status",
            render: (v: any) => v ? (
                <span className="bg-black text-white px-8 py-2 rounded-lg font-bold text-[10px] uppercase tracking-wider block text-center max-w-[120px]">
                    {String(v)}
                </span>
            ) : null
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
                <h1 className="text-[28px] font-black text-gray-900 tracking-tight">Medications & Supplies</h1>
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

            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
                <div className="p-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Search Field */}
                    <div className="relative w-full max-w-lg">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input
                            type="text"
                            placeholder="Search medications..."
                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-black text-sm transition-all"
                        />
                    </div>
                    {/* Filters & Actions */}
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-6 py-3.5 border border-gray-100 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all">
                            <ListFilter size={18} />
                            Dispense
                        </button>
                        <button
                            onClick={() => setActiveModal("add")}
                            className="bg-black text-white px-8 py-3.5 rounded-xl font-black text-sm flex items-center gap-2 shadow-xl shadow-black/10 hover:shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            Add Item +
                        </button>
                    </div>
                </div>

                <div className="px-8 pb-8">
                    <DataTable
                        columns={COLUMNS}
                        data={meds}
                        className="assignments-table rounded-2xl overflow-hidden"
                    />
                </div>
            </div>

            {/* Recently Dispensed */}
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                <h2 className="text-xl font-black text-gray-900 tracking-tight mb-6">Recently Dispensed</h2>
                <div className="bg-gray-50/50 p-6 rounded-2xl">
                    <div className="space-y-1">
                        <p className="text-[15px] font-black text-gray-900">John Doe</p>
                        <p className="text-[12px] font-bold text-gray-500">Paracetamol •</p>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AddMedicationModal open={activeModal === "add"} onClose={() => setActiveModal(null)} onConfirm={handleAdd} />
            <UpdateMedicationModal open={activeModal === "edit"} onClose={() => setActiveModal(null)} record={selectedRecord} onConfirm={handleUpdate} />
            <ViewMedicationModal open={activeModal === "view"} onClose={() => setActiveModal(null)} record={selectedRecord} />
            <DeleteConfirmationModal open={activeModal === "delete"} onClose={() => setActiveModal(null)} onConfirm={handleDelete} />
        </motion.div>
    );
}
