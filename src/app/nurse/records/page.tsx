"use client";

import { PageHeader } from "@/components/ui/Shared";
import { StatCard, Card, CardBody } from "@/components/ui/Card";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import {
  Stethoscope,
  Users,
  CalendarDays,
  AlertCircle,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Filter,
  GraduationCap,
  BriefcaseMedical
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  AddRecordModal,
  UpdateRecordModal,
  ViewRecordModal,
  DeleteConfirmationModal
} from "@/components/nurse/HealthRecordModals";

const healthRecords = [
  { id: 1, name: "Amani Samuel", class: "S5 MCB", bloodType: "O+", allergies: "Peanuts", lastVisit: "02-02-2026" },
  { id: 2, name: "John Doe", class: "S5 MCB", bloodType: "O+", allergies: "Peanuts", lastVisit: "02-02-2026" },
  { id: 3, name: "John Doe", class: "S5 MCB", bloodType: "O+", allergies: "Peanuts", lastVisit: "02-02-2026" },
  { id: 4, name: "John Doe", class: "S5 MCB", bloodType: "O+", allergies: "Peanuts", lastVisit: "02-02-2026" },
  { id: 5, name: "John Doe", class: "S5 MCB", bloodType: "O+", allergies: "Peanuts", lastVisit: "02-02-2026" },
  { id: 6, name: "John Doe", class: "S5 MCB", bloodType: "O+", allergies: "Peanuts", lastVisit: "02-02-2026" },
  { id: 7, name: "John Doe", class: "S5 MCB", bloodType: "O+", allergies: "Peanuts", lastVisit: "02-02-2026" },
  { id: 8, name: "John Doe", class: "S5 MCB", bloodType: "O+", allergies: "Peanuts", lastVisit: "02-02-2026" },
  { id: 9, name: "John Doe", class: "S5 MCB", bloodType: "O+", allergies: "Peanuts", lastVisit: "02-02-2026" },
  { id: 10, name: "John Doe", class: "S5 MCB", bloodType: "O+", allergies: "Peanuts", lastVisit: "02-02-2026" },
];

export default function HealthRecordsPage() {
  const [records, setRecords] = useState(healthRecords);
  const [activeModal, setActiveModal] = useState<"add" | "edit" | "view" | "delete" | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const handleAdd = () => {
    const newRecord = {
      id: Date.now(),
      name: "New Student " + (records.length + 1),
      class: "S1 A",
      bloodType: "A+",
      allergies: "None",
      lastVisit: new Date().toISOString().split('T')[0]
    };
    setRecords([newRecord, ...records]);
  };

  const handleUpdate = () => {
    setRecords(records.map(r => r.id === selectedRecord.id ? { ...r, name: r.name + " (Updated)" } : r));
  };

  const handleDelete = () => {
    setRecords(records.filter(r => r.id !== selectedRecord.id));
  };

  const columns: Column<typeof healthRecords[number]>[] = [
    // ... (rest of COLUMNS stays the same, I'll just keep the variable records below)
    {
      key: "checkbox",
      header: "",
      render: () => <input type="checkbox" className="rounded border-gray-300 h-4 w-4" />
    },
    {
      key: "name",
      header: "Student Name",
      width: "280px",
      render: (v) => <span className="font-black text-gray-900 whitespace-nowrap">{String(v)}</span>
    },
    { key: "class", header: "Class" },
    { key: "bloodType", header: "Blood Type" },
    { key: "allergies", header: "Allergies" },
    { key: "lastVisit", header: "Last Visit" },
    {
      key: "action",
      header: "Action",
      align: "right",
      render: (_, row) => (
        <div className="flex items-center justify-end gap-5 px-4 font-black">
          <button
            onClick={() => { setSelectedRecord(row); setActiveModal("view"); }}
            className="hover:scale-110 transition-transform text-black"
          >
            <Eye size={20} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => { setSelectedRecord(row); setActiveModal("edit"); }}
            className="hover:scale-110 transition-transform text-black"
          >
            <Edit size={20} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => { setSelectedRecord(row); setActiveModal("delete"); }}
            className="hover:scale-110 transition-transform text-black hover:text-red-500"
          >
            <Trash2 size={20} strokeWidth={2.5} />
          </button>
        </div>
      )
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="stats-grid">
        {[
          { label: "Today's Visits", value: "308", icon: <Stethoscope size={28} />, progress: 75 },
          { label: "Active Cases", value: "308", icon: <BriefcaseMedical size={28} />, progress: 45 },
          { label: "Appointments", value: "308", icon: <CalendarDays size={28} />, progress: 60 },
          { label: "Critical Cases", value: "308", icon: <AlertCircle size={28} />, progress: 25 },
        ].map((stat, i) => (
          <StatCard
            key={i}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            progress={stat.progress}
            meta={{ male: "61%", female: "39%" }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by student name..."
              className="w-full pl-16 pr-6 py-4 border border-gray-100 rounded-full bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all text-sm font-medium"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-6 py-4 bg-gray-50/30 cursor-pointer hover:bg-gray-100 transition-all font-bold text-gray-600">
              <Filter size={18} className="text-gray-400" />
              <span className="text-[13px]">All Classes</span>
            </div>
            <Button
              onClick={() => setActiveModal("add")}
              className="bg-black text-white hover:opacity-90 rounded-xl h-[52px] px-10 font-black text-[13px] uppercase tracking-wider"
            >
              Add Record
            </Button>
          </div>
        </div>

        <Card className="mt-6 overflow-hidden border-none shadow-none rounded-[20px]">
          <CardBody className="p-0">
            <DataTable
              columns={columns}
              data={records}
              keyField="id"
              className="table-header-black"
              pageSize={10}
              paginationClassName="pagination-rounded p-6"
            />
          </CardBody>
        </Card>
      </motion.div>

      {/* Modals */}
      <AddRecordModal open={activeModal === "add"} onClose={() => setActiveModal(null)} onConfirm={handleAdd} />
      <UpdateRecordModal open={activeModal === "edit"} onClose={() => setActiveModal(null)} record={selectedRecord} onConfirm={handleUpdate} />
      <ViewRecordModal open={activeModal === "view"} onClose={() => setActiveModal(null)} record={selectedRecord} />
      <DeleteConfirmationModal open={activeModal === "delete"} onClose={() => setActiveModal(null)} onConfirm={handleDelete} />
    </motion.div >
  );
}
