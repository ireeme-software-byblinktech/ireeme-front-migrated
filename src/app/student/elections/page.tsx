"use client";

import { useState } from "react";
import { 
  CheckSquare, Clock, AlertCircle, Award, 
  User, Check, ChevronLeft, ChevronRight, CheckCircle2
} from "lucide-react";

// Types
interface Candidate {
  id: string;
  name: string;
  className: string;
  quote: string;
}

interface ElectionPosition {
  id: string;
  title: string;
  description: string;
  required: boolean;
  candidates: Candidate[];
}

// Data
const positionsData: ElectionPosition[] = [
  {
    id: "head",
    title: "Head Prefect",
    description: "Lead the student body and represent students to administration",
    required: true,
    candidates: [
      { id: "c1", name: "John Doe", className: "S5 MCB", quote: "I will promote discipline and unity among students, ensuring every voice is heard and creating a more inclusive school environment." },
      { id: "c2", name: "Jane Smith", className: "S5 PCM", quote: "I will represent students fairly and work towards better communication with administration for positive change." }
    ]
  },
  {
    id: "deputy",
    title: "Deputy Head Prefect",
    description: "Assist the Head Prefect in coordinating student council activities",
    required: true,
    candidates: [
      { id: "c3", name: "Alice Brown", className: "S4 PCB", quote: "Empowering every student to reach their full potential." },
      { id: "c4", name: "Bob Wilson", className: "S4 MEG", quote: "Building a supportive and engaging campus community." }
    ]
  },
  {
    id: "class",
    title: "Class Representative",
    description: "Represent your graduating class in committee meetings",
    required: true,
    candidates: [
      { id: "c5", name: "Michael Lee", className: "S5 MCB", quote: "Dedicated to academic excellence and student well-being." },
      { id: "c6", name: "Sarah Connor", className: "S5 MCB", quote: "Ready to take action on the issues that matter most." }
    ]
  },
  {
    id: "sports",
    title: "Sports Minister",
    description: "Organize inter-school tournaments and athletic events",
    required: true,
    candidates: [
      { id: "c7", name: "David Kim", className: "S4 Math", quote: "Sports build character. I'll make sure everyone has a chance to play." },
      { id: "c8", name: "Emily Chen", className: "S5 Physics", quote: "Leveling up our athletic programs and school spirit!" }
    ]
  }
];

export default function StudentElectionsPage() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const currentPosition = positionsData[currentStepIndex];
  const selectedCandidateId = votes[currentPosition.id];
  
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === positionsData.length - 1;
  const progressPercent = Math.round(((currentStepIndex + 1) / positionsData.length) * 100);

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
    // In a real app, send votes to backend here
    setIsConfirmModalOpen(false);
    setHasVoted(true);
  };

  if (hasVoted) {
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
              Your votes for the 2025 Student Council Elections have been securely recorded. Thank you for making your voice heard.
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
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Student Council Elections 2025</h1>
          </div>
          <div className="flex items-center gap-2 bg-[#E6F8EE] text-[#008A3D] font-bold px-4 py-2 rounded-full text-sm shrink-0">
            <div className="w-2 h-2 rounded-full bg-[#008A3D]"></div>
            Voting Open
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-gray-500">
          <div className="flex items-center gap-2">
            <Clock size={16} />
            Ends in 2 days
          </div>
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
                  {pos.title.split(' ')[0]} {/* Head, Deputy, Class, Sports */}
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
            <h2 className="text-2xl font-extrabold">{currentPosition.title}</h2>
            {currentPosition.required && (
              <span className="bg-blue-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-md ml-2 tracking-wider">
                Required
              </span>
            )}
          </div>
          <p className="text-gray-400 text-sm md:text-base font-medium">
            {currentPosition.description}
          </p>
        </div>

        {/* Form Content */}
        <div className="p-6 md:p-8 space-y-4">
          {currentPosition.candidates.map((candidate) => {
            const isSelected = selectedCandidateId === candidate.id;
            
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
                      <h3 className="text-xl font-bold text-gray-900">{candidate.name}</h3>
                    </div>
                    <p className="text-sm font-bold text-gray-500 mb-4 ml-7">
                      Class: {candidate.className}
                    </p>
                    
                    {/* Quote styled box */}
                    <div className="ml-7 bg-gray-100/80 rounded-lg p-5 border-l-[6px] border-black text-gray-700 italic font-medium leading-relaxed">
                      "{candidate.quote}"
                    </div>
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
            disabled={!selectedCandidateId}
            className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold text-sm transition-colors ${
              !selectedCandidateId
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-70'
                : 'bg-black text-white hover:bg-gray-800 shadow-sm'
            }`}
          >
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