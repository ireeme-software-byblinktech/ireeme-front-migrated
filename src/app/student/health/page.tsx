"use client";

import Link from "next/link";
import { StatCard, Card, CardHeader, CardBody } from "@/components/ui/Card";
import { 
  Stethoscope, 
  FileText, 
  Calendar, 
  AlertCircle, 
  Pill, 
  GraduationCap
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
                <button className="flex items-center gap-3 bg-black text-white p-5 rounded-xl hover:bg-gray-800 transition-colors shadow-sm">
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
              <button className="text-blue-600 text-base font-bold hover:underline">
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
    </div>
  );
}