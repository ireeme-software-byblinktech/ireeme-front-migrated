"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { StatCard, Card, CardHeader, CardBody } from "@/components/ui";
import { 
  Stethoscope, 
  FileText, 
  Calendar, 
  AlertCircle, 
  Pill, 
  GraduationCap,
  X,
  ClipboardList,
  Activity
} from "lucide-react";
import { useStudentProfile } from "@/hooks/api/useStudentAPI";
import { useHealthRecords, useHealthAppointments, useMedicalCases, useCreateAppointment } from "@/hooks/api/useHealth";
import { formatDate } from "@/lib/utils";

export default function StudentHealthPage() {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  const { data: profile } = useStudentProfile();
  const { data: healthRecords = [], isLoading: recordsLoading } = useHealthRecords(profile?.id);
  const { data: appointments = [], isLoading: appointmentsLoading } = useHealthAppointments(profile?.id);
  const { data: medicalCases = [], isLoading: casesLoading } = useMedicalCases(profile?.id);

  const isLoading = recordsLoading || appointmentsLoading || casesLoading;

  // Derive stats from real data
  const statsData = useMemo(() => [
    {
      label: "Total Records",
      value: healthRecords.length,
      icon: <FileText size={20} />,
      progress: Math.min(100, healthRecords.length * 10),
      trend: { value: healthRecords.filter(r => {
        if (!r.date) return false;
        const date = new Date(r.date);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return date > monthAgo;
      }).length.toString(), direction: "up" as const, label: "This month" }
    },
    {
      label: "Appointments", 
      value: appointments.length,
      icon: <Calendar size={20} />,
      progress: Math.min(100, (appointments.filter(a => a.status === "COMPLETED").length / Math.max(1, appointments.length)) * 100),
      trend: { value: appointments.filter(a => a.status === "SCHEDULED").length.toString(), direction: "up" as const, label: "Upcoming" }
    },
    {
      label: "Medical Cases",
      value: medicalCases.length, 
      icon: <ClipboardList size={20} />,
      progress: Math.min(100, (medicalCases.filter(c => c.status === "RESOLVED").length / Math.max(1, medicalCases.length)) * 100),
      trend: { value: medicalCases.filter(c => c.status === "OPEN").length.toString(), direction: "up" as const, label: "Active" }
    },
    {
      label: "Health Status",
      value: "Good",
      icon: <Activity size={20} />,
      progress: 90,
      trend: { value: "0", direction: "up" as const, label: "Issues" }
    }
  ], [healthRecords, appointments, medicalCases]);

  if (isLoading && !healthRecords.length) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1240px] w-full pb-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-[#111827] mb-2">Health Center</h1>
        <p className="text-sm text-gray-500">Manage your health records and appointments</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value.toString()}
            icon={stat.icon}
            progress={stat.progress}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          
          {/* Quick Actions */}
          <Card>
            {/* Hardcode header replacing CardHeader to allow larger text */}
            <div className="flex items-center justify-between p-5 border-b border-gray-50 bg-white rounded-t-xl">
              <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
            </div>
            <CardBody className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => setIsAppointmentModalOpen(true)}
                  className="flex items-center gap-3 bg-black text-white p-5 rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
                >
                  <Calendar size={22} />
                  <span className="font-bold text-base">Book Appointment</span>
                </button>
                <button className="flex items-center gap-3 bg-gray-50 text-gray-800 p-5 rounded-xl hover:bg-gray-100 transition-colors">
                  <FileText size={22} />
                  <span className="font-bold text-base">View Records</span>
                </button>
                <button className="flex items-center gap-3 bg-gray-50 text-gray-800 p-5 rounded-xl hover:bg-gray-100 transition-colors">
                  <AlertCircle size={22} />
                  <span className="font-bold text-base">Report Issue</span>
                </button>
                <button className="flex items-center gap-3 bg-gray-50 text-gray-800 p-5 rounded-xl hover:bg-gray-100 transition-colors">
                  <Pill size={22} />
                  <span className="font-bold text-base">Medications</span>
                </button>
              </div>
            </CardBody>
          </Card>

          {/* My Appointments */}
          <Card>
            <div className="flex items-center justify-between p-5 border-b border-gray-50 bg-white rounded-t-xl">
              <h3 className="text-lg font-bold text-gray-900">My Appointments</h3>
              <button 
                onClick={() => setIsAppointmentModalOpen(true)}
                className="text-blue-600 text-base font-bold hover:underline"
              >
                Book New
              </button>
            </div>
            <CardBody className="space-y-4 p-5">
              {appointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No appointments yet</p>
                </div>
              ) : (
                appointments.slice(0, 3).map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                        <Calendar size={24} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{appointment.reason}</h4>
                        <p className="text-base text-gray-500 mt-1">
                          {appointment.appointmentDate && formatDate(appointment.appointmentDate, { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className={`px-4 py-1.5 text-sm font-bold rounded-full shrink-0 ${
                      appointment.status === "SCHEDULED" ? "bg-blue-100 text-blue-700" :
                      appointment.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                      appointment.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {appointment.status}
                    </div>
                  </div>
                ))
              )}
            </CardBody>
          </Card>

          {/* Medical History */}
          <Card>
            <div className="flex items-center justify-between p-5 border-b border-gray-50 bg-white rounded-t-xl">
              <h3 className="text-lg font-bold text-gray-900">Medical History</h3>
            </div>
            <CardBody className="space-y-4 p-5">
              {healthRecords.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No medical history yet</p>
                </div>
              ) : (
                healthRecords.slice(0, 3).map((record) => (
                  <div key={record.id} className="border border-gray-100 rounded-xl p-5 flex flex-col gap-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-gray-900 text-base">{record.chiefComplaint}</h4>
                        <p className="text-sm text-gray-500 mt-1">{record.date ? formatDate(record.date) : ""}</p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {record.nurse.user.firstName} {record.nurse.user.lastName}
                      </span>
                    </div>
                    {(record.diagnosis || record.treatment) && (
                      <p className="text-base text-gray-700 mt-2">
                        {record.diagnosis || record.treatment}
                      </p>
                    )}
                  </div>
                ))
              )}
            </CardBody>
          </Card>

        </div>

        {/* Right Column */}
        <div className="space-y-8">
          
          {/* My Health Info */}
          <Card>
            <div className="flex items-center justify-between p-5 border-b border-gray-50 bg-white rounded-t-xl">
              <h3 className="text-lg font-bold text-gray-900">My Health Info</h3>
            </div>
            <CardBody className="p-5">
              <div className="space-y-6">
                <div>
                  <h5 className="text-sm text-gray-500 mb-1.5">Blood Type</h5>
                  <p className="text-base font-bold text-gray-900">{(profile as any)?.bloodType || "Not set"}</p>
                </div>
                <div>
                  <h5 className="text-sm text-gray-500 mb-1.5">Height</h5>
                  <p className="text-base font-bold text-gray-900">{(profile as any)?.height ? `${(profile as any).height} cm` : "Not set"}</p>
                </div>
                <div>
                  <h5 className="text-sm text-gray-500 mb-1.5">Weight</h5>
                  <p className="text-base font-bold text-gray-900">{(profile as any)?.weight ? `${(profile as any).weight} kg` : "Not set"}</p>
                </div>
                <div>
                  <h5 className="text-sm text-gray-500 mb-1.5">Allergies</h5>
                  <p className="text-base font-bold text-gray-900">{(profile as any)?.allergies || "None"}</p>
                </div>
                <div>
                  <h5 className="text-sm text-gray-500 mb-1.5">Medical Conditions</h5>
                  <p className="text-base font-bold text-gray-900">{(profile as any)?.medicalConditions || "None"}</p>
                </div>
                <div>
                  <h5 className="text-sm text-gray-500 mb-1.5">Last Checkup</h5>
                  <p className="text-base font-bold text-gray-900">
                    {healthRecords.length > 0 && healthRecords[0].date ? formatDate(healthRecords[0].date) : "No checkups yet"}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Emergency Card */}
          <div className="bg-[#FFF4F4] border border-red-100 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle size={24} className="text-red-600" />
              <h3 className="font-extrabold text-lg text-red-900">Emergency</h3>
            </div>
            <p className="text-base text-red-800 mb-6 leading-relaxed">
              If you have a medical emergency, contact the nurse immediately or call emergency services.
            </p>
            <button className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-base font-bold py-3.5 rounded-lg transition-colors flex items-center justify-center">
              Contact Nurse
            </button>
          </div>

        </div>
      </div>

      {/* Book Appointment Modal */}
      {isAppointmentModalOpen && (
        <BookAppointmentModal
          isOpen={isAppointmentModalOpen}
          onClose={() => setIsAppointmentModalOpen(false)}
        />
      )}
    </div>
  );
}

// Book Appointment Modal Component
function BookAppointmentModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    reason: "",
    date: "",
    time: "",
    type: "General Checkup",
    description: ""
  });

  const { data: profile } = useStudentProfile();
  const createAppointment = useCreateAppointment();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id || !formData.reason || !formData.date || !formData.time) return;

    try {
      const appointmentDate = new Date(`${formData.date}T${formData.time}`).toISOString();
      await createAppointment.mutateAsync({
        studentId: profile.id,
        appointmentDate,
        reason: formData.reason,
        type: formData.type,
        description: formData.description || undefined,
      });
      onClose();
      setFormData({ reason: "", date: "", time: "", type: "General Checkup", description: "" });
    } catch (error) {
      console.error("Failed to create appointment:", error);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[9999]">
        <div className="absolute left-0 top-0 w-64 h-full bg-transparent pointer-events-none"></div>
        <div className="absolute left-64 top-0 right-0 bottom-0 bg-black bg-opacity-10 backdrop-blur-sm"></div>
        <div className="absolute left-64 top-0 right-0 bottom-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl relative z-10 max-h-[90vh] flex flex-col">
            <div className="bg-black text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
              <h2 className="text-xl font-semibold">Book Appointment</h2>
              <button onClick={onClose} className="text-white hover:text-gray-300">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Reason for appointment *</label>
                    <input
                      type="text"
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-gray-400"
                      placeholder="e.g. Fever, Checkup"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Appointment type *</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-gray-400 bg-transparent"
                    >
                      <option value="General Checkup">General Checkup</option>
                      <option value="Specialist">Specialist</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Emergency">Emergency</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Preferred date *</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Preferred time *</label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Short description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-gray-400 h-24 resize-none"
                    placeholder="Enter short details about your concerns"
                  />
                </div>

                <div className="flex items-center justify-center gap-4 pt-4">
                  <button
                    type="submit"
                    className="bg-black text-white px-8 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
                  >
                    Confirm Booking
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="bg-white text-gray-700 border border-gray-300 px-8 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
                  >
                    cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
