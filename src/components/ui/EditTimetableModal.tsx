"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface EditTimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    day: string;
    time: string;
    subject: string;
    teacher: string;
  };
}

export function EditTimetableModal({ isOpen, onClose, initialData }: EditTimetableModalProps) {
  const [formData, setFormData] = useState({
    subject: initialData?.subject || "",
    teacher: initialData?.teacher || "",
    time: initialData?.time || "08:00 - 09:00",
    day: initialData?.day || "MONDAY"
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute left-64 top-0 right-0 bottom-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute left-64 top-0 right-0 bottom-0 flex items-center justify-center pointer-events-none p-6">
        <div className="bg-black text-white rounded-2xl w-full max-w-lg shadow-2xl pointer-events-auto overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h2 className="text-xl font-bold">Edit Schedule</h2>
              <p className="text-gray-400 text-xs mt-1">Modify the subject or teacher for this time slot.</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Day</label>
                <select 
                   disabled
                   className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-all appearance-none opacity-50"
                   value={formData.day}
                >
                  <option value={formData.day}>{formData.day}</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Time Slot</label>
                <select 
                   disabled
                   className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-all appearance-none opacity-50"
                   value={formData.time}
                >
                  <option value={formData.time}>{formData.time}</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Subject Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Mathematics"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-all"
                  value={formData.subject}
                  onChange={e => setFormData({...formData, subject: e.target.value})}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Teacher Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Prof. Johnson"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-all"
                  value={formData.teacher}
                  onChange={e => setFormData({...formData, teacher: e.target.value})}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg text-sm font-bold border border-white/10 hover:bg-white/5 transition-all">Cancel</button>
              <button type="submit" className="px-8 py-2.5 rounded-lg text-sm font-bold bg-white text-black hover:bg-gray-200 transition-all shadow-lg">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
