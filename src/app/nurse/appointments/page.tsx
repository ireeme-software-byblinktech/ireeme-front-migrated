"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, StatCard } from "@/components/ui";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { CalendarDays, Clock, CheckCircle, XCircle, Plus, Search } from "lucide-react";
import { motion } from "framer-motion";
import { healthApi, Appointment, AppointmentStatus, CreateAppointmentDto } from "@/lib/api/health";
import { studentsApi, Student } from "@/lib/api/students";
import { toast } from "@/lib/utils/toast";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [formData, setFormData] = useState<CreateAppointmentDto>({
    studentId: "",
    nurseId: "", // Will be set from current user
    scheduledAt: "",
    reason: "",
  });

  useEffect(() => {
    fetchStudents();
    fetchAllAppointments();
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

  const fetchAllAppointments = async () => {
    setLoading(true);
    try {
      const response = await studentsApi.getStudents({ limit: 50, isActive: true });
      const allAppointments: Appointment[] = [];
      
      // Fetch appointments for each student
      for (const student of response.data) {
        try {
          const studentAppointments = await healthApi.getAppointments(student.id);
          const appointmentsArray = Array.isArray(studentAppointments) ? studentAppointments : [];
          allAppointments.push(...appointmentsArray);
        } catch (error) {
          // Skip students with no appointments
          console.log(`No appointments for student ${student.id}`);
        }
      }
      
      // Sort by date, newest first
      allAppointments.sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
      setAppointments(allAppointments);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAppointment = async () => {
    if (!formData.studentId || !formData.scheduledAt || !formData.reason) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // Get nurse ID from JWT token
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Not authenticated. Please login again.");
        return;
      }
      
      // Decode JWT to get user ID
      const payload = JSON.parse(atob(token.split('.')[1]));
      const nurseId = payload.sub; // 'sub' is the user ID in JWT
      
      if (!nurseId) {
        toast.error("Nurse ID not found. Please login again.");
        return;
      }
      
      const appointmentData = { ...formData, nurseId };
      
      const newAppointment = await healthApi.createAppointment(appointmentData);
      setAppointments([newAppointment, ...appointments]);
      toast.success("Appointment created successfully");
      setShowAddModal(false);
      setFormData({ studentId: "", nurseId: "", scheduledAt: "", reason: "" });
    } catch (error) {
      console.error("Failed to create appointment:", error);
      toast.error("Failed to create appointment");
    }
  };

  const handleUpdateStatus = async (id: string, status: AppointmentStatus) => {
    try {
      const updated = await healthApi.updateAppointmentStatus(id, status);
      setAppointments(appointments.map(a => a.id === id ? updated : a));
      toast.success(`Appointment ${status.toLowerCase()}`);
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update appointment status");
    }
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    const styles = {
      PENDING: "bg-yellow-100 text-yellow-800",
      CONFIRMED: "bg-blue-100 text-blue-800",
      COMPLETED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const columns: Column<Appointment>[] = [
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
      key: "scheduledAt",
      header: "Scheduled",
      render: (v) => new Date(String(v)).toLocaleString()
    },
    {
      key: "reason",
      header: "Reason",
      render: (v) => String(v)
    },
    {
      key: "status",
      header: "Status",
      render: (v) => getStatusBadge(v as AppointmentStatus)
    },
    {
      key: "actions",
      header: "Actions",
      render: (_, row) => (
        <div className="flex gap-2">
          {row.status === "PENDING" && (
            <>
              <button
                onClick={() => handleUpdateStatus(row.id, "CONFIRMED")}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                title="Confirm"
              >
                <CheckCircle size={18} />
              </button>
              <button
                onClick={() => handleUpdateStatus(row.id, "CANCELLED")}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                title="Cancel"
              >
                <XCircle size={18} />
              </button>
            </>
          )}
          {row.status === "CONFIRMED" && (
            <button
              onClick={() => handleUpdateStatus(row.id, "COMPLETED")}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
              title="Complete"
            >
              <CheckCircle size={18} />
            </button>
          )}
        </div>
      )
    },
  ];

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === "PENDING").length,
    confirmed: appointments.filter(a => a.status === "CONFIRMED").length,
    completed: appointments.filter(a => a.status === "COMPLETED").length,
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total" value={stats.total.toString()} icon={<CalendarDays size={28} />} progress={100} />
        <StatCard label="Pending" value={stats.pending.toString()} icon={<Clock size={28} />} progress={60} />
        <StatCard label="Confirmed" value={stats.confirmed.toString()} icon={<CheckCircle size={28} />} progress={75} />
        <StatCard label="Completed" value={stats.completed.toString()} icon={<CheckCircle size={28} />} progress={90} />
      </div>

      {/* Main Content */}
      <div className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black">Appointments</h2>
          <Button onClick={() => setShowAddModal(true)} className="bg-black text-white rounded-xl px-6">
            <Plus size={18} className="mr-2" />
            Schedule Appointment
          </Button>
        </div>

        {/* Appointments Table */}
        <Card className="overflow-hidden border-none shadow-sm rounded-2xl">
          <CardBody className="p-0">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading appointments...</div>
            ) : appointments.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No appointments recorded</div>
            ) : (
              <DataTable columns={columns} data={appointments} keyField="id" />
            )}
          </CardBody>
        </Card>
      </div>

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-2xl font-black mb-6">Schedule Appointment</h3>
            
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
                <label className="block text-sm font-bold text-gray-700 mb-2">Date & Time *</label>
                <input
                  type="datetime-local"
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Reason *</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Reason for appointment..."
                  rows={3}
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
                onClick={handleCreateAppointment}
                className="flex-1 py-4 bg-black text-white text-[14px] font-black rounded-[18px] uppercase tracking-wider hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-black/10"
              >
                Schedule
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

