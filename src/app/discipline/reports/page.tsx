"use client";

import { Card, CardHeader, CardBody } from "@/components/ui";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/Shared";
import {
  FileText,
  Download,
  TrendingUp,
  BarChart2,
  Calendar,
  ChevronDown,
  Filter,
  Plus,
  LayoutDashboard,
  Search
} from "lucide-react";
import { motion } from "framer-motion";

// ─── MOCK DATA ────────────────────────────────────────────────

const incidentTypes = [
  { label: "Disruptive Behavior", count: 48, percentage: 80 },
  { label: "Tardiness", count: 38, percentage: 65 },
  { label: "Academic Dishonesty", count: 32, percentage: 55 },
  { label: "Fighting", count: 28, percentage: 45 },
  { label: "Vandalism", count: 20, percentage: 35 },
  { label: "Other", count: 15, percentage: 25 },
];

const generatedReports = [
  { id: 1, title: "Monthly Discipline sum", type: "Summary", period: "March 2026", date: "02/03/2026", size: "2.4 MB" },
  { id: 2, title: "Behavior Trends", type: "Analysis", period: "March 2026", date: "02/03/2026", size: "2.4 MB" },
  { id: 3, title: "Behavior Trends", type: "Incident", period: "March 2026", date: "02/03/2026", size: "2.4 MB" },
  { id: 4, title: "Behavior Trends", type: "Summary", period: "March 2026", date: "01/03/2026", size: "2.4 MB" },
  { id: 5, title: "Behavior Trends", type: "Summary", period: "March 2026", date: "01/03/2026", size: "2.4 MB" },
  { id: 6, title: "Behavior Trends", type: "Summary", period: "March 2026", date: "01/03/2026", size: "2.4 MB" },
  { id: 7, title: "Behavior Trends", type: "Incident", period: "March 2026", date: "01/03/2026", size: "2.4 MB" },
  { id: 8, title: "Behavior Trends", type: "Summary", period: "March 2026", date: "01/03/2026", size: "2.4 MB" },
  { id: 9, title: "Behavior Trends", type: "Summary", period: "March 2026", date: "01/03/2026", size: "2.4 MB" },
  { id: 10, title: "Behavior Trends", type: "Summary", period: "March 2026", date: "01/03/2026", size: "2.4 MB" },
];

const reportCols: Column<any>[] = [
  { key: "id", header: "", render: () => <input type="checkbox" className="rounded" /> },
  { key: "title", header: "Report Title", render: (v) => <span className="text-gray-900 font-medium">{String(v)}</span> },
  { key: "type", header: "Type", render: (v) => <span className="text-gray-500">{String(v)}</span> },
  { key: "period", header: "Period", render: (v) => <span className="text-gray-500">{String(v)}</span> },
  { key: "date", header: "Generated", render: (v) => <span className="text-gray-500">{String(v)}</span> },
  { key: "size", header: "Size", render: (v) => <span className="text-gray-500">{String(v)}</span> },
  {
    key: "actions",
    header: "Actions",
    render: () => (
      <button className="text-blue-500 hover:text-blue-600 transition-colors">
        <Download size={18} />
      </button>
    )
  },
];

export default function ReportsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 p-1"
    >
      <PageHeader
        title="Discipline Reports"
        subtitle="Generate and analyze disciplinary patterns and automated reports"
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Cases", value: "179", trend: "+12", period: "this week" },
          { label: "Active Cases", value: "23", trend: "+2", period: "this month" },
          { label: "Resolved Cases", value: "156", trend: "+15", period: "this month" },
          { label: "Students Affected", value: "67", trend: "+5", period: "this month" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm rounded-2xl bg-white p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full border-[3px] border-black flex items-center justify-center p-0.5">
                <div className="w-full h-full rounded-full border border-black/10 flex items-center justify-center bg-gray-50">
                  <span className="font-bold text-xl">{i === 3 ? "○" : "$"}</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                <div className="flex items-baseline gap-3">
                  <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
                  <span className="text-[11px] font-bold text-emerald-500">{stat.trend} <span className="text-gray-400">– {stat.period}</span></span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <Card className="lg:col-span-2 border-none shadow-sm rounded-2xl bg-white overflow-hidden">
          <CardHeader title="Incidents by Type" className="px-8 pt-8 border-none" />
          <CardBody className="px-8 pb-8 space-y-6">
            {incidentTypes.map((type, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-gray-600">{type.label}</span>
                  <span className="text-black">{type.count}</span>
                </div>
                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${type.percentage}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="h-full bg-black rounded-full"
                  />
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Generate Report Form */}
        <Card className="border-none shadow-sm rounded-2xl bg-white p-8">
          <h2 className="text-lg font-black text-gray-900 mb-8 border-none">Generate Report</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Report Type</label>
              <div className="relative">
                <select className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-black/5 appearance-none">
                  <option>Monthly Summary</option>
                  <option>Weekly Report</option>
                  <option>Annual Overview</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Period</label>
              <div className="relative">
                <select className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-black/5 appearance-none">
                  <option>This Month</option>
                  <option>Last Month</option>
                  <option>Custom Range</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
            <Button className="w-full bg-black text-white hover:bg-gray-900 rounded-xl py-7 font-black flex gap-3 items-center justify-center transition-all hover:scale-[1.02] shadow-xl shadow-black/10">
              <FileText size={18} /> Generate Report
            </Button>
          </div>
        </Card>
      </div>

      {/* Table Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Generated Reports</h2>
          <Button variant="outline" className="flex gap-2 items-center text-gray-400 font-bold border-gray-100">
            <Filter size={16} /> All Types
          </Button>
        </div>
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
          <CardBody className="p-0">
            <DataTable
              columns={reportCols}
              data={generatedReports}
              keyField="id"
            />
          </CardBody>
        </Card>
      </div>
    </motion.div>
  );
}
