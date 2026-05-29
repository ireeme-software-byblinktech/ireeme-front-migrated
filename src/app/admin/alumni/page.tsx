"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
    DataTable, 
    Column, 
    SearchInput, 
    Button 
} from "@/components/ui";
import { 
    Eye, 
    Pencil, 
    Printer, 
    ChevronDown,
    Filter,
    Loader2
} from "lucide-react";
import { studentsApi, Student } from "@/lib/api/students";
import { apiClient } from "@/lib/api/client";
import { ViewStudentModal } from "@/components/ui/ViewStudentModal";

export default function AdminAlumniPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [classFilter, setClassFilter] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;
    
    // Modal States
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    // Fetch classes for filter
    const { data: classes } = useQuery({
        queryKey: ["classes"],
        queryFn: () => apiClient<Array<{ id: string; name: string; stream: string | null }>>("/api/v1/classes"),
    });

    // Fetch alumni students (isActive = false)
    const { data, isLoading, error } = useQuery({
        queryKey: ["alumni", page, searchQuery, classFilter],
        queryFn: () => {
            const params: any = { page, limit, isActive: false };
            if (searchQuery) params.search = searchQuery;
            if (classFilter) params.classId = classFilter;
            return studentsApi.getStudents(params);
        },
    });

    const handleView = (student: Student) => {
        setSelectedStudent(student);
        setIsViewModalOpen(true);
    };

    const columns: Column<Student>[] = [
        {
            key: "select",
            header: <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-black cursor-pointer" />,
            width: "50px",
            render: () => <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-black cursor-pointer" />
        },
        {
            key: "user",
            header: "Student Name",
            render: (v: any) => (
                <span className="font-medium text-gray-900">
                    {v.firstName} {v.lastName}
                </span>
            )
        },
        {
            key: "user",
            header: "Email address",
            render: (v: any) => <span className="text-gray-500">{v.email}</span>
        },
        {
            key: "gender",
            header: "Gender",
            render: (v) => <span className="text-gray-500">{v || "N/A"}</span>
        },
        {
            key: "studentNumber",
            header: "Student ID",
            render: (v) => <span className="text-gray-500">{String(v)}</span>
        },
        {
            key: "user",
            header: "Student contact",
            render: (v: any) => <span className="text-gray-500">{v?.phoneNumber || "N/A"}</span>
        },
        {
            key: "action",
            header: "Action",
            align: "right",
            render: (_, row) => (
                <div className="flex items-center gap-4 justify-end">
                    <button 
                        onClick={() => handleView(row)}
                        className="text-gray-400 hover:text-black transition-colors" 
                        title="View details"
                    >
                        <Eye size={18} />
                    </button>
                    <button 
                        className="text-gray-400 hover:text-black transition-colors" 
                        title="Edit record"
                    >
                        <Pencil size={18} />
                    </button>
                </div>
            )
        }
    ];

    if (error) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <p className="text-red-500 mb-2">Failed to load alumni</p>
                    <p className="text-sm text-gray-500">{(error as Error).message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-10">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Alumni Students</h1>
            </div>

            {/* Controls Row 1 */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="text-sm font-medium text-gray-500 text-[13px]">
                    {isLoading ? (
                        "Loading..."
                    ) : (
                        `Showing ${((page - 1) * limit) + 1} - ${Math.min(page * limit, data?.total || 0)} of ${data?.total || 0} alumni`
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="bg-white border-gray-200 h-9 px-6 font-bold text-[10px] uppercase tracking-widest text-gray-700">
                        <Printer size={14} className="mr-2" />
                        PRINT
                    </Button>
                    <div className="relative">
                        <Button variant="outline" className="bg-white border-gray-200 h-9 px-6 font-bold text-[10px] uppercase tracking-widest text-gray-700 flex items-center gap-2">
                            EXPORT
                            <ChevronDown size={14} />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Controls Row 2: Search and Specific Filters */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="w-full md:w-[450px]">
                    <SearchInput 
                        placeholder="search alumni" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-white border border-gray-200 rounded-lg h-10 text-sm"
                        containerClassName="h-10"
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                    <button 
                        onClick={() => setClassFilter("")}
                        className={`flex items-center gap-2 px-6 h-10 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                            !classFilter ? "bg-black text-white" : "bg-white border border-gray-200 text-gray-600"
                        }`}
                    >
                        <Filter size={16} />
                        All classes
                    </button>
                    
                    {/* Class Filter Dropdown */}
                    {classes && classes.length > 0 && (
                        <div className="flex items-center bg-white border border-gray-200 rounded-lg px-4 h-10 group focus-within:border-black transition-all min-w-[180px]">
                            <Filter size={16} className="text-gray-400 mr-2" />
                            <select 
                                value={classFilter}
                                onChange={(e) => setClassFilter(e.target.value)}
                                className="bg-transparent border-none outline-none text-[13px] font-medium text-gray-600 w-full appearance-none cursor-pointer"
                            >
                                <option value="">Select Class</option>
                                {classes.map((cls) => (
                                    <option key={cls.id} value={cls.id}>
                                        {cls.name} {cls.stream ? `- ${cls.stream}` : ''}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="text-gray-400 ml-1" />
                        </div>
                    )}
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white border border-gray-100 rounded-none overflow-hidden shadow-sm">
                {isLoading ? (
                    <div className="flex items-center justify-center h-96">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    </div>
                ) : (
                    <DataTable 
                        columns={columns} 
                        data={data?.data || []} 
                        pageSize={limit}
                        className="students-table border-none table-black-header"
                        keyField="id"
                    />
                )}
            </div>

            {/* Pagination */}
            {data && data.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                    <Button
                        variant="outline"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                        Page {page} of {data.pages}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => setPage(p => Math.min(data.pages, p + 1))}
                        disabled={page === data.pages}
                    >
                        Next
                    </Button>
                </div>
            )}

            {/* Modals */}
            <ViewStudentModal 
                isOpen={isViewModalOpen} 
                onClose={() => setIsViewModalOpen(false)} 
                student={selectedStudent} 
            />
        </div>
    );
}
