"use client";

import React, { useState } from "react";
import { 
    AdminStatCard,
    DataTable,
    Column
} from "@/components/ui";
import { 
    Search, 
    Filter, 
    ChevronDown, 
    GraduationCap, 
    Users,
    Download,
    Mail
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ViewAlumniModal } from "@/components/ui/ViewAlumniModal";

interface AlumniRecord {
    id: number;
    name: string;
    graduationYear: string;
    email: string;
    phone: string;
    currentStatus: "Employed" | "Higher Education" | "Self-Employed" | "Searching";
}

const alumniData: AlumniRecord[] = Array.from({ length: 15 }).map((_, i) => ({
    id: i + 1,
    name: i % 3 === 0 ? "Samuel Johnson" : "Jane Doe",
    graduationYear: i % 2 === 0 ? "2024" : "2023",
    email: i % 3 === 0 ? "samuel@alumni.ac" : "jane@alumni.ac",
    phone: "0788123456",
    currentStatus: i % 4 === 0 ? "Employed" : (i % 4 === 1 ? "Higher Education" : "Searching")
}));

export default function AdminAlumniPage() {
    const [data] = useState(alumniData);
    const [search, setSearch] = useState("");

    // Modal state
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [activeAlumni, setActiveAlumni] = useState<any>(null);

    const filteredData = data.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.graduationYear.includes(search)
    );

    const columns: Column<AlumniRecord>[] = [
        {
            key: "id",
            header: "ID",
            width: "60px",
            render: (v) => <span className="text-gray-400 font-medium">#{String(v)}</span>
        },
        {
            key: "name",
            header: "Alumni Name",
            render: (v) => <span className="font-bold text-gray-900">{String(v)}</span>
        },
        {
            key: "graduationYear",
            header: "Class of",
            render: (v) => <span className="text-gray-600 font-medium">{String(v)}</span>
        },
        {
            key: "email",
            header: "Email Address",
            render: (v) => <span className="text-gray-500">{String(v)}</span>
        },
        {
            key: "currentStatus",
            header: "Current Status",
            render: (v) => (
                <div className={cn(
                    "px-4 py-1.5 rounded-full text-[11px] font-bold inline-block min-w-[120px] text-center uppercase tracking-wider shadow-sm border",
                    v === "Employed" ? "bg-black text-white border-black" : 
                    v === "Higher Education" ? "bg-[#008A44] text-white border-[#008A44]" : 
                    "bg-white text-gray-600 border-gray-200"
                )}>
                    {String(v)}
                </div>
            )
        },
        {
            key: "action",
            header: "Action",
            align: "right",
            render: (_, row) => (
                <div className="flex items-center gap-4 justify-end">
                    <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-100 text-gray-400 hover:text-black hover:border-black transition-all">
                        <Mail size={16} />
                    </button>
                    <button 
                        onClick={() => {
                            setActiveAlumni(row);
                            setIsViewOpen(true);
                        }}
                        className="bg-black text-white px-4 h-9 rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all"
                    >
                        Details
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-8 pb-10">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Alumni Network</h1>
                <button className="flex items-center gap-2 bg-black text-white px-6 h-11 rounded-lg text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg">
                    <Download size={18} />
                    Export Directory
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <AdminStatCard 
                    label="Total Alumni"
                    value={1248}
                    icon={<Users />}
                    subtext={[{ label: "Male (48%)" }, { label: "Female (52%)" }]}
                    progress={100}
                />
                <AdminStatCard 
                    label="Higher Education"
                    value={842}
                    icon={<GraduationCap />}
                    subtext="68% Success Rate"
                    progress={68}
                />
                <AdminStatCard 
                    label="Employment"
                    value={312}
                    icon={<Users />}
                    subtext="25% Workforce"
                    progress={25}
                />
                <AdminStatCard 
                    label="Growth Rate"
                    value="+12%"
                    icon={<Users />}
                    subtext="From 2023 Cohort"
                    progress={12}
                />
            </div>

            {/* Content Area */}
            <section className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-bold text-gray-900">Alumni Directory</h2>
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">2024 Active</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                            <input 
                                type="text"
                                placeholder="Search alumni..."
                                className="pl-10 pr-4 h-11 w-64 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-all"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-5 h-11 rounded-xl text-sm font-bold hover:border-black transition-all">
                            <Filter size={18} />
                            Filter
                            <ChevronDown size={14} />
                        </button>
                    </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-none overflow-hidden shadow-sm">
                    <DataTable 
                        columns={columns} 
                        data={filteredData} 
                        pageSize={10}
                        showPagination={false}
                        className="alumni-table border-none table-black-header"
                        keyField="id"
                    />
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-8 py-5 bg-white border border-gray-100 rounded-[20px] shadow-sm">
                    <span className="text-sm text-gray-500 font-medium">Showing 1 to {Math.min(filteredData.length, 10)} of {filteredData.length} records</span>
                    <div className="flex items-center gap-2">
                        <button className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors">Previous</button>
                        <button className="w-10 h-10 bg-black text-white rounded-xl text-sm font-bold shadow-lg shadow-black/10">1</button>
                        <button className="w-10 h-10 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors">2</button>
                        <button className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors">Next</button>
                    </div>
                </div>
            </section>

            <ViewAlumniModal 
                isOpen={isViewOpen}
                onClose={() => setIsViewOpen(false)}
                data={activeAlumni}
            />
        </div>
    );
}
