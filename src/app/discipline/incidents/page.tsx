"use client";

import { StatCard, Card, CardBody } from "@/components/ui";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/Shared";
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  MoreHorizontal
} from "lucide-react";
import { motion } from "framer-motion";

// ─── MOCK DATA ────────────────────────────────────────────────

const incidents = [
  { id: 1, student: "John Smith", incident: "Repeated tardiness", severity: "Medium", status: "Pending", date: "02-02-2026" },
  { id: 2, student: "John Smith", incident: "Repeated tardiness", severity: "Medium", status: "Pending", date: "02-02-2026" },
  { id: 3, student: "John Smith", incident: "Repeated tardiness", severity: "Medium", status: "Pending", date: "02-02-2026" },
  { id: 4, student: "John Smith", incident: "Repeated tardiness", severity: "Medium", status: "Pending", date: "02-02-2026" },
  { id: 5, student: "John Smith", incident: "Repeated tardiness", severity: "Medium", status: "Pending", date: "02-02-2026" },
  { id: 6, student: "John Doe", incident: "Repeated tardiness", severity: "Medium", status: "Pending", date: "02-02-2026" },
  { id: 7, student: "John Doe", incident: "Repeated tardiness", severity: "Medium", status: "Pending", date: "02-02-2026" },
  { id: 8, student: "John Doe", incident: "Repeated tardiness", severity: "Medium", status: "Pending", date: "02-02-2026" },
  { id: 9, student: "John Doe", incident: "Repeated tardiness", severity: "Medium", status: "Pending", date: "02-02-2026" },
  { id: 10, student: "John Doe", incident: "Repeated tardiness", severity: "Medium", status: "Pending", date: "02-02-2026" },
  { id: 11, student: "John Doe", incident: "Repeated tardiness", severity: "Medium", status: "Pending", date: "02-02-2026" },
  { id: 12, student: "John Doe", incident: "Repeated tardiness", severity: "Medium", status: "Pending", date: "02-02-2026" },
];

type IncidentRow = typeof incidents[number];

const incidentCols: Column<IncidentRow>[] = [
  { key: "id", header: "", render: () => <input type="checkbox" className="rounded border-gray-300" /> },
  { key: "student", header: "Student", render: (v) => <span className="font-medium text-gray-900">{String(v)}</span> },
  { key: "incident", header: "Incident", render: (v) => <span className="text-gray-600">{String(v)}</span> },
  { key: "severity", header: "Severity", render: (v) => <span className="text-gray-600">{String(v)}</span> },
  { key: "status", header: "Status", render: (v) => <span className="text-gray-600">{String(v)}</span> },
  { key: "date", header: "Date", render: (v) => <span className="text-gray-600">{String(v)}</span> },
  {
    key: "actions",
    header: "Actions",
    render: () => (
      <div className="flex gap-3">
        <button className="text-gray-400 hover:text-black transition-colors"><Eye size={18} /></button>
        <button className="text-gray-400 hover:text-black transition-colors"><Edit size={18} /></button>
        <button className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
      </div>
    )
  },
];

export default function IncidentsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 p-1"
    >
      <PageHeader
        title="Discipline Cases"
        subtitle="Manage and track active student disciplinary cases"
      />

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search Cases"
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all bg-white"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none py-3 px-6 h-auto normal-case font-medium border-gray-200 text-gray-600 hover:bg-gray-50 flex gap-2 items-center">
            <Filter size={16} /> All status
          </Button>
          <Button variant="outline" className="flex-1 md:flex-none py-3 px-6 h-auto normal-case font-medium border-gray-200 text-gray-600 hover:bg-gray-50 flex gap-2 items-center">
            <Filter size={16} /> All severities
          </Button>
          <Button className="flex-1 md:flex-none py-3 px-8 h-auto bg-black text-white hover:bg-gray-900 rounded-lg flex gap-2 items-center font-bold">
            New Case <Plus size={18} />
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Cases", value: "4", trend: "3.5", period: "last week" },
          { label: "Pending", value: "1", trend: "3.5", period: "this month" },
          { label: "Under Review", value: "2", trend: "3.5", period: "this month" },
          { label: "Resolved", value: "1", trend: "1.5", period: "this month" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm rounded-2xl bg-white p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full border-[3px] border-black flex items-center justify-center p-0.5">
                <div className="w-full h-full rounded-full border border-black/10 flex items-center justify-center bg-white">
                  {i === 3 ? <MoreHorizontal size={24} /> : <span className="font-bold text-xl">$</span>}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-700 text-sm font-medium">{stat.label}</p>
                <div className="flex items-baseline gap-3">
                  <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
                  <span className="text-[11px] font-bold text-emerald-500">{stat.trend}% <span className="text-gray-400">– {stat.period}</span></span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Table Section */}
      <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardBody className="p-0">
          <DataTable
            columns={incidentCols}
            data={incidents}
            keyField="id"
            className="discipline-cases-table"
          />
          <div className="p-6 flex items-center justify-between border-t border-gray-50 text-[11px] font-bold text-gray-400">
            <span>Showing 1 to 4 of 247 results</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="px-4 py-2 h-auto text-[11px] border-gray-200 uppercase font-black tracking-widest hover:bg-black hover:text-white transition-all rounded-lg">Previous</Button>
              <div className="flex gap-1">
                <Button size="sm" className="w-8 h-8 p-0 bg-black text-white text-[11px] font-black rounded-lg">1</Button>
                <Button variant="outline" size="sm" className="w-8 h-8 p-0 text-[11px] font-black border-gray-200 rounded-lg hover:bg-gray-50">2</Button>
              </div>
              <Button variant="outline" size="sm" className="px-4 py-2 h-auto text-[11px] border-gray-200 uppercase font-black tracking-widest hover:bg-black hover:text-white transition-all rounded-lg">Next</Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
