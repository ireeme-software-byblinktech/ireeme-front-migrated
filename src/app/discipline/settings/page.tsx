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
  Check,
  Plus,
  Edit,
  Trash2
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { disciplineApi, OffenseType } from "@/lib/api/discipline";

const tabs = [
  { id: "offense-types", label: "Offense Types", icon: <ShieldAlert size={18} /> },
  { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
  { id: "reports", label: "Reports", icon: <FileText size={18} /> },
  { id: "cases", label: "Case Management", icon: <ShieldAlert size={18} /> },
  { id: "data", label: "Data & Archive", icon: <Database size={18} /> },
  { id: "security", label: "Security", icon: <Shield size={18} /> },
  { id: "interface", label: "Interface", icon: <Eye size={18} /> },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("offense-types");
  const [offenseTypes, setOffenseTypes] = useState<OffenseType[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingOffense, setEditingOffense] = useState<OffenseType | null>(null);
  const [formData, setFormData] = useState({ name: "", pointDeduction: 0 });
  
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

  useEffect(() => {
    if (activeTab === "offense-types") {
      fetchOffenseTypes();
    }
  }, [activeTab]);

  const fetchOffenseTypes = async () => {
    try {
      setLoading(true);
      const data = await disciplineApi.getOffenseTypes();
      setOffenseTypes(data);
    } catch (error) {
      console.error("Failed to fetch offense types:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOffense = async () => {
    if (!formData.name || formData.pointDeduction <= 0) {
      alert("Please fill all fields");
      return;
    }
    try {
      await disciplineApi.createOffenseType(formData);
      setShowAddModal(false);
      setFormData({ name: "", pointDeduction: 0 });
      fetchOffenseTypes();
    } catch (error) {
      console.error("Failed to create offense type:", error);
      alert("Failed to create offense type");
    }
  };

  const handleUpdateOffense = async () => {
    if (!editingOffense || !formData.name || formData.pointDeduction <= 0) {
      alert("Please fill all fields");
      return;
    }
    try {
      await disciplineApi.updateOffenseType(editingOffense.id, formData);
      setEditingOffense(null);
      setFormData({ name: "", pointDeduction: 0 });
      fetchOffenseTypes();
    } catch (error) {
      console.error("Failed to update offense type:", error);
      alert("Failed to update offense type");
    }
  };

  const handleDeleteOffense = async (id: string) => {
    if (!confirm("Are you sure you want to delete this offense type?")) return;
    try {
      await disciplineApi.deleteOffenseType(id);
      fetchOffenseTypes();
    } catch (error) {
      console.error("Failed to delete offense type:", error);
      alert("Failed to delete offense type");
    }
  };

  const startEdit = (offense: OffenseType) => {
    setEditingOffense(offense);
    setFormData({ name: offense.name, pointDeduction: offense.pointDeduction });
  };

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
          {activeTab === "offense-types" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-gray-900">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                    <ShieldAlert size={20} className="text-black" />
                  </div>
                  <h2 className="text-xl font-black tracking-tight">Offense Types</h2>
                </div>
                <Button 
                  onClick={() => setShowAddModal(true)}
                  className="bg-black text-white hover:bg-gray-800 rounded-lg py-3 px-6 font-bold flex gap-2 items-center"
                >
                  <Plus size={18} /> Add Offense Type
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-12 text-gray-500">Loading...</div>
              ) : offenseTypes.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No offense types found. Add one to get started.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {offenseTypes.map((offense) => (
                    <div
                      key={offense.id}
                      className="flex items-center justify-between p-6 rounded-2xl bg-gray-50/40 hover:bg-gray-50 border border-gray-100 transition-all"
                    >
                      <div className="flex-1">
                        <h4 className="font-black text-[15px] text-gray-900 mb-1">{offense.name}</h4>
                        <p className="text-[12px] text-red-600 font-bold uppercase tracking-tight">
                          -{offense.pointDeduction} points
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(offense)}
                          className="p-2 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-black"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteOffense(offense.id)}
                          className="p-2 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add/Edit Modal */}
              {(showAddModal || editingOffense) && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-2xl p-8 max-w-md w-full space-y-6">
                    <h3 className="text-2xl font-black">
                      {editingOffense ? "Edit Offense Type" : "Add Offense Type"}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Offense Name
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                          placeholder="e.g., Fighting, Tardiness"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Point Deduction
                        </label>
                        <input
                          type="number"
                          value={formData.pointDeduction}
                          onChange={(e) => setFormData({ ...formData, pointDeduction: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                          placeholder="e.g., 10"
                          min="0"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => {
                          setShowAddModal(false);
                          setEditingOffense(null);
                          setFormData({ name: "", pointDeduction: 0 });
                        }}
                        variant="outline"
                        className="flex-1 py-3 border-gray-200"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={editingOffense ? handleUpdateOffense : handleAddOffense}
                        className="flex-1 py-3 bg-black text-white hover:bg-gray-800"
                      >
                        {editingOffense ? "Update" : "Add"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
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
