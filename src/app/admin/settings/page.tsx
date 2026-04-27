"use client";

import { useState } from "react";
import { User, Bell, Shield, Globe, Monitor, HelpCircle, Check, LogOut, Camera, Key } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "profile", label: "My Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security & Login", icon: Shield },
  { id: "preferences", label: "Preferences", icon: Monitor },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form States
  const [profileData, setProfileData] = useState({
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@iremee.ac",
    phone: "+250 788 123 456",
    bio: "Head Administrator at Iremee School, managing staff and academic operations."
  });

  const [notificationToggles, setNotificationToggles] = useState({
    emailAlerts: true,
    pushNotifications: true,
    smsAlerts: true,
    weeklyDigest: false,
  });

  const [appearance, setAppearance] = useState("light");

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
        <p className="text-gray-500 mt-1">Manage your administrative account and portal preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Settings Navigation */}
        <div className="w-full lg:w-64 shrink-0 space-y-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left",
                  isActive 
                    ? "bg-black text-white shadow-sm" 
                    : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
                )}
              >
                <Icon size={18} className={isActive ? "text-white" : "text-gray-400"} />
                {tab.label}
              </button>
            );
          })}
          
          <div className="pt-4 mt-4 border-t border-gray-100">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all text-left">
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 bg-white border border-gray-100 rounded-xl shadow-sm min-h-[500px]">
          
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>
              
              {/* Avatar Upload */}
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                <div className="relative group cursor-pointer">
                  <img src="https://ui-avatars.com/api/?name=Michael+Chen&background=000&color=fff&size=120" alt="Avatar" className="w-24 h-24 rounded-full object-cover shadow-sm bg-gray-50 border border-gray-200" />
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={24} className="text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Admin Photo</h3>
                  <p className="text-sm text-gray-500 mb-3">JPG, GIF or PNG. Max size of 800K</p>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-black transition-colors">Upload New</button>
                    <button className="px-4 py-2 bg-gray-50 text-gray-600 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors border border-gray-200">Remove</button>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">First Name</label>
                  <input type="text" value={profileData.firstName} onChange={(e) => setProfileData({...profileData, firstName: e.target.value})} className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Last Name</label>
                  <input type="text" value={profileData.lastName} onChange={(e) => setProfileData({...profileData, lastName: e.target.value})} className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <input type="email" value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone Number</label>
                  <input type="tel" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Administrative Bio</label>
                  <textarea rows={4} value={profileData.bio} onChange={(e) => setProfileData({...profileData, bio: e.target.value})} className="w-full px-4 py-3 rounded-md border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all resize-none"></textarea>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Portal Notifications</h2>
              <div className="space-y-6">
                {[
                  { key: 'emailAlerts', title: 'System Alerts', description: 'Receive important system status and administrative alerts via email.' },
                  { key: 'pushNotifications', title: 'Desktop Notifications', description: 'Get live browser notifications for urgent messages and system updates.' },
                  { key: 'smsAlerts', title: 'Critical SMS Alerts', description: 'Receive emergency broadcast alerts directly to your verified phone number.' },
                  { key: 'weeklyDigest', title: 'School Report Digest', description: 'Weekly analytical summary of school performance and teacher activities.' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
                    <div className="pr-8">
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    </div>
                    <button 
                      onClick={() => setNotificationToggles(prev => ({...prev, [item.key]: !prev[item.key as keyof typeof notificationToggles]}))}
                      className={cn(
                        "w-12 h-6 rounded-full flex items-center transition-colors shrink-0",
                        notificationToggles[item.key as keyof typeof notificationToggles] ? "bg-black" : "bg-gray-200"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform mx-1",
                        notificationToggles[item.key as keyof typeof notificationToggles] ? "translate-x-6" : "translate-x-0"
                      )} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Security & Login</h2>
              
              <div className="mb-8 p-6 bg-gray-50 border border-gray-100 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Key size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Administrator Authentication</h3>
                    <p className="text-sm text-gray-600 mt-1 mb-4">You are using high-privilege access. Multi-factor authentication (MFA) is strictly required for this account.</p>
                    <button onClick={() => alert("Redirecting to MFA Setup...")} className="px-4 py-2 bg-white border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm text-blue-600 font-bold">MFA Enabled (Manage)</button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-2">Change Password</h3>
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">New Password</label>
                    <input type="password" placeholder="New Password" className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input type="password" placeholder="Confirm Password" className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all" />
                  </div>
                  <button className="px-4 py-2.5 mt-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-black transition-colors">Update Admin Password</button>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <div className="p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Portal Preferences</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Interface Theme</h3>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setAppearance("light")}
                      className={cn("p-4 border rounded-xl flex flex-col items-center gap-3 transition-all", appearance === "light" ? "border-black bg-gray-50 ring-1 ring-black" : "border-gray-200 hover:border-gray-300")}
                    >
                      <div className="w-24 h-16 bg-white border border-gray-200 rounded-md shadow-sm"></div>
                      <span className="text-sm font-medium">Light Mode</span>
                    </button>
                    <button 
                      onClick={() => setAppearance("dark")}
                      className={cn("p-4 border rounded-xl flex flex-col items-center gap-3 transition-all", appearance === "dark" ? "border-black bg-gray-50 ring-1 ring-black" : "border-gray-200 hover:border-gray-300")}
                    >
                      <div className="w-24 h-16 bg-black rounded-md shadow-sm"></div>
                      <span className="text-sm font-medium">Dark Mode</span>
                    </button>
                    <button 
                      onClick={() => setAppearance("system")}
                      className={cn("p-4 border rounded-xl flex flex-col items-center gap-3 transition-all", appearance === "system" ? "border-black bg-gray-50 ring-1 ring-black" : "border-gray-200 hover:border-gray-300")}
                    >
                      <div className="w-24 h-16 bg-gradient-to-r from-gray-100 to-black rounded-md shadow-sm border border-gray-200"></div>
                      <span className="text-sm font-medium">System Default</span>
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-8">
                  <h3 className="font-semibold text-gray-900 mb-4">Language & Region</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Language</label>
                      <select className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-black/5 focus:border-black cursor-pointer">
                        <option>English (US)</option>
                        <option>French (FR)</option>
                        <option>Spanish (ES)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Administrative Timezone</label>
                      <select className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-black/5 focus:border-black cursor-pointer">
                        <option>Central Africa Time (CAT)</option>
                        <option>Eastern Standard Time (EST)</option>
                        <option>Pacific Standard Time (PST)</option>
                        <option>Greenwich Mean Time (GMT)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="px-8 py-5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between rounded-b-xl">
            <p className="text-sm text-gray-500">Changes will apply across your admin session.</p>
            <div className="flex items-center gap-3">
              <button className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors">Discard</button>
              <button 
                onClick={handleSave} 
                disabled={isSaving || savedSuccess}
                className="px-6 py-2.5 bg-black text-white rounded-md text-sm font-medium shadow-sm hover:bg-gray-900 transition-colors flex items-center gap-2 min-w-[120px] justify-center disabled:opacity-80"
              >
                {isSaving ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Saving...</>
                ) : savedSuccess ? (
                  <><Check size={16} /> Updated</>
                ) : (
                  "Save Settings"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
