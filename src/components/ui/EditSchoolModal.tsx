"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface EditSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  school?: {
    name: string;
    studentName: string;
    parentName: string;
    parentEmail: string;
    phone: string;
  };
}

export function EditSchoolModal({ isOpen, onClose, school }: EditSchoolModalProps) {
  const [formData, setFormData] = useState({
    studentName: school?.studentName || "John Doe",
    parentName: school?.parentName || "Doe Dad",
    parentEmail: school?.parentEmail || "Doe@gmail.com",
    phone: school?.phone || "250789002101"
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    onClose();
  };

  return (
    <>
      {/* Overlay that excludes sidebar */}
      <div className="fixed inset-0 z-50">
        {/* Sidebar area - no blur */}
        <div className="absolute left-0 top-0 w-64 h-full bg-transparent pointer-events-none"></div>
        
        {/* Main content area - light blur */}
        <div className="absolute left-64 top-0 right-0 bottom-0 bg-black bg-opacity-20 backdrop-blur-sm"></div>
        
        {/* Modal container - no top space */}
        <div className="absolute left-64 top-0 right-0 bottom-0 flex items-center justify-center">
          <div className="bg-black text-white rounded-lg p-6 w-full max-w-lg mx-4 relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Edit School: Rwanda Coding Academy</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Subtitle */}
            <p className="text-gray-400 text-sm mb-6">
              Review and update the school's information. Some fields may be locked.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Student Name */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Student Name
                  </label>
                  <input
                    type="text"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full bg-black border border-gray-400 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-gray-300"
                  />
                </div>

                {/* Parent Email */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Parent Email
                  </label>
                  <input
                    type="email"
                    value={formData.parentEmail}
                    onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                    className="w-full bg-black border border-gray-400 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-gray-300"
                  />
                </div>

                {/* Parent Name */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Parent Name
                  </label>
                  <input
                    type="text"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full bg-black border border-gray-400 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-gray-300"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-black border border-gray-400 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-gray-300"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-white text-black rounded text-sm hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-white text-black rounded text-sm hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-white text-black rounded text-sm hover:bg-gray-100"
                >
                  Mark as Paid
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
