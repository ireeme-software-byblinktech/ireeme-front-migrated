"use client";

import { useState } from "react";
import { 
  GraduationCap, 
  Award, 
  MapPin, 
  Calendar, 
  Users, 
  Camera, 
  Play, 
  History, 
  CheckCircle2, 
  Star, 
  ArrowRight, 
  Mail,
  ChevronRight,
  TrendingUp,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AlumniGraduationPage() {
  return (
    <div className="pb-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-black uppercase tracking-tight">Graduation Details</h2>
          <p className="text-sm font-medium text-gray-400">Relive the moment you became a leader in the global community.</p>
        </div>
        
        <div className="flex bg-black text-white px-6 py-3 rounded-2xl shadow-sm relative overflow-hidden group cursor-pointer">
           <div className="relative z-10 flex items-center gap-4">
              <div>
                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Class of</p>
                 <h4 className="text-xl font-bold text-emerald-400 tracking-tight leading-none">2015</h4>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Honors</p>
                 <h4 className="text-xs font-bold text-white uppercase tracking-tight">Magna Cum Laude</h4>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
         {/* Main Memories Section */}
         <div className="lg:col-span-8 space-y-12">
            <div className="relative rounded-[64px] overflow-hidden bg-gray-900 h-[500px] shadow-3xl group">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                     <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto border border-white/20 hover:scale-110 transition-transform cursor-pointer">
                        <Play className="text-white fill-white ml-1" size={32} />
                     </div>
                     <p className="text-xs font-black text-white uppercase italic tracking-widest opacity-60">Graduation Highlights 2015</p>
                  </div>
               </div>
               
               <div className="absolute bottom-12 left-12 right-12 z-10 flex items-end justify-between">
                  <div className="space-y-2">
                     <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">The final march</h2>
                     <p className="text-sm font-bold text-gray-400 italic">May 22, 2015 • School Grand Hall</p>
                  </div>
                  <div className="flex gap-2">
                     <button className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all">
                        <Camera className="text-white" size={24} />
                     </button>
                     <button className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all">
                        <Star className="text-white fill-white" size={24} />
                     </button>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
               <div className="bg-white rounded-[48px] border border-gray-100 p-12 space-y-8 shadow-sm">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center">
                        <GraduationCap size={24} />
                     </div>
                     <h3 className="text-xl font-black italic tracking-tight uppercase underline italic decoration-emerald-500 decoration-4 underline-offset-4">Academic Stance</h3>
                  </div>
                  
                  <div className="space-y-6">
                     {[
                       { label: "Degree Awarded", value: "B.Sc Computing & AI" },
                       { label: "GPA Record", value: "3.92 / 4.00" },
                       { label: "Faculty Mentor", value: "Prof. Alan Turing" },
                       { label: "Student Rep", value: "President (Class '15)" }
                     ].map((item, i) => (
                       <div key={i} className="flex justify-between items-center border-b border-dashed border-gray-50 pb-3">
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">{item.label}</p>
                          <p className="text-sm font-black text-gray-900 uppercase italic tracking-tighter">{item.value}</p>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="bg-emerald-500 rounded-[48px] p-12 text-white flex flex-col justify-center relative overflow-hidden shadow-xl shadow-emerald-500/20 group cursor-pointer active:scale-95 transition-all">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
                  <div className="relative z-10 space-y-8">
                     <History className="opacity-20" size={48} />
                     <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-tight">Digital Degree <br />Certificate</h3>
                     <p className="text-sm font-medium italic text-emerald-100 opacity-80 leading-relaxed">
                        Secure, cryptographically signed version of your physical diploma for instant employment verification.
                     </p>
                     <Button className="w-full bg-white text-black font-black uppercase italic rounded-2xl h-14 border-none shadow-xl hover:scale-105 transition-all">
                        Download Digital Copy
                     </Button>
                  </div>
               </div>
            </div>
         </div>

         {/* Sidebar Stats Column */}
         <div className="lg:col-span-4 space-y-8">
            <h2 className="text-2xl font-black text-black uppercase tracking-tight italic">Class Legacy</h2>
            
            <div className="bg-white border border-gray-100 rounded-[56px] p-12 shadow-sm shadow-black/5 space-y-12">
               <div className="space-y-8">
                  <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic decoration-gray-100 underline underline-offset-8 decoration-2">Community Stats</h4>
                  
                  <div className="space-y-8">
                     <div>
                        <div className="flex justify-between items-end mb-3">
                           <p className="text-xs font-black uppercase text-gray-900 italic tracking-tighter">Class Giving participation</p>
                           <p className="text-sm font-black text-emerald-500 italic">92%</p>
                        </div>
                        <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                           <div className="w-[92%] h-full bg-emerald-500 rounded-full" />
                        </div>
                     </div>
                     <div>
                        <div className="flex justify-between items-end mb-3">
                           <p className="text-xs font-black uppercase text-gray-900 italic tracking-tighter">Global Employment rate</p>
                           <p className="text-sm font-black text-emerald-500 italic">98.5%</p>
                        </div>
                        <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                           <div className="w-[98.5%] h-full bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                        </div>
                     </div>
                  </div>
               </div>

               <div className="pt-10 border-t-2 border-dashed border-gray-50 space-y-8">
                  <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic decoration-gray-100 underline underline-offset-8 decoration-2">Hall of Fame nominees</h4>
                  <div className="space-y-6">
                     {[
                       { name: "Sarah J.", role: "Medical", avatar: "SJ" },
                       { name: "Marc U.", role: "AI Research", avatar: "MU" }
                     ].map((alumni, i) => (
                       <div key={i} className="flex items-center justify-between group cursor-pointer hover:translate-x-1 transition-transform">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center font-black text-[10px] shadow-lg group-hover:rotate-6 transition-transform italic">
                                {alumni.avatar}
                             </div>
                             <div>
                                <p className="text-xs font-black text-gray-900 uppercase italic tracking-tighter">{alumni.name}</p>
                                <p className="text-[10px] font-bold text-gray-300 italic">{alumni.role}</p>
                             </div>
                          </div>
                          <button className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300 group-hover:bg-black group-hover:text-white group-hover:border-black transition-all">
                             <ChevronRight size={14} />
                          </button>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="pt-10 border-t-2 border-dashed border-gray-50">
                  <div className="bg-gray-50 border border-gray-100 rounded-[32px] p-6 text-center space-y-4 shadow-inner">
                     <p className="text-[10px] font-bold text-gray-400 italic leading-relaxed">
                        "Your journey doesn't end at graduation. It simply transitions into leadership."
                     </p>
                     <p className="text-[11px] font-black uppercase tracking-tight text-gray-900 italic opacity-40">— 2015 Commencement Speech</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

