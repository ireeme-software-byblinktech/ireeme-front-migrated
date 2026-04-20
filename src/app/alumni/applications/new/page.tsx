"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Plus, 
  Building2, 
  Globe, 
  Calendar, 
  Link as LinkIcon,
  CheckCircle2,
  Trash2,
  X,
  GraduationCap,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/Button";

type AppStatus = "Not Started" | "In Progress" | "Submitted" | "Accepted" | "Rejected";

export default function NewApplicationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    universityName: "",
    programName: "",
    country: "",
    applicationLink: "",
    deadline: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newApp = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      status: "Not Started" as const,
      createdAt: new Date().toISOString(),
      requirements: [
        "Personal Statement",
        "Recommendation Letters",
        "Transcripts",
        "Test Scores",
        "Application Fee"
      ].map((title, i) => ({
        id: `r-${Math.random().toString(36).substr(2, 4)}-${i}`,
        title,
        completed: false
      })),
      documents: []
    };

    const saved = localStorage.getItem("alumni_applications");
    const currentApps = saved ? JSON.parse(saved) : [];
    const updatedApps = [newApp, ...currentApps];
    
    localStorage.setItem("alumni_applications", JSON.stringify(updatedApps));
    
    router.push("/alumni/applications");
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-black transition-all shadow-sm"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="space-y-0.5">
          <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase italic flex items-center gap-2">
             <Plus className="text-blue-600" size={20} /> Add New Intent
          </h2>
          <p className="text-xs font-medium text-gray-400 italic">Initialize a new academic tracking file for your admission process.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         {/* Form Section */}
         <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                     <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Target University</label>
                     <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                        <input 
                           required
                           type="text" 
                           placeholder="e.g. University of Tokyo" 
                           className="w-full h-10 bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 text-xs font-bold outline-none focus:ring-1 focus:ring-black transition-all"
                           value={formData.universityName}
                           onChange={(e) => setFormData({...formData, universityName: e.target.value})}
                        />
                     </div>
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Target Country</label>
                     <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                        <input 
                           required
                           type="text" 
                           placeholder="e.g. Japan" 
                           className="w-full h-10 bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 text-xs font-bold outline-none focus:ring-1 focus:ring-black transition-all"
                           value={formData.country}
                           onChange={(e) => setFormData({...formData, country: e.target.value})}
                        />
                     </div>
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                     <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Academic Program</label>
                     <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                        <input 
                           required
                           type="text" 
                           placeholder="e.g. Masters in Data Science" 
                           className="w-full h-10 bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 text-xs font-bold outline-none focus:ring-1 focus:ring-black transition-all"
                           value={formData.programName}
                           onChange={(e) => setFormData({...formData, programName: e.target.value})}
                        />
                     </div>
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Application Portal URL</label>
                     <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                        <input 
                           type="url" 
                           placeholder="https://admissions..." 
                           className="w-full h-10 bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 text-xs font-bold outline-none focus:ring-1 focus:ring-black transition-all"
                           value={formData.applicationLink}
                           onChange={(e) => setFormData({...formData, applicationLink: e.target.value})}
                        />
                     </div>
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Submission Deadline</label>
                     <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                        <input 
                           required
                           type="date" 
                           className="w-full h-10 bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 text-xs font-bold outline-none focus:ring-1 focus:ring-black transition-all"
                           value={formData.deadline}
                           onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                        />
                     </div>
                  </div>
               </div>

               <div className="pt-3">
                  <Button type="submit" className="w-full h-12 bg-black text-white hover:bg-blue-600 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl transition-all border-none">
                     Create Tracking File
                  </Button>
               </div>
            </form>
         </div>

         {/* Info Sidebar */}
         <div className="lg:col-span-4 space-y-4">
            <div className="bg-gray-900 text-white rounded-2xl p-6 space-y-4 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12">
                  <Sparkles size={60} />
               </div>
               <h4 className="text-base font-bold uppercase italic tracking-tighter">Automated Setup</h4>
               <p className="text-[10px] font-medium text-gray-400 leading-relaxed italic">Linking a university will automatically initialize your Admission Checklist with the institutional standards.</p>
               <ul className="space-y-2.5 pt-2">
                  {[
                    "Personal Statement",
                    "Letters of Recommendation",
                    "IELTS/TOEFL Scores",
                    "Degree Transcript",
                    "Application Fee Track"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-gray-300">
                       <CheckCircle2 size={12} className="text-blue-500" /> {item}
                    </li>
                  ))}
               </ul>
            </div>

            <div className="p-5 border border-gray-100 rounded-2xl space-y-2.5 bg-gray-50/50">
               <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Privacy Note</h4>
               <p className="text-[9px] font-medium text-gray-400 leading-relaxed italic">All documents uploaded to your admission tracking file are encrypted and only accessible through your legacy portal.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
