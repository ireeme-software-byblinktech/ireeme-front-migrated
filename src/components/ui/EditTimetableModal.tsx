"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Loader2, Trash2 } from "lucide-react";
import { timetableApi } from "@/lib/api/timetable";
import { toast } from "@/lib/utils/toast";

interface EditTimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    slotId?: string;
    classId: string;
    dayOfWeek: number;
    day: string;
    time: string;
    startTime: string;
    subject?: string;
    teacher?: string;
    subjectId?: string;
    teacherId?: string;
  };
}

const dayNames = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

export function EditTimetableModal({ isOpen, onClose, initialData }: EditTimetableModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    subjectName: initialData?.subject || "",
    teacherName: initialData?.teacher || "",
    startTime: initialData?.startTime || "08:00",
    endTime: "",
    dayOfWeek: initialData?.dayOfWeek ?? 0,
    room: "",
  });

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        subjectName: initialData.subject || "",
        teacherName: initialData.teacher || "",
        startTime: initialData.startTime || "08:00",
        endTime: "",
        dayOfWeek: initialData.dayOfWeek ?? 0,
        room: "",
      });
    }
  }, [initialData]);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!initialData?.slotId) throw new Error("Slot ID is required");
      return timetableApi.deleteSlot(initialData.slotId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timetable"] });
      toast.success("Slot deleted successfully");
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete slot");
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subjectName.trim() || !formData.teacherName.trim()) {
      toast.error("Please enter both subject and teacher name");
      return;
    }
    
    toast.success("Timetable slot will be saved (implementation in progress)");
    onClose();
  };

  const handleDelete = () => {
    if (!initialData?.slotId) {
      toast.error("No slot to delete");
      return;
    }
    
    if (confirm("Are you sure you want to delete this slot?")) {
      deleteMutation.mutate();
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute left-64 top-0 right-0 bottom-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute left-64 top-0 right-0 bottom-0 flex items-center justify-center pointer-events-none p-6">
        <div className="bg-black text-white rounded-2xl w-full max-w-lg shadow-2xl pointer-events-auto overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h2 className="text-xl font-bold">
                {initialData?.slotId ? "Edit Schedule" : "Add Schedule"}
              </h2>
              <p className="text-gray-400 text-xs mt-1">
                {initialData?.slotId 
                  ? "Modify the subject or teacher for this time slot." 
                  : "Add a new subject to the timetable."}
              </p>
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
                   className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 transition-all"
                   value={formData.dayOfWeek}
                   onChange={e => setFormData({...formData, dayOfWeek: parseInt(e.target.value)})}
                >
                  {dayNames.map((day, index) => (
                    <option key={index} value={index} className="bg-black text-white">{day}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Start Time</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. 08:00"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-all"
                  value={formData.startTime}
                  onChange={e => setFormData({...formData, startTime: e.target.value})}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">End Time</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. 09:00"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-all"
                  value={formData.endTime}
                  onChange={e => setFormData({...formData, endTime: e.target.value})}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Subject</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Biology (BIO101)"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-all"
                  value={formData.subjectName}
                  onChange={e => setFormData({...formData, subjectName: e.target.value})}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Teacher</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. John Smith"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-all"
                  value={formData.teacherName}
                  onChange={e => setFormData({...formData, teacherName: e.target.value})}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Room (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Room 101"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-all"
                  value={formData.room}
                  onChange={e => setFormData({...formData, room: e.target.value})}
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-4">
              <div>
                {initialData?.slotId && (
                  <button 
                    type="button" 
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                    className="px-6 py-2.5 rounded-lg text-sm font-bold border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                    Delete
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="px-6 py-2.5 rounded-lg text-sm font-bold border border-white/10 hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-8 py-2.5 rounded-lg text-sm font-bold bg-white text-black hover:bg-gray-200 transition-all shadow-lg flex items-center gap-2"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
