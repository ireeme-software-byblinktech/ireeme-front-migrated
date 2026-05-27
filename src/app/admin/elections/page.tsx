"use client";

import React, { useState } from "react";
import { Card, CardBody, Button } from "@/components/ui";
import { 
    Plus, 
    ChevronDown, 
    ChevronUp, 
    Settings, 
    Users, 
    Calendar,
    Save,
    Bell,
    CheckCircle2,
    XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { AddPositionModal } from "@/components/ui/AddPositionModal";
import { AddCandidateModal } from "@/components/ui/AddCandidateModal";

interface Candidate {
  id: number;
  name: string;
  class: string;
}

interface Position {
  id: number;
  title: string;
  candidates: Candidate[];
}

export default function AdminElectionsPage() {
    const [isVotingOpen, setIsVotingOpen] = useState(true);
    const [expandedPosition, setExpandedPosition] = useState<number | null>(1);
    
    // Modal states
    const [isAddPosOpen, setIsAddPosOpen] = useState(false);
    const [isAddCanOpen, setIsAddCanOpen] = useState(false);
    const [targetPositionId, setTargetPositionId] = useState<number | null>(null);

    const [positions, setPositions] = useState<Position[]>([
        {
            id: 1,
            title: "Chairman",
            candidates: [
                { id: 1, name: "John Doe", class: "S5 MCB" },
                { id: 2, name: "Jane Smith", class: "S5 MPC" },
                { id: 3, name: "Robert Wilson", class: "S6 PCB" }
            ]
        },
        {
            id: 2,
            title: "Chaiperson",
            candidates: [
                { id: 4, name: "Alice Brown", class: "S4 HEG" },
                { id: 5, name: "Charlie Davis", class: "S5 MEG" }
            ]
        }
    ]);

    const togglePosition = (id: number) => {
        setExpandedPosition(expandedPosition === id ? null : id);
    };

    const handleAddPosition = (title: string) => {
        const newPos: Position = {
            id: Date.now(),
            title,
            candidates: []
        };
        setPositions([...positions, newPos]);
        setExpandedPosition(newPos.id);
    };

    const handleAddCandidate = (name: string, className: string) => {
        if (!targetPositionId) return;
        setPositions(positions.map(pos => {
            if (pos.id === targetPositionId) {
                return {
                    ...pos,
                    candidates: [...pos.candidates, { id: Date.now(), name, class: className }]
                };
            }
            return pos;
        }));
    };

    const openCandidateModal = (posId: number) => {
        setTargetPositionId(posId);
        setIsAddCanOpen(true);
    };

    return (
        <div className="space-y-6 pb-12">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Elections</h1>
            </div>

            {/* Admin Panel Header Card */}
            <Card className="border-none shadow-[0_2px_15px_rgba(0,0,0,0.04)] overflow-hidden">
                <CardBody className="p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold text-gray-900">Student Elections - Admin Panel</h2>
                            <p className="text-gray-500 text-sm font-medium">Election: student council 2026</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-[#008A44] text-white px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-sm">
                                Open
                            </div>
                            <button 
                                onClick={() => setIsVotingOpen(false)}
                                className="bg-[#EE1D23] text-white px-6 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-all shadow-sm"
                            >
                                Close voting
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                        <button className="bg-black text-white h-14 rounded-xl text-base font-bold tracking-wide hover:opacity-90 transition-all flex items-center justify-center gap-3">
                            Manage Election
                        </button>
                        <button className="bg-white text-gray-900 border-2 border-gray-100 h-14 rounded-xl text-base font-bold tracking-wide hover:border-black transition-all flex items-center justify-center gap-3">
                            View Results & Stats
                        </button>
                    </div>
                </CardBody>
            </Card>

            {/* Election Settings */}
            <Card className="border-none shadow-[0_2px_15px_rgba(0,0,0,0.04)]">
                <CardBody className="p-8 space-y-8">
                    <h3 className="text-lg font-bold text-gray-900">Election settings</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">Election Name</label>
                            <input 
                                type="text" 
                                defaultValue="Student Council 2026"
                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-black transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">Start Date</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    defaultValue="01/03/2025"
                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-black transition-all"
                                />
                                <Calendar size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">End Date</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    defaultValue="01/03/2025"
                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-black transition-all"
                                />
                                <Calendar size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <button className="bg-black text-white px-10 h-12 rounded-lg text-sm font-bold tracking-wide hover:opacity-90 transition-all">
                        Save settings
                    </button>
                </CardBody>
            </Card>

            {/* Positions Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-xl font-bold text-gray-900">Positions</h3>
                    <button 
                        onClick={() => setIsAddPosOpen(true)}
                        className="bg-black text-white px-6 h-11 rounded-lg text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-all"
                    >
                        <Plus size={18} />
                        Add position
                    </button>
                </div>

                <div className="space-y-3">
                    {positions.map((pos) => (
                        <div key={pos.id} className="space-y-3">
                            <button 
                                onClick={() => togglePosition(pos.id)}
                                className="w-full bg-white border border-gray-100 rounded-xl p-5 flex items-center justify-between hover:border-gray-200 transition-all shadow-sm group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "transition-transform duration-300",
                                        expandedPosition === pos.id ? "rotate-0" : "-rotate-90"
                                    )}>
                                        <ChevronDown size={20} className="text-gray-400" />
                                    </div>
                                    <span className="text-lg font-bold text-gray-900">
                                        {pos.title} <span className="text-gray-400 font-medium ml-2 text-base">({pos.candidates.length} candidates)</span>
                                    </span>
                                </div>
                            </button>

                            <AnimatePresence>
                                {expandedPosition === pos.id && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden space-y-3 pl-4"
                                    >
                                        <button 
                                            onClick={() => openCandidateModal(pos.id)}
                                            className="bg-black text-white px-6 h-10 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-4 hover:opacity-90 transition-all"
                                        >
                                            <Plus size={16} />
                                            Add candidate
                                        </button>
                                        
                                        {pos.candidates.map((can) => (
                                            <div key={can.id} className="bg-white border border-gray-100 rounded-xl p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                                                <div className="space-y-1">
                                                    <h4 className="text-lg font-bold text-gray-900">{can.name}</h4>
                                                    <p className="text-gray-400 text-sm font-medium">{can.class}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modals */}
            <AddPositionModal 
                isOpen={isAddPosOpen} 
                onClose={() => setIsAddPosOpen(false)} 
                onAdd={handleAddPosition} 
            />
            <AddCandidateModal 
                isOpen={isAddCanOpen} 
                onClose={() => setIsAddCanOpen(false)} 
                onAdd={handleAddCandidate}
                positionTitle={positions.find(p => p.id === targetPositionId)?.title}
            />
        </div>
    );
}