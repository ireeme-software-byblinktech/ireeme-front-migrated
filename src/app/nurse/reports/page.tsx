"use client";

import { StatCard } from "@/components/ui/Card";
import { Download, FileText, ChevronDown, GraduationCap, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";

const STATS = [
  { label: "Total Visits", value: "308", icon: <GraduationCap size={28} />, progress: 75, meta: { male: "61%", female: "39%" } },
  { label: "Cases Treated", value: "308", icon: <GraduationCap size={28} />, progress: 45, meta: { male: "61%", female: "39%" } },
  { label: "Appointments", value: "308", icon: <GraduationCap size={28} />, progress: 60, meta: { male: "61%", female: "39%" } },
  { label: "Recovery Rate", value: "308", icon: <GraduationCap size={28} />, progress: 25, meta: { male: "61%", female: "39%" } },
];

const QUICK_REPORTS = [
  { title: "Daily Summary", sub: "Today's activities" },
  { title: "Medication Report", sub: "Inventory & dispensing" },
  { title: "Student Health", sub: "Health records summary" },
];

const TABS = ["Daily", "Weekly", "Monthly", "Yearly"];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("Monthly");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-[28px] font-black text-gray-900 tracking-tight">Reports & Analytics</h1>
      </div>

      <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 bg-gray-50/50 p-2 rounded-2xl border border-gray-100">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-8 py-3 rounded-xl text-sm font-black transition-all",
                activeTab === tab
                  ? "bg-black text-white shadow-lg shadow-black/10"
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        <button className="bg-black text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-3 shadow-xl shadow-black/10 hover:shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
          <Download size={20} strokeWidth={3} />
          Export Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, i) => (
          <StatCard
            key={i}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            progress={stat.progress}
            meta={stat.meta}
          />
        ))}
      </div>

      {/* Trends Chart Section */}
      <div className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm relative">
        <div className="flex justify-between items-center mb-12 px-4">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Monthly Vlsists Trend</h2>
          <div className="flex items-center gap-3 px-6 py-2.5 bg-white border border-gray-100 rounded-xl text-sm font-black text-gray-600 shadow-sm cursor-pointer">
            2026
            <ChevronDown size={18} className="text-gray-400" />
          </div>
        </div>

        <div className="h-[360px] relative mt-4 overflow-visible">
          {/* Grid Lines - Matching Image 2 */}
          <div className="absolute inset-0 flex flex-col justify-between py-10 pr-0">
            {[200, 150, 100, 50, 0].map(y => (
              <div key={y} className="flex items-center gap-8">
                <span className="text-[13px] text-gray-400 w-8 text-right font-black">{y}</span>
                <div className="flex-1 h-[1px] bg-gray-100"></div>
              </div>
            ))}
          </div>

          {/* Months Labels - Uppercase centered per segment */}
          <div className="absolute bottom-0 left-16 right-0 flex justify-between px-0 pt-8">
            {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'].map(month => (
              <span key={month} className="text-[12px] text-gray-400 font-black tracking-widest uppercase w-[calc(100%/12)] text-center">{month}</span>
            ))}
          </div>

          {/* SVG Line Graph - Exact Jagged Profile from Image 2 */}
          <div className="absolute inset-0 left-16 pt-10 pb-10 pr-0">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 200">
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#27272a" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#f4f4f5" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M5,190 L10,180 L50,180 L80,182 L120,170 L150,120 L180,145 L220,140 L250,110 L300,180 L350,150 L400,165 L430,130 L450,105 L470,25 L490,175 L520,135 L550,150 L580,120 L620,145 L650,115 L680,125 L710,105 L730,185 L780,150 L810,155 L840,140 L880,175 L910,135 L950,120 L1000,100 L1000,200 L0,200 Z"
                fill="url(#trendGradient)"
              />
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                d="M5,190 L10,180 L50,180 L80,182 L120,170 L150,120 L180,145 L220,140 L250,110 L300,180 L350,150 L400,165 L430,130 L450,105 L470,25 L490,175 L520,135 L550,150 L580,120 L620,145 L650,115 L680,125 L710,105 L730,185 L780,150 L810,155 L840,140 L880,175 L910,135 L950,120 L1000,100"
                fill="none"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Dots at specific points matching Image 2 profile */}
              {[5, 120, 150, 250, 300, 470, 490, 710, 730].map((x, i) => {
                const map: Record<number, number> = {
                  5: 190, 120: 170, 150: 120, 250: 110, 300: 180, 470: 25, 490: 175, 710: 105, 730: 185
                };
                return <circle key={i} cx={x} cy={map[x]} r="4.5" fill="black" stroke="white" strokeWidth="2" />;
              })}
            </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Case Distribution Pie Chart Container */}
        <div className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm">
          <h2 className="text-xl font-black text-gray-900 tracking-tight mb-12">Case Distribution</h2>
          <div className="flex flex-col md:flex-row items-center gap-12 justify-center">
            <div className="relative w-64 h-64">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#000000" strokeWidth="20" strokeDasharray="88 251" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#4B5563" strokeWidth="20" strokeDasharray="63 251" strokeDashoffset="-88" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#9CA3AF" strokeWidth="20" strokeDasharray="50 251" strokeDashoffset="-151" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#D1D5DB" strokeWidth="20" strokeDasharray="38 251" strokeDashoffset="-201" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#E5E7EB" strokeWidth="20" strokeDasharray="12 251" strokeDashoffset="-239" />
              </svg>
            </div>
            <div className="space-y-4">
              {[
                { label: "Fever", color: "bg-black", pct: "35%" },
                { label: "Injury", color: "bg-gray-600", pct: "25%" },
                { label: "Headache", color: "bg-gray-400", pct: "20%" },
                { label: "Stomach", color: "bg-gray-300", pct: "15%" },
                { label: "Other", color: "bg-gray-200", pct: "5%" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-12">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-3 h-3 rounded-full", item.color)} />
                    <span className="text-sm font-bold text-gray-500">{item.label}</span>
                  </div>
                  <span className="text-sm font-black text-gray-900">{item.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Reports List */}
        <div className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm">
          <h2 className="text-xl font-black text-gray-900 tracking-tight mb-12">Quick Reports</h2>
          <div className="space-y-4">
            {QUICK_REPORTS.map((report, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 10 }}
                className="flex items-center gap-6 p-6 bg-gray-50/50 rounded-2xl hover:bg-white border border-transparent hover:border-gray-100 transition-all cursor-pointer shadow-sm group"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-900 shadow-sm border border-gray-50 group-hover:bg-black group-hover:text-white transition-all">
                  <FileText size={28} />
                </div>
                <div>
                  <h4 className="text-[17px] font-black text-gray-900 leading-none mb-1">{report.title}</h4>
                  <p className="text-sm font-bold text-gray-400">{report.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
