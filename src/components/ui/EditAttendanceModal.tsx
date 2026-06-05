"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditAttendanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: number, status: "Present" | "Absent" | "Late", checkIn: string) => void;
    data?: {
        id: number;
        name: string;
        status: "Present" | "Absent" | "Late";
        checkInTime: string;
    };
}

export function EditAttendanceModal({ isOpen, onClose, onSave, data }: EditAttendanceModalProps) {
    const [status, setStatus] = useState<"Present" | "Absent" | "Late">(data?.status || "Present");
    const [checkIn, setCheckIn] = useState(data?.checkInTime || "");

    if (!isOpen || !data) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(data.id, status, checkIn);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Overlay - skips sidebar */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm ml-64" 
                onClick={onClose} 
            />
            
            {/* Modal Content */}
            <div className="relative bg-black text-white w-full max-w-lg rounded-[20px] p-8 shadow-2xl ml-64 overflow-hidden border border-white/5">
                <div className="space-y-1 mb-10">
                    <h2 className="text-xl font-bold tracking-tight">Edit Attendance</h2>
                    <p className="text-gray-400 text-xs font-medium">Update attendance status for {data.name}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">Attendance Status</label>
                            <select 
                                className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-white/30 transition-all appearance-none"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as any)}
                            >
                                <option value="Present">Present</option>
                                <option value="Absent">Absent</option>
                                <option value="Late">Late</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">Check-in Time</label>
                            <input 
                                type="text" 
                                placeholder="e.g. 09:15 AM"
                                className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-white/30 transition-all"
                                value={checkIn}
                                onChange={(e) => setCheckIn(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-6 pt-4">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="text-sm font-bold text-gray-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="bg-white text-black px-8 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-200 transition-all"
                        >
                            Update Attendance
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

