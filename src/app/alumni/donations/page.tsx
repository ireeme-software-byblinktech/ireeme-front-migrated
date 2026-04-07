"use client";

import { useState } from "react";
import { 
  Heart, 
  Target, 
  Users, 
  TrendingUp, 
  Award, 
  ShieldCheck, 
  ArrowRight, 
  ChevronRight,
  Gift,
  HandHeart,
  TrendingDown,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/Card";

const PROJECTS = [
  {
    id: "1",
    title: "Next-Gen AI Lab",
    subtitle: "Equipping the class of 2029 with advanced robotics and AI research tools.",
    raised: 145000,
    goal: 200000,
    donors: 412,
    color: "emerald"
  },
  {
    id: "2",
    title: "Bright Future Scholarship",
    subtitle: "Supporting 50 high-potential students from underprivileged backgrounds.",
    raised: 35000,
    goal: 50000,
    donors: 128,
    color: "blue"
  },
  {
    id: "3",
    title: "Eco-Campus Initiative",
    subtitle: "Solar integration and vertical gardening across the school perimeter.",
    raised: 28000,
    goal: 100000,
    donors: 76,
    color: "amber"
  }
];

export default function AlumniDonationsPage() {
  return (
    <div className="pb-10 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        <div className="space-y-1 text-center md:text-left">
          <h2 className="text-2xl font-bold text-black uppercase tracking-tight">Invest in Future Success</h2>
          <p className="text-sm font-medium text-gray-400 italic leading-relaxed">Directly impact the next generation of global leaders through strategic giving.</p>
        </div>
        <div className="flex items-center gap-4 bg-emerald-50 px-5 py-2.5 rounded-[20px] border border-emerald-100 shadow-sm">
           <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg">
              <ShieldCheck size={20} />
           </div>
           <div>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-none mb-1">Giving Status</p>
              <h4 className="text-sm font-bold text-emerald-900 uppercase tracking-tight leading-none">Gold Circle Alumnus</h4>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "TOTAL GIVEN", value: "$15.4K", icon: Heart, trend: "+$1.2K this year" },
          { label: "DONOR NETWORK", value: "8,412", icon: Users, trend: "+84 active members" },
          { label: "ACTIVE CAMPAIGNS", value: "05", icon: Target, trend: "3 Closing Soon" },
          { label: "PARTICIPATION", value: "68%", icon: TrendingUp, trend: "+4% vs Last Year" },
        ].map((stat, i) => (
          <StatCard
            key={i}
            label={stat.label}
            value={stat.value}
            icon={<stat.icon size={20} />}
            progress={75}
            trend={{ value: stat.trend, direction: "up" }}
          />
        ))}
      </div>

      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
         <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-black uppercase tracking-tight">Active Impact Campaigns</h3>
            <Link href="#" className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest hover:text-black transition-colors border-b border-emerald-100 pb-0.5">Audit Visibility Report</Link>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PROJECTS.map((project) => {
              const progress = Math.min((project.raised / project.goal) * 100, 100);
              return (
                <div key={project.id} className="group flex flex-col bg-white rounded-[32px] border border-gray-100 p-8 hover:shadow-md hover:border-black transition-all h-full relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gray-50" />
                   <div className="absolute top-0 left-0 h-1 bg-emerald-500 transition-all duration-1000" style={{ width: `${progress}%` }} />
                   
                   <div className="mb-8">
                      <div className="flex items-center justify-between mb-6">
                         <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center shadow-inner group-hover:bg-black group-hover:text-white transition-all">
                            <HandHeart className="text-emerald-500 group-hover:text-white" size={24} />
                         </div>
                         <div className="text-right">
                            <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mb-1 leading-none">{Math.round(progress)}% Goal</p>
                            <h4 className="text-lg font-bold text-gray-900 leading-none">${project.raised.toLocaleString()}</h4>
                         </div>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 tracking-tight uppercase mb-3 leading-tight group-hover:text-emerald-600 transition-colors">{project.title}</h3>
                      <p className="text-[11px] font-medium text-gray-400 leading-relaxed italic">{project.subtitle}</p>
                   </div>

                   <div className="mt-auto space-y-6 pt-6 border-t border-gray-50">
                      <div className="flex justify-between items-center">
                         <div className="flex flex-col">
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Target Goal</p>
                            <h4 className="text-sm font-bold text-gray-900 leading-none">${project.goal.toLocaleString()}</h4>
                         </div>
                         <div className="text-right flex flex-col">
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Donors</p>
                            <h4 className="text-sm font-bold text-gray-900 opacity-60 leading-none">{project.donors}</h4>
                         </div>
                      </div>
                      <Button className="w-full h-12 bg-black text-white hover:bg-emerald-600 rounded-xl font-bold text-[10px] uppercase tracking-widest gap-2 shadow-lg transition-all border-none">
                         Support Project
                         <ArrowUpRight size={14} />
                      </Button>
                   </div>
                </div>
              );
            })}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-6">
         <div className="lg:col-span-7 bg-gray-900 rounded-[40px] p-12 text-white relative h-full flex flex-col justify-center shadow-xl overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-emerald-500/10 transition-all" />
            <Award className="text-emerald-400 mb-8 opacity-40 shrink-0" size={56} />
            <h2 className="text-3xl font-bold tracking-tight leading-tight mb-6 uppercase">Become a <br /><span className="text-emerald-400">Legacy Builder</span></h2>
            <p className="text-sm font-medium text-gray-400 leading-relaxed mb-10 max-w-sm italic">
               Contributions exceeding <span className="font-bold text-white leading-none">$5,000</span> qualify for permanent recognition in the <span className="text-white font-bold underline decoration-emerald-500 underline-offset-4 uppercase tracking-tighter">School Founders Lobby</span>.
            </p>
            <button className="flex items-center gap-4 bg-white/5 p-6 rounded-3xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer group/btn">
               <div className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center font-bold text-xs">LB</div>
               <div className="text-left flex-1 min-w-0">
                  <h4 className="text-sm font-bold uppercase tracking-tight truncate">Corporate Naming Rights</h4>
                  <p className="text-[10px] font-medium text-emerald-400">Request formal meeting with development office</p>
               </div>
               <ChevronRight className="text-gray-500 group-hover/btn:translate-x-1 transition-transform" />
            </button>
         </div>

         <div className="lg:col-span-5 bg-white border border-gray-100 rounded-[40px] p-10 space-y-10 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-4 border-b border-gray-50 pb-6">
               <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center">
                  <Gift className="text-emerald-600" size={20} />
               </div>
               <h3 className="text-lg font-bold uppercase tracking-tight text-black italic">Why Invest?</h3>
            </div>
            
            <div className="space-y-8 px-1">
               {[
                 { title: "Empower Global Minds", text: "85% of alumni-led scholarships fund first-generation academic journeys." },
                 { title: "High-Level Networking", text: "Elite contributors gain access to exclusive biennial leadership galas." },
                 { title: "Tax Efficiency", text: "100% of contributions are tax-deductible under standard provisions." }
               ].map((item, i) => (
                 <div key={i} className="flex gap-5 group">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center font-bold text-gray-300 text-[10px] group-hover:bg-black group-hover:text-white transition-all shrink-0">0{i+1}</div>
                    <div className="space-y-1">
                       <h4 className="text-xs font-bold uppercase tracking-tight text-gray-800 group-hover:text-emerald-600 transition-colors">{item.title}</h4>
                       <p className="text-[10px] font-medium text-gray-400 leading-relaxed italic">{item.text}</p>
                    </div>
                 </div>
               ))}
            </div>

            <Button variant="outline" className="h-12 font-bold uppercase border border-gray-100 rounded-xl text-[9px] tracking-widest mt-4 hover:border-black hover:text-black transition-all">
               Download Impact Report 2025
            </Button>
         </div>
      </div>
    </div>
  );
}
