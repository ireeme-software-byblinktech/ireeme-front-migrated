"use client";

import { useState } from "react";
import { 
  FileText, 
  Download, 
  Clock, 
  ShieldCheck, 
  Globe, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  Database,
  Printer,
  Share2,
  FileCheck,
  MoreVertical,
  ExternalLink,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DataTable, Column } from "@/components/ui/DataTable";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/ui";

interface DocRequest {
  id: string;
  type: string;
  date: string;
  status: "Completed" | "Processing" | "Action Required";
  delivery: "Digital" | "Physical";
}

const DOCUMENT_INVENTORY = [
  { id: "1", title: "Official Academic Transcript", lastRequested: "April 02, 2026", cost: "$15.00", status: "Active System" },
  { id: "2", title: "Graduation Degree Certificate", lastRequested: "March 20, 2026", cost: "Free", status: "Verified" },
  { id: "3", title: "Dean's List Certificate", lastRequested: "N/A", cost: "Free", status: "Available" }
];

const RECENT_REQUESTS: DocRequest[] = [
  { id: "RQ-9842", type: "Official Transcript", date: "April 02, 2026", status: "Completed", delivery: "Digital" },
  { id: "RQ-7512", type: "Graduation Certificate", date: "March 20, 2026", status: "Processing", delivery: "Physical" },
  { id: "RQ-6120", type: "Enrollment Verification", date: "Feb 12, 2026", status: "Action Required", delivery: "Digital" }
];

export default function AlumniDocumentsPortal() {
  const columns: Column<DocRequest>[] = [
    { 
      key: "id", 
      header: "Request ID", 
      width: "15%",
      render: (val) => <span className="font-bold text-gray-500 text-xs">{String(val)}</span>
    },
    { 
      key: "type", 
      header: "Document Type", 
      width: "30%",
      render: (val) => <span className="font-bold text-gray-900 uppercase text-xs tracking-tight">{String(val)}</span>
    },
    { 
      key: "date", 
      header: "Requested On", 
      width: "20%",
      render: (val) => <span className="text-xs text-gray-400">{String(val)}</span>
    },
    { 
      key: "status", 
      header: "Status", 
      width: "15%",
      render: (val) => (
        <div className={cn(
          "px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tight inline-flex",
          val === "Completed" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
          val === "Processing" ? "bg-blue-50 text-blue-600 border border-blue-100" :
          "bg-rose-50 text-rose-600 border border-rose-100"
        )}>
           {String(val)}
        </div>
      )
    },
    { 
      key: "actions", 
      header: "Actions", 
      width: "10%",
      align: "right",
      render: (_, record) => (
        <button className="p-2 hover:bg-gray-50 rounded-lg transition-all text-gray-400 hover:text-black">
           {record.status === "Completed" ? <Download size={16} /> : <MoreVertical size={16} />}
        </button>
      )
    }
  ];

  return (
    <div className="pb-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-black uppercase tracking-tight">Academic Records</h2>
          <p className="text-sm font-medium text-gray-400">Manage and request your official institutional credentials.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white px-5 py-2.5 rounded-[20px] border border-gray-100 shadow-sm">
           <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center">
              <ShieldCheck size={20} />
           </div>
           <div>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">Security Verified</p>
              <h4 className="text-sm font-bold text-gray-900 tracking-tight leading-none uppercase">Credential Vault Active</h4>
           </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard
          label="Total Records"
          value="12"
          icon={<FileText size={24} />}
          progress={100}
          trend={{ value: "2", direction: "up", label: "New this year" }}
        />
        <StatCard
          label="Verified Docs"
          value="08"
          icon={<FileCheck size={24} />}
          progress={75}
          trend={{ value: "Stable", direction: "up" }}
        />
        <StatCard
          label="Pending Requests"
          value="01"
          icon={<Clock size={24} />}
          progress={25}
          trend={{ value: "Active", direction: "up" }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Main Column */}
         <div className="lg:col-span-8 space-y-10">
            
            {/* Request New Documents */}
            <div className="space-y-6">
               <h3 className="text-xl font-bold text-black uppercase tracking-tight">Request Credentials</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {DOCUMENT_INVENTORY.map((doc) => (
                    <div key={doc.id} className="group flex flex-col bg-white border border-gray-100 rounded-3xl p-6 hover:shadow-md transition-all cursor-pointer">
                       <div className="flex items-center justify-between mb-6">
                          <div className="w-12 h-12 bg-gray-50 rounded-2xl border border-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all">
                             <FileText size={24} />
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-bold text-emerald-600 uppercase opacity-60 leading-none mb-1">Status</p>
                             <h4 className="text-xs font-bold text-gray-900 uppercase tracking-tight">{doc.status}</h4>
                          </div>
                       </div>

                       <div className="space-y-2 mb-6">
                          <h3 className="text-lg font-bold text-gray-900 tracking-tight uppercase group-hover:text-emerald-500 transition-colors leading-tight">{doc.title}</h3>
                          <div className="flex items-center gap-4">
                             <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase">
                                <Clock size={12} /> {doc.lastRequested}
                             </div>
                             <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase">
                                {doc.cost}
                             </div>
                          </div>
                       </div>

                       <Button className="w-full h-11 bg-black text-white hover:bg-emerald-600 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all mt-auto flex items-center justify-center gap-2">
                          Request Now
                          <ArrowRight size={14} />
                       </Button>
                    </div>
                  ))}
               </div>
            </div>

            {/* History Table */}
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-black uppercase tracking-tight">Request History</h3>
                  <button className="text-[10px] font-bold text-emerald-600 hover:text-black transition-all uppercase tracking-widest border-b border-emerald-100 pb-0.5">Audit Log</button>
               </div>
               <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  <DataTable 
                    columns={columns as any} 
                    data={RECENT_REQUESTS as any} 
                    className="parent-portal-table border-none"
                  />
               </div>
            </div>
         </div>

         {/* Sidebar Column */}
         <div className="lg:col-span-4 space-y-6">
            <div className="bg-gray-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
               <Database className="text-emerald-400 mb-6 opacity-40" size={40} />
               <h2 className="text-2xl font-bold tracking-tight leading-tight mb-4 uppercase">Credential Wallet</h2>
               <p className="text-xs font-medium text-gray-400 leading-relaxed mb-8">
                  Access cryptographically verifiable certificates recognized globally by employers and visa offices.
               </p>
               
               <div className="space-y-4 mb-8">
                  {['Digital Signature Protocol', 'Blockchain Hash Verification'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                       <CheckCircle2 size={14} className="text-emerald-400" />
                       <span className="text-[10px] font-bold uppercase tracking-tight opacity-70">{item}</span>
                    </div>
                  ))}
               </div>

               <Button className="w-full h-12 bg-white text-black font-bold uppercase rounded-xl shadow-lg hover:bg-emerald-500 hover:text-white transition-all flex gap-3 text-xs">
                  Open Digital Wallet
                  <ExternalLink size={14} />
               </Button>
            </div>

            <div className="bg-white border border-gray-100 rounded-[32px] p-8 space-y-8 shadow-sm">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center">
                     <AlertCircle className="text-emerald-600" size={20} />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-tight text-black">Need Support?</h4>
               </div>
               
               <div className="space-y-6 px-1">
                  <p className="text-[11px] font-medium text-gray-400 leading-relaxed italic">
                     Digital documents are delivered within <span className="text-black font-bold">2 business hours</span>.
                  </p>
                  
                  <div className="space-y-3">
                     <button className="w-full flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-transparent hover:border-gray-200 hover:bg-white transition-all group">
                        <span className="text-[10px] font-bold uppercase text-gray-700">Report an issue</span>
                        <ChevronRight className="text-gray-300 group-hover:text-black" size={14} />
                     </button>
                     <button className="w-full flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-transparent hover:border-gray-200 hover:bg-white transition-all group">
                        <span className="text-[10px] font-bold uppercase text-gray-700">Contact Registrar</span>
                        <ChevronRight className="text-gray-300 group-hover:text-black" size={14} />
                     </button>
                  </div>

                  <div className="pt-4 border-t border-dashed border-gray-100">
                     <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-100">
                        <Globe className="text-emerald-600 shrink-0" size={18} />
                        <p className="text-[9px] font-bold uppercase text-emerald-800 tracking-tight leading-tight">Recognized by over 5,000 Woven Network Institutions.</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

