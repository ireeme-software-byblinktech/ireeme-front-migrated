"use client";

import { Card, CardBody } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/Shared";
import {
  Bell,
  FileText,
  ShieldAlert,
  Database,
  Shield,
  Eye,
  Save,
  Check
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
  { id: "reports", label: "Reports", icon: <FileText size={18} /> },
  { id: "cases", label: "Case Management", icon: <ShieldAlert size={18} /> },
  { id: "data", label: "Data & Archive", icon: <Database size={18} /> },
  { id: "security", label: "Security", icon: <Shield size={18} /> },
  { id: "interface", label: "Interface", icon: <Eye size={18} /> },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("notifications");
  const [settings, setSettings] = useState({
    autoNotifications: true,
    emailAlerts: true,
    smsAlerts: false,
    highSeverityAlerts: true,
    parentNotifications: true,
    escalationAlerts: true,
    dailyDigest: false,
    weekendNotifications: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 p-1"
    >
      <PageHeader
        title="Settings"
        subtitle="Manage your portal preferences and configurations"
      />

      {/* Tabs */}
      <div className="bg-white p-1.5 rounded-xl border border-gray-100 flex gap-1 overflow-x-auto scrollbar-hide shadow-sm shadow-gray-100/20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2.5 px-6 py-3 rounded-lg transition-all whitespace-nowrap font-bold text-[13px] tracking-tight",
              activeTab === tab.id
                ? "bg-black text-white shadow-xl shadow-black/20"
                : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Container */}
      <Card className="border-none shadow-2xl shadow-gray-200/30 rounded-[24px] overflow-hidden bg-white">
        <CardBody className="p-10">
          {activeTab === "notifications" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Alert Preferences */}
              <div className="space-y-10">
                <div className="flex items-center gap-4 text-gray-900">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                    <Bell size={20} className="text-black" />
                  </div>
                  <h2 className="text-xl font-black tracking-tight">Alert Preferences</h2>
                </div>
                <div className="space-y-4">
                  {[
                    { id: "autoNotifications", label: "Auto Notifications", desc: "Receive notifications for new cases" },
                    { id: "emailAlerts", label: "Email Alerts", desc: "Send email for important updates" },
                    { id: "smsAlerts", label: "SMS Alerts", desc: "Send text messages for urgent cases" },
                    { id: "highSeverityAlerts", label: "High Severity Alerts", desc: "Immediate alerts for high severity cases" },
                  ].map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleSetting(item.id as keyof typeof settings)}
                      className="flex items-center justify-between p-6 rounded-2xl bg-gray-50/40 hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all cursor-pointer group"
                    >
                      <div className="flex-1">
                        <h4 className="font-black text-[15px] text-gray-900 mb-1">{item.label}</h4>
                        <p className="text-[12px] text-gray-400 font-bold uppercase tracking-tight">{item.desc}</p>
                      </div>
                      <div className={cn(
                        "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all",
                        settings[item.id as keyof typeof settings]
                          ? "bg-black border-black"
                          : "border-gray-200 bg-white group-hover:border-gray-300"
                      )}>
                        {settings[item.id as keyof typeof settings] && <Check size={14} className="text-white" strokeWidth={4} />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Communication */}
              <div className="space-y-10">
                <div className="flex items-center gap-4 text-gray-900">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                    <Bell size={20} className="text-black" />
                  </div>
                  <h2 className="text-xl font-black tracking-tight">Communication</h2>
                </div>
                <div className="space-y-4">
                  {[
                    { id: "parentNotifications", label: "Parent Notifications", desc: "Notify parents automatically" },
                    { id: "escalationAlerts", label: "Escalation Alerts", desc: "Alert when cases are escalated" },
                    { id: "dailyDigest", label: "Daily Digest", desc: "Daily summary of activities" },
                    { id: "weekendNotifications", label: "Weekend Notifications", desc: "Receive notifications on weekends" },
                  ].map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleSetting(item.id as keyof typeof settings)}
                      className="flex items-center justify-between p-6 rounded-2xl bg-gray-50/40 hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all cursor-pointer group"
                    >
                      <div className="flex-1">
                        <h4 className="font-black text-[15px] text-gray-900 mb-1">{item.label}</h4>
                        <p className="text-[12px] text-gray-400 font-bold uppercase tracking-tight">{item.desc}</p>
                      </div>
                      <div className={cn(
                        "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all",
                        settings[item.id as keyof typeof settings]
                          ? "bg-black border-black"
                          : "border-gray-200 bg-white group-hover:border-gray-300"
                      )}>
                        {settings[item.id as keyof typeof settings] && <Check size={14} className="text-white" strokeWidth={4} />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      <div className="flex justify-end pt-2">
        <Button className="bg-black text-white hover:bg-gray-800 rounded-2xl py-8 h-auto px-12 font-black text-[16px] flex gap-3 items-center shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all hover:scale-[1.02] hover:-translate-y-1">
          <Save size={20} /> Save Settings
        </Button>
      </div>
    </motion.div>
  );
}
