"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
    Users,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EditAttendanceModal } from "@/components/ui/EditAttendanceModal";
import { classesApi } from "@/lib/api/classes";
import { attendanceApi, AttendanceRecord, TeacherAttendanceRecord, DailySummary, TeacherDailySummary } from "@/lib/api/attendance";
import { toast } from "@/lib/utils/toast";

export default function AdminAttendancesPage() {
    const queryClient = useQueryClient();
    const [viewType, setViewType] = useState<"Teachers" | "Students">("Students");
    const [selectedClassId, setSelectedClassId] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [nameFilter, setNameFilter] = useState("");
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [activeRecord, setActiveRecord] = useState<any>(null);

    // Fetch classes
    const { data: classes, isLoading: loadingClasses } = useQuery({
        queryKey: ["classes"],
        queryFn: classesApi.getClasses,
    });

    // Fetch daily attendance summary
    const { data: attendanceData, isLoading: loadingAttendance } = useQuery({
        queryKey: ["attendance-daily", selectedClassId, selectedDate],
        queryFn: async () => {
            const result = await attendanceApi.getDailySummary(
                selectedClassId || undefined, 
                selectedDate
            );
            return result;
        },
        enabled: !!selectedDate && viewType === "Students",
    });

    // Fetch teacher attendance summary
    const { data: teacherAttendanceData, isLoading: loadingTeacherAttendance } = useQuery({
        queryKey: ["teacher-attendance-daily", selectedDate],
        queryFn: async () => {
            const result = await attendanceApi.getTeacherDailySummary(selectedDate);
            return result;
        },
        enabled: !!selectedDate && viewType === "Teachers",
    });

    // Set first class as default when classes load
    React.useEffect(() => {
        if (classes && classes.length > 0 && !selectedClassId) {
            // Don't auto-select, let user choose "All Classes" or a specific class
            // setSelectedClassId(classes[0].id);
        }
    }, [classes, selectedClassId]);

    // Show message when date changes and no data exists
    const hasNoDataForDate = viewType === "Students" 
        ? (attendanceData?.records?.length === 0 && !loadingAttendance && selectedClassId)
        : (teacherAttendanceData?.records?.length === 0 && !loadingTeacherAttendance);

    // Mark bulk attendance mutation
    const markAttendanceMutation = useMutation({
        mutationFn: attendanceApi.markBulk,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["attendance-daily"] });
            toast.success("Attendance updated successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to update attendance");
        },
    });

    // Mark teacher attendance mutation
    const markTeacherAttendanceMutation = useMutation({
        mutationFn: attendanceApi.markTeacherBulk,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teacher-attendance-daily"] });
            toast.success("Teacher attendance updated successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to update teacher attendance");
        },
    });

    const toggleStatus = (studentId: string, currentStatus: string) => {
        if (!selectedClassId || !attendanceData) {
            toast.error("Please select a class first");
            return;
        }
        
        const newStatus = currentStatus === "PRESENT" ? "ABSENT" : "PRESENT";
        
        markAttendanceMutation.mutate({
            classId: selectedClassId,
            date: selectedDate,
            records: [{
                studentId,
                status: newStatus as any,
            }],
        });
    };

    const toggleTeacherStatus = (teacherId: string, currentStatus: string) => {
        if (!teacherAttendanceData) {
            toast.error("Unable to update attendance");
            return;
        }
        
        const newStatus = currentStatus === "PRESENT" ? "ABSENT" : "PRESENT";
        
        markTeacherAttendanceMutation.mutate({
            date: selectedDate,
            records: [{
                teacherId,
                status: newStatus as any,
            }],
        });
    };

    const handleSaveAttendance = (studentId: string, status: "PRESENT" | "ABSENT" | "LATE", remarks: string) => {
        if (!selectedClassId) {
            toast.error("Please select a class first");
            return;
        }
        
        markAttendanceMutation.mutate({
            classId: selectedClassId,
            date: selectedDate,
            records: [{
                studentId,
                status: status as any,
                remarks,
            }],
        });
        setIsEditOpen(false);
    };

    const openEditModal = (record: AttendanceRecord) => {
        setActiveRecord(record);
        setIsEditOpen(true);
    };

    const filteredData = useMemo(() => {
        if (!attendanceData?.records) return [];
        return attendanceData.records.filter(item => {
            const fullName = `${item.student?.user.firstName ?? ''} ${item.student?.user.lastName ?? ''}`.toLowerCase();
            return fullName.includes(nameFilter.toLowerCase());
        });
    }, [attendanceData, nameFilter]);

    const filteredTeacherData = useMemo(() => {
        if (!teacherAttendanceData?.records) return [];
        return teacherAttendanceData.records.filter(item => {
            const fullName = `${item.teacher?.user.firstName ?? ''} ${item.teacher?.user.lastName ?? ''}`.toLowerCase();
            return fullName.includes(nameFilter.toLowerCase());
        });
    }, [teacherAttendanceData, nameFilter]);

    const columns: Column<AttendanceRecord>[] = [
        {
            key: "select",
            header: <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-black cursor-pointer" />,
            width: "50px",
            render: () => <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-black cursor-pointer" />
        },
        {
            key: "student",
            header: viewType === "Teachers" ? "Teacher Name" : "Student Name",
            render: (_, row) => (
                <span className="font-medium text-gray-900">
                    {row.student?.user.firstName} {row.student?.user.lastName}
                </span>
            )
        },
        {
            key: "student",
            header: "Email-address",
            render: (_, row) => <span className="text-gray-500">{row.student?.user.email}</span>
        },
        {
            key: "date",
            header: "Date & Time",
            render: (v) => <span className="text-gray-500">{new Date(String(v)).toLocaleDateString()}</span>
        },
        {
            key: "checkInTime",
            header: "Check-in time",
            render: (v) => <span className="text-gray-500">{v ? new Date(String(v)).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-'}</span>
        },
        {
            key: "status",
            header: "Status",
            render: (v) => (
                <div className={cn(
                    "px-8 py-2 rounded-md text-[11px] font-bold inline-block min-w-[100px] text-center uppercase tracking-wider",
                    v === "ABSENT" ? "bg-[#EE1D23] text-white" : 
                    v === "LATE" ? "bg-[#F59E0B] text-white" :
                    "bg-[#008A44] text-white"
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
                        onClick={() => toggleStatus(row.studentId, row.status)}
                        className={cn(
                            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                            row.status === "PRESENT" ? "bg-black" : "bg-gray-200"
                        )}
                        disabled={markAttendanceMutation.isPending}
                    >
                        <span 
                            className={cn(
                                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                row.status === "PRESENT" ? "translate-x-5" : "translate-x-0"
                            )}
                        />
                    </button>
                </div>
            )
        }
    ];

    const teacherColumns: Column<TeacherAttendanceRecord>[] = [
        {
            key: "select",
            header: <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-black cursor-pointer" />,
            width: "50px",
            render: () => <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-black cursor-pointer" />
        },
        {
            key: "teacher",
            header: "Teacher Name",
            render: (_, row) => (
                <span className="font-medium text-gray-900">
                    {row.teacher?.user.firstName} {row.teacher?.user.lastName}
                </span>
            )
        },
        {
            key: "teacher",
            header: "Email-address",
            render: (_, row) => <span className="text-gray-500">{row.teacher?.user.email}</span>
        },
        {
            key: "date",
            header: "Date & Time",
            render: (v) => <span className="text-gray-500">{new Date(String(v)).toLocaleDateString()}</span>
        },
        {
            key: "checkInTime",
            header: "Check-in time",
            render: (v) => <span className="text-gray-500">{v ? new Date(String(v)).toLocaleTimeString() : '-'}</span>
        },
        {
            key: "status",
            header: "Status",
            render: (v) => (
                <div className={cn(
                    "px-8 py-2 rounded-md text-[11px] font-bold inline-block min-w-[100px] text-center uppercase tracking-wider",
                    v === "ABSENT" ? "bg-[#EE1D23] text-white" : 
                    v === "LATE" ? "bg-[#F59E0B] text-white" :
                    "bg-[#008A44] text-white"
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
                        onClick={() => toggleTeacherStatus(row.teacherId, row.status)}
                        className={cn(
                            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                            row.status === "PRESENT" ? "bg-black" : "bg-gray-200"
                        )}
                        disabled={markTeacherAttendanceMutation.isPending}
                    >
                        <span 
                            className={cn(
                                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                row.status === "PRESENT" ? "translate-x-5" : "translate-x-0"
                            )}
                        />
                    </button>
                </div>
            )
        }
    ];

    if (loadingClasses) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Attendances</h1>
                
                {/* Teachers/Students Toggle */}
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
                    <button
                        onClick={() => setViewType("Teachers")}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                            viewType === "Teachers"
                                ? "bg-black text-white"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        Teachers
                    </button>
                    <button
                        onClick={() => setViewType("Students")}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                            viewType === "Students"
                                ? "bg-black text-white"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        Students
                    </button>
                </div>
            </div>

            {/* Class and Date Selection */}
            <div className="flex items-center gap-4">
                {viewType === "Students" && (
                    <select
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium"
                    >
                        <option value="">All Classes</option>
                        {classes?.map((cls) => (
                            <option key={cls.id} value={cls.id}>
                                {cls.name} {cls.stream ? `- ${cls.stream}` : ''}
                            </option>
                        ))}
                    </select>
                )}
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium"
                />
            </div>

            {/* Status Section */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">
                        {viewType === "Teachers" ? "Teacher status" : "Student status"}
                    </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <AdminStatCard 
                        label={viewType === "Teachers" ? "Total teachers" : "Total students"}
                        value={viewType === "Teachers" ? (teacherAttendanceData?.totalTeachers || 0) : (attendanceData?.totalStudents || 0)}
                        icon={<Users />}
                        subtext={[{ label: viewType === "Teachers" ? "In school" : "In selected class" }]}
                        progress={100}
                    />
                    <AdminStatCard 
                        label="Present | Today"
                        value={viewType === "Teachers" ? (teacherAttendanceData?.present || 0) : (attendanceData?.present || 0)}
                        icon={<Users />}
                        subtext={[{ 
                            label: `${viewType === "Teachers" ? (teacherAttendanceData?.attendanceRate.toFixed(0) || 0) : (attendanceData?.attendanceRate.toFixed(0) || 0)}% attendance`,
                        }]}
                        progress={viewType === "Teachers" ? (teacherAttendanceData?.attendanceRate || 0) : (attendanceData?.attendanceRate || 0)}
                    />
                    <AdminStatCard 
                        label="Absent | Today"
                        value={viewType === "Teachers" ? (teacherAttendanceData?.absent || 0) : (attendanceData?.absent || 0)}
                        icon={<Users />}
                        subtext={[{ 
                            label: `${viewType === "Teachers" ? (teacherAttendanceData?.late || 0) : (attendanceData?.late || 0)} late`,
                        }]}
                        progress={viewType === "Teachers" 
                            ? (teacherAttendanceData ? (teacherAttendanceData.absent / teacherAttendanceData.totalTeachers) * 100 : 0)
                            : (attendanceData ? (attendanceData.absent / attendanceData.totalStudents) * 100 : 0)
                        }
                    />
                    <AdminStatCard 
                        label="Attendance rate"
                        value={`${viewType === "Teachers" ? (teacherAttendanceData?.attendanceRate.toFixed(0) || 0) : (attendanceData?.attendanceRate.toFixed(0) || 0)}%`}
                        icon={<Users />}
                        subtext={viewType === "Teachers" ? "For selected date" : "For selected date"}
                        progress={viewType === "Teachers" ? (teacherAttendanceData?.attendanceRate || 0) : (attendanceData?.attendanceRate || 0)}
                    />
                </div>
            </section>

            {/* Attendance List Section */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">
                        {viewType === "Teachers" ? "Teacher Attendance list" : "Student Attendance list"}
                    </h2>
                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            placeholder={`Search ${viewType.toLowerCase()}...`}
                            className="px-4 py-2 border border-gray-100 rounded-md text-sm"
                            value={nameFilter}
                            onChange={(e) => setNameFilter(e.target.value)}
                        />
                        <button className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium flex items-center gap-2">
                            <Calendar size={16} />
                            Today
                        </button>
                    </div>
                </div>

                {(viewType === "Students" ? loadingAttendance : loadingTeacherAttendance) ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-black" />
                    </div>
                ) : viewType === "Teachers" ? (
                    filteredTeacherData.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            {hasNoDataForDate 
                                ? `No teacher attendance records found for ${new Date(selectedDate).toLocaleDateString()}`
                                : "No teacher attendance records found for selected date"
                            }
                        </div>
                    ) : (
                        <>
                            <div className="bg-white border border-gray-100 rounded-none overflow-hidden shadow-sm">
                                <DataTable 
                                    columns={teacherColumns} 
                                    data={filteredTeacherData} 
                                    pageSize={10}
                                    showPagination={false}
                                    className="attendance-table border-none table-black-header"
                                    keyField="id"
                                />
                            </div>

                            <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-100 mt-[-16px]">
                                <span className="text-sm text-gray-500">
                                    Showing {filteredTeacherData.length} of {teacherAttendanceData?.totalTeachers || 0} teachers
                                </span>
                            </div>
                        </>
                    )
                ) : filteredData.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        {hasNoDataForDate 
                            ? `No attendance records found for ${new Date(selectedDate).toLocaleDateString()}`
                            : `No attendance records found for selected ${selectedClassId ? 'class' : 'date'}`
                        }
                    </div>
                ) : (
                    <>
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

                        <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-100 mt-[-16px]">
                            <span className="text-sm text-gray-500">
                                Showing {filteredData.length} of {attendanceData?.totalStudents || 0} students
                            </span>
                        </div>
                    </>
                )}
            </section>

            <EditAttendanceModal 
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                onSave={(id, status, checkIn) => {
                    if (activeRecord) {
                        handleSaveAttendance(activeRecord.studentId, status as any, checkIn);
                    }
                }}
                data={activeRecord}
            />
        </div>
    );
}
