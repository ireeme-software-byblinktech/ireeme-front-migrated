"use client";

import React from "react";
import { X, GraduationCap, Mail, Phone, MapPin, Briefcase, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface ViewAlumniModalProps {
    isOpen: boolean;
    onClose: () => void;
    data?: {
        id: number;
        name: string;
        graduationYear: string;
        email: string;
        phone: string;
        currentStatus: string;
    };
}

export function ViewAlumniModal({ isOpen, onClose, data }: ViewAlumniModalProps) {
    if (!isOpen || !data) return null;

    const details = [
        { label: "Full Name", value: data.name, icon: <GraduationCap size={18} /> },
        { label: "Graduation Year", value: data.graduationYear, icon: <Calendar size={18} /> },
        { label: "Email Address", value: data.email, icon: <Mail size={18} /> },
        { label: "Phone Number", value: data.phone, icon: <Phone size={18} /> },
        { label: "Current Status", value: data.currentStatus, icon: <Briefcase size={18} /> },
        { label: "Location", value: "Kigali, Rwanda", icon: <MapPin size={18} /> },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Overlay - skips sidebar */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm ml-64" 
                onClick={onClose} 
            />
            
            {/* Modal Content */}
            <div className="relative bg-black text-white w-full max-w-2xl rounded-[24px] p-10 shadow-2xl ml-64 overflow-hidden border border-white/5">
                <div className="flex items-center justify-between mb-10">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold tracking-tight">Alumni Profile</h2>
                        <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">Alumni ID: #{data.id}</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {details.map((item, index) => (
                        <div key={index} className="space-y-3">
                            <div className="flex items-center gap-2 text-gray-500">
                                {item.icon}
                                <label className="text-[11px] font-bold uppercase tracking-widest">{item.label}</label>
                            </div>
                            <div className="text-[17px] font-semibold text-white pl-6">
                                {item.value}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-end gap-6">
                    <button 
                        onClick={onClose}
                        className="text-sm font-bold text-gray-400 hover:text-white transition-colors"
                    >
                        Close
                    </button>
                    <button 
                        className="bg-white text-black px-10 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all shadow-lg"
                    >
                        Send Email
                    </button>
                </div>
            </div>
        </div>
    );
}

