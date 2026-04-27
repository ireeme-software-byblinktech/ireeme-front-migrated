"use client";

import React, { useState } from "react";
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
    Printer, 
    ChevronDown,
    Filter,
    Users
} from "lucide-react";

// Modals
import { AddStudentModal } from "@/components/ui/AddStudentModal";
import { ViewStudentModal } from "@/components/ui/ViewStudentModal";
import { EditStudentModal } from "@/components/ui/EditStudentModal";
import { DeleteStudentModal } from "@/components/ui/DeleteStudentModal";

interface Student {
    id: number;
    name: string;
    email: string;
    gender: string;
    studentId: string;
    contact: string;
}

const students: Student[] = Array.from({ length: 70 }).map((_, i) => ({
    id: i + 1,
    name: "John Doe",
    email: "johndoe@gmail.com",
    gender: "Female",
    studentId: "STU001",
    contact: "+250 788 111 111"
}));

export default function AdminStudentsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [classFilter, setClassFilter] = useState("All classes");
    
    // Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    const handleAction = (type: 'view' | 'edit' | 'delete', student: Student) => {
        setSelectedStudent(student);
        if (type === 'view') setIsViewModalOpen(true);
        if (type === 'edit') setIsEditModalOpen(true);
        if (type === 'delete') setIsDeleteModalOpen(true);
    };

    const columns: Column<Student>[] = [
        {
            key: "select",
            header: <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-black cursor-pointer" />,
            width: "50px",
            render: () => <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-black cursor-pointer" />
        },
        {
            key: "name",
            header: "Student Name",
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
            key: "studentId",
            header: "Student ID",
            render: (v) => <span className="text-gray-500">{String(v)}</span>
        },
        {
            key: "contact",
            header: "Student contact",
            render: (v) => <span className="text-gray-500">{String(v)}</span>
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

    const filteredStudents = students.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-10">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Students</h1>
            </div>

            {/* Controls Row 1 */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="text-sm font-medium text-gray-500 text-[13px]">
                    Showing 1 - 10 of {students.length} students
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
                        ADD STUDENT +
                    </Button>
                </div>
            </div>

            {/* Controls Row 2: Search and Specific Filters */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="w-full md:w-[450px]">
                    <SearchInput 
                        placeholder="search stUdent" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-white border border-gray-200 rounded-lg h-10 text-sm"
                        containerClassName="h-10"
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                    <button className="flex items-center gap-2 bg-black text-white px-6 h-10 rounded-lg text-sm font-medium transition-all whitespace-nowrap">
                        <Filter size={16} />
                        All classes
                    </button>
                    
                    <div className="flex items-center bg-white border border-gray-200 rounded-lg px-4 h-10 group focus-within:border-black transition-all min-w-[140px]">
                        <Filter size={16} className="text-gray-400 mr-2" />
                        <select className="bg-transparent border-none outline-none text-[13px] font-medium text-gray-600 w-full appearance-none cursor-pointer">
                            <option value="">Intake</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                        </select>
                        <ChevronDown size={14} className="text-gray-400 ml-1" />
                    </div>

                    <button className="flex items-center bg-white border border-gray-200 rounded-lg px-6 h-10 group hover:border-black transition-all whitespace-nowrap">
                        <Users size={16} className="text-gray-400 mr-2" />
                        <span className="text-[13px] font-medium text-gray-600">Alumni students</span>
                    </button>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white border border-gray-100 rounded-none overflow-hidden shadow-sm">
                <DataTable 
                    columns={columns} 
                    data={filteredStudents} 
                    pageSize={10}
                    className="students-table border-none table-black-header"
                    keyField="id"
                />
            </div>

            {/* Modals */}
            <AddStudentModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
            />
            
            <ViewStudentModal 
                isOpen={isViewModalOpen} 
                onClose={() => setIsViewModalOpen(false)} 
                student={selectedStudent} 
            />
            
            <EditStudentModal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                student={selectedStudent} 
            />
            
            <DeleteStudentModal 
                isOpen={isDeleteModalOpen} 
                onClose={() => setIsDeleteModalOpen(false)} 
                studentName={selectedStudent?.name} 
                onDelete={() => console.log("Deleted student", selectedStudent?.id)}
            />
        </div>
    );
}
