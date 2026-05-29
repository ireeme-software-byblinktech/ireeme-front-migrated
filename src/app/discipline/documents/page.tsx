"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardBody } from "@/components/ui";
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
    FileText,
    X
} from "lucide-react";
import { motion } from "framer-motion";
import { filesApi } from "@/lib/api/files";
import { toast } from "@/lib/utils/toast";

// ─── Types ────────────────────────────────────────────────────

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
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [sortBy, setSortBy] = useState<"date-desc" | "date-asc">("date-desc");
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [uploadCategory, setUploadCategory] = useState("Certificate");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load documents from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem("discipline_documents");
        if (stored) {
            setDocuments(JSON.parse(stored));
        }
    }, []);

    // Save documents to localStorage whenever they change
    useEffect(() => {
        if (documents.length > 0) {
            localStorage.setItem("discipline_documents", JSON.stringify(documents));
        }
    }, [documents]);

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

            setDocuments(prev => [newDoc, ...prev]);
            toast.success("Document uploaded successfully");
            setShowUploadModal(false);
        } catch (error) {
            console.error("Upload error:", error);
            toast.error(error instanceof Error ? error.message : "Failed to upload document");
        } finally {
            setUploading(false);
        }
    };

    const handleView = async (doc: Document) => {
        try {
            const result = await filesApi.getFileUrl(doc.key);
            window.open(result.url, "_blank");
        } catch (error) {
            console.error("View error:", error);
            toast.error("Failed to open document");
        }
    };

    const handleDownload = async (doc: Document) => {
        try {
            const result = await filesApi.getFileUrl(doc.key);
            const link = document.createElement("a");
            link.href = result.url;
            link.download = `${doc.name}.${doc.type.toLowerCase()}`;
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
            setDocuments(prev => prev.filter(d => d.id !== docId));
            toast.success("Document deleted");
        }
    };

    // Get unique categories from documents
    const categories = ["all", ...Array.from(new Set(documents.map(d => d.category)))];

    // Filter and sort documents
    let filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    // Sort documents
    filteredDocuments = [...filteredDocuments].sort((a, b) => {
        const dateA = new Date(a.date.split("-").reverse().join("-")).getTime();
        const dateB = new Date(b.date.split("-").reverse().join("-")).getTime();
        return sortBy === "date-desc" ? dateB - dateA : dateA - dateB;
    });

    const docCols: Column<Document>[] = [
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
            render: (_, row) => (
                <div className="flex gap-4">
                    <button 
                        onClick={() => handleView(row)}
                        className="text-gray-400 hover:text-black transition-colors"
                    >
                        <Eye size={18} />
                    </button>
                    <button 
                        onClick={() => handleDownload(row)}
                        className="text-gray-400 hover:text-black transition-colors"
                    >
                        <Download size={18} />
                    </button>
                    <button 
                        onClick={() => handleDelete(row.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
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
            className="space-y-8 p-1"
        >
            <PageHeader
                title="Documents"
                subtitle="Store, organize, and access your academic and school documents."
                actions={
                    <Button 
                        onClick={() => setShowUploadModal(true)}
                        className="bg-black text-white px-8 py-7 h-auto rounded-2xl font-black flex gap-3 items-center shadow-xl shadow-black/10 hover:scale-[1.02] transition-all"
                    >
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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all bg-white font-medium"
                    />
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    {/* Category Filter */}
                    <div className="relative flex-1 md:flex-none">
                        <Button 
                            variant="outline" 
                            onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                            className="w-full py-3.5 px-6 h-auto normal-case font-black border-gray-100 text-gray-400 flex gap-2 items-center rounded-xl hover:bg-gray-50"
                        >
                            <Filter size={16} /> {categoryFilter === "all" ? "All documents" : categoryFilter}
                        </Button>
                        {showCategoryMenu && (
                            <div className="absolute top-full mt-2 left-0 bg-white border border-gray-100 rounded-xl shadow-lg z-10 min-w-[200px]">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => {
                                            setCategoryFilter(cat);
                                            setShowCategoryMenu(false);
                                        }}
                                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl ${
                                            categoryFilter === cat ? "bg-gray-100 font-bold" : ""
                                        }`}
                                    >
                                        {cat === "all" ? "All documents" : cat}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sort by Date */}
                    <div className="relative flex-1 md:flex-none">
                        <Button 
                            variant="outline" 
                            onClick={() => setShowSortMenu(!showSortMenu)}
                            className="w-full py-3.5 px-6 h-auto normal-case font-black border-gray-100 text-gray-400 flex gap-2 items-center rounded-xl hover:bg-gray-50"
                        >
                            <Calendar size={16} /> {sortBy === "date-desc" ? "Newest first" : "Oldest first"}
                        </Button>
                        {showSortMenu && (
                            <div className="absolute top-full mt-2 right-0 bg-white border border-gray-100 rounded-xl shadow-lg z-10 min-w-[180px]">
                                <button
                                    onClick={() => {
                                        setSortBy("date-desc");
                                        setShowSortMenu(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 rounded-t-xl ${
                                        sortBy === "date-desc" ? "bg-gray-100 font-bold" : ""
                                    }`}
                                >
                                    Newest first
                                </button>
                                <button
                                    onClick={() => {
                                        setSortBy("date-asc");
                                        setShowSortMenu(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 rounded-b-xl ${
                                        sortBy === "date-asc" ? "bg-gray-100 font-bold" : ""
                                    }`}
                                >
                                    Oldest first
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Table */}
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                <CardBody className="p-0">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading documents...</div>
                    ) : filteredDocuments.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            {searchQuery ? "No documents found matching your search" : "No documents uploaded yet"}
                        </div>
                    ) : (
                        <DataTable
                            columns={docCols}
                            data={filteredDocuments}
                            keyField="id"
                        />
                    )}
                </CardBody>
            </Card>

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
                                <label className="text-gray-600 text-sm mb-2 block">Category</label>
                                <select
                                    value={uploadCategory}
                                    onChange={(e) => setUploadCategory(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black"
                                >
                                    <option value="Certificate">Certificate</option>
                                    <option value="Medical record">Medical Record</option>
                                    <option value="Report card">Report Card</option>
                                    <option value="Letter">Letter</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-gray-600 text-sm mb-2 block">File</label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleFileUpload(file);
                                    }}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black"
                                    disabled={uploading}
                                />
                            </div>

                            {uploading && (
                                <div className="text-center text-gray-500 py-4">
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
