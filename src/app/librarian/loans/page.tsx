"use client";

import { motion } from "framer-motion";
import {
  Search,
  Book,
  Eye,
  Edit2,
  Filter,
  User,
  Calendar,
} from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Shared";
import { useState } from "react";
import { cn } from "@/lib/utils";

// ─── MOCK DATA ────────────────────────────────────────────────

const loans = [
  { id: 1, title: "Crimes of stanfield", borrower: "John Doe", borrowDate: "25-07-2025", returnDate: "25-07-2025", status: "Active" },
  { id: 2, title: "Crimes of stanfield", borrower: "John Doe", borrowDate: "25-07-2025", returnDate: "25-07-2025", status: "Overdue" },
  { id: 3, title: "Crimes of stanfield", borrower: "John Doe", borrowDate: "25-07-2025", returnDate: "25-07-2025", status: "Active" },
  { id: 4, title: "Crimes of stanfield", borrower: "John Doe", borrowDate: "25-07-2025", returnDate: "25-07-2025", status: "Active" },
  { id: 5, title: "Crimes of stanfield", borrower: "John Doe", borrowDate: "25-07-2025", returnDate: "25-07-2025", status: "Active" },
  { id: 6, title: "Crimes of stanfield", borrower: "John Doe", borrowDate: "25-07-2025", returnDate: "25-07-2025", status: "Active" },
  { id: 7, title: "Crimes of stanfield", borrower: "John Doe", borrowDate: "25-07-2025", returnDate: "25-07-2025", status: "Active" },
  { id: 8, title: "Crimes of stanfield", borrower: "John Doe", borrowDate: "25-07-2025", returnDate: "25-07-2025", status: "Active" },
];

type LoanItem = typeof loans[number];

const loanCols: Column<LoanItem>[] = [
  {
    key: "id",
    header: "Book Cover",
    width: "100px",
    render: () => (
      <div className="w-10 h-14 bg-gray-50 rounded-sm overflow-hidden flex items-center justify-center border border-gray-100 shadow-sm ml-2">
        <Book className="text-gray-300" size={20} />
      </div>
    )
  },
  { key: "title", header: "Book Title", render: (v) => <span className="font-semibold text-gray-800">{String(v)}</span> },
  { key: "borrower", header: "Borrower", render: (v) => <span className="font-medium text-gray-600">{String(v)}</span> },
  { key: "borrowDate", header: "Borrow date", render: (v) => <span className="text-gray-500 tabular-nums">{String(v)}</span> },
  { key: "returnDate", header: "Return date", render: (v) => <span className="text-gray-500 tabular-nums">{String(v)}</span> },
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
        <button className="text-gray-400 hover:text-black transition-colors"><Edit2 size={18} /></button>
        <button className="text-gray-400 hover:text-black transition-colors"><Eye size={18} /></button>
      </div>
    )
  }
];

export default function LoansPage() {
  const [activeTab, setActiveTab] = useState("issue");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-10"
    >
      {/* Header Section */}
      <div>
        <h1 className="text-[28px] font-black text-gray-900 tracking-tight">Issue & Return Books</h1>
        <p className="text-gray-500 text-sm font-medium mt-1">Manage book transactions and returns</p>
      </div>

      <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 pt-6 border-b border-gray-50">
          <Tabs
            tabs={[
              { id: "issue", label: "Issue Book" },
              { id: "return", label: "Return Book" }
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        <div className="p-8">
          <h2 className="text-lg font-black text-gray-900 mb-6">{activeTab === "issue" ? "Issue New Book" : "Return a Book"}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[12px] font-black text-gray-500 uppercase tracking-widest pl-1">Student ID</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Enter student ID"
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-100 rounded-xl bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[12px] font-black text-gray-500 uppercase tracking-widest pl-1">Book ID / ISBN</label>
              <div className="relative">
                <Book className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Enter book ID or ISBN"
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-100 rounded-xl bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[12px] font-black text-gray-500 uppercase tracking-widest pl-1">Issue Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-100 rounded-xl bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[12px] font-black text-gray-500 uppercase tracking-widest pl-1">Due Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-100 rounded-xl bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <Button className="h-12 px-8 rounded-xl bg-black text-white font-black hover:bg-gray-900 shadow-lg shadow-black/10 transition-all active:scale-95">
              {activeTab === "issue" ? "Issue Book" : "Return Book"}
            </Button>
            <Button variant="outline" className="h-12 px-8 rounded-xl border-gray-200 font-black text-gray-500 hover:bg-gray-50">
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Transaction Records Table */}
      <div className="space-y-4">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by book title, student name, or ID..."
              className="w-full pl-12 pr-4 py-3 border border-gray-100 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all text-sm shadow-sm"
            />
          </div>
          <Button variant="outline" className="h-11 px-6 rounded-xl border-gray-100 font-bold text-gray-600 bg-white hover:bg-gray-50 shadow-sm">
            All Status <Filter size={16} className="ml-2" />
          </Button>
        </div>

        <Card className="border-none shadow-xl shadow-gray-100/30 rounded-[24px] overflow-hidden bg-white">
          <CardBody className="p-0">
            <div className="bg-black text-white px-8 py-5 flex justify-between items-center font-black uppercase tracking-widest text-[10px]">
              <span className="w-[100px]">Book Cover</span>
              <span className="flex-1">Book Title</span>
              <span className="flex-1">Borrower</span>
              <span className="flex-1">Borrow date</span>
              <span className="flex-1">Return date</span>
              <span className="flex-1">Status</span>
              <span className="w-[120px]">Action</span>
            </div>
            <DataTable
              columns={loanCols}
              data={loans}
              keyField="id"
              hideHeader
            />
          </CardBody>
        </Card>
      </div>
    </motion.div>
  );
}
