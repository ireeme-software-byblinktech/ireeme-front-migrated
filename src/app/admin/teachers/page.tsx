"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
    DataTable, 
    Column, 
    SearchInput, 
    Button 
} from "@/components/ui";
import { 
    Eye, 
    Pencil, 
    Trash2, 
    Plus, 
    Printer, 
    Download,
    ChevronDown,
    Filter,
    Loader2
} from "lucide-react";
import { teachersApi, Teacher } from "@/lib/api/teachers";
import { AddTeacherModal } from "@/components/ui/AddTeacherModal";
import { ViewTeacherModal } from "@/components/ui/ViewTeacherModal";
import { EditTeacherModal } from "@/components/ui/EditTeacherModal";
import { DeleteTeacherModal } from "@/components/ui/DeleteTeacherModal";
import { toast } from "@/lib/utils/toast";

export default function AdminTeachersPage() {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState("");
    const [lessonFilter, setLessonFilter] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;
    
    // Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

    // Fetch teachers
    const { data, isLoading, error } = useQuery({
        queryKey: ["teachers", page, searchQuery],
        queryFn: () => teachersApi.getTeachers({ 
            page, 
            limit, 
            search: searchQuery || undefined 
        }),
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: (id: string) => teachersApi.deleteTeacher(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teachers"] });
            toast.success("Teacher deleted successfully");
            setIsDeleteModalOpen(false);
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to delete teacher");
        },
    });

    const handleAction = (type: 'view' | 'edit' | 'delete', teacher: Teacher) => {
        setSelectedTeacher(teacher);
        if (type === 'view') setIsViewModalOpen(true);
        if (type === 'edit') setIsEditModalOpen(true);
        if (type === 'delete') setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (selectedTeacher) {
            deleteMutation.mutate(selectedTeacher.id);
        }
    };

    const columns: Column<Teacher>[] = [
        {
            key: "select",
            header: <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-black cursor-pointer" />,
            width: "50px",
            render: () => <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-black cursor-pointer" />
        },
        {
            key: "user",
            header: "Teacher Name",
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
            key: "department",
            header: "Department",
            render: (v: unknown) => <span className="text-gray-500">{(v as string | null | undefined) || "N/A"}</span>
        },
        {
            key: "subjects",
            header: "Subjects",
            render: (v: any) => (
                <span className="text-gray-500">
                    {v && v.length > 0 
                        ? v.map((s: any) => s.subject.name).join(", ")
                        : "No subjects"}
                </span>
            )
        },
        {
            key: "isActive",
            header: "Status",
            render: (v) => (
                <div className={`${v ? 'bg-black text-white' : 'bg-gray-400 text-white'} px-8 py-2 rounded-md text-[11px] font-bold inline-block min-w-[110px] text-center uppercase tracking-wider`}>
                    {v ? "ACTIVE" : "INACTIVE"}
                </div>
            )
        },
        {
            key: "action",
            header: "Action",
            align: "right",
            render: (_, row) => (
                <div className="flex items-center gap-4 justify-end">
                    <button 
                        onClick={() => handleAction('view', row)}
                        className="text-gray-400 hover:text-black transition-colors" 
                        title="View details"
                    >
                        <Eye size={18} />
                    </button>
                    <button 
                        onClick={() => handleAction('edit', row)}
                        className="text-gray-400 hover:text-black transition-colors" 
                        title="Edit record"
                    >
                        <Pencil size={18} />
                    </button>
                    <button 
                        onClick={() => handleAction('delete', row)}
                        className="text-gray-400 hover:text-black transition-colors" 
                        title="Delete record"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            )
        }
    ];

    if (error) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <p className="text-red-500 mb-2">Failed to load teachers</p>
                    <p className="text-sm text-gray-500">{(error as Error).message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-10">
            {/* Page Header Area */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Teachers</h1>
            </div>

            {/* Controls Row 1 */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="text-sm font-medium text-gray-500">
                    {isLoading ? (
                        "Loading..."
                    ) : (
                        `Showing ${((page - 1) * limit) + 1} - ${Math.min(page * limit, data?.total || 0)} of ${data?.total || 0} teachers`
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
                    <Button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-black text-white hover:bg-gray-800 h-9 px-6 font-bold text-[10px] uppercase tracking-widest rounded-md"
                    >
                        ADD TEACHER +
                    </Button>
                </div>
            </div>

            {/* Controls Row 2: Search and Filter */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="w-full md:w-[400px]">
                    <SearchInput 
                        placeholder="search teacher" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-white border border-gray-200 rounded-lg h-10 text-sm"
                        containerClassName="h-10"
                    />
                </div>
                <div className="w-full md:w-[180px]">
                    <div className="flex items-center bg-white border border-gray-200 rounded-lg px-4 h-10 group focus-within:border-black transition-all">
                        <Filter size={16} className="text-gray-400 mr-2" />
                        <select 
                            className="bg-transparent border-none outline-none text-[13px] font-medium text-gray-600 w-full appearance-none cursor-pointer"
                            value={lessonFilter}
                            onChange={(e) => setLessonFilter(e.target.value)}
                        >
                            <option value="">Lesson taught</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="Physics">Physics</option>
                            <option value="Chemistry">Chemistry</option>
                        </select>
                        <ChevronDown size={14} className="text-gray-400 ml-1" />
                    </div>
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
                        className="teachers-table border-none table-black-header"
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

            {/* Modals Integration */}
            <AddTeacherModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
            />
            
            <ViewTeacherModal 
                isOpen={isViewModalOpen} 
                onClose={() => setIsViewModalOpen(false)} 
                teacher={selectedTeacher} 
            />
            
            <EditTeacherModal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                teacher={selectedTeacher} 
            />
            
            <DeleteTeacherModal 
                isOpen={isDeleteModalOpen} 
                onClose={() => setIsDeleteModalOpen(false)} 
                teacherName={selectedTeacher ? `${selectedTeacher.user.firstName} ${selectedTeacher.user.lastName}` : ""}
                onDelete={handleDelete}
                isDeleting={deleteMutation.isPending}
            />
        </div>
    );
}

