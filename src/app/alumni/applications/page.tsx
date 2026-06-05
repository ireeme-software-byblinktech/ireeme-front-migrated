"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Plus, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink, 
  Trash2, 
  FileText, 
  Globe, 
  X,
  ChevronRight,
  MoreVertical,
  Paperclip,
  ArrowRight,
  Building2,
  Search,
  Filter,
  ArrowUpDown
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- Types ---
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
  deadline: string; // ISO format
  status: AppStatus;
  requirements: Requirement[];
  documents: AppDocument[];
  createdAt: string;
}

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

export default function ApplicationDashboard() {
  const router = useRouter();
  const [apps, setApps] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<AppStatus | "All">("All");
  const [sortBy, setSortBy] = useState<"newest" | "deadline">("newest");

  useEffect(() => {
    const saved = localStorage.getItem("alumni_applications");
    if (saved) {
      setApps(JSON.parse(saved));
    } else {
      setApps(INITIAL_APPS);
      localStorage.setItem("alumni_applications", JSON.stringify(INITIAL_APPS));
    }
  }, []);

  const filteredApps = useMemo(() => {
    return apps
      .filter(app => {
        const matchesSearch = app.universityName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             app.programName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "All" || app.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === "deadline") return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        return 0;
      });
  }, [apps, searchTerm, statusFilter, sortBy]);

  const getDeadlineInfo = (deadlineStr: string) => {
    const deadline = new Date(deadlineStr);
    const today = new Date();
    const diff = deadline.getTime() - today.getTime();
    const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return { text: "Expired", color: "text-gray-400 bg-gray-50" };
    if (daysLeft <= 7) return { text: `${daysLeft} days left`, color: "text-rose-600 bg-rose-50" };
    if (daysLeft <= 30) return { text: `${daysLeft} days left`, color: "text-amber-600 bg-amber-50" };
    return { text: `${daysLeft} days left`, color: "text-emerald-600 bg-emerald-50" };
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-10">
      {/* Standard Portal Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-100">
         <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">University Trackers</h1>
            <p className="text-sm font-medium text-gray-400">Centralize and advance your global university applications.</p>
         </div>
         <Link href="/alumni/applications/new">
            <Button className="h-11 bg-black text-white hover:bg-emerald-600 rounded-xl px-6 text-xs font-bold uppercase tracking-widest gap-2 shadow-lg transition-all">
               <Plus size={16} /> New Application
            </Button>
         </Link>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white border border-gray-100 p-4 rounded-[32px] shadow-sm">
         <div className="flex flex-1 items-center gap-4 w-full">
            <div className="relative flex-1 group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={16} />
               <input 
                type="text" 
                placeholder="Search university or program..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 bg-gray-50 border border-gray-50 rounded-2xl pl-12 pr-6 text-xs font-bold outline-none focus:ring-1 focus:ring-black transition-all"
               />
            </div>
            
            <div className="relative group">
               <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
               <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="pl-11 pr-10 h-12 bg-gray-50 border border-gray-50 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-1 focus:ring-black cursor-pointer appearance-none min-w-[160px]"
               >
                  <option value="All">All Statuses</option>
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
               </select>
            </div>

            <div className="relative group">
               <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
               <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="pl-11 pr-10 h-12 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-1 focus:ring-black cursor-pointer appearance-none min-w-[160px]"
               >
                  <option value="newest">Newest First</option>
                  <option value="deadline">Next Deadline</option>
               </select>
            </div>
         </div>
      </div>

      {apps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredApps.map((app) => (
            <div 
              key={app.id}
              onClick={() => router.push(`/alumni/applications/${app.id}`)}
              className="bg-white border border-gray-100 p-8 rounded-[40px] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest",
                    app.status === "In Progress" ? "bg-amber-50 text-amber-500 shadow-sm shadow-amber-100" :
                    app.status === "Not Started" ? "bg-gray-50 text-gray-400" : 
                    app.status === "Accepted" ? "bg-emerald-50 text-emerald-500" : "bg-blue-50 text-blue-500"
                  )}>
                    {app.status}
                  </span>
                  <div className={cn("px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5", getDeadlineInfo(app.deadline).color)}>
                    <Clock size={12} /> {getDeadlineInfo(app.deadline).text}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-black text-gray-900 leading-tight uppercase italic">{app.universityName}</h3>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                    <Globe size={14} /> {app.country} / {app.programName}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-gray-300">
                    <span>Admissibility Readiness</span>
                    <span className="text-black">{app.requirements.filter(r => r.completed).length}/{app.requirements.length}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-black transition-all duration-1000" 
                      style={{ width: `${(app.requirements.filter(r => r.completed).length / app.requirements.length) * 100}%` }} 
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                   <div className="flex items-center gap-3 text-gray-200 group-hover:text-black transition-colors">
                      <FileText size={18} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Archive Details</span>
                   </div>
                   <ArrowRight size={20} className="text-gray-200 group-hover:text-black group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          ))}
          {filteredApps.length === 0 && (
            <div className="col-span-full py-20 text-center space-y-4 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-100">
               <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-200 mx-auto shadow-sm">
                  <Search size={32} />
               </div>
               <div className="space-y-1">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No matching applications</p>
                  <p className="text-[10px] text-gray-300 italic">Try adjusting your filters or search terms.</p>
               </div>
               <Button 
                  variant="outline" 
                  onClick={() => { setSearchTerm(""); setStatusFilter("All"); }}
                  className="h-10 px-8 rounded-xl border-gray-200 text-[10px] font-bold uppercase tracking-widest"
               >
                  Reset Filters
               </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="py-32 text-center space-y-8 bg-white border border-gray-100 rounded-[60px] shadow-sm animate-in fade-in zoom-in-95 duration-700">
           <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center text-gray-200 mx-auto shadow-inner">
              <Building2 size={48} />
           </div>
           <div className="max-w-md mx-auto space-y-3">
              <h3 className="text-2xl font-black text-black uppercase tracking-tight italic">Your Academic Journey Starts Here</h3>
              <p className="text-[11px] font-medium text-gray-400 leading-relaxed italic px-10">
                 You haven't registered any university applications yet. Begin by adding your target institutions to track deadlines, documents, and admission stages in one place.
              </p>
           </div>
           <Link href="/alumni/applications/new">
              <Button className="bg-black text-white hover:bg-blue-600 rounded-[20px] px-12 h-14 font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl transition-all border-none gap-3">
                 <Plus size={18} /> Start First Application
              </Button>
           </Link>
        </div>
      )}
    </div>
  );
}

