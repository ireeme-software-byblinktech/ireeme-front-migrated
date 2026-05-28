"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
    XCircle,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { AddPositionModal } from "@/components/ui/AddPositionModal";
import { AddCandidateModal } from "@/components/ui/AddCandidateModal";
import { electionsApi } from "@/lib/api/elections";
import { toast } from "@/lib/utils/toast";

export default function AdminElectionsPage() {
    const queryClient = useQueryClient();
    const [expandedPosition, setExpandedPosition] = useState<string | null>(null);
    
    // Modal states
    const [isAddPosOpen, setIsAddPosOpen] = useState(false);
    const [isAddCanOpen, setIsAddCanOpen] = useState(false);
    const [targetPositionId, setTargetPositionId] = useState<string | null>(null);

    // Election settings state
    const [electionName, setElectionName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Fetch elections
    const { data: elections, isLoading } = useQuery({
        queryKey: ["elections"],
        queryFn: async () => {
            const data = await electionsApi.getElections();
            console.log("Fetched elections:", data);
            return data;
        },
    });

    // Get the first active election or first election
    const currentElection = elections?.find(e => e.status === "ACTIVE") || elections?.[0];
    
    console.log("Current election:", currentElection);

    // Set election data when loaded
    React.useEffect(() => {
        if (currentElection) {
            setElectionName(currentElection.title);
            setStartDate(currentElection.startAt ? new Date(currentElection.startAt).toISOString().split('T')[0] : "");
            setEndDate(currentElection.endAt ? new Date(currentElection.endAt).toISOString().split('T')[0] : "");
        }
    }, [currentElection]);

    // Add candidate mutation
    const addCandidateMutation = useMutation({
        mutationFn: electionsApi.addCandidate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["elections"] });
            toast.success("Candidate added successfully");
            setIsAddCanOpen(false);
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to add candidate");
        },
    });

    // Add position mutation
    const addPositionMutation = useMutation({
        mutationFn: (data: { name: string }) => {
            if (!currentElection?.id) {
                throw new Error("No active election");
            }
            return electionsApi.addPosition(currentElection.id, { name: data.name, maxVotes: 1 });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["elections"] });
            toast.success("Position added successfully");
            setIsAddPosOpen(false);
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to add position");
        },
    });

    // Close voting mutation
    const closeVotingMutation = useMutation({
        mutationFn: () => {
            if (!currentElection?.id) {
                throw new Error("No active election");
            }
            console.log("Closing voting for election ID:", currentElection.id);
            return electionsApi.closeVoting(currentElection.id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["elections"] });
            toast.success("Voting closed successfully");
        },
        onError: (error: Error) => {
            console.error("Close voting error:", error);
            toast.error(error.message || "Failed to close voting");
        },
    });

    // Open voting mutation
    const openVotingMutation = useMutation({
        mutationFn: () => {
            if (!currentElection?.id) {
                throw new Error("No active election");
            }
            console.log("Opening voting for election ID:", currentElection.id);
            return electionsApi.openVoting(currentElection.id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["elections"] });
            toast.success("Voting opened successfully");
        },
        onError: (error: Error) => {
            console.error("Open voting error:", error);
            toast.error(error.message || "Failed to open voting");
        },
    });

    const togglePosition = (id: string) => {
        setExpandedPosition(expandedPosition === id ? null : id);
    };

    const handleAddPosition = (title: string) => {
        addPositionMutation.mutate({ name: title });
    };

    const handleAddCandidate = (studentId: string, bio: string) => {
        if (!targetPositionId) return;
        addCandidateMutation.mutate({
            positionId: targetPositionId,
            studentId,
            bio,
        });
    };

    const openCandidateModal = (posId: string) => {
        setTargetPositionId(posId);
        setIsAddCanOpen(true);
    };

    const handleCloseVoting = () => {
        closeVotingMutation.mutate();
    };

    const handleOpenVoting = () => {
        openVotingMutation.mutate();
    };

    const handleSaveSettings = () => {
        // TODO: Implement save settings API call
        toast.success("Save settings endpoint not yet implemented");
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
            </div>
        );
    }

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
                            <p className="text-gray-500 text-sm font-medium">
                                Election: {currentElection?.title || "No election"}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "flex items-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-all shadow-sm",
                                currentElection?.status === "ACTIVE" ? "bg-[#008A44] text-white" :
                                currentElection?.status === "CLOSED" ? "bg-[#EE1D23] text-white" :
                                "bg-gray-400 text-white"
                            )}>
                                {currentElection?.status || "DRAFT"}
                            </div>
                            {currentElection?.status === "ACTIVE" ? (
                                <button 
                                    onClick={handleCloseVoting}
                                    disabled={closeVotingMutation.isPending}
                                    className="bg-[#EE1D23] text-white px-6 py-2 rounded-md text-sm font-bold hover:opacity-90 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {closeVotingMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Close voting
                                </button>
                            ) : (
                                <button 
                                    onClick={handleOpenVoting}
                                    disabled={openVotingMutation.isPending}
                                    className="bg-[#008A44] text-white px-6 py-2 rounded-md text-sm font-bold hover:opacity-90 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {openVotingMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Open voting
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                        <button className="bg-black text-white h-14 rounded-md text-base font-bold tracking-wide hover:opacity-90 transition-all flex items-center justify-center gap-3">
                            Manage Election
                        </button>
                        <button className="bg-white text-gray-900 border-2 border-gray-100 h-14 rounded-md text-base font-bold tracking-wide hover:border-black transition-all flex items-center justify-center gap-3">
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
                                value={electionName}
                                onChange={(e) => setElectionName(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-md px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-black transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">Start Date</label>
                            <div className="relative">
                                <input 
                                    type="date" 
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-md px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-black transition-all"
                                />
                                <Calendar size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">End Date</label>
                            <div className="relative">
                                <input 
                                    type="date" 
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-md px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-black transition-all"
                                />
                                <Calendar size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleSaveSettings}
                        className="bg-black text-white px-10 h-12 rounded-md text-sm font-bold tracking-wide hover:opacity-90 transition-all"
                    >
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
                        className="bg-black text-white px-6 h-11 rounded-md text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-all"
                    >
                        <Plus size={18} />
                        Add position
                    </button>
                </div>

                <div className="space-y-3">
                    {currentElection?.positions && currentElection.positions.length > 0 ? (
                        currentElection.positions.map((pos) => (
                            <div key={pos.id} className="space-y-3">
                                <button 
                                    onClick={() => togglePosition(pos.id)}
                                    className="w-full bg-white border border-gray-100 rounded-md p-5 flex items-center justify-between hover:border-gray-200 transition-all shadow-sm group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "transition-transform duration-300",
                                            expandedPosition === pos.id ? "rotate-0" : "-rotate-90"
                                        )}>
                                            <ChevronDown size={20} className="text-gray-400" />
                                        </div>
                                        <span className="text-lg font-bold text-gray-900">
                                            {pos.name} <span className="text-gray-400 font-medium ml-2 text-base">({pos.candidates?.length || 0} candidates)</span>
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
                                                className="bg-black text-white px-6 h-10 rounded-md text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-4 hover:opacity-90 transition-all"
                                            >
                                                <Plus size={16} />
                                                Add candidate
                                            </button>
                                            
                                            {pos.candidates && pos.candidates.length > 0 ? (
                                                pos.candidates.map((can) => (
                                                    <div key={can.id} className="bg-white border border-gray-100 rounded-md p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                                                        <div className="space-y-1">
                                                            <h4 className="text-lg font-bold text-gray-900">
                                                                {can.student.user.firstName} {can.student.user.lastName}
                                                            </h4>
                                                            <p className="text-gray-400 text-sm font-medium">
                                                                {can.student.studentNumber}
                                                            </p>
                                                            {can.bio && (
                                                                <p className="text-gray-600 text-sm mt-2">{can.bio}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-400 text-sm text-center py-4">No candidates yet</p>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            <p className="text-lg font-medium mb-2">No positions available</p>
                            <p className="text-sm">Click "Add position" to create your first position</p>
                        </div>
                    )}
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
                positionTitle={currentElection?.positions?.find(p => p.id === targetPositionId)?.name}
            />
        </div>
    );
}
