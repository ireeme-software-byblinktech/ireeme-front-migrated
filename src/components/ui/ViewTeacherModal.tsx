"use client";

import { X } from "lucide-react";

interface ViewTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: any;
}

export function ViewTeacherModal({ isOpen, onClose, teacher }: ViewTeacherModalProps) {
  if (!isOpen || !teacher) return null;

  const details = [
    { label: "Teacher Name", value: `${teacher.user.firstName} ${teacher.user.lastName}` },
    { label: "Email Address", value: teacher.user.email },
    { label: "Employee Number", value: teacher.employeeNum },
    { label: "Department", value: teacher.department || "N/A" },
    { label: "Qualification", value: teacher.qualification || "N/A" },
    { label: "Contact Number", value: teacher.user.phoneNumber || "N/A" },
    { label: "Status", value: teacher.isActive ? "Active" : "Inactive" },
  ];

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute left-64 top-0 right-0 bottom-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute left-64 top-0 right-0 bottom-0 flex items-center justify-center pointer-events-none p-6">
        <div className="bg-black text-white rounded-2xl w-full max-w-lg shadow-2xl pointer-events-auto overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h2 className="text-xl font-bold">Teacher Details</h2>
              <p className="text-gray-400 text-xs mt-1">Detailed view of the teacher's profile information.</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            <div className="border border-white/10 rounded-xl overflow-hidden">
              <table className="w-full text-sm text-left">
                <tbody>
                  {details.map((detail, idx) => (
                    <tr key={idx} className={idx !== details.length - 1 ? "border-b border-white/10" : ""}>
                      <td className="px-6 py-4 bg-white/5 font-bold text-[11px] uppercase tracking-wider text-gray-400 w-1/3">
                        {detail.label}
                      </td>
                      <td className="px-6 py-4 text-white font-medium">
                        {detail.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 flex justify-end">
              <button 
                onClick={onClose}
                className="px-8 py-3 rounded-xl text-sm font-bold bg-white text-black hover:bg-gray-200 transition-all shadow-lg"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

