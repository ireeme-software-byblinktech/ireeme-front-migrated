"use client";

import { StatCard } from "@/components/ui";
import { DataTable } from "@/components/ui/DataTable";
import { Search, ListFilter, Plus, Eye, Pencil, Trash2, Pill } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
    AddMedicationModal,
    UpdateMedicationModal,
    ViewMedicationModal,
    DeleteConfirmationModal
} from "@/components/nurse/HealthRecordModals";
import { medicationsApi, Medication, CreateMedicationDto, UpdateMedicationDto } from "@/lib/api/medications";
import { toast } from "@/lib/utils/toast";

export default function MedicationsPage() {
    const [meds, setMeds] = useState<Medication[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeModal, setActiveModal] = useState<"add" | "edit" | "view" | "delete" | null>(null);
    const [selectedRecord, setSelectedRecord] = useState<Medication | null>(null);
    const [formData, setFormData] = useState<CreateMedicationDto>({
        name: "",
        type: "",
        quantity: "",
        expiryDate: "",
        status: "In Stock",
    });

    useEffect(() => {
        fetchMedications();
    }, []);

    const fetchMedications = async () => {
        setLoading(true);
        try {
            const data = await medicationsApi.getAll();
            setMeds(data);
        } catch (error) {
            console.error("Failed to fetch medications:", error);
            toast.error("Failed to load medications");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!formData.name || !formData.type || !formData.quantity || !formData.expiryDate) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            const newMed = await medicationsApi.create(formData);
            setMeds([newMed, ...meds]);
            toast.success("Medication added successfully");
            setActiveModal(null);
            setFormData({ name: "", type: "", quantity: "", expiryDate: "", status: "In Stock" });
        } catch (error) {
            console.error("Failed to add medication:", error);
            toast.error("Failed to add medication");
        }
    };

    const handleUpdate = async () => {
        if (!selectedRecord) return;

        try {
            const updated = await medicationsApi.update(selectedRecord.id, formData);
            setMeds(meds.map(m => m.id === selectedRecord.id ? updated : m));
            toast.success("Medication updated successfully");
            setActiveModal(null);
            setSelectedRecord(null);
        } catch (error) {
            console.error("Failed to update medication:", error);
            toast.error("Failed to update medication");
        }
    };

    const handleEdit = (record: Medication) => {
        setSelectedRecord(record);
        setFormData({
            name: record.name,
            type: record.type,
            quantity: record.quantity,
            expiryDate: new Date(record.expiryDate).toISOString().split('T')[0],
            status: record.status,
        });
        setActiveModal("edit");
    };

    const handleOpenAddModal = () => {
        setFormData({ name: "", type: "", quantity: "", expiryDate: "", status: "In Stock" });
        setActiveModal("add");
    };

    const handleDelete = async () => {
        if (!selectedRecord) return;

        try {
            await medicationsApi.delete(selectedRecord.id);
            setMeds(meds.filter(m => m.id !== selectedRecord.id));
            toast.success("Medication deleted successfully");
            setActiveModal(null);
        } catch (error) {
            console.error("Failed to delete medication:", error);
            toast.error("Failed to delete medication");
        }
    };

    const stats = {
        total: meds.length,
        inStock: meds.filter(m => m.status === "In Stock").length,
        lowStock: meds.filter(m => m.status === "Low Stock").length,
        outOfStock: meds.filter(m => m.status === "Out of Stock").length,
    };

    const STATS = [
        { label: "Total Items", value: stats.total.toString(), icon: <Pill />, progress: 100, trend: null },
        { label: "In Stock", value: stats.inStock.toString(), icon: <Pill />, progress: stats.total > 0 ? (stats.inStock / stats.total) * 100 : 0, trend: null },
        { label: "Low Stock", value: stats.lowStock.toString(), icon: <Pill />, progress: stats.total > 0 ? (stats.lowStock / stats.total) * 100 : 0, trend: null },
        { label: "Out of Stock", value: stats.outOfStock.toString(), icon: <Pill />, progress: stats.total > 0 ? (stats.outOfStock / stats.total) * 100 : 0, trend: null },
    ];

    const COLUMNS = [
        { key: "checkbox", header: "", render: () => <input type="checkbox" className="rounded-md h-4 w-4 border-gray-300 accent-black cursor-pointer" /> },
        { key: "name", header: "Medication Name" },
        { key: "type", header: "Type" },
        { key: "quantity", header: "Quantity" },
        { 
            key: "expiryDate", 
            header: "Expiry Date",
            render: (v: any) => v ? new Date(v).toLocaleDateString() : "N/A"
        },
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
                        onClick={() => handleEdit(row)}
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
                        trend={stat.trend}
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
                        <div className="relative group flex items-center gap-2 px-6 py-3.5 border border-gray-100 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all cursor-pointer">
                            <ListFilter size={18} />
                            <span>Filter Status</span>
                            <select className="absolute inset-0 opacity-0 cursor-pointer w-full h-full">
                                <option value="">All Status</option>
                                <option value="In Stock">In Stock</option>
                                <option value="Low Stock">Low Stock</option>
                                <option value="Out of Stock">Out of Stock</option>
                            </select>
                        </div>
                        <button
                            onClick={handleOpenAddModal}
                            className="bg-black text-white px-8 py-3.5 rounded-xl font-black text-sm flex items-center gap-2 shadow-xl shadow-black/10 hover:shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            Add Item +
                        </button>
                    </div>
                </div>

                <div className="px-8 pb-8">
                    {meds.length === 0 && !loading ? (
                        <div className="text-center py-16">
                            <p className="text-gray-400 text-lg font-bold">No medications recorded</p>
                        </div>
                    ) : (
                        <DataTable
                            columns={COLUMNS}
                            data={meds}
                            className="assignments-table rounded-2xl overflow-hidden"
                        />
                    )}
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
            <AddMedicationModal 
                open={activeModal === "add"} 
                onClose={() => setActiveModal(null)} 
                onConfirm={handleAdd}
                formData={formData}
                setFormData={setFormData}
            />
            <UpdateMedicationModal 
                open={activeModal === "edit"} 
                onClose={() => setActiveModal(null)} 
                record={selectedRecord} 
                onConfirm={handleUpdate}
                formData={formData}
                setFormData={setFormData}
            />
            <ViewMedicationModal open={activeModal === "view"} onClose={() => setActiveModal(null)} record={selectedRecord} />
            <DeleteConfirmationModal open={activeModal === "delete"} onClose={() => setActiveModal(null)} onConfirm={handleDelete} />
        </motion.div>
    );
}

