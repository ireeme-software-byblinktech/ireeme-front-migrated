"use client";

import { Card, CardBody } from "@/components/ui/Card";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/Shared";
import {
    Search,
    Upload,
    Filter,
    Calendar,
    Eye,
    Download,
    Trash2,
    FileText
} from "lucide-react";
import { motion } from "framer-motion";

// ─── MOCK DATA ────────────────────────────────────────────────

const documents = [
    { id: 1, name: "Birth Certificate", category: "Certificate", type: "PDF", date: "20-07-2025", status: "Private" },
    { id: 2, name: "Birth Certificate", category: "Certificate", type: "PDF", date: "20-07-2025", status: "Private" },
    { id: 3, name: "Birth Certificate", category: "Certificate", type: "PDF", date: "20-07-2025", status: "Private" },
    { id: 4, name: "Birth Certificate", category: "Certificate", type: "PDF", date: "20-07-2025", status: "Private" },
    { id: 5, name: "Birth Certificate", category: "Certificate", type: "PDF", date: "20-07-2025", status: "Private" },
    { id: 6, name: "Medical Clearance", category: "Medical record", type: "PDF", date: "20-07-2025", status: "Private" },
    { id: 7, name: "Medical Clearance", category: "Medical record", type: "PDF", date: "20-07-2025", status: "Private" },
    { id: 8, name: "Medical Clearance", category: "Medical record", type: "PDF", date: "20-07-2025", status: "Private" },
    { id: 9, name: "Medical Clearance", category: "Medical record", type: "PDF", date: "20-07-2025", status: "Private" },
];

const docCols: Column<any>[] = [
    { key: "id", header: "", render: () => <input type="checkbox" className="rounded" /> },
    { key: "name", header: "Name", render: (v) => <span className="text-gray-900 font-bold">{String(v)}</span> },
    { key: "category", header: "Category", render: (v) => <span className="text-gray-500">{String(v)}</span> },
    { key: "type", header: "File type", render: (v) => <span className="text-gray-500 font-bold">{String(v)}</span> },
    { key: "date", header: "Upload date", render: (v) => <span className="text-gray-500">{String(v)}</span> },
    {
        key: "status",
        header: "Status",
        render: (v) => (
            <span className="bg-black text-white px-6 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest inline-block text-center min-w-[100px]">
                {String(v)}
            </span>
        )
    },
    {
        key: "actions",
        header: "Action",
        render: () => (
            <div className="flex gap-4">
                <button className="text-gray-400 hover:text-black transition-colors"><Eye size={18} /></button>
                <button className="text-gray-400 hover:text-black transition-colors"><Download size={18} /></button>
                <button className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
            </div>
        )
    },
];

export default function DocumentsPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 p-1"
        >
            <PageHeader
                title="Documents"
                subtitle="Store, organize, and access your academic and school documents."
                actions={
                    <Button className="bg-black text-white px-8 py-7 h-auto rounded-2xl font-black flex gap-3 items-center shadow-xl shadow-black/10 hover:scale-[1.02] transition-all">
                        <Upload size={20} /> Upload a document
                    </Button>
                }
            />

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full max-w-xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search document"
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all bg-white font-medium"
                    />
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <Button variant="outline" className="flex-1 md:flex-none py-3.5 px-6 h-auto normal-case font-black border-gray-100 text-gray-400 flex gap-2 items-center rounded-xl">
                        <Filter size={16} /> All documents
                    </Button>
                    <Button variant="outline" className="flex-1 md:flex-none py-3.5 px-6 h-auto normal-case font-black border-gray-100 text-gray-400 flex gap-2 items-center rounded-xl">
                        <Calendar size={16} /> upload date
                    </Button>
                </div>
            </div>

            {/* Table */}
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                <CardBody className="p-0">
                    <DataTable
                        columns={docCols}
                        data={documents}
                        keyField="id"
                    />
                </CardBody>
            </Card>
        </motion.div>
    );
}
