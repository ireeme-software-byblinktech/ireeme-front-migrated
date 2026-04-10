"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { StatCard, Card, CardHeader, CardBody } from "@/components/ui/Card";
import { 
  Stethoscope, 
  FileText, 
  Calendar, 
  AlertCircle, 
  Pill, 
  GraduationCap,
  X
} from "lucide-react";

// Stats data array
// (Keeping original text from mockup for visual fidelity, but can be updated to health metrics)
const statsData = [
  {
    label: "Total Subjects",
    value: 15,
    icon: <GraduationCap size={20} />,
    progress: 75,
    trend: { value: "3.6", direction: "up" as const, label: "This month" }
  },
  {
    label: "Total Notes", 
    value: 30,
    icon: <FileText size={20} />,
    progress: 80,
    trend: { value: "3.6", direction: "up" as const, label: "This month" }
  },
  {
    label: "Total Assignments",
    value: 30, 
    icon: <FileText size={20} />,
    progress: 65,
    trend: { value: "3.6", direction: "up" as const, label: "This month" }
  },
  {
    label: "Total reports",
    value: 30,
    icon: <FileText size={20} />,
    progress: 90,
    trend: { value: "3.6", direction: "up" as const, label: "This month" }
  }
];

export default function StudentHealthPage() {
  const router = useRouter();
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  return (
    <div className="space-y-8 max-w-[1240px] w-full pb-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl lg:text-4xl font-extrabold text-[#111827] mb-2 tracking-tight">Health Center</h1>
        <p className="text-lg text-gray-500">Manage your health records and appointments</p>
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
            onClick={() => {
              if (stat.label === "Total Assignments") router.push("/student/assignments");
              else if (stat.label === "Total Notes") router.push("/student/notes");
              else if (stat.label.toLowerCase() === "total reports") router.push("/student/report-card");
              else if (stat.label === "Total Subjects") router.push("/student/timetable");
            }}
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
              {/* Appointment Item */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    <Calendar size={24} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Regular Checkup</h4>
                    <p className="text-base text-gray-500 mt-1">2025-01-22 at 10:00 AM</p>
                  </div>
                </div>
                <div className="px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-bold rounded-full shrink-0">
                  Scheduled
                </div>
              </div>

              {/* Appointment Item */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    <Calendar size={24} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Fever</h4>
                    <p className="text-base text-gray-500 mt-1">2025-01-15 at 2:30 PM</p>
                  </div>
                </div>
                <div className="px-4 py-1.5 bg-green-100 text-green-700 text-sm font-bold rounded-full shrink-0">
                  Completed
                </div>
              </div>

              {/* Appointment Item */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    <Calendar size={24} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Headache</h4>
                    <p className="text-base text-gray-500 mt-1">2025-01-10 at 11:00 AM</p>
                  </div>
                </div>
                <div className="px-4 py-1.5 bg-green-100 text-green-700 text-sm font-bold rounded-full shrink-0">
                  Completed
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Medical History */}
          <Card>
            <div className="flex items-center justify-between p-5 border-b border-gray-50 bg-white rounded-t-xl">
              <h3 className="text-lg font-bold text-gray-900">Medical History</h3>
            </div>
            <CardBody className="space-y-4 p-5">
              {/* History Item */}
              <div className="border border-gray-100 rounded-xl p-5 flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 text-base">Fever</h4>
                    <p className="text-sm text-gray-500 mt-1">2025-01-15</p>
                  </div>
                  <span className="text-sm text-gray-500">Nurse Jane</span>
                </div>
                <p className="text-base text-gray-700 mt-2">Paracetamol prescribed</p>
              </div>

              {/* History Item */}
              <div className="border border-gray-100 rounded-xl p-5 flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 text-base">Headache</h4>
                    <p className="text-sm text-gray-500 mt-1">2025-01-10</p>
                  </div>
                  <span className="text-sm text-gray-500">Nurse Jane</span>
                </div>
                <p className="text-base text-gray-700 mt-2">Rest and hydration</p>
              </div>

              {/* History Item */}
              <div className="border border-gray-100 rounded-xl p-5 flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 text-base">Minor Injury</h4>
                    <p className="text-sm text-gray-500 mt-1">2024-12-20</p>
                  </div>
                  <span className="text-sm text-gray-500">Nurse Mary</span>
                </div>
                <p className="text-base text-gray-700 mt-2">Wound cleaned and bandaged</p>
              </div>
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
                  <p className="text-base font-bold text-gray-900">O+</p>
                </div>
                <div>
                  <h5 className="text-sm text-gray-500 mb-1.5">Height</h5>
                  <p className="text-base font-bold text-gray-900">170 cm</p>
                </div>
                <div>
                  <h5 className="text-sm text-gray-500 mb-1.5">Weight</h5>
                  <p className="text-base font-bold text-gray-900">65 kg</p>
                </div>
                <div>
                  <h5 className="text-sm text-gray-500 mb-1.5">Allergies</h5>
                  <p className="text-base font-bold text-gray-900">Peanuts</p>
                </div>
                <div>
                  <h5 className="text-sm text-gray-500 mb-1.5">Medical Conditions</h5>
                  <p className="text-base font-bold text-gray-900">None</p>
                </div>
                <div>
                  <h5 className="text-sm text-gray-500 mb-1.5">Last Checkup</h5>
                  <p className="text-base font-bold text-gray-900">2025-01-15</p>
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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
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