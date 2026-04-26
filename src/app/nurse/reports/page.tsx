"use client";

import { StatCard } from "@/components/ui";
import { Download, FileText, ChevronDown, GraduationCap, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";

const STATS = [
  { label: "Total Visits", value: "308", icon: <GraduationCap size={28} />, progress: 75, trend: { value: "+12", label: "from yesterday", direction: "up" as const } },
  { label: "Cases Treated", value: "308", icon: <GraduationCap size={28} />, progress: 45, trend: { value: "-3", label: "from yesterday", direction: "down" as const } },
  { label: "Appointments", value: "308", icon: <GraduationCap size={28} />, progress: 60, trend: { value: "4", label: "completed", direction: "up" as const } },
  { label: "Recovery Rate", value: "308", icon: <GraduationCap size={28} />, progress: 25, trend: { value: "-1", label: "this week", direction: "down" as const } },
];

const QUICK_REPORTS = [
  { title: "Daily Summary", sub: "Today's activities" },
  { title: "Medication Report", sub: "Inventory & dispensing" },
  { title: "Student Health", sub: "Health records summary" },
];

const TABS = ["Daily", "Weekly", "Monthly", "Yearly"];

// Chart Data — dense sub-monthly points to create the spiky look matching Super Admin
const denseValues = [
  8000, 15000, 22000, 28000,
  38000, 32000, 42000, 34000,
  26000, 22000, 28000, 24000,
  32000, 40000, 30000, 79000,
  64364.77, 50000, 42000, 38000,
  44000, 34000, 44000, 36000,
  26000, 16000, 10000, 20000,
  38000, 56000, 46000, 50000,
  60000, 48000, 40000, 36000,
  44000, 50000, 46000, 52000,
  40000, 34000, 46000, 50000,
  48000, 52000, 56000, 58000,
];

const dotIndices = [3, 7, 11, 15, 16, 20, 26, 29, 32, 36, 41, 44];
const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("Monthly");
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; value: number } | null>(null);

  const maxVal = 85000;
  const chartW = 1000;
  const chartH = 260; // Increased to match Super Admin
  const padTop = 20;
  const padBottom = 10;
  const svgH = chartH + padTop + padBottom;
  const n = denseValues.length;

  const pts = denseValues.map((value, i) => {
    const x = (i / (n - 1)) * chartW;
    const y = padTop + chartH - (value / maxVal) * chartH;
    return { x, y, value };
  });

  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L ${pts[n - 1].x} ${padTop + chartH} L ${pts[0].x} ${padTop + chartH} Z`;
  const dotPts = dotIndices.filter(i => i < n).map(i => pts[i]);

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
            trend={stat.trend}
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

        <div className="relative mt-8">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 origin-center text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase whitespace-nowrap select-none w-0 flex justify-center items-center">
            ( Visits Count )
          </div>
          
          <div className="ml-16 relative">
            <svg
              viewBox={`0 0 ${chartW} ${svgH}`}
              preserveAspectRatio="none"
              className="w-full h-[320px]"
            >
              <defs>
                <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C9CDD3" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#F9FAFB" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Horizontal grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((frac) => (
                <line
                  key={frac}
                  x1={0} y1={padTop + chartH - frac * chartH}
                  x2={chartW} y2={padTop + chartH - frac * chartH}
                  stroke="#F3F4F6" strokeWidth="1"
                />
              ))}

              {/* Area fill */}
              <path d={areaPath} fill="url(#fillGrad)" />

              {/* Dense spiky line */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                d={linePath}
                fill="none"
                stroke="black"
                strokeWidth="1.5"
                strokeLinejoin="miter"
                strokeLinecap="butt"
              />

              {/* Key dots */}
              {dotPts.map((point, i) => (
                <circle
                  key={i}
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill="black"
                  stroke="white"
                  strokeWidth="2"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(point)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}

              {/* Tooltip */}
              {hoveredPoint && (
                <g transform={`translate(${Math.min(hoveredPoint.x, chartW - 50)},${hoveredPoint.y - 18})`}>
                  <rect x="-44" y="-22" width="95" height="26" rx="6" fill="black" />
                  <text x="3" y="-5" textAnchor="middle" fill="white" fontSize="11" fontWeight="900">
                    {hoveredPoint.value.toLocaleString()}
                  </text>
                  <polygon points="-6,5 6,5 0,11" fill="black" />
                </g>
              )}
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between mt-4">
              {monthLabels.map((label, i) => (
                <span key={i} className="text-[11px] font-black text-gray-400 text-center uppercase tracking-widest" style={{ width: `${100 / monthLabels.length}%` }}>
                  {label}
                </span>
              ))}
            </div>
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
