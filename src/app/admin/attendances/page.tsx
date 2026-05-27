"use client";

import React, { useState, useMemo } from "react";
import { 
    AdminStatCard,
    DataTable,
    Column
} from "@/components/ui";
import { 
    Pencil, 
    ChevronDown, 
    Filter, 
    Calendar,
    GraduationCap,
    Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EditAttendanceModal } from "@/components/ui/EditAttendanceModal";

interface AttendanceRecord {
    id: number;
    name: string;
    email: string;
    dateTime: string;
    checkInTime: string;
    status: "Present" | "Absent" | "Late";
}

const teacherAttendanceData: AttendanceRecord[] = Array.from({ length: 15 }).map((_, i) => ({
    id: i + 1,
    name: i % 4 === 0 ? "Samuel Johnson" : "John Doe",
    email: i % 4 === 0 ? "samuel@gmail.com" : "johndoe@gmail.com",
    dateTime: "12-06-2025",
    checkInTime: i % 3 === 0 ? "-" : "09:15 AM",
    status: i % 3 === 0 ? "Absent" : (i % 4 === 0 ? "Late" : "Present")
}));

const studentAttendanceData: AttendanceRecord[] = Array.from({ length: 15 }).map((_, i) => ({
    id: i + 100,
    name: "John Doe",
    email: "johndoe@gmail.com",
    dateTime: "12-06-2025",
    checkInTime: i % 3 === 0 ? "-" : "09:15 AM",
    status: i % 3 === 0 ? "Absent" : "Present"
}));

export default function AdminAttendancesPage() {
    const [viewType, setViewType] = useState<"Teachers" | "Students">("Teachers");
    const [data, setData] = useState(teacherAttendanceData);
    const [studentData, setStudentData] = useState(studentAttendanceData);
    const [filterToday, setFilterToday] = useState(false);
    const [nameFilter, setNameFilter] = useState("");

    // Modal state
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [activeRecord, setActiveRecord] = useState<any>(null);

    const currentData = viewType === "Teachers" ? data : studentData;

    const toggleStatus = (id: number) => {
        const updater = (prev: AttendanceRecord[]): AttendanceRecord[] => prev.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    status: (item.status === "Present" ? "Absent" : "Present") as AttendanceRecord['status']
                };
            }
            return item;
        });

        if (viewType === "Teachers") setData(updater);
        else setStudentData(updater);
    };

    const handleSaveAttendance = (id: number, status: "Present" | "Absent" | "Late", checkIn: string) => {
        const updater = (prev: AttendanceRecord[]): AttendanceRecord[] => prev.map(item => {
            if (item.id === id) {
                return { ...item, status, checkInTime: checkIn } as AttendanceRecord;
            }
            return item;
        });

        if (viewType === "Teachers") setData(updater);
        else setStudentData(updater);
    };

    const openEditModal = (row: AttendanceRecord) => {
        setActiveRecord(row);
        setIsEditOpen(true);
    };

    const filteredData = useMemo(() => {
        return currentData.filter(item => {
            const matchesName = item.name.toLowerCase().includes(nameFilter.toLowerCase());
            const matchesDate = filterToday ? item.dateTime === "12-06-2025" : true;
            return matchesName && matchesDate;
        });
    }, [currentData, nameFilter, filterToday]);

    const columns: Column<AttendanceRecord>[] = [
        {
            key: "select",
            header: <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-black cursor-pointer" />,
            width: "50px",
            render: () => <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-black cursor-pointer" />
        },
        {
            key: "name",
            header: viewType === "Teachers" ? "Teacher Name" : "Student Name",
            render: (v) => <span className="font-medium text-gray-900">{String(v)}</span>
        },
        {
            key: "email",
            header: "Email-address",
            render: (v) => <span className="text-gray-500">{String(v)}</span>
        },
        {
            key: "dateTime",
            header: "Date & Time",
            render: (v) => <span className="text-gray-500">{String(v)}</span>
        },
        {
            key: "checkInTime",
            header: "Check-in time",
            render: (v) => <span className="text-gray-500">{String(v)}</span>
        },
        {
            key: "status",
            header: "Status",
            render: (v) => (
                <div className={cn(
                    "px-8 py-2 rounded-md text-[11px] font-bold inline-block min-w-[100px] text-center uppercase tracking-wider",
                    v === "Absent" ? "bg-[#EE1D23] text-white" : (viewType === "Students" ? "bg-[#008A44] text-white" : "bg-black text-white")
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
                <div className="flex items-center gap-6 justify-end">
                    <button 
                        onClick={() => openEditModal(row)}
                        className="text-gray-900 hover:opacity-70 transition-opacity"
                    >
                        <Pencil size={18} />
                    </button>
                    <button 
                        onClick={() => toggleStatus(row.id)}
                        className={cn(
                            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                            row.status === "Present" ? "bg-black" : "bg-gray-200"
                        )}
                    >
                        <span 
                            className={cn(
                                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                row.status === "Present" ? "translate-x-5" : "translate-x-0"
                            )}
                        />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-8 pb-10">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Attendances</h1>
            </div>

            {/* Status Section */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">{viewType === "Teachers" ? "Teacher" : "Student"} status</h2>
                    <div className="relative">
                        <select 
                            className="flex items-center gap-2 text-sm font-medium text-gray-500 cursor-pointer border border-gray-100 px-4 py-2 rounded-md hover:border-black transition-all appearance-none pr-10"
                            value={viewType}
                            onChange={(e) => setViewType(e.target.value as any)}
                        >
                            <option value="Teachers">Teachers</option>
                            <option value="Students">Students</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-2 text-gray-400">
                             <Filter size={14} />
                             <ChevronDown size={14} />
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <AdminStatCard 
                        label={`Total ${viewType.toLowerCase()}`}
                        value={308}
                        icon={viewType === "Teachers" ? <GraduationCap /> : <Users />}
                        subtext={[{ label: "Male (61%)" }, { label: "Female (39%)" }]}
                        progress={100}
                    />
                    <AdminStatCard 
                        label="Present | Today"
                        value={308}
                        icon={viewType === "Teachers" ? <GraduationCap /> : <Users />}
                        subtext={[{ label: "Male (61%)" }, { label: "Female (39%)" }]}
                        progress={85}
                    />
                    <AdminStatCard 
                        label="Absent | Today"
                        value={308}
                        icon={viewType === "Teachers" ? <GraduationCap /> : <Users />}
                        subtext={[{ label: "Male (61%)" }, { label: "Female (39%)" }]}
                        progress={15}
                    />
                    <AdminStatCard 
                        label="Attendance rate"
                        value={viewType === "Teachers" ? "75%" : "92%"}
                        icon={viewType === "Teachers" ? <GraduationCap /> : <Users />}
                        subtext="+2% from last week"
                        progress={viewType === "Teachers" ? 75 : 92}
                    />
                </div>
            </section>

            {/* Attendance List Section */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">{viewType === "Teachers" ? "Teacher" : "Student"} Attendance list</h2>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500 cursor-pointer border border-gray-100 px-3 py-2 rounded-md hover:border-black transition-all">
                            <input 
                                type="text"
                                placeholder={`Search ${viewType}...`}
                                className="bg-transparent border-none outline-none w-32 placeholder:text-gray-400"
                                value={nameFilter}
                                onChange={(e) => setNameFilter(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={() => setFilterToday(!filterToday)}
                            className={cn(
                                "flex items-center gap-2 px-8 h-10 rounded-lg text-sm font-bold uppercase tracking-widest transition-all border",
                                filterToday ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-200 hover:border-black"
                            )}
                        >
                            <Calendar size={16} />
                            Today
                        </button>
                    </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-none overflow-hidden shadow-sm">
                    <DataTable 
                        columns={columns} 
                        data={filteredData} 
                        pageSize={10}
                        showPagination={false}
                        className="attendance-table border-none table-black-header"
                        keyField="id"
                    />
                </div>

                {/* Pagination matching design */}
                <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-100 mt-[-16px]">
                    <span className="text-sm text-gray-500">Showing 1 to {Math.min(filteredData.length, 10)} of {filteredData.length} results</span>
                    <div className="flex items-center gap-2">
                        <button className="px-6 py-2 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">Previous</button>
                        <button className="w-9 h-9 bg-black text-white rounded-md text-sm font-medium">1</button>
                        <button className="w-9 h-9 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors text-gray-600">2</button>
                        <button className="px-6 py-2 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">Next</button>
                    </div>
                </div>
            </section>

            <EditAttendanceModal 
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                onSave={handleSaveAttendance}
                data={activeRecord}
            />
        </div>
    );
}