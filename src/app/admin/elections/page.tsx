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
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { AddPositionModal } from "@/components/ui/AddPositionModal";
import { AddCandidateModal } from "@/components/ui/AddCandidateModal";
import { electionsApi } from "@/lib/api/elections";
import { toast } from "@/lib/utils/toast";

export default function AdminElectionsPage() {
    const queryClient = useQueryClient();
    const [expandedPosition, setExpandedPosition] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"positions" | "results">("positions");
    
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

    // Fetch results when on results tab
    const { data: resultsData, isLoading: isLoadingResults } = useQuery({
        queryKey: ["election-results", currentElection?.id],
        queryFn: async () => {
            if (!currentElection?.id) return null;
            return await electionsApi.getResults(currentElection.id);
        },
        enabled: activeTab === "results" && !!currentElection?.id,
    });

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
                            {currentElection?.status === "ACTIVE" ? (
                                <Button
                                    onClick={handleCloseVoting}
                                    disabled={closeVotingMutation.isPending}
                                    className="bg-[#EE1D23] text-white hover:bg-red-700 px-6 py-2 rounded-md text-sm font-bold flex items-center gap-2"
                                >
                                    {closeVotingMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                    <XCircle size={16} />
                                    Close Voting
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleOpenVoting}
                                    disabled={openVotingMutation.isPending}
                                    className="bg-[#008A44] text-white hover:bg-green-700 px-6 py-2 rounded-md text-sm font-bold flex items-center gap-2"
                                >
                                    {openVotingMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                    <CheckCircle2 size={16} />
                                    Launch Voting
                                </Button>
                            )}
                            
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
                        <button 
                            onClick={() => setActiveTab("positions")}
                            className={cn(
                                "h-14 rounded-md text-base font-bold tracking-wide transition-all flex items-center justify-center gap-3",
                                activeTab === "positions" 
                                    ? "bg-black text-white" 
                                    : "bg-white text-gray-900 border-2 border-gray-100 hover:border-black"
                            )}
                        >
                            Manage Election
                        </button>
                        <button 
                            onClick={() => setActiveTab("results")}
                            className={cn(
                                "h-14 rounded-md text-base font-bold tracking-wide transition-all flex items-center justify-center gap-3",
                                activeTab === "results" 
                                    ? "bg-black text-white" 
                                    : "bg-white text-gray-900 border-2 border-gray-100 hover:border-black"
                            )}
                        >
                            View Results & Stats
                        </button>
                    </div>
                </CardBody>
            </Card>

            {/* Election Settings */}
            {activeTab === "positions" && (
                <>
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
                </>
            )}

            {/* Results Section */}
            {activeTab === "results" && (
                <Card className="border-none shadow-[0_2px_15px_rgba(0,0,0,0.04)]">
                    <CardBody className="p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Election Results</h3>
                        
                        {isLoadingResults ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-black" />
                            </div>
                        ) : resultsData ? (
                            <div className="space-y-8">
                                {/* Publish/Unpublish Results Button */}
                                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Results Visibility</h4>
                                        <p className="text-sm text-gray-600">
                                            {currentElection?.resultsPublished 
                                                ? "Results are currently visible to students" 
                                                : "Results are hidden from students"}
                                        </p>
                                    </div>
                                    {currentElection?.resultsPublished ? (
                                        <Button
                                            onClick={() => {
                                                if (!currentElection?.id) return;
                                                electionsApi.unpublishResults(currentElection.id)
                                                    .then(() => {
                                                        queryClient.invalidateQueries({ queryKey: ["elections"] });
                                                        toast.success("Results unpublished successfully");
                                                    })
                                                    .catch((error: Error) => {
                                                        toast.error(error.message || "Failed to unpublish results");
                                                    });
                                            }}
                                            className="bg-gray-600 text-white hover:bg-gray-700 px-6 py-2 rounded-md text-sm font-bold flex items-center gap-2"
                                        >
                                            <XCircle size={16} />
                                            Hide Results from Students
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => {
                                                if (!currentElection?.id) return;
                                                electionsApi.publishResults(currentElection.id)
                                                    .then(() => {
                                                        queryClient.invalidateQueries({ queryKey: ["elections"] });
                                                        toast.success("Results published successfully");
                                                    })
                                                    .catch((error: Error) => {
                                                        toast.error(error.message || "Failed to publish results");
                                                    });
                                            }}
                                            className="bg-[#008A44] text-white hover:bg-green-700 px-6 py-2 rounded-md text-sm font-bold flex items-center gap-2"
                                        >
                                            <CheckCircle2 size={16} />
                                            Publish Results to Students
                                        </Button>
                                    )}
                                </div>

                                {resultsData.positions.map((position) => {
                                    // Prepare data for pie chart
                                    const pieData = position.candidates.map((candidate) => ({
                                        name: candidate.studentName,
                                        value: candidate.voteCount,
                                        percentage: candidate.percentage,
                                    }));

                                    // Color palette for pie chart
                                    const COLORS = ['#008A44', '#EE1D23', '#FFB800', '#0066CC', '#9333EA', '#EC4899', '#14B8A6', '#F97316'];

                                    return (
                                        <div key={position.positionId} className="bg-white border border-gray-100 rounded-lg p-6">
                                            <div className="flex items-center justify-between mb-6">
                                                <h4 className="text-xl font-bold text-gray-900">{position.positionTitle}</h4>
                                                <span className="text-sm font-bold text-gray-500">
                                                    Total Votes: {position.totalVotes}
                                                </span>
                                            </div>
                                            
                                            {/* Grid layout: Pie chart on left, candidate list on right */}
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                {/* Pie Chart */}
                                                <div className="flex flex-col items-center justify-center">
                                                    {position.totalVotes > 0 ? (
                                                        <>
                                                            <ResponsiveContainer width="100%" height={300}>
                                                                <PieChart>
                                                                    <Pie
                                                                        data={pieData}
                                                                        cx="50%"
                                                                        cy="50%"
                                                                        labelLine={false}
                                                                        label={(props: any) => `${props.percentage.toFixed(1)}%`}
                                                                        outerRadius={100}
                                                                        fill="#8884d8"
                                                                        dataKey="value"
                                                                    >
                                                                        {pieData.map((entry, index) => (
                                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                                        ))}
                                                                    </Pie>
                                                                    <Tooltip 
                                                                        formatter={(value: any) => [`${value} votes`, 'Votes']}
                                                                        contentStyle={{
                                                                            backgroundColor: 'white',
                                                                            border: '1px solid #e5e7eb',
                                                                            borderRadius: '8px',
                                                                            padding: '8px 12px'
                                                                        }}
                                                                    />
                                                                    <Legend 
                                                                        verticalAlign="bottom" 
                                                                        height={36}
                                                                        formatter={(value: any) => <span className="text-sm font-medium text-gray-700">{value}</span>}
                                                                    />
                                                                </PieChart>
                                                            </ResponsiveContainer>
                                                        </>
                                                    ) : (
                                                        <div className="flex items-center justify-center h-[300px] text-gray-400">
                                                            <p className="text-sm font-medium">No votes cast yet</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Candidate List */}
                                                <div className="space-y-3">
                                                    {position.candidates.map((candidate, index) => {
                                                        const isWinner = index === 0;
                                                        return (
                                                            <div 
                                                                key={candidate.candidateId} 
                                                                className={cn(
                                                                    "border rounded-lg p-4 transition-all",
                                                                    isWinner ? "border-[#008A44] bg-green-50/50" : "border-gray-200"
                                                                )}
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-3">
                                                                        <div 
                                                                            className="w-4 h-4 rounded-full flex-shrink-0" 
                                                                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                                        />
                                                                        {isWinner && (
                                                                            <div className="w-8 h-8 bg-[#008A44] text-white rounded-full flex items-center justify-center flex-shrink-0">
                                                                                <CheckCircle2 size={18} />
                                                                            </div>
                                                                        )}
                                                                        <div>
                                                                            <h5 className="text-lg font-bold text-gray-900">
                                                                                {candidate.studentName}
                                                                            </h5>
                                                                            {isWinner && (
                                                                                <span className="text-xs font-bold text-[#008A44] uppercase">
                                                                                    Leading
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <div className="text-2xl font-bold text-gray-900">
                                                                            {candidate.voteCount}
                                                                        </div>
                                                                        <div className="text-sm font-bold text-gray-500">
                                                                            {candidate.percentage.toFixed(1)}%
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-400">
                                <p className="text-lg font-medium">No results available yet</p>
                            </div>
                        )}
                    </CardBody>
                </Card>
            )}

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
