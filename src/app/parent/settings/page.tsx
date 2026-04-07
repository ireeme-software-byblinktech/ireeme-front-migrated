"use client";

import { useState } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Lock, 
  Bell, 
  Camera,
  ChevronRight,
  ExternalLink,
  Clock,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { EditProfileModal } from "@/components/ui/EditProfileModal";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"personal" | "security" | "notifications">("personal");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const userData = {
    firstName: "Alexander",
    lastName: "Rawles",
    email: "alexarawles@gmail.com",
    phone: "+(250) 793 131 491",
    country: "Rwanda",
    gender: "Male",
    address: "Kigali, NV 89104",
    occupation: "Software Engineer",
    memberSince: "May 2024"
  };

  const children = [
    { name: "Joel Queen", grade: "Year 1 A", avatar: "JQ" },
    { name: "Jane Doe", grade: "Year 3 B", avatar: "JD" }
  ];

  return (
    <div className="pb-20 max-w-6xl mx-auto">
      {/* Hero Profile Section */}
      <div className="relative mb-12">
        <div className="h-48 w-full bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-[40px] shadow-2xl overflow-hidden relative">
           <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
           <div className="absolute top-6 right-8">
              <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-xs font-black uppercase tracking-widest">
                Parent Account
              </div>
           </div>
        </div>
        
        <div className="px-12 -mt-16 flex flex-col md:flex-row items-end gap-8 relative z-10">
          <div className="relative group">
            <div className="w-40 h-40 bg-white p-2 rounded-[48px] shadow-2xl relative">
              <div className="w-full h-full bg-gray-100 rounded-[40px] flex items-center justify-center text-5xl font-black text-black overflow-hidden border-4 border-gray-50">
                AR
              </div>
              <button className="absolute bottom-2 right-2 w-10 h-10 bg-black text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-all border-4 border-white">
                <Camera size={18} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 pb-4">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">{userData.firstName} {userData.lastName}</h1>
            <p className="text-gray-500 font-bold flex items-center gap-2 mt-1">
              <Mail size={16} />
              {userData.email}
            </p>
          </div>
          
          <div className="pb-4 flex gap-3">
             <Button 
                variant="outline" 
                className="rounded-2xl font-black uppercase text-xs h-12 px-6 border-gray-200 hover:bg-gray-50 transition-all border-2"
                onClick={() => setIsEditModalOpen(true)}
             >
               Edit Profile
             </Button>
             <Button className="bg-black text-white rounded-2xl font-black uppercase text-xs h-12 px-8 shadow-xl shadow-black/20 hover:bg-gray-800 transition-all">
               View Public Profile
             </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 px-4">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
           {[
             { id: "personal", label: "Personal Info", icon: User },
             { id: "security", label: "Security", icon: Shield },
             { id: "notifications", label: "Notifications", icon: Bell },
           ].map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={cn(
                 "w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all font-black text-sm uppercase tracking-tight",
                activeTab === tab.id 
                  ? "bg-black text-white shadow-xl shadow-black/10 scale-[1.02]" 
                  : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
               )}
             >
               <div className="flex items-center gap-4">
                 <tab.icon size={20} />
                 {tab.label}
               </div>
               {activeTab === tab.id && <ChevronRight size={16} />}
             </button>
           ))}

           <div className="pt-8 px-6">
              <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4">Account Stats</h4>
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500">Logins</span>
                    <span className="text-xs font-black text-gray-900">42</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500">Documents</span>
                    <span className="text-xs font-black text-gray-900">12</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500">Children linked</span>
                    <span className="text-xs font-black text-emerald-600">02</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-[40px] border border-gray-100 p-10 shadow-sm min-h-[500px]">
            {activeTab === "personal" && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                   <h3 className="text-2xl font-black text-black uppercase tracking-tight italic underlined">Personal Information</h3>
                   <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                         <CheckCircle2 size={16} />
                      </div>
                      <span className="text-xs font-black text-emerald-600 uppercase tracking-tighter self-center">Verified Account</span>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">First Name</label>
                    <p className="text-lg font-bold text-gray-900">{userData.firstName}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Name</label>
                    <p className="text-lg font-bold text-gray-900">{userData.lastName}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</label>
                    <p className="text-lg font-bold text-gray-900">{userData.email}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</label>
                    <p className="text-lg font-bold text-gray-900">{userData.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Address</label>
                    <p className="text-lg font-bold text-gray-900">{userData.address}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Occupation</label>
                    <p className="text-lg font-bold text-gray-900">{userData.occupation}</p>
                  </div>
                </div>

                <div className="pt-10 border-t border-gray-50">
                   <h4 className="text-sm font-black text-black uppercase mb-6 tracking-widest italic decoration-emerald-500 underline underline-offset-4">Linked Children</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {children.map((child, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-5 rounded-[24px] bg-gray-50 border border-gray-100 hover:border-black/10 transition-all group cursor-pointer">
                          <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center font-black group-hover:scale-105 transition-transform shadow-lg">
                            {child.avatar}
                          </div>
                          <div className="flex-1">
                            <p className="font-black text-gray-900 uppercase text-xs">{child.name}</p>
                            <p className="text-[10px] font-bold text-gray-400">{child.grade}</p>
                          </div>
                          <ExternalLink size={16} className="text-gray-300 group-hover:text-black transition-colors" />
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-black text-black uppercase tracking-tight italic">Security Settings</h3>
                
                <div className="p-8 rounded-[32px] border-2 border-dashed border-gray-100 bg-gray-50/30">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                        <Lock size={20} className="text-black" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900 uppercase">Account Password</p>
                        <p className="text-xs font-bold text-gray-500">Last changed 3 months ago</p>
                      </div>
                    </div>
                    <Button variant="outline" className="rounded-xl font-black text-xs h-10 border-black text-black hover:bg-black hover:text-white transition-all">
                      Change Password
                    </Button>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                        <Shield size={20} className="text-black" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900 uppercase">Two-Factor Authentication</p>
                        <p className="text-xs font-bold text-gray-500 italic">Enabled via Email Account</p>
                      </div>
                    </div>
                    <div className="w-12 h-6 bg-emerald-500 rounded-full relative p-1 cursor-pointer">
                       <div className="w-4 h-4 bg-white rounded-full absolute right-1" />
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                   <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Active Sessions</h4>
                   <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-white border border-gray-50 rounded-2xl shadow-sm">
                         <div className="flex items-center gap-4">
                            <Clock size={16} className="text-emerald-500" />
                            <p className="text-xs font-black text-gray-800 uppercase tracking-tighter">Chrome on Windows (Current)</p>
                         </div>
                         <p className="text-[10px] font-bold text-gray-400">Kigali, Rwanda</p>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white border border-gray-50 rounded-2xl shadow-sm opacity-60">
                         <div className="flex items-center gap-4">
                            <Clock size={16} className="text-gray-400" />
                            <p className="text-xs font-black text-gray-800 uppercase tracking-tighter">Safari on iPhone 15</p>
                         </div>
                         <p className="text-[10px] font-bold text-gray-400">2 days ago</p>
                      </div>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        initialData={userData} 
      />
    </div>
  );
}
