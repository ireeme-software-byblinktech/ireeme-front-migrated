"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, StatCard } from "@/components/ui";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { BriefcaseMedical, AlertCircle, CheckCircle, Plus, X } from "lucide-react";
import { motion } from "framer-motion";
import { healthApi, MedicalCase, CreateMedicalCaseDto } from "@/lib/api/health";
import { studentsApi, Student } from "@/lib/api/students";
import { toast } from "@/lib/utils/toast";

export default function MedicalCasesPage() {
  const [cases, setCases] = useState<MedicalCase[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [formData, setFormData] = useState<CreateMedicalCaseDto>({
    studentId: "",
    diagnosis: "",
    symptoms: "",
  });

  useEffect(() => {
    fetchStudents();
    fetchAllCases();
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

  const fetchAllCases = async () => {
    setLoading(true);
    try {
      const response = await studentsApi.getStudents({ limit: 50, isActive: true });
      const allCases: MedicalCase[] = [];
      
      // Fetch cases for each student
      for (const student of response.data) {
        try {
          const studentCases = await healthApi.getMedicalCases(student.id);
          const casesArray = Array.isArray(studentCases) ? studentCases : [];
          allCases.push(...casesArray);
        } catch (error) {
          // Skip students with no cases
          console.log(`No cases for student ${student.id}`);
        }
      }
      
      // Sort by date, newest first
      allCases.sort((a, b) => new Date(b.openedAt).getTime() - new Date(a.openedAt).getTime());
      setCases(allCases);
    } catch (error) {
      console.error("Failed to fetch cases:", error);
      toast.error("Failed to load medical cases");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCase = async () => {
    if (!formData.studentId || !formData.diagnosis || !formData.symptoms) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const newCase = await healthApi.createMedicalCase(formData);
      setCases([newCase, ...cases]);
      toast.success("Medical case created successfully");
      setShowAddModal(false);
      setFormData({ studentId: "", diagnosis: "", symptoms: "" });
    } catch (error) {
      console.error("Failed to create case:", error);
      toast.error("Failed to create medical case");
    }
  };

  const handleCloseCase = async (id: string) => {
    if (!confirm("Are you sure you want to close this case?")) return;

    try {
      const updated = await healthApi.closeMedicalCase(id);
      setCases(cases.map(c => c.id === id ? updated : c));
      toast.success("Medical case closed");
    } catch (error) {
      console.error("Failed to close case:", error);
      toast.error("Failed to close medical case");
    }
  };

  const getStatusBadge = (status: string) => {
    return status === "OPEN" ? (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
        OPEN
      </span>
    ) : (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
        CLOSED
      </span>
    );
  };

  const columns: Column<MedicalCase>[] = [
    {
      key: "student",
      header: "Student",
      render: (_, row) => (
        <div>
          <div className="font-bold">
            {row.student?.user?.firstName || 'Unknown'} {row.student?.user?.lastName || ''}
          </div>
          <div className="text-xs text-gray-500">{row.student?.studentNumber || 'N/A'}</div>
        </div>
      )
    },
    {
      key: "diagnosis",
      header: "Diagnosis",
      render: (v) => <span className="font-bold">{String(v)}</span>
    },
    {
      key: "symptoms",
      header: "Symptoms",
      render: (v) => String(v)
    },
    {
      key: "openedAt",
      header: "Opened",
      render: (v) => new Date(String(v)).toLocaleDateString()
    },
    {
      key: "status",
      header: "Status",
      render: (v) => getStatusBadge(String(v))
    },
    {
      key: "actions",
      header: "Actions",
      render: (_, row) => (
        row.status === "OPEN" ? (
          <button
            onClick={() => handleCloseCase(row.id)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
            title="Close Case"
          >
            <CheckCircle size={18} />
          </button>
        ) : null
      )
    },
  ];

  const stats = {
    total: cases.length,
    open: cases.filter(c => c.status === "OPEN").length,
    closed: cases.filter(c => c.status === "CLOSED").length,
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Cases" value={stats.total.toString()} icon={<BriefcaseMedical size={28} />} progress={100} />
        <StatCard label="Open Cases" value={stats.open.toString()} icon={<AlertCircle size={28} />} progress={60} />
        <StatCard label="Closed Cases" value={stats.closed.toString()} icon={<CheckCircle size={28} />} progress={90} />
      </div>

      {/* Main Content */}
      <div className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black">Medical Cases</h2>
          <Button onClick={() => setShowAddModal(true)} className="bg-black text-white rounded-xl px-6">
            <Plus size={18} className="mr-2" />
            Open New Case
          </Button>
        </div>

        {/* Cases Table */}
        <Card className="overflow-hidden border-none shadow-sm rounded-2xl">
          <CardBody className="p-0">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading cases...</div>
            ) : cases.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No medical cases recorded</div>
            ) : (
              <DataTable columns={columns} data={cases} keyField="id" />
            )}
          </CardBody>
        </Card>
      </div>

      {/* Add Case Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-2xl font-black mb-6">Open Medical Case</h3>
            
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
                  placeholder="e.g., Chronic Headache"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Symptoms *</label>
                <textarea
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Describe symptoms..."
                  rows={4}
                  required
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
                onClick={handleCreateCase}
                className="flex-1 py-4 bg-black text-white text-[14px] font-black rounded-[18px] uppercase tracking-wider hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-black/10"
              >
                Open Case
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
