"use client";

import { useState } from "react";
import { StatCard, Card } from "@/components/ui/Card";
import { DataTable, Column } from "@/components/ui/DataTable";
import { DollarSign, MoreHorizontal, Filter, Download, ChevronDown } from "lucide-react";

// Stats
const reportsStats = [
  {
    label: "Total teachers",
    value: "2K",
    icon: <DollarSign size={18} />,
    progress: 75,
    trend: { value: "3.6~", direction: "up" as const, label: "This month" }
  },
  {
    label: "Total students",
    value: "30K",
    icon: <DollarSign size={18} />,
    progress: 60,
    trend: { value: "3.6~", direction: "up" as const, label: "This month" }
  },
  {
    label: "Attendance rate",
    value: "30%",
    icon: <DollarSign size={18} />,
    progress: 30,
    trend: { value: "3.6~", direction: "up" as const, label: "This month" }
  },
  {
    label: "Status",
    value: "ON",
    icon: <MoreHorizontal size={18} />,
    progress: 100,
    trend: { value: "", direction: "up" as const, label: "This month" }
  }
];

interface StudentReport {
  id: string;
  studentName: string;
  school: string;
  class: string;
  dateEnrolled: string;
}

const reportTableData: StudentReport[] = [
  ...Array.from({ length: 5 }).map((_, i) => ({
    id: `report-${i + 1}`,
    studentName: "John Doe",
    school: "Rwanda Coding Academy",
    class: "Primary four (P4)",
    dateEnrolled: "12, October, 2019"
  }))
];

// Chart Data — dense sub-monthly points to create the jagged/spiky look in the image
const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

// 4 data points per month. Shaped to match the reference image visually.
const denseValues = [
  // Jan — starts low, climbs steadily
  8000, 15000, 22000, 28000,
  // Feb — notable peak (prominent dot in image), slight dip then back up
  38000, 32000, 42000, 34000,
  // Mar — mid-range, flatter
  26000, 22000, 28000, 24000,
  // Apr — rises into a tall dramatic spike
  32000, 40000, 30000, 79000,
  // May — post-spike drop. 64364.77 is the hover value shown in image. Then drops further
  64364.77, 50000, 42000, 38000,
  // June — lower, zigzag
  44000, 34000, 44000, 36000,
  // July — deep dip (lowest point in image)
  26000, 16000, 10000, 20000,
  // Aug — rebounds high with a peak then dots
  38000, 56000, 46000, 50000,
  // Sep — high then drops to flat range
  60000, 48000, 40000, 36000,
  // Oct — mid-range
  44000, 50000, 46000, 52000,
  // Nov — slight dip with a dot near low point
  40000, 34000, 46000, 50000,
  // Dec — ends higher
  48000, 52000, 56000, 58000,
];

// Key dot indices (one visible black dot per month at a notable position — matches the image)
const dotIndices = [3, 7, 11, 15, 16, 20, 26, 29, 32, 36, 41, 44];

// Month label x-positions used for the x-axis
const monthBoundaries = monthLabels;

export default function SuperAdminReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState("October");
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; value: number } | null>(null);

  const maxVal = 85000;
  const chartW = 1000;
  const chartH = 260;
  const padTop = 20;
  const padBottom = 10;
  const svgH = chartH + padTop + padBottom;
  const n = denseValues.length;

  // Map all dense values to SVG coordinates
  const pts = denseValues.map((value, i) => {
    const x = (i / (n - 1)) * chartW;
    const y = padTop + chartH - (value / maxVal) * chartH;
    return { x, y, value };
  });

  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L ${pts[n - 1].x} ${padTop + chartH} L ${pts[0].x} ${padTop + chartH} Z`;
  const dotPts = dotIndices.filter(i => i < n).map(i => pts[i]);



  const columns: Column<StudentReport>[] = [
    {
      key: "studentName",
      header: "Student name",
      render: (_, row) => <div className="font-semibold text-gray-900">{row.studentName}</div>
    },
    {
      key: "school",
      header: "School",
      render: (_, row) => <div className="text-gray-600">{row.school}</div>
    },
    {
      key: "class",
      header: "Class",
      render: (_, row) => <div className="text-gray-600">{row.class}</div>
    },
    {
      key: "dateEnrolled",
      header: "Date enrolled",
      render: (_, row) => <div className="text-gray-600">{row.dateEnrolled}</div>
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-500 mt-1">
          Detailed overview of system performance, including enrollment and attendance metrics.
        </p>
      </div>

      {/* Filter Toolbar — matches the image exactly */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center mb-2">
        {/* Left: pill-style filter bar */}
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm h-12 divide-x divide-gray-100">
          {/* Filter icon box */}
          <div className="flex items-center justify-center w-14 h-full shrink-0 bg-white">
            <Filter size={17} className="text-gray-500" />
          </div>

          {/* "Filter By" label */}
          <div className="flex items-center px-4 h-full bg-white">
            <span className="text-sm font-semibold text-gray-600 whitespace-nowrap">Filter By</span>
          </div>

          {/* School dropdown */}
          <div className="flex items-center justify-between px-4 h-full bg-white gap-2 cursor-pointer min-w-[110px]">
            <select
              defaultValue=""
              className="bg-transparent border-none outline-none focus:ring-0 text-sm font-semibold text-gray-800 cursor-pointer appearance-none"
            >
              <option value="">School</option>
              <option value="rca">Rwanda Coding Academy</option>
            </select>
            <ChevronDown size={13} className="text-gray-500 shrink-0 pointer-events-none" />
          </div>

          {/* Date range dropdown */}
          <div className="flex items-center justify-between px-4 h-full bg-white gap-2 cursor-pointer min-w-[130px]">
            <select
              defaultValue=""
              className="bg-transparent border-none outline-none focus:ring-0 text-sm font-semibold text-gray-800 cursor-pointer appearance-none"
            >
              <option value="">Date range</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="1y">Last year</option>
            </select>
            <ChevronDown size={13} className="text-gray-500 shrink-0 pointer-events-none" />
          </div>

          {/* Report type dropdown */}
          <div className="flex items-center justify-between px-4 h-full bg-white gap-2 cursor-pointer min-w-[140px]">
            <select
              defaultValue=""
              className="bg-transparent border-none outline-none focus:ring-0 text-sm font-semibold text-gray-800 cursor-pointer appearance-none"
            >
              <option value="">Report type</option>
              <option value="enrollment">Enrollment</option>
              <option value="attendance">Attendance</option>
            </select>
            <ChevronDown size={13} className="text-gray-500 shrink-0 pointer-events-none" />
          </div>
        </div>

        {/* Generate report button */}
        <button className="bg-black text-white px-6 h-12 rounded-md text-md font-semibold hover:bg-gray-800 transition-colors whitespace-nowrap shadow-md">
          Generate report
        </button>
      </div>

      {/* Stat Cards — 4 in a row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {reportsStats.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            progress={stat.progress}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Chart Card */}
      <Card className="border border-gray-100 shadow-sm rounded-xl overflow-hidden">
        {/* Chart Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-2xl font-bold text-gray-900">Students enrollment per month</h2>
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border border-gray-200 rounded-md pl-3 pr-8 py-1.5 text-sm font-semibold text-gray-700 appearance-none cursor-pointer bg-white focus:outline-none"
            >
              {monthLabels.map((m: string) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Chart body */}
        <div className="relative px-6 pb-8">
          {/* Y-axis rotated label */}
          <div
            className="absolute left-6 top-1/2 -translate-y-1/2 -rotate-90 origin-center text-[12px] font-medium text-gray-400 tracking-widest whitespace-nowrap select-none w-0 flex justify-center items-center"
          >
            ( Number of students enrolled )
          </div>
          {/* SVG chart */}
          <div className="ml-16">
            <svg
              viewBox={`0 0 ${chartW} ${svgH}`}
              preserveAspectRatio="none"
              className="w-full"
              style={{ height: "280px" }}
            >
              <defs>
                <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C9CDD3" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#F9FAFB" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Horizontal grid lines */}
              {[0.25, 0.5, 0.75, 1].map((frac) => (
                <line
                  key={frac}
                  x1={0} y1={padTop + chartH - frac * chartH}
                  x2={chartW} y2={padTop + chartH - frac * chartH}
                  stroke="#EBEBEB" strokeWidth="1"
                />
              ))}

              {/* Area fill */}
              <path d={areaPath} fill="url(#fillGrad)" />

              {/* Dense jagged line */}
              <path
                d={linePath}
                fill="none"
                stroke="#111827"
                strokeWidth="1.5"
                strokeLinejoin="miter"
                strokeLinecap="butt"
              />

              {/* Key dots — only at selected inflection points like the image */}
              {dotPts.map((point, i) => (
                <circle
                  key={i}
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill="#111827"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(point)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}

              {/* All points are hoverable (invisible hit targets) */}
              {pts.map((point, i) => (
                <circle
                  key={`hit-${i}`}
                  cx={point.x}
                  cy={point.y}
                  r="6"
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(point)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}

              {/* Tooltip */}
              {hoveredPoint && (
                <g transform={`translate(${Math.min(hoveredPoint.x, chartW - 50)},${hoveredPoint.y - 18})`}>
                  <rect x="-44" y="-22" width="95" height="26" rx="3" fill="#111827" />
                  <text x="3" y="-5" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">
                    {hoveredPoint.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </text>
                  <polygon points="-6,5 6,5 0,11" fill="#111827" />
                </g>
              )}
            </svg>

            {/* X-axis labels — one per month, evenly spaced */}
            <div className="flex justify-between mt-1">
              {monthLabels.map((label, i) => (
                <span key={i} className="text-[11px] font-semibold text-gray-400 text-center" style={{ width: `${100 / monthLabels.length}%` }}>
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Report Table */}
      <div className="mt-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Report table</h2>
          <button className="bg-black text-white px-5 py-2 rounded-md text-sm font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors">
            Download pdf <Download size={15} />
          </button>
        </div>
        <Card className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <DataTable
            columns={columns as unknown as Column<Record<string, unknown>>[]}
            data={reportTableData as unknown as Record<string, unknown>[]}
            keyField="id"
            className="reports-table border-0 w-full"
          />
        </Card>
      </div>
    </div>
  );
}
