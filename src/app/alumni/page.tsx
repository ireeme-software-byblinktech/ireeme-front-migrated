"use client";

import { 
  Users, 
  Heart, 
  Trophy, 
  GraduationCap, 
  FileText,
  Clock,
  ChevronRight,
  ArrowUpRight,
  Bell,
  Search,
  BookOpen,
  ArrowRight,
  FileCheck,
  Globe,
  Sparkles,
  School,
  ExternalLink,
  Milestone,
  CheckCircle2,
  Calendar,
  Send,
  Zap,
  Target,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Activity,
  Plus
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardBody, StatCard } from "@/components/ui/Card";

// --- Mock Data ---
const METRICS = [
  { label: "Global Network", value: "12,482", sub: "Alumni in System", icon: Globe, color: "text-blue-500", bg: "bg-blue-50" },
  { label: "Credentials", value: "08", sub: "Documents Requested", icon: FileCheck, color: "text-emerald-500", bg: "bg-emerald-50" },
  { label: "Legacy Peers", value: "154", sub: "Connected Contacts", icon: Users, color: "text-purple-500", bg: "bg-purple-50" },
  { label: "Tracked Intents", value: "03", sub: "Active Applications", icon: Target, color: "text-rose-500", bg: "bg-rose-50" },
];

const RECENT_ACTIVITY = [
  { event: "Transcript Verified", time: "2h ago", status: "Approved", statusColor: "bg-emerald-50 text-emerald-600", desc: "Your Harvard MPP transcript is now officially signed." },
  { event: "Application Update", time: "5h ago", status: "Moving", statusColor: "bg-blue-50 text-blue-600", desc: "Oxford admission committee has started reviewing your file." },
  { event: "Legacy Connection", time: "1d ago", status: "New", statusColor: "bg-purple-50 text-purple-600", desc: "Sarah Uwase (Class of '18) accepted your connection request." },
];

const ALUMNI_NEAR_YOU = [
  { name: "Sarah Johnson", role: "Neurosurgeon", loc: "Boston, USA", initials: "SJ" },
  { name: "Marc Uwase", role: "AI Researcher", loc: "Zurich, CH", initials: "MU" },
  { name: "Emily Chen", role: "UX Designer", loc: "Singapore", initials: "EC" },
];

const MY_DOCUMENTS = [
  { name: "Official_Transcript_2026.pdf", date: "April 02", type: "PDF" },
  { name: "Degree_Certificate.pdf", date: "March 20", type: "PDF" },
  { name: "SOP_Draft_Final.docx", date: "March 15", type: "DOC" },
];

const CHART_DATA = [
  { year: "2020", count: 85 },
  { year: "2019", count: 62 },
  { year: "2018", count: 94 },
  { year: "2017", count: 48 },
  { year: "2016", count: 76 },
];

const QUICK_ACTIONS = [
  { title: "Apply New", icon: Plus, link: "/alumni/applications/new" },
  { title: "Broadcast", icon: Send, link: "#" },
  { title: "Verify File", icon: ShieldCheck, link: "/alumni/documents" },
  { title: "Get Support", icon: MessageSquare, link: "#" },
];

export default function AlumniDashboardRedesign() {
  return (
    <div className="pb-20 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Standard Portal Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-100">
         <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Legacy Dashboard</h1>
            <p className="text-sm font-medium text-gray-400">Welcome back, John. Class of 2015.</p>
         </div>
         <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-100">
               <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
               <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">Legacy Gold Status</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
               <Clock size={14} className="text-gray-400" />
               <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Last login: Today 09:42 AM</span>
            </div>
         </div>
      </div>

      {/* 2. Overview Metrics (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
         {METRICS.map((metric, i) => (
           <StatCard
             key={i}
             label={metric.label}
             value={metric.value}
             icon={<metric.icon size={22} />}
             progress={i === 0 ? 100 : i === 1 ? 80 : i === 2 ? 65 : 40}
             trend={{ value: i === 0 ? "Global" : i === 1 ? "Issued" : "Active", direction: "up" }}
           />
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Main View Area (2/3) */}
         <div className="lg:col-span-2 space-y-8">
            
            {/* 3. Recent Activity */}
            <Card className="border-none shadow-sm ring-1 ring-gray-100 overflow-hidden">
               <CardHeader 
                  title="RECENT LEGACY ACTIVITY" 
                  subtitle="Latest updates from your network"
                  className="px-10 py-8"
                  action={<button className="text-[10px] font-black text-gray-300 uppercase hover:text-black transition-colors">History</button>}
               />
               <CardBody className="p-10 pt-4 space-y-8">
                  <div className="space-y-6">
                     {RECENT_ACTIVITY.map((act, i) => (
                       <div key={i} className="flex gap-6 group/act cursor-pointer">
                          <div className="flex flex-col items-center">
                             <div className="w-2.5 h-2.5 rounded-full bg-gray-200 group-hover/act:bg-black transition-colors" />
                             {i !== RECENT_ACTIVITY.length - 1 && <div className="w-0.5 h-full bg-gray-50 mt-1.5" />}
                          </div>
                          <div className="flex-1 pb-4">
                             <div className="flex items-center justify-between">
                                <h4 className="text-[11px] font-black uppercase text-gray-900 leading-none">{act.event}</h4>
                                <span className={cn("px-2.5 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest", act.statusColor)}>{act.status}</span>
                             </div>
                             <p className="text-[10px] font-bold text-gray-400 leading-relaxed italic mt-2">{act.desc}</p>
                             <p className="text-[9px] font-black text-gray-300 uppercase mt-1.5">{act.time}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </CardBody>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* 4. Alumni Near You */}
               <Card className="border-none shadow-sm ring-1 ring-gray-100 overflow-hidden">
                  <CardHeader title="LOCAL DISCOVERY" subtitle="Peers in your current region" className="px-10 py-6" />
                  <CardBody className="p-10 pt-4 space-y-8">
                     <div className="space-y-6">
                        {ALUMNI_NEAR_YOU.map((alumni, i) => (
                           <div key={i} className="flex items-center justify-between group/alumni cursor-pointer">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white text-[10px] font-black italic group-hover/alumni:scale-110 transition-all shadow-lg">
                                    {alumni.initials}
                                 </div>
                                 <div>
                                    <p className="text-[11px] font-black text-gray-900 uppercase leading-none">{alumni.name}</p>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">{alumni.role}</p>
                                 </div>
                              </div>
                              <ArrowUpRight size={16} className="text-gray-200 group-hover/alumni:text-black group-hover/alumni:translate-x-1 group-hover/alumni:-translate-y-1 transition-all" />
                           </div>
                        ))}
                     </div>
                     <Link href="/alumni/directory" className="block pt-2">
                        <button className="w-full h-12 bg-gray-50 hover:bg-black hover:text-white text-gray-400 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all italic">
                           Open Global Map
                        </button>
                     </Link>
                  </CardBody>
               </Card>

               {/* 6. Alumni by Graduation Year */}
               <Card className="border-none shadow-sm ring-1 ring-gray-100 overflow-hidden">
                  <CardHeader title="ACTIVE COHORTS" subtitle="Engagement index by year" className="px-10 py-6" />
                  <CardBody className="p-10 pt-4 space-y-8">
                     <div className="flex items-end justify-between h-32 pt-4 px-2">
                        {CHART_DATA.map((data, i) => (
                           <div key={i} className="flex flex-col items-center gap-3 flex-1 group/bar">
                              <div 
                                className="w-4 bg-gray-50 group-hover/bar:bg-black transition-all rounded-full relative"
                                style={{ height: `${data.count}%` }}
                              >
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-bold text-gray-400 opacity-0 group-hover/bar:opacity-100 transition-opacity">{data.count}</div>
                              </div>
                              <span className="text-[8px] font-black text-gray-300 uppercase">{data.year}</span>
                           </div>
                        ))}
                     </div>
                     <p className="text-[9px] font-bold text-gray-300 text-center uppercase tracking-widest italic pt-2">System Engagement Data</p>
                  </CardBody>
               </Card>
            </div>
         </div>

         {/* Sidebar (1/3) */}
         <div className="space-y-8">
            
            {/* 7. Quick Actions */}
            <Card className="bg-gray-900 overflow-hidden shadow-xl border-none ring-1 ring-white/10">
               <CardBody className="p-10 space-y-8 relative">
                  <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 text-blue-500">
                     <Zap size={100} />
                  </div>
                  <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] italic relative z-10">Power Commands</h4>
                  <div className="grid grid-cols-2 gap-4 relative z-10">
                     {QUICK_ACTIONS.map((action, i) => (
                        <Link key={i} href={action.link} className="bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 rounded-3xl p-6 flex flex-col items-center gap-3 transition-all group/pow">
                           <action.icon size={24} className="text-blue-400 group-hover/pow:scale-110 transition-transform" />
                           <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">{action.title}</span>
                        </Link>
                     ))}
                  </div>
               </CardBody>
            </Card>

            {/* 5. My Documents */}
            <Card className="border-none shadow-sm ring-1 ring-gray-100 overflow-hidden">
               <CardHeader title="INVENTORY" subtitle="Recent archive files" className="px-10 py-6" />
               <CardBody className="p-10 pt-4 space-y-8">
                  <div className="space-y-6">
                     {MY_DOCUMENTS.map((doc, i) => (
                        <div key={i} className="group/doc cursor-pointer">
                           <div className="flex items-center justify-between">
                              <p className="text-[10px] font-black text-gray-900 truncate max-w-[140px]">{doc.name}</p>
                              <span className="text-[8px] font-bold text-gray-300 border border-gray-100 px-2 py-0.5 rounded-lg">{doc.type}</span>
                           </div>
                           <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest italic mt-1">{doc.date}</p>
                        </div>
                     ))}
                  </div>
                  <Link href="/alumni/documents" className="block pt-2">
                     <button className="w-full h-12 bg-gray-50 hover:bg-black hover:text-white rounded-2xl flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all">
                        Enter Archive <ArrowRight size={14} />
                     </button>
                  </Link>
               </CardBody>
            </Card>

            {/* Support Widget */}
            <div className="p-1 w-full bg-black rounded-[40px] overflow-hidden group shadow-2xl">
               <div className="bg-white/5 backdrop-blur-xl rounded-[36px] p-8 text-white space-y-4">
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-40 italic underline decoration-rose-500 underline-offset-4">Institutional Channel</p>
                  <p className="text-xl font-black italic uppercase leading-none tracking-tight">Need Support?</p>
                  <p className="text-[10px] font-medium text-white/40 leading-relaxed italic">Our team is available 24/7 to assist with your academic archives and connectivity.</p>
                  <Button className="w-full h-14 bg-white text-black hover:bg-blue-600 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all mt-4 border-none">
                     Secure Broadcast
                  </Button>
               </div>
            </div>

         </div>

      </div>

    </div>
  );
}
