"use client";

import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Download,
  Eye,
  Edit2,
  Lock,
  Filter,
  Users,
  BookOpen,
  ClipboardList,
  FileText,
  StickyNote
} from "lucide-react";
import { Card, CardBody, StatCard } from "@/components/ui/Card";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// ─── MOCK DATA ────────────────────────────────────────────────

const members = [
  { id: 1, name: "John Doe", email: "johndoe@gmail.com", role: "Student", loans: 3, status: "Active" },
  { id: 2, name: "John Doe", email: "johndoe@gmail.com", role: "Student", loans: 4, status: "Active" },
  { id: 3, name: "John Doe", email: "johndoe@gmail.com", role: "Student", loans: 2, status: "Active" },
  { id: 4, name: "John Doe", email: "johndoe@gmail.com", role: "Student", loans: 1, status: "Active" },
  { id: 5, name: "John Doe", email: "johndoe@gmail.com", role: "Student", loans: 4, status: "Active" },
  { id: 6, name: "John Doe", email: "johndoe@gmail.com", role: "Student", loans: 3, status: "Active" },
  { id: 7, name: "John Doe", email: "johndoe@gmail.com", role: "Student", loans: 3, status: "Active" },
  { id: 8, name: "John Doe", email: "johndoe@gmail.com", role: "Student", loans: 3, status: "Active" },
  { id: 9, name: "John Doe", email: "johndoe@gmail.com", role: "Student", loans: 3, status: "Active" },
  { id: 10, name: "John Doe", email: "johndoe@gmail.com", role: "Student", loans: 3, status: "Active" },
  { id: 11, name: "John Doe", email: "johndoe@gmail.com", role: "Teacher", loans: 3, status: "Active" },
];

type MemberItem = typeof members[number];

const memberCols: Column<MemberItem>[] = [
  {
    key: "checkbox",
    header: "",
    width: "60px",
    render: () => (
      <div className="flex justify-center">
        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black" />
      </div>
    )
  },
  { key: "name", header: "User name", render: (v) => <span className="font-semibold text-gray-800 ml-4">{String(v)}</span> },
  { key: "email", header: "User Email", render: (v) => <span className="text-gray-500">{String(v)}</span> },
  { key: "role", header: "Role", render: (v) => <span className="text-gray-600">{String(v)}</span> },
  { key: "loans", header: "Loans", render: (v) => <span className="text-gray-600 font-bold">{String(v)}</span> },
  {
    key: "status",
    header: "Status",
    render: (v) => (
      <span className={cn(
        "px-6 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border text-center block w-fit min-w-[100px]",
        v === "Active" ? "bg-black text-white border-black" : "bg-white text-gray-900 border-gray-200"
      )}>
        {String(v)}
      </span>
    )
  },
  {
    key: "action",
    header: "Action",
    render: () => (
      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-black transition-colors"><Eye size={18} /></button>
        <button className="text-gray-400 hover:text-black transition-colors"><Edit2 size={18} /></button>
        <button className="text-gray-400 hover:text-black transition-colors"><Lock size={18} /></button>
      </div>
    )
  }
];

export default function MembersPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-10"
    >
      {/* Header Section */}
      <div>
        <h1 className="text-[28px] font-black text-gray-900 tracking-tight">Library Members</h1>
        <p className="text-gray-500 text-sm font-medium mt-1">Manage library membership and member information</p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, member ID, or email..."
            className="w-full pl-12 pr-4 py-3 border border-gray-100 rounded-xl bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all text-sm"
          />
        </div>
        <div className="flex items-center gap-3 w-full xl:w-auto">
          <Button variant="outline" className="flex-1 xl:flex-none h-11 px-6 rounded-xl border-gray-100 font-bold text-gray-600 hover:bg-gray-50">
            All Types <Filter size={16} className="ml-2" />
          </Button>
          <Button variant="outline" className="flex-1 xl:flex-none h-11 px-6 rounded-xl border-gray-100 font-bold text-gray-600 hover:bg-gray-50">
            All Status <Filter size={16} className="ml-2" />
          </Button>
          <Button variant="outline" className="flex-1 xl:flex-none h-11 px-6 rounded-xl border-gray-100 font-bold text-gray-600 hover:bg-gray-50">
            <Download size={16} className="mr-2" /> Export
          </Button>
          <Button className="flex-1 xl:flex-none h-11 px-6 rounded-xl bg-black text-white font-bold hover:bg-gray-900 shadow-lg shadow-black/10 transition-all active:scale-95">
            <Plus size={18} className="mr-2" /> Add Member
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Subjects"
          value="15"
          icon={<BookOpen />}
          trend={{ value: "+3.6", direction: "up", label: "This month" }}
        />
        <StatCard
          label="Total Assignments"
          value="30"
          icon={<ClipboardList />}
          trend={{ value: "+3.6", direction: "up", label: "This month" }}
        />
        <StatCard
          label="Total Notes"
          value="30"
          icon={<StickyNote />}
          trend={{ value: "+3.6", direction: "up", label: "This month" }}
        />
        <StatCard
          label="Total reports"
          value="30"
          icon={<FileText />}
          trend={{ value: "+3.6", direction: "up", label: "This month" }}
        />
      </div>

      {/* Members Table */}
      <Card className="border-none shadow-xl shadow-gray-100/30 rounded-[24px] overflow-hidden bg-white">
        <CardBody className="p-0">
          <DataTable
            columns={memberCols}
            data={members}
            keyField="id"
          />
          <div className="p-6 flex items-center justify-between border-t border-gray-50 text-[11px] font-black text-gray-400 uppercase tracking-wider">
            <span>Showing 1 to 4 of 247 results</span>
            <div className="flex gap-4">
              <Button variant="outline" size="sm" className="px-5 h-10 text-[11px] border-gray-100 font-extrabold hover:bg-black hover:text-white transition-all rounded-lg">Previous</Button>
              <div className="flex gap-2">
                <Button size="sm" className="w-10 h-10 p-0 bg-black text-white text-[11px] font-black shadow-lg shadow-black/20 rounded-lg">1</Button>
                <Button variant="outline" size="sm" className="w-10 h-10 p-0 text-[11px] font-black border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">2</Button>
              </div>
              <Button variant="outline" size="sm" className="px-5 h-10 text-[11px] border-gray-100 font-extrabold hover:bg-black hover:text-white transition-all rounded-lg">Next</Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
