"use client";

import { StatCard, Card, CardBody } from "@/components/ui";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import {
    Plus,
    Search,
    Eye,
    Edit,
    Trash2,
    Filter,
    GraduationCap
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import {
    AddPermissionModal,
    UpdatePermissionModal,
    ViewPermissionModal,
    DeleteConfirmationModal
} from "@/components/nurse/HealthRecordModals";
import { studentsApi, Student } from "@/lib/api/students";
import { homePermissionsApi, HomePermission, CreateHomePermissionDto, UpdateHomePermissionDto, HomePermissionStatus } from "@/lib/api/home-permissions";
import { toast } from "@/lib/utils/toast";

interface PermissionRow extends HomePermission {
    name: string;
    issue: string;
    parent: string;
    dateIssued: string;
    expectedReturn: string;
}

export default function HomePermissionsPage() {
    const [permissions, setPermissions] = useState<HomePermission[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ active: 0, returned: 0, overdue: 0, thisWeek: 0 });
    const [activeModal, setActiveModal] = useState<"add" | "edit" | "view" | "delete" | null>(null);
    const [selectedRecord, setSelectedRecord] = useState<HomePermission | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [formData, setFormData] = useState<CreateHomePermissionDto>({
        studentId: "",
        healthIssue: "",
        parentGuardian: "",
        expectedReturn: "",
        notes: "",
    });

    useEffect(() => {
        fetchPermissions();
        fetchStudents();
        fetchStats();
    }, []);

    const fetchPermissions = async () => {
        setLoading(true);
        try {
            const response = await homePermissionsApi.getAll();
            setPermissions(response.data);
        } catch (error) {
            console.error("Failed to fetch permissions:", error);
            toast.error("Failed to load permissions");
        } finally {
            setLoading(false);
        }
    };

    const fetchStudents = async () => {
        try {
            const response = await studentsApi.getStudents({ limit: 50, isActive: true });
            setStudents(response.data);
        } catch (error) {
            console.error("Failed to fetch students:", error);
        }
    };

    const fetchStats = async () => {
        try {
            const data = await homePermissionsApi.getStats();
            setStats(data);
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        }
    };

    const handleAdd = async () => {
        if (!formData.studentId || !formData.healthIssue || !formData.parentGuardian || !formData.expectedReturn) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            const newPermission = await homePermissionsApi.create(formData);
            setPermissions(prev => [newPermission, ...prev]);
            toast.success("Permission created successfully");
            setActiveModal(null);
            setFormData({ studentId: "", healthIssue: "", parentGuardian: "", expectedReturn: "", notes: "" });
            fetchStats();
        } catch (error) {
            console.error("Failed to create permission:", error);
            toast.error("Failed to create permission");
        }
    };

    const handleUpdate = async () => {
        if (!selectedRecord) return;

        try {
            const updateData: UpdateHomePermissionDto = {
                healthIssue: formData.healthIssue,
                parentGuardian: formData.parentGuardian,
                expectedReturn: formData.expectedReturn,
                notes: formData.notes,
            };
            const updated = await homePermissionsApi.update(selectedRecord.id, updateData);
            setPermissions(prev => prev.map(p => p.id === selectedRecord.id ? updated : p));
            toast.success("Permission updated successfully");
            setActiveModal(null);
            setSelectedRecord(null);
        } catch (error) {
            console.error("Failed to update permission:", error);
            toast.error("Failed to update permission");
        }
    };

    const handleDelete = async () => {
        if (!selectedRecord) return;

        try {
            await homePermissionsApi.delete(selectedRecord.id);
            setPermissions(prev => prev.filter(p => p.id !== selectedRecord.id));
            toast.success("Permission deleted successfully");
            setActiveModal(null);
            setSelectedRecord(null);
            fetchStats();
        } catch (error) {
            console.error("Failed to delete permission:", error);
            toast.error("Failed to delete permission");
        }
    };

    const handleOpenAddModal = () => {
        setFormData({ studentId: "", healthIssue: "", parentGuardian: "", expectedReturn: "", notes: "" });
        setActiveModal("add");
    };

    const handleEdit = (record: HomePermission) => {
        setSelectedRecord(record);
        setFormData({
            studentId: record.studentId,
            healthIssue: record.healthIssue,
            parentGuardian: record.parentGuardian,
            expectedReturn: new Date(record.expectedReturn).toISOString().split('T')[0],
            notes: record.notes || "",
        });
        setActiveModal("edit");
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const formatStatus = (status: HomePermissionStatus) => {
        return status.charAt(0) + status.slice(1).toLowerCase();
    };

    const tableData: PermissionRow[] = permissions.map(p => ({
        ...p,
        name: `${p.student.user.firstName} ${p.student.user.lastName}`,
        issue: p.healthIssue,
        parent: p.parentGuardian,
        dateIssued: formatDate(p.dateIssued),
        expectedReturn: formatDate(p.expectedReturn),
    }));

    const columns: Column<PermissionRow>[] = [
        {
            key: "checkbox",
            header: "",
            render: () => <input type="checkbox" className="rounded border-gray-300 h-4 w-4" />
        },
        { key: "name", header: "Student Name", render: (v) => <span className="font-bold">{String(v)}</span> },
        {
            key: "issue",
            header: "Health Issue",
            render: (_, row) => (
                <div>
                    <p className="font-black text-sm text-gray-900">{row.issue}</p>
                    <p className="text-[11px] text-gray-400 font-bold uppercase mt-0.5">{row.parent}</p>
                </div>
            )
        },
        { key: "dateIssued", header: "Date Issued" },
        { key: "expectedReturn", header: "Expected Return" },
        {
            key: "status",
            header: "Status",
            render: (_, row) => (
                <span className={cn(
                    "px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest block text-center max-w-[110px]",
                    row.status === HomePermissionStatus.ACTIVE ? "bg-black text-white" :
                        row.status === HomePermissionStatus.OVERDUE ? "bg-red-950 text-red-500 shadow-lg shadow-red-500/10" : "bg-gray-100 text-gray-800"
                )}>
                    {formatStatus(row.status)}
                </span>
            )
        },
        {
            key: "action",
            header: "Action",
            align: "right",
            render: (_, row) => (
                <div className="flex items-center justify-end gap-3 px-2">
                    <button
                        onClick={() => { setSelectedRecord(row); setActiveModal("view"); }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-black"
                    >
                        <Eye size={18} />
                    </button>
                    <button
                        onClick={() => handleEdit(row)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-black"
                    >
                        <Edit size={18} />
                    </button>
                    <button
                        onClick={() => { setSelectedRecord(row); setActiveModal("delete"); }}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-500"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { label: "Active Permission", value: stats.active.toString(), icon: <GraduationCap size={28} />, progress: 75, trend: { value: "+12", label: "from yesterday", direction: "up" as const } },
                    { label: "Returned Today", value: stats.returned.toString(), icon: <GraduationCap size={28} />, progress: 45, trend: { value: "-3", label: "from yesterday", direction: "down" as const } },
                    { label: "Overdue Returns", value: stats.overdue.toString(), icon: <GraduationCap size={28} />, progress: 60, trend: { value: "4", label: "completed", direction: "up" as const } },
                    { label: "This Week", value: stats.thisWeek.toString(), icon: <GraduationCap size={28} />, progress: 25, trend: { value: "-1", label: "this week", direction: "down" as const } },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <StatCard
                            label={stat.label}
                            value={stat.value}
                            icon={stat.icon}
                            progress={stat.progress}
                            trend={stat.trend}
                        />
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50"
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="relative flex-1 max-w-2xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by student name..."
                            className="w-full pl-12 pr-4 py-3.5 border border-gray-100 rounded-2xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all text-sm shadow-inner"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative group flex items-center gap-3 border border-gray-100 rounded-2xl px-5 py-3 bg-white cursor-pointer hover:bg-gray-50 transition-all shadow-sm">
                            <Filter size={18} className="text-gray-400" />
                            <span className="text-sm font-black text-gray-700">Filter Class</span>
                            <select className="absolute inset-0 opacity-0 cursor-pointer w-full h-full font-black text-sm">
                                <option value="">All Classes</option>
                                <option value="S1">Senior 1</option>
                                <option value="S2">Senior 2</option>
                                <option value="S3">Senior 3</option>
                                <option value="S4">Senior 4</option>
                                <option value="S5">Senior 5</option>
                                <option value="S6">Senior 6</option>
                            </select>
                        </div>
                        <Button
                            icon={<Plus size={20} />}
                            onClick={handleOpenAddModal}
                            className="bg-black text-white hover:bg-gray-800 rounded-2xl h-12 px-10 font-black shadow-2xl shadow-black/20"
                        >
                            Add Record
                        </Button>
                    </div>
                </div>

                <Card className="mt-10 overflow-hidden border border-gray-50 rounded-2xl shadow-none">
                    <CardBody className="p-0">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <p className="text-gray-500">Loading permissions...</p>
                            </div>
                        ) : tableData.length === 0 ? (
                            <div className="flex items-center justify-center py-12">
                                <p className="text-gray-500">No permissions recorded</p>
                            </div>
                        ) : (
                            <DataTable
                                columns={columns}
                                data={tableData}
                                keyField="id"
                                className="table-header-black"
                            />
                        )}
                    </CardBody>
                </Card>
            </motion.div>

            {/* Modals */}
            <AddPermissionModal 
                open={activeModal === "add"} 
                onClose={() => setActiveModal(null)} 
                onConfirm={handleAdd} 
                students={students}
                formData={formData}
                setFormData={setFormData}
            />
            <UpdatePermissionModal 
                open={activeModal === "edit"} 
                onClose={() => setActiveModal(null)} 
                record={selectedRecord} 
                onConfirm={handleUpdate}
                formData={formData}
                setFormData={setFormData}
            />
            <ViewPermissionModal open={activeModal === "view"} onClose={() => setActiveModal(null)} record={selectedRecord} />
            <DeleteConfirmationModal open={activeModal === "delete"} onClose={() => setActiveModal(null)} onConfirm={handleDelete} />
        </motion.div>
    );
}

