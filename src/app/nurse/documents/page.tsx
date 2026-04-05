"use client";

import { motion } from "framer-motion";
import { DataTable } from "@/components/ui/DataTable";
import { Search, ListFilter, Calendar, Upload, Eye, Download, Trash2 } from "lucide-react";
import { useState } from "react";
import {
    AddDocumentModal,
    ViewDocumentModal,
    DeleteConfirmationModal
} from "@/components/nurse/HealthRecordModals";

const DOCUMENTS = [
    { name: "Birth Certificate", category: "Certificate", type: "PDF", date: "20-07-2025", status: "Private" },
    { name: "Birth Certificate", category: "Certificate", type: "PDF", date: "20-07-2025", status: "Private" },
    { name: "Birth Certificate", category: "Certificate", type: "PDF", date: "20-07-2025", status: "Private" },
    { name: "Birth Certificate", category: "Certificate", type: "PDF", date: "20-07-2025", status: "Private" },
    { name: "Birth Certificate", category: "Certificate", type: "PDF", date: "20-07-2025", status: "Private" },
    { name: "Birth Certificate", category: "Certificate", type: "PDF", date: "20-07-2025", status: "Private" },
    { name: "Medical Clearance", category: "Medical record", type: "PDF", date: "20-07-2025", status: "Private" },
    { name: "Medical Clearance", category: "Medical record", type: "PDF", date: "20-07-2025", status: "Private" },
    { name: "Medical Clearance", category: "Medical record", type: "PDF", date: "20-07-2025", status: "Private" },
    { name: "Medical Clearance", category: "Medical record", type: "PDF", date: "20-07-2025", status: "Private" },
    { name: "Medical Clearance", category: "Medical record", type: "PDF", date: "20-07-2025", status: "Private" },
    { name: "Medical Clearance", category: "Medical record", type: "PDF", date: "20-07-2025", status: "Private" },
    { name: "Medical Clearance", category: "Medical record", type: "PDF", date: "20-07-2025", status: "Private" },
];

export default function DocumentsPage() {
    const [docs, setDocs] = useState(DOCUMENTS);
    const [activeModal, setActiveModal] = useState<"add" | "view" | "delete" | null>(null);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);

    const handleAdd = () => {
        const newDoc = {
            name: "New Uploaded File " + (docs.length + 1),
            category: "General",
            type: "PDF",
            date: new Date().toISOString().split('T')[0],
            status: "Private"
        };
        setDocs([newDoc, ...docs]);
    };

    const handleDelete = () => {
        setDocs(docs.filter(item => item.name !== selectedRecord.name));
    };

    const COLUMNS = [
        { key: "name", header: "Name" },
        { key: "category", header: "Category" },
        { key: "type", header: "File type" },
        { key: "date", header: "Upload date" },
        {
            key: "status",
            header: "Status",
            render: (v: any) => (
                <span className="bg-black text-white px-8 py-2 rounded-lg font-bold text-[10px] uppercase tracking-wider">
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
                    <button className="hover:scale-110 transition-transform"><Download size={18} /></button>
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
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="space-y-1">
                    <h1 className="text-[28px] font-black text-gray-900 tracking-tight">Documents</h1>
                    <p className="text-gray-500 font-medium">Store, organize, and access your academic and school documents.</p>
                </div>
                <button
                    onClick={() => setActiveModal("add")}
                    className="bg-black text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-3 shadow-xl shadow-black/10 hover:shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    <Upload size={20} strokeWidth={3} />
                    Upload a document
                </button>
            </div>

            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden min-h-[600px]">
                <div className="p-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Search Field */}
                    <div className="relative w-full max-sm-sm">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input
                            type="text"
                            placeholder="Search document"
                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-black text-sm transition-all"
                        />
                    </div>
                    {/* Filters */}
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-6 py-3.5 border border-gray-100 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all">
                            <ListFilter size={18} />
                            All documents
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3.5 border border-gray-100 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all">
                            <Calendar size={18} />
                            upload date
                        </button>
                    </div>
                </div>

                <div className="px-8 pb-8">
                    <DataTable
                        columns={COLUMNS}
                        data={docs}
                        className="assignments-table rounded-2xl overflow-hidden"
                    />
                </div>
            </div>

            {/* Modals */}
            <AddDocumentModal open={activeModal === "add"} onClose={() => setActiveModal(null)} onConfirm={handleAdd} />
            <ViewDocumentModal open={activeModal === "view"} onClose={() => setActiveModal(null)} record={selectedRecord} />
            <DeleteConfirmationModal open={activeModal === "delete"} onClose={() => setActiveModal(null)} onConfirm={handleDelete} />
        </motion.div>
    );
}
