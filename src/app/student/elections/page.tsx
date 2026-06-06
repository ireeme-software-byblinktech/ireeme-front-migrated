"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  CheckSquare, Clock, AlertCircle, Award, 
  User, Check, ChevronLeft, ChevronRight, Loader2, CheckCircle2
} from "lucide-react";
import { electionsApi } from "@/lib/api/elections";
import { toast } from "@/lib/utils/toast";
import { cn } from "@/lib/utils";

// Import types from API
import type { Election } from "@/lib/api/elections";

export default function StudentElectionsPage() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Fetch active elections
  const { data: elections, isLoading } = useQuery({
    queryKey: ["student-elections"],
    queryFn: async () => {
      const data = await electionsApi.getElections();
      return data.filter((e: Election) => e.status === "ACTIVE" || (e.status === "CLOSED" && e.resultsPublished));
    },
  });

  const activeElection = elections?.[0];

  // Check voting status
  const { data: votingStatus, isLoading: isLoadingStatus } = useQuery({
    queryKey: ["voting-status", activeElection?.id],
    queryFn: async () => {
      if (!activeElection?.id) return null;
      return await electionsApi.getVotingStatus(activeElection.id);
    },
    enabled: !!activeElection?.id && activeElection.status === "ACTIVE",
  });

  // Fetch results if election is closed and results are published
  const { data: resultsData, isLoading: isLoadingResults } = useQuery({
    queryKey: ["election-results", activeElection?.id],
    queryFn: async () => {
      if (!activeElection?.id) return null;
      return await electionsApi.getResults(activeElection.id);
    },
    enabled: !!activeElection?.id && activeElection.status === "CLOSED" && activeElection.resultsPublished,
  });

  // Vote mutation
  const queryClient = useQueryClient();
  
  const voteMutation = useMutation({
    mutationFn: async (voteData: { positionId: string; candidateId: string }[]) => {
      // Call vote API for each position
      for (const vote of voteData) {
        await electionsApi.castVote(vote);
      }
    },
    onSuccess: () => {
      setIsConfirmModalOpen(false);
      toast.success("Your votes have been recorded successfully!");
      // Refetch voting status
      queryClient.invalidateQueries({ queryKey: ["voting-status", activeElection?.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit votes");
    },
  });

  const positionsData = activeElection?.positions || [];
  
  const currentPosition = positionsData[currentStepIndex];
  const selectedCandidateId = currentPosition ? votes[currentPosition.id] : undefined;
  
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === positionsData.length - 1;
  const progressPercent = positionsData.length > 0 ? Math.round(((currentStepIndex + 1) / positionsData.length) * 100) : 0;

  const handleNext = () => {
    if (isLastStep) {
      setIsConfirmModalOpen(true);
    } else {
      setCurrentStepIndex(curr => curr + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(curr => curr - 1);
    }
  };

  const submitVotes = () => {
    const voteData = Object.entries(votes).map(([positionId, candidateId]) => ({
      positionId,
      candidateId,
    }));
    voteMutation.mutate(voteData);
  };

  if (isLoading || isLoadingStatus) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  if (!activeElection) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-[1240px]">
        <div className="bg-white border border-gray-100 shadow-2xl shadow-gray-200/50 rounded-3xl p-10 md:p-14 max-w-xl w-full text-center">
          <div className="w-24 h-24 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckSquare size={44} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">No Active Elections</h1>
          <p className="text-lg text-gray-500 max-w-sm mx-auto mb-10 leading-relaxed font-medium">
            There are currently no elections open for voting. Please check back later.
          </p>
          <button 
            onClick={() => window.location.href = '/student'}
            className="bg-black text-white px-8 py-4 rounded-xl font-bold text-sm shadow-md hover:bg-gray-800 transition-all w-full sm:w-auto min-w-[200px]"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Show results if election is closed and results are published
  if (activeElection.status === "CLOSED" && activeElection.resultsPublished) {
    return (
      <div className="space-y-6 max-w-[1240px] w-full pb-12">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Election Results</h1>
        </div>

        {/* Header Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <Award size={32} className="text-gray-900" strokeWidth={2.5} />
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">{activeElection.title}</h1>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 text-gray-700 font-bold px-4 py-2 rounded-full text-sm shrink-0">
              <div className="w-2 h-2 rounded-full bg-gray-700"></div>
              Voting Closed
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoadingResults ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-black" />
          </div>
        ) : resultsData ? (
          <div className="space-y-6">
            {resultsData.positions.map((position) => (
              <div key={position.positionId} className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-gray-900">{position.positionTitle}</h4>
                  <span className="text-sm font-bold text-gray-500">
                    Total Votes: {position.totalVotes}
                  </span>
                </div>
                
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
                            {isWinner && (
                              <div className="w-8 h-8 bg-[#008A44] text-white rounded-full flex items-center justify-center">
                                <CheckCircle2 size={18} />
                              </div>
                            )}
                            <div>
                              <h5 className="text-lg font-bold text-gray-900">
                                {candidate.studentName}
                              </h5>
                              {isWinner && (
                                <span className="text-xs font-bold text-[#008A44] uppercase">
                                  Winner
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
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  // Show "already voted" message if student has voted
  if (votingStatus?.hasVoted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-[1240px]">
        <div className="bg-white border border-gray-100 shadow-2xl shadow-gray-200/50 rounded-3xl p-10 md:p-14 max-w-xl w-full text-center relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-100 rounded-full blur-3xl -mr-32 -mt-32 opacity-40 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-100 rounded-full blur-3xl -ml-24 -mb-24 opacity-40 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            {/* Highlight bubble around icon */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-25"></div>
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-inner relative z-10">
                <CheckSquare size={44} className="text-green-600" strokeWidth={2.5} />
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Ballot Received!</h1>
            <p className="text-lg text-gray-500 max-w-sm mx-auto mb-10 leading-relaxed font-medium">
              Your votes for the {activeElection.title} have been securely recorded. Thank you for making your voice heard.
            </p>
            
            <button 
              onClick={() => window.location.href = '/student'}
              className="bg-black text-white px-8 py-4 rounded-xl font-bold text-sm shadow-md hover:bg-gray-800 transition-all w-full sm:w-auto min-w-[200px]"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1240px] w-full pb-12">
      
      {/* Header Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <CheckSquare size={32} className="text-gray-900" strokeWidth={2.5} />
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">{activeElection.title}</h1>
          </div>
          <div className="flex items-center gap-2 bg-[#E6F8EE] text-[#008A3D] font-bold px-4 py-2 rounded-full text-sm shrink-0">
            <div className="w-2 h-2 rounded-full bg-[#008A3D]"></div>
            Voting Open
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-gray-500">
          {activeElection.endAt && (
            <div className="flex items-center gap-2">
              <Clock size={16} />
              Ends {new Date(activeElection.endAt).toLocaleDateString()}
            </div>
          )}
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            Only one vote per position
          </div>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between font-extrabold text-[15px] text-[#4F566B] mb-4">
          <span>Step {currentStepIndex + 1} of {positionsData.length}</span>
          <span>{progressPercent}% Complete</span>
        </div>
        
        {/* Thick Progress Line */}
        <div className="w-full bg-[#EAECEF] h-3 rounded-full mb-8">
          <div 
            className="bg-black h-full transition-all duration-500 rounded-full" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        
        {/* Nodes */}
        <div className="flex justify-between items-start px-2 sm:px-8">
          {positionsData.map((pos, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            
            return (
              <div key={pos.id} className="flex flex-col items-center gap-3 w-16">
                {isCurrent || isCompleted ? (
                  <div className="w-[42px] h-[42px] rounded-full flex items-center justify-center font-bold text-base bg-black text-white ring-[6px] ring-[#F1F3F5] shadow-sm">
                    {isCompleted ? <Check size={20} strokeWidth={3} /> : idx + 1}
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-base bg-[#EAECEF] text-[#868C98]">
                    {idx + 1}
                  </div>
                )}
                <span className={`text-[13px] font-bold ${isCurrent || isCompleted ? 'text-gray-600' : 'text-[#868C98]'}`}>
                  {pos.name ? pos.name.split(' ')[0] : 'Position'} {/* Head, Deputy, Class, Sports */}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Position Voting Block */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Black Header */}
        <div className="bg-black text-white p-6 md:p-8">
          <div className="flex items-center gap-3 mb-2">
            <Award size={28} />
            <h2 className="text-2xl font-extrabold">{currentPosition.name}</h2>
            <span className="bg-blue-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-md ml-2 tracking-wider">
              Required
            </span>
          </div>
          <p className="text-gray-400 text-sm md:text-base font-medium">
            Select your preferred candidate for this position
          </p>
        </div>

        {/* Form Content */}
        <div className="p-6 md:p-8 space-y-4">
          {currentPosition.candidates.map((candidate) => {
            const isSelected = selectedCandidateId === candidate.id;
            const candidateName = `${candidate.student.user.firstName} ${candidate.student.user.lastName}`;
            
            return (
              <label 
                key={candidate.id} 
                className={`block relative border rounded-xl p-5 md:p-6 cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-gray-900 bg-gray-50/50 shadow-sm' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Custom Radio Button */}
                  <div className={`w-6 h-6 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? 'border-gray-900' : 'border-gray-300'
                  }`}>
                    {isSelected && <div className="w-3 h-3 bg-gray-900 rounded-full" />}
                  </div>
                  
                  {/* Candidate Info */}
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-2 mb-1">
                      <User size={20} className="text-gray-500" />
                      <h3 className="text-xl font-bold text-gray-900">{candidateName}</h3>
                    </div>
                    <p className="text-sm font-bold text-gray-500 mb-4 ml-7">
                      Student ID: {candidate.student.studentNumber}
                    </p>
                    
                    {/* Bio styled box */}
                    {candidate.bio && (
                      <div className="ml-7 bg-gray-100/80 rounded-lg p-5 border-l-[6px] border-black text-gray-700 italic font-medium leading-relaxed">
                        "{candidate.bio}"
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Hidden native input */}
                <input 
                  type="radio" 
                  name={currentPosition.id} 
                  value={candidate.id}
                  checked={isSelected}
                  onChange={() => setVotes({ ...votes, [currentPosition.id]: candidate.id })}
                  className="hidden" 
                />
              </label>
            );
          })}
        </div>
        
        {/* Bottom Actions */}
        <div className="p-6 md:p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button 
            onClick={handlePrev}
            disabled={isFirstStep}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-colors ${
              isFirstStep 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-70' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 shadow-sm'
            }`}
          >
            <ChevronLeft size={18} />
            Previous
          </button>
          
          {!selectedCandidateId ? (
            <span className="text-red-500 font-bold text-sm hidden md:block">
              Please select a candidate to continue
            </span>
          ) : (
            <span className="text-gray-500 font-bold text-sm hidden md:block">
              Selection recorded! Auto-saved.
            </span>
          )}

          <button 
            onClick={handleNext}
            disabled={!selectedCandidateId || voteMutation.isPending}
            className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold text-sm transition-colors ${
              !selectedCandidateId || voteMutation.isPending
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-70'
                : 'bg-black text-white hover:bg-gray-800 shadow-sm'
            }`}
          >
            {voteMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLastStep ? 'Submit Votes' : 'Next'}
            {!isLastStep && <ChevronRight size={18} />}
          </button>
        </div>
      </div>

      {/* Confirm Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsConfirmModalOpen(false)}></div>
          <div className="bg-white rounded-xl shadow-2xl relative z-10 w-full max-w-lg overflow-hidden flex flex-col pt-8 pb-6 px-8 text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckSquare size={32} strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Submit Your Ballot?</h2>
            <p className="text-gray-500 font-medium mb-8">
              You are about to cast your vote for {positionsData.length} positions. You will not be able to change your votes once submitted.
            </p>
            
            <div className="flex gap-4 w-full">
              <button 
                onClick={() => setIsConfirmModalOpen(false)}
                className="flex-1 px-4 py-3 rounded-lg font-bold border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Go Back
              </button>
              <button 
                onClick={submitVotes}
                className="flex-1 px-4 py-3 rounded-lg font-bold bg-black text-white hover:bg-gray-800 shadow-sm"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

