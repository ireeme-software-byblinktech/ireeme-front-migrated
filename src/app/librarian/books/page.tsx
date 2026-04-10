"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  ClipboardList,
  FileText,
  Search,
  Book,
  Plus,
  Download,
  Eye,
  Trash2,
  Filter,
  StickyNote
} from "lucide-react";
import { Card, CardBody, StatCard } from "@/components/ui/Card";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// ─── MOCK DATA ────────────────────────────────────────────────

const books = [
  { id: 1, title: "Operating Systems", isbn: "978-0132350884", category: "Computer Science", stock: "2/5", status: "Active" },
  { id: 2, title: "Operating Systems", isbn: "978-0132350884", category: "Computer Science", stock: "3/5", status: "Borrowed" },
  { id: 3, title: "Operating Systems", isbn: "978-0132350884", category: "Computer Science", stock: "1/10", status: "Active" },
  { id: 4, title: "Operating Systems", isbn: "978-0132350884", category: "Computer Science", stock: "1/10", status: "Active" },
  { id: 5, title: "Operating Systems", isbn: "978-0132350884", category: "Computer Science", stock: "1/10", status: "Active" },
  { id: 6, title: "Operating Systems", isbn: "978-0132350884", category: "Computer Science", stock: "1/10", status: "Active" },
  { id: 7, title: "Operating Systems", isbn: "978-0132350884", category: "Computer Science", stock: "1/10", status: "Active" },
  { id: 8, title: "Operating Systems", isbn: "978-0132350884", category: "Computer Science", stock: "1/10", status: "Active" },
];

type BookItem = typeof books[number];

const bookCols: Column<BookItem>[] = [
  {
    key: "id",
    header: "Book Cover",
    width: "120px",
    render: () => (
      <div className="w-10 h-14 bg-gray-50 rounded-sm overflow-hidden flex items-center justify-center border border-gray-100 shadow-sm ml-2">
        <Book className="text-gray-300" size={20} />
      </div>
    )
  },
  { key: "title", header: "Book Title", render: (v) => <span className="font-semibold text-gray-800">{String(v)}</span> },
  { key: "isbn", header: "ISBN", render: (v) => <span className="text-gray-500 tabular-nums">{String(v)}</span> },
  { key: "category", header: "Category", render: (v) => <span className="text-gray-600">{String(v)}</span> },
  { key: "stock", header: "Stock", render: (v) => <span className="text-gray-600">{String(v)}</span> },
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
        <button className="text-gray-400 hover:text-rose-500 transition-colors"><Trash2 size={18} /></button>
      </div>
    )
  }
];

export default function BooksPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-10"
    >
      {/* Header Section */}
      <div>
        <h1 className="text-[28px] font-black text-gray-900 tracking-tight">Books Management</h1>
        <p className="text-gray-500 text-sm font-medium mt-1">Manage your library's book collection</p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by title, author, or ISBN..."
            className="w-full pl-12 pr-4 py-3 border border-gray-100 rounded-xl bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all text-sm"
          />
        </div>
        <div className="flex items-center gap-3 w-full xl:w-auto">
          <Button variant="outline" className="flex-1 xl:flex-none h-11 px-6 rounded-xl border-gray-100 font-bold text-gray-600 hover:bg-gray-50">
            All Categories <Filter size={16} className="ml-2" />
          </Button>
          <Button variant="outline" className="flex-1 xl:flex-none h-11 px-6 rounded-xl border-gray-100 font-bold text-gray-600 hover:bg-gray-50">
            <Download size={16} className="mr-2" /> Export
          </Button>
          <Button className="flex-1 xl:flex-none h-11 px-6 rounded-xl bg-black text-white font-bold hover:bg-gray-900 shadow-lg shadow-black/10 transition-all active:scale-95">
            <Plus size={18} className="mr-2" /> Add Book
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

      {/* Books Table */}
      <Card className="border-none shadow-xl shadow-gray-100/30 rounded-[24px] overflow-hidden bg-white">
        <CardBody className="p-0">
          <DataTable
            columns={bookCols}
            data={books}
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
