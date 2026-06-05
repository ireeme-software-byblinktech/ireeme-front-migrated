"use client";

import { useState } from "react";
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Shield, 
  MapPin, 
  Briefcase, 
  Globe, 
  Camera, 
  CheckCircle2, 
  X,
  CreditCard,
  ChevronRight,
  Eye,
  Settings as SettingsIcon,
  Trash2,
  AlertTriangle,
  Target,
  FileText,
  Users,
  Trophy,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function AlumniSettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications" | "privacy">("profile");
  
  // Mock form state
  const [profile, setProfile] = useState({
    name: "John Archivist",
    email: "john.a@legacy.edu",
    bio: "AI researcher focusing on ethical frameworks and legacy data systems. Class of 2015 graduates.",
    profession: "AI Researcher",
    company: "Google DeepMind",
    location: "Zurich, Switzerland",
    classYear: "2015"
  });

  const TABS = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-20 space-y-12">
      
      {/* Standard Portal Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
         <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Identity Settings</h1>
            <p className="text-sm font-medium text-gray-400">Manage your profile and digital security preferences.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
         
         {/* Settings Navigation */}
         <div className="lg:col-span-3 space-y-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                  activeTab === tab.id 
                    ? "bg-black text-white shadow-xl shadow-black/10" 
                    : "text-gray-400 hover:bg-gray-50 hover:text-black"
                )}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
         </div>

         {/* Settings Content Area */}
         <div className="lg:col-span-9">
            
            {activeTab === "profile" && (
              <div className="bg-white border border-gray-100 rounded-[40px] p-10 shadow-sm space-y-10 animate-in fade-in duration-500">
                 
                 {/* Avatar Upload */}
                 <div className="flex items-center gap-8 border-b border-gray-50 pb-10">
                    <div className="relative group">
                       <div className="w-24 h-24 bg-gray-900 rounded-[32px] flex items-center justify-center text-white text-2xl font-black italic shadow-2xl">
                          JA
                       </div>
                       <div className="absolute inset-0 bg-black/60 rounded-[32px] opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer">
                          <Camera className="text-white" size={24} />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">Identity Thumbnail</h4>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recommended size: 512x512 | PNG or JPG</p>
                       <div className="flex gap-4 pt-1">
                          <button className="text-[10px] font-black text-blue-600 uppercase hover:underline">Change</button>
                          <button className="text-[10px] font-black text-rose-500 uppercase hover:underline">Remove</button>
                       </div>
                    </div>
                 </div>

                 {/* Basic Info Grid */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Full Legal Name</label>
                       <input 
                        type="text" 
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-6 text-sm font-bold outline-none focus:ring-1 focus:ring-black transition-all"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Legacy Email</label>
                       <input 
                        type="email" 
                        value={profile.email}
                        readOnly
                        className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-6 text-sm font-bold text-gray-400 outline-none cursor-not-allowed"
                       />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Legacy Bio</label>
                       <textarea 
                        value={profile.bio}
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        className="w-full h-32 bg-gray-50 border border-gray-100 rounded-3xl p-6 text-sm font-medium text-gray-600 outline-none focus:ring-1 focus:ring-black resize-none transition-all"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Current Profession</label>
                       <input 
                        type="text" 
                        value={profile.profession}
                        onChange={(e) => setProfile({...profile, profession: e.target.value})}
                        className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-6 text-sm font-bold outline-none focus:ring-1 focus:ring-black transition-all"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Institutional Year</label>
                       <select 
                        value={profile.classYear}
                        disabled
                        className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-6 text-sm font-bold text-gray-400 appearance-none cursor-not-allowed"
                       >
                          <option value="2015">Class of 2015</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Organization HQ</label>
                       <input 
                        type="text" 
                        value={profile.company}
                        onChange={(e) => setProfile({...profile, company: e.target.value})}
                        className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-6 text-sm font-bold outline-none focus:ring-1 focus:ring-black transition-all"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Global Location</label>
                       <input 
                        type="text" 
                        value={profile.location}
                        onChange={(e) => setProfile({...profile, location: e.target.value})}
                        className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-6 text-sm font-bold outline-none focus:ring-1 focus:ring-black transition-all"
                       />
                    </div>
                 </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="bg-white border border-gray-100 rounded-[40px] p-10 shadow-sm space-y-10 animate-in fade-in duration-500">
                 <div className="space-y-8">
                    {/* Password Section */}
                    <div className="space-y-6 border-b border-gray-50 pb-8">
                       <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                          <Lock size={18} className="text-rose-500" /> Advanced Encryption
                       </h4>
                       <div className="space-y-4 max-w-md">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Current Password</label>
                             <input type="password" placeholder="••••••••••••" className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-6 text-sm outline-none focus:ring-1 focus:ring-black" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">New Password Hash</label>
                             <input type="password" placeholder="••••••••••••" className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-6 text-sm outline-none focus:ring-1 focus:ring-black" />
                          </div>
                          <Button className="h-12 bg-black text-white rounded-xl px-10 text-[10px] font-black uppercase tracking-widest">Rotate Keys</Button>
                       </div>
                    </div>

                    {/* 2FA Section */}
                    <div className="flex items-center justify-between p-8 bg-gray-50 rounded-[32px] border border-gray-100 group">
                       <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm transition-transform group-hover:rotate-12">
                             <Shield size={28} />
                          </div>
                          <div className="space-y-1">
                             <h4 className="text-[11px] font-black uppercase tracking-tight text-gray-900">Multi-Factor Protocol (2FA)</h4>
                             <p className="text-[10px] font-medium text-gray-400 italic">Adds a second layer of defense to your legacy archives.</p>
                          </div>
                       </div>
                       <button className="w-16 h-8 bg-black rounded-full relative transition-all">
                          <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full translate-x-8" />
                       </button>
                    </div>

                    {/* Active Sessions */}
                    <div className="space-y-6">
                       <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Verification Pipelines (3)</h4>
                       <div className="space-y-3">
                          {[
                            { device: "MacBook Pro M3", loc: "Zurich, CH", time: "Active Now", current: true },
                            { device: "iPhone 15 Pro", loc: "Zurich, CH", time: "2h ago", current: false },
                            { device: "iPad Pro", loc: "Kigali, RW", time: "3d ago", current: false },
                          ].map((session, i) => (
                            <div key={i} className="flex items-center justify-between p-6 bg-white border border-gray-50 rounded-2xl">
                               <div className="flex items-center gap-4">
                                  <Globe size={18} className={session.current ? "text-emerald-500" : "text-gray-300"} />
                                  <div>
                                     <p className="text-[11px] font-black text-gray-900">{session.device} {session.current && <span className="text-emerald-500 italic ml-2">Verified</span>}</p>
                                     <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">{session.loc} • {session.time}</p>
                                  </div>
                               </div>
                               {!session.current && <button className="text-[10px] font-black text-rose-500 uppercase hover:underline">Revoke</button>}
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {/* Remove sections if any */}
         </div>
      </div>
    </div>
  );
}

