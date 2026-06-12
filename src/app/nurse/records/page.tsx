"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/Shared";
import { StatCard, Card, CardBody } from "@/components/ui";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import {
  Stethoscope,
  Users,
  CalendarDays,
  AlertCircle,
  Plus,
  Search,
  Eye,
  Filter,
  BriefcaseMedical
} from "lucide-react";
import { motion } from "framer-motion";
import { healthApi, HealthRecord, CreateHealthRecordDto } from "@/lib/api/health";
import { studentsApi, Student } from "@/lib/api/students";
import { toast } from "@/lib/utils/toast";

export default function HealthRecordsPage() {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<CreateHealthRecordDto>({
    studentId: "",
    diagnosis: "",
    treatment: "",
  });

  // Fetch students and all records on mount
  useEffect(() => {
    fetchStudents();
    fetchAllRecords();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await studentsApi.getStudents({ limit: 50, isActive: true });
      setStudents(response.data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
      toast.error("Failed to load students");
    }
  };

  const fetchAllRecords = async () => {
    setLoading(true);
    try {
      const allRecords = await healthApi.getAllHealthRecords();
      // Sort by date, newest first
      allRecords.sort((a, b) => {
        const dateA = a.visitDate ? new Date(a.visitDate).getTime() : 0;
        const dateB = b.visitDate ? new Date(b.visitDate).getTime() : 0;
        return dateB - dateA;
      });
      setRecords(allRecords);
    } catch (error) {
      console.error("Failed to fetch records:", error);
      toast.error("Failed to load health records");
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = async () => {
    if (!formData.studentId || !formData.diagnosis) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const newRecord = await healthApi.createHealthRecord(formData);
      toast.success("Health record created successfully");
      setShowAddModal(false);
      
      // Add the new record to the list
      setRecords([newRecord, ...records]);
      
      setFormData({ studentId: "", diagnosis: "", treatment: "" });
    } catch (error) {
      console.error("Failed to create record:", error);
      toast.error("Failed to create health record");
    }
  };

  const columns: Column<HealthRecord>[] = [
    {
      key: "student",
      header: "Student",
      render: (_, row) => (
        <span className="font-bold">
          {row.student?.user?.firstName || 'Unknown'} {row.student?.user?.lastName || ''}
        </span>
      )
    },
    {
      key: "visitDate",
      header: "Visit Date",
      render: (v) => new Date(String(v)).toLocaleDateString()
    },
    {
      key: "diagnosis",
      header: "Diagnosis",
      render: (v) => <span className="font-bold">{String(v)}</span>
    },
    {
      key: "treatment",
      header: "Treatment",
      render: (v) => String(v || "N/A")
    },
    {
      key: "nurse",
      header: "Nurse",
      render: (_, row) => row.nurse ? `${row.nurse.firstName} ${row.nurse.lastName}` : 'N/A'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Records"
          value={records.length.toString()}
          icon={<Stethoscope size={28} />}
          progress={75}
          trend={{ value: "+12", label: "this month", direction: "up" }}
        />
        <StatCard
          label="Active Students"
          value={students.length.toString()}
          icon={<Users size={28} />}
          progress={85}
          trend={{ value: "+5", label: "this week", direction: "up" }}
        />
        <StatCard
          label="This Week"
          value="24"
          icon={<CalendarDays size={28} />}
          progress={60}
          trend={{ value: "4", label: "today", direction: "up" }}
        />
        <StatCard
          label="Critical"
          value="2"
          icon={<AlertCircle size={28} />}
          progress={25}
          trend={{ value: "-1", label: "this week", direction: "down" }}
        />
      </div>

      {/* Main Content */}
      <div className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6">
          <h2 className="text-2xl font-black text-gray-900">Health Records</h2>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-black text-white hover:opacity-90 rounded-xl px-8 py-3 font-bold"
          >
            <Plus size={18} className="mr-2" />
            Add Record
          </Button>
        </div>

        {/* Records Table */}
        <Card className="overflow-hidden border-none shadow-sm rounded-2xl">
          <CardBody className="p-0">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading records...</div>
            ) : records.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No records recorded</div>
            ) : (
              <DataTable
                columns={columns}
                data={records}
                keyField="id"
              />
            )}
          </CardBody>
        </Card>
      </div>

      {/* Add Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-2xl font-black mb-6">Add Health Record</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Student *</label>
                <select
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                  required
                >
                  <option value="">-- Select student --</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.user.firstName} {student.user.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Diagnosis *</label>
                <input
                  type="text"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="e.g., Headache, Fever"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Treatment</label>
                <textarea
                  value={formData.treatment}
                  onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Treatment details..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-4 bg-gray-200 text-black text-[14px] font-black rounded-[18px] uppercase tracking-wider hover:bg-gray-300 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRecord}
                className="flex-1 py-4 bg-black text-white text-[14px] font-black rounded-[18px] uppercase tracking-wider hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-black/10"
              >
                Create Record
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

