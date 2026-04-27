"use client";

import React, { useState } from "react";
import { 
    DataTable, 
    Column, 
    SearchInput, 
    Select, 
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
    Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

// Modals
import { AddTeacherModal } from "@/components/ui/AddTeacherModal";
import { ViewTeacherModal } from "@/components/ui/ViewTeacherModal";
import { EditTeacherModal } from "@/components/ui/EditTeacherModal";
import { DeleteTeacherModal } from "@/components/ui/DeleteTeacherModal";

interface Teacher {
    id: number;
    name: string;
    email: string;
    gender: string;
    lesson: string;
    status: string;
}

const teachers: Teacher[] = Array.from({ length: 70 }).map((_, i) => ({
    id: i + 1,
    name: i % 3 === 0 ? "Samuel Johnson" : "John Doe",
    email: i % 3 === 0 ? "samuel@gmail.com" : "johndoe@gmail.com",
    gender: i % 4 === 0 ? "Male" : "Female",
    lesson: i % 7 === 0 ? "Physics" : "Mathematics",
    status: "Active"
}));

export default function AdminTeachersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [lessonFilter, setLessonFilter] = useState("");
    
    // Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

    const handleAction = (type: 'view' | 'edit' | 'delete', teacher: Teacher) => {
        setSelectedTeacher(teacher);
        if (type === 'view') setIsViewModalOpen(true);
        if (type === 'edit') setIsEditModalOpen(true);
        if (type === 'delete') setIsDeleteModalOpen(true);
    };

    const columns: Column<Teacher>[] = [
        {
            key: "select",
            header: <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-black cursor-pointer" />,
            width: "50px",
            render: () => <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-black cursor-pointer" />
        },
        {
            key: "name",
            header: "Teacher Name",
            render: (v) => <span className="font-medium text-gray-900">{String(v)}</span>
        },
        {
            key: "email",
            header: "Email adress",
            render: (v) => <span className="text-gray-500">{String(v)}</span>
        },
        {
            key: "gender",
            header: "Gender",
            render: (v) => <span className="text-gray-500">{String(v)}</span>
        },
        {
            key: "lesson",
            header: "Lesson",
            render: (v) => <span className="text-gray-500">{String(v)}</span>
        },
        {
            key: "status",
            header: "Status",
            render: (v) => (
                <div className="bg-black text-white px-8 py-2 rounded-md text-[11px] font-bold inline-block min-w-[110px] text-center uppercase tracking-wider">
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

    const filteredTeachers = teachers.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-10">
            {/* Page Header Area */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Teachers</h1>
            </div>

            {/* Controls Row 1 */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="text-sm font-medium text-gray-500">
                    Showing 1 - 10 of {teachers.length} teachers
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
                <DataTable 
                    columns={columns} 
                    data={filteredTeachers} 
                    pageSize={10}
                    className="teachers-table border-none table-black-header"
                    keyField="id"
                />
            </div>

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
                teacherName={selectedTeacher?.name} 
                onDelete={() => {
                    console.log("Deleted", selectedTeacher?.id);
                    // Actual delete logic here
                }}
            />
        </div>
    );
}
