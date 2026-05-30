"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { DataTable } from "@/components/ui/DataTable";
import { Search, ListFilter, Calendar, Upload, Download, Trash2, X } from "lucide-react";
import { filesApi } from "@/lib/api/files";
import { toast } from "@/lib/utils/toast";

interface Document {
    id: string;
    name: string;
    category: string;
    type: string;
    date: string;
    status: string;
    key: string;
    url: string;
    sizeBytes: number;
}

export default function DocumentsPage() {
    const [docs, setDocs] = useState<Document[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadCategory, setUploadCategory] = useState("Medical record");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load documents from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem("nurse_documents");
        if (stored) {
            setDocs(JSON.parse(stored));
        }
    }, []);

    // Save documents to localStorage whenever they change
    useEffect(() => {
        if (docs.length > 0) {
            localStorage.setItem("nurse_documents", JSON.stringify(docs));
        }
    }, [docs]);

    const handleFileUpload = async (file: File) => {
        if (!file) return;

        setUploading(true);
        try {
            const result = await filesApi.uploadFile(file);
            
            const newDoc: Document = {
                id: crypto.randomUUID(),
                name: file.name.replace(/\.[^/.]+$/, ""),
                category: uploadCategory,
                type: file.type.split("/")[1]?.toUpperCase() || "FILE",
                date: new Date().toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                }),
                status: "Private",
                key: result.key,
                url: result.url,
                sizeBytes: file.size
            };

            setDocs(prev => [newDoc, ...prev]);
            toast.success("Document uploaded successfully");
            setShowUploadModal(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            console.error("Upload error:", error);
            toast.error(error instanceof Error ? error.message : "Failed to upload document");
        } finally {
            setUploading(false);
        }
    };

    const handleDownload = async (doc: Document) => {
        try {
            // Get fresh URL from backend
            const result = await filesApi.getFileUrl(doc.key);
            
            // Create a temporary anchor element to trigger download
            const link = document.createElement("a");
            link.href = result.url;
            link.download = `${doc.name}.${doc.type.toLowerCase()}`;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            
            // Append to body, click, and remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            toast.success("Download started");
        } catch (error) {
            console.error("Download error:", error);
            toast.error("Failed to download document");
        }
    };

    const handleDelete = (docId: string) => {
        if (confirm("Are you sure you want to delete this document?")) {
            setDocs(prev => prev.filter(d => d.id !== docId));
            toast.success("Document deleted");
        }
    };

    // Get unique categories from documents
    const categories = ["all", ...Array.from(new Set(docs.map(d => d.category)))];

    // Filter documents
    let filteredDocs = docs.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

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
                        onClick={() => handleDownload(row)}
                        className="hover:scale-110 transition-transform"
                        title="Download"
                    >
                        <Download size={18} />
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="hover:scale-110 transition-transform text-red-500 hover:text-red-600"
                        title="Delete"
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
                    onClick={() => setShowUploadModal(true)}
                    className="bg-black text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-3 shadow-xl shadow-black/10 hover:shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    <Upload size={20} strokeWidth={3} />
                    Upload a document
                </button>
            </div>

            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden min-h-[600px]">
                <div className="p-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Search Field */}
                    <div className="relative w-full max-w-lg">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input
                            type="text"
                            placeholder="Search document"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-black text-sm transition-all"
                        />
                    </div>
                    {/* Filters */}
                    <div className="flex items-center gap-3 font-bold">
                        <div className="relative group flex items-center gap-2 px-6 py-3.5 border border-gray-100 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-all cursor-pointer">
                            <ListFilter size={18} />
                            <span>{categoryFilter === "all" ? "All Documents" : categoryFilter}</span>
                            <select 
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            >
                                <option value="all">All Documents</option>
                                {categories.filter(c => c !== "all").map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                                <option value="Medical record">Medical records</option>
                                <option value="Certificate">Certificates</option>
                                <option value="Letter">Letters</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="px-8 pb-8">
                    {loading ? (
                        <div className="text-center py-16">
                            <p className="text-gray-400 text-lg font-bold">Loading documents...</p>
                        </div>
                    ) : filteredDocs.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-gray-400 text-lg font-bold">
                                {searchQuery ? "No documents found matching your search" : "No documents uploaded yet"}
                            </p>
                        </div>
                    ) : (
                        <DataTable
                            columns={COLUMNS}
                            data={filteredDocs}
                            className="assignments-table rounded-2xl overflow-hidden"
                        />
                    )}
                </div>
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-black">Upload Document</h3>
                            <button
                                onClick={() => setShowUploadModal(false)}
                                className="text-gray-400 hover:text-black transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-gray-600 text-sm mb-2 block font-bold">Category</label>
                                <select
                                    value={uploadCategory}
                                    onChange={(e) => setUploadCategory(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                                >
                                    <option value="Medical record">Medical Record</option>
                                    <option value="Certificate">Certificate</option>
                                    <option value="Report card">Report Card</option>
                                    <option value="Letter">Letter</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-gray-600 text-sm mb-2 block font-bold">File</label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleFileUpload(file);
                                    }}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                                    disabled={uploading}
                                />
                            </div>

                            {uploading && (
                                <div className="text-center text-gray-500 py-4 font-bold">
                                    Uploading...
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}
