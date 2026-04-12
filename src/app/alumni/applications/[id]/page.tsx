"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Trash2, 
  FileText, 
  Globe, 
  X,
  Paperclip,
  Building2,
  AlertCircle,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";

// --- Types (Shared) ---
type AppStatus = "Not Started" | "In Progress" | "Submitted" | "Accepted" | "Rejected";

interface Requirement {
  id: string;
  title: string;
  completed: boolean;
}

interface AppDocument {
  id: string;
  name: string;
  type: string;
}

interface Application {
  id: string;
  universityName: string;
  programName: string;
  country: string;
  applicationLink: string;
  deadline: string;
  status: AppStatus;
  requirements: Requirement[];
  documents: AppDocument[];
  createdAt: string;
}

// --- Mock Initial Data Fetching ---
// In a real app, this would come from an API or shared state
const DEFAULT_REQUIREMENTS = [
  "Personal Statement",
  "Recommendation Letters",
  "Transcripts",
  "Test Scores",
  "Application Fee"
];

const INITIAL_APPS: Application[] = [
  {
    id: "1",
    universityName: "Harvard University",
    programName: "Public Policy (MPP)",
    country: "USA",
    applicationLink: "https://www.hks.harvard.edu",
    deadline: "2026-12-01",
    status: "In Progress",
    createdAt: new Date().toISOString(),
    requirements: DEFAULT_REQUIREMENTS.map((r, i) => ({ id: `r-${i}`, title: r, completed: i < 2 })),
    documents: [{ id: "d1", name: "CV_2026.pdf", type: "CV" }]
  },
  {
    id: "2",
    universityName: "National University of Singapore",
    programName: "Computer Science (PhD)",
    country: "Singapore",
    applicationLink: "https://www.comp.nus.edu.sg",
    deadline: "2026-05-15",
    status: "Not Started",
    createdAt: new Date().toISOString(),
    requirements: DEFAULT_REQUIREMENTS.map((r, i) => ({ id: `r-${i}`, title: r, completed: false })),
    documents: []
  }
];

export default function ApplicationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [app, setApp] = useState<Application | null>(null);
  const [newRequirement, setNewRequirement] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("alumni_applications");
    if (saved) {
      const allApps = JSON.parse(saved);
      const found = allApps.find((a: Application) => a.id === id);
      if (found) setApp(found);
    }
  }, [id]);

  // Sync back to localStorage whenever 'app' changes
  useEffect(() => {
    if (app) {
      const saved = localStorage.getItem("alumni_applications");
      if (saved) {
        const allApps = JSON.parse(saved);
        const updatedApps = allApps.map((a: Application) => a.id === app.id ? app : a);
        localStorage.setItem("alumni_applications", JSON.stringify(updatedApps));
      }
    }
  }, [app]);

  if (!app) return (
    <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
       <AlertCircle size={48} className="text-gray-200" />
       <p className="text-gray-400 font-bold uppercase tracking-widest">Application not found</p>
       <Button onClick={() => router.push("/alumni/applications")} variant="outline">Back to List</Button>
    </div>
  );

  const toggleRequirement = (reqId: string) => {
    setApp(prev => prev ? {
      ...prev,
      requirements: prev.requirements.map(req => 
        req.id === reqId ? { ...req, completed: !req.completed } : req
      )
    } : null);
  };

  const addCustomRequirement = () => {
    if (!newRequirement.trim()) return;
    const req: Requirement = {
      id: Math.random().toString(36).substr(2, 9),
      title: newRequirement,
      completed: false
    };
    setApp(prev => prev ? { ...prev, requirements: [...prev.requirements, req] } : null);
    setNewRequirement("");
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // Simulate upload delay with real file name
    setTimeout(() => {
      const newDoc: AppDocument = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type.split('/')[1]?.toUpperCase() || "PDF"
      };
      setApp(prev => prev ? { ...prev, documents: [...prev.documents, newDoc] } : null);
      setIsUploading(false);
    }, 1200);
  };

  const deleteDocument = (docId: string) => {
    setApp(prev => prev ? {
      ...prev,
      documents: prev.documents.filter(d => d.id !== docId)
    } : null);
  };

  const calculateProgress = () => {
    const total = app.requirements.length;
    const completed = app.requirements.filter(r => r.completed).length;
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12 space-y-6">
      {/* Detail Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
           <button 
            onClick={() => router.push("/alumni/applications")}
            className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-black transition-all shadow-sm"
           >
              <ArrowLeft size={18} />
           </button>
           <div className="space-y-0.5">
              <h2 className="text-xl font-bold text-gray-900 leading-tight">{app.universityName}</h2>
              <div className="flex items-center gap-2 text-xs text-gray-400 font-medium italic">
                 <Building2 size={14} /> {app.programName}
              </div>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative group">
              <Filter size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black transition-colors" />
              <select 
                value={app.status}
                onChange={(e) => setApp(prev => prev ? { ...prev, status: e.target.value as AppStatus } : null)}
                className="pl-8 pr-6 py-2 bg-gray-50 rounded-xl text-[9px] font-black text-gray-900 border border-gray-100 uppercase tracking-widest outline-none focus:ring-1 focus:ring-black cursor-pointer appearance-none"
              >
                 <option value="Not Started">Not Started</option>
                 <option value="In Progress">In Progress</option>
                 <option value="Submitted">Submitted</option>
                 <option value="Accepted">Accepted</option>
                 <option value="Rejected">Rejected</option>
              </select>
           </div>
           <Link href={app.applicationLink} target="_blank">
              <Button className="bg-black text-white px-4 h-10 rounded-xl font-bold text-[9px] uppercase tracking-widest gap-2">
                 Application Portal <ExternalLink size={12} />
              </Button>
           </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         {/* Left Column: Requirements & Notes */}
         <div className="lg:col-span-7 space-y-6">
            
            {/* Checklist Section */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
               <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                     <CheckCircle2 size={16} /> Admission Checklist
                  </h4>
                  <span className="text-[10px] font-bold text-blue-600">{calculateProgress()}% Complete</span>
               </div>

               <div className="space-y-2">
                  {app.requirements.map(req => (
                    <div 
                      key={req.id} 
                      onClick={() => toggleRequirement(req.id)}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group",
                        req.completed ? "bg-gray-50/50 border-transparent" : "bg-white border-gray-100 hover:border-black"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all",
                          req.completed ? "bg-black border-black text-white" : "border-gray-200 group-hover:border-black"
                        )}>
                          {req.completed && <CheckCircle2 size={12} />}
                        </div>
                        <span className={cn("text-xs font-bold", req.completed ? "text-gray-300 line-through italic" : "text-gray-700")}>
                          {req.title}
                        </span>
                      </div>
                    </div>
                  ))}
               </div>

               {/* Add Custom Requirement Input */}
               <div className="pt-2 flex items-center gap-2">
                  <div className="relative flex-1">
                     <Plus className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                     <input 
                      type="text" 
                      placeholder="Add custom task..." 
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCustomRequirement()}
                      className="w-full h-10 bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 text-xs font-medium outline-none focus:ring-1 focus:ring-black transition-all"
                     />
                  </div>
                  <Button onClick={addCustomRequirement} className="bg-gray-900 text-white h-10 px-4 rounded-xl font-bold text-[9px] uppercase">Add Step</Button>
               </div>
            </div>

            {/* Notes Section Placeholder */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
               <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                  <FileText size={16} /> Internal Notes
               </h4>
               <textarea 
                className="w-full h-32 bg-gray-50 border border-gray-100 rounded-xl p-4 text-xs font-medium text-gray-600 outline-none focus:ring-1 focus:ring-black resize-none"
                placeholder="Log interview dates, faculty names, or specific submission queries..."
               />
            </div>
         </div>

         {/* Right Column: Files & Metadata */}
         <div className="lg:col-span-5 space-y-6">
            
            {/* Document Manager */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
               <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                     <Paperclip size={16} /> Documents
                  </h4>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                  />
                  <button 
                    onClick={handleFileUpload}
                    disabled={isUploading}
                    className="text-[9px] font-bold text-blue-600 uppercase tracking-widest hover:text-black transition-all flex items-center gap-1.5"
                  >
                     {isUploading ? <Clock size={10} className="animate-spin" /> : <Plus size={10} />}
                     {isUploading ? "Uploading..." : "Upload File"}
                  </button>
               </div>

               <div className="space-y-2">
                  {app.documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl group/doc">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-400">
                             <FileText size={16} />
                          </div>
                          <div>
                             <p className="text-[11px] font-bold text-gray-900 truncate max-w-[120px]">{doc.name}</p>
                             <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{doc.type}</p>
                          </div>
                       </div>
                       <button onClick={() => deleteDocument(doc.id)} className="text-gray-300 hover:text-rose-500 transition-colors opacity-0 group-hover/doc:opacity-100">
                          <Trash2 size={14} />
                       </button>
                    </div>
                  ))}
                  {app.documents.length === 0 && !isUploading && (
                    <div className="py-6 text-center border-2 border-dashed border-gray-50 rounded-xl">
                       <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">No documents attached</p>
                    </div>
                  )}
                  {isUploading && (
                    <div className="h-[56px] border-2 border-dashed border-blue-100 bg-blue-50/20 rounded-xl flex items-center justify-center animate-pulse">
                       <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Uploading encrypted file...</span>
                    </div>
                  )}
               </div>
            </div>

            {/* Quick Stats Sidebar */}
            <div className="bg-gray-900 text-white rounded-2xl p-6 space-y-4 shadow-xl">
               <div className="space-y-0.5">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Institutional Context</h4>
                  <p className="text-base font-bold uppercase tracking-tight">{app.country} Admissions</p>
               </div>
               
               <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                     <span className="text-[9px] font-bold text-gray-400 uppercase">Country</span>
                     <span className="text-[9px] font-bold uppercase">{app.country}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                     <span className="text-[9px] font-bold text-gray-400 uppercase">Deadline</span>
                     <span className="text-[9px] font-bold uppercase">{new Date(app.deadline).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-[9px] font-bold text-gray-400 uppercase">Created On</span>
                     <span className="text-[9px] font-bold uppercase">{new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>
               </div>

               <Button className="w-full h-10 bg-white text-black hover:bg-rose-500 hover:text-white rounded-xl font-black text-[9px] uppercase tracking-widest transition-all">
                  Withdraw Application
               </Button>
            </div>
         </div>
      </div>
    </div>
  );
}
