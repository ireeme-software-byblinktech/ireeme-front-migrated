"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, Loader2 } from "lucide-react";
import { studentsApi } from "@/lib/api/students";
import { toast } from "@/lib/utils/toast";

interface AddCandidateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (studentId: string, bio: string) => void;
    positionTitle?: string;
}

export function AddCandidateModal({ isOpen, onClose, onAdd, positionTitle }: AddCandidateModalProps) {
    const [name, setName] = useState("");
    const [className, setClassName] = useState("");
    const [bio, setBio] = useState("");

    // Fetch all students to search from
    const { data: studentsData, isLoading, error } = useQuery({
        queryKey: ["students", "for-candidates"],
        queryFn: async () => {
            const result = await studentsApi.getStudents({ page: 1, limit: 50 });
            return result;
        },
        enabled: isOpen,
        retry: 1,
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!name.trim() || !bio.trim()) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (!studentsData?.data || studentsData.data.length === 0) {
            toast.error("No students available. Please add students first.");
            return;
        }

        // Search for student by name (case-insensitive, partial match)
        const searchName = name.trim().toLowerCase();
        const student = studentsData.data.find(s => {
            const firstName = s.user.firstName.toLowerCase();
            const lastName = s.user.lastName.toLowerCase();
            const fullName = `${firstName} ${lastName}`;
            
            // Match if search contains first name, last name, or full name
            return firstName.includes(searchName) || 
                   lastName.includes(searchName) || 
                   fullName.includes(searchName) ||
                   searchName.includes(firstName) ||
                   searchName.includes(lastName);
        });

        if (!student) {
            const availableNames = studentsData.data
                .slice(0, 5)
                .map(s => `${s.user.firstName} ${s.user.lastName}`)
                .join(", ");
            toast.error(`Student "${name}" not found. Try: ${availableNames}...`);
            return;
        }

        onAdd(student.id, bio);
        setName("");
        setClassName("");
        setBio("");
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
                        Enter candidate information {positionTitle && `for ${positionTitle}`}
                    </p>
                </div>

                {isLoading && (
                    <div className="flex items-center justify-center py-8 mb-4">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                        <span className="ml-3 text-sm text-gray-400">Loading students...</span>
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <p className="text-sm text-red-400">Failed to load students. Please try again.</p>
                    </div>
                )}

                {!isLoading && studentsData?.data && studentsData.data.length === 0 && (
                    <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <p className="text-sm text-yellow-400">No students found. Please add students first.</p>
                    </div>
                )}

                {!isLoading && studentsData?.data && studentsData.data.length > 0 && (
                    <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <p className="text-xs text-blue-400">
                            💡 {studentsData.data.length} students available
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <input 
                            type="text" 
                            autoFocus
                            placeholder="Name of candidate (e.g., Mia King)"
                            className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-white/30 transition-all placeholder:text-gray-600"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={isLoading || !studentsData?.data}
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <input 
                            type="text" 
                            placeholder="Class of candidate (optional)"
                            className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-white/30 transition-all placeholder:text-gray-600"
                            value={className}
                            onChange={(e) => setClassName(e.target.value)}
                            disabled={isLoading || !studentsData?.data}
                        />
                    </div>
                    
                    <div className="space-y-2 pb-6">
                        <textarea
                            placeholder="Candidate bio or manifesto..."
                            className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-white/30 transition-all placeholder:text-gray-600 min-h-[100px] resize-none"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            required
                            disabled={isLoading || !studentsData?.data}
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
                            disabled={isLoading || !studentsData?.data || !name.trim() || !bio.trim()}
                            className="bg-white text-black px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-200 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                "Add candidate +"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
