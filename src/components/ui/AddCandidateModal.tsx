"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddCandidateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (name: string, className: string) => void;
    positionTitle?: string;
}

export function AddCandidateModal({ isOpen, onClose, onAdd, positionTitle }: AddCandidateModalProps) {
    const [name, setName] = useState("");
    const [className, setClassName] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && className.trim()) {
            onAdd(name, className);
            setName("");
            setClassName("");
            onClose();
        }
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
                    <h2 className="text-xl font-bold tracking-tight">Add New Candidate</h2>
                    <p className="text-gray-400 text-xs font-medium">
                        Enter candidate information to add it to the system {positionTitle && `for ${positionTitle}`}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <input 
                            type="text" 
                            autoFocus
                            placeholder="Name of candidate"
                            className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-white/30 transition-all placeholder:text-gray-600"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2 pb-6">
                        <input 
                            type="text" 
                            placeholder="Class of candidate"
                            className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-white/30 transition-all placeholder:text-gray-600"
                            value={className}
                            onChange={(e) => setClassName(e.target.value)}
                        />
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
                            className="bg-white text-black px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-200 transition-all flex items-center gap-2"
                        >
                            Add candidate +
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
