"use client";

import { useState } from "react";
import { StatCard, Card, CardBody } from "@/components/ui/Card";
import { DataTable, Column } from "@/components/ui/DataTable";
import { GraduationCap, FileText, SquarePen } from "lucide-react";

// Stats data array matching the mockup
const statsData = [
  {
    label: "Total Subjects",
    value: 15,
    icon: <GraduationCap size={20} />,
    progress: 75,
    trend: { value: "3.6", direction: "up" as const, label: "This month" }
  },
  {
    label: "Total Assignments", 
    value: 30,
    icon: <FileText size={20} />,
    progress: 80,
    trend: { value: "3.6", direction: "up" as const, label: "This month" }
  },
  {
    label: "Total Notes",
    value: 30, 
    icon: <FileText size={20} />,
    progress: 65,
    trend: { value: "3.6", direction: "up" as const, label: "This month" }
  },
  {
    label: "Total reports",
    value: 30,
    icon: <FileText size={20} />,
    progress: 90,
    trend: { value: "3.6", direction: "up" as const, label: "This month" }
  }
];

// Sample table data based on the mockup
interface DisciplineMark {
  id: string;
  date: string;
  reason: string;
  preparedBy: string;
  deducted: string;
  term: string;
  status: string;
}

const tableData: DisciplineMark[] = [
  { id: "1", date: "Nov 15th, 2025", reason: "Late arrival to class", preparedBy: "Prof. Williams", deducted: "-3", term: "Term 1", status: "Active" },
  { id: "2", date: "Nov 15th, 2025", reason: "Late arrival to class", preparedBy: "Prof. Williams", deducted: "-4", term: "Term 1", status: "Active" },
  { id: "3", date: "Nov 15th, 2025", reason: "Late arrival to class", preparedBy: "Prof. Williams", deducted: "-2", term: "Term 1", status: "Active" },
  { id: "4", date: "Nov 15th, 2025", reason: "Late arrival to class", preparedBy: "Prof. Williams", deducted: "-1", term: "Term 1", status: "Active" },
  { id: "5", date: "Nov 15th, 2025", reason: "Late arrival to class", preparedBy: "Prof. Williams", deducted: "-4", term: "Term 1", status: "Active" },
  { id: "6", date: "Nov 15th, 2025", reason: "Late arrival to class", preparedBy: "Prof. Williams", deducted: "-3", term: "Term 1", status: "Active" },
  { id: "7", date: "Nov 15th, 2025", reason: "Late arrival to class", preparedBy: "Prof. Williams", deducted: "-3", term: "Term 1", status: "Active" },
];

export default function StudentDisciplinePage() {
  const [activeTab, setActiveTab] = useState("All Terms");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DisciplineMark | null>(null);

  // Filtering
  const filteredData = activeTab === "All Terms" 
    ? tableData 
    : tableData.filter(item => item.term === activeTab);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const columns: Column<DisciplineMark>[] = [
    {
      key: "date",
      header: "Date",
      render: (_, row) => (
        <div className="font-medium text-gray-900 py-2">{row.date}</div>
      )
    },
    {
      key: "reason",
      header: "Reason",
      render: (_, row) => (
        <div className="text-gray-600">{row.reason}</div>
      )
    },
    {
      key: "preparedBy",
      header: "Prepared by",
      render: (_, row) => (
        <div className="text-gray-600">{row.preparedBy}</div>
      )
    },
    {
      key: "deducted",
      header: "Deducted",
      render: (_, row) => (
        <div className="text-gray-900 font-medium">{row.deducted}</div>
      )
    },
    {
      key: "term",
      header: "Term",
      render: (_, row) => (
        <div className="text-gray-600">{row.term}</div>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (_, row) => (
        <span className="bg-black text-white px-4 py-1.5 rounded-md text-sm font-bold">
          {row.status}
        </span>
      )
    },
    {
      key: "action",
      header: "Action",
      align: "center",
      render: (_, row) => (
        <button 
          onClick={() => {
            setSelectedRecord(row);
            setIsActionModalOpen(true);
          }}
          className="text-gray-900 hover:text-gray-600 p-2 transition-colors"
        >
          <SquarePen size={20} strokeWidth={2.5} />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-8 max-w-[1240px] w-full pb-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] mb-1">Discipline Marks</h1>
          <p className="text-lg text-gray-500">Track your discipline marks and deductions</p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-md px-4 py-2 shadow-sm">
          <span className="text-gray-600 font-medium">Academic Year:</span>
          <select className="bg-transparent border-none outline-none text-gray-900 font-bold focus:ring-0 cursor-pointer text-base">
            <option>2024-2025</option>
            <option>2023-2024</option>
          </select>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value.toString()}
            icon={stat.icon}
            progress={stat.progress}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Term-wise Deductions */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900">Term-wise Deductions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h4 className="text-gray-600 font-bold text-base mb-2">Term 1</h4>
            <div className="text-4xl font-extrabold text-gray-900 mb-2">-7</div>
            <p className="text-gray-500 text-sm font-medium">marks deducted</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h4 className="text-gray-600 font-bold text-base mb-2">Term 2</h4>
            <div className="text-4xl font-extrabold text-gray-900 mb-2">-0</div>
            <p className="text-gray-500 text-sm font-medium">marks deducted</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h4 className="text-gray-600 font-bold text-base mb-2">Term 3</h4>
            <div className="text-4xl font-extrabold text-gray-900 mb-2">-0</div>
            <p className="text-gray-500 text-sm font-medium">marks deducted</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        {["All Terms", "Term 1", "Term 2", "Term 3"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            className={`px-6 py-2.5 rounded-md font-bold text-sm transition-all shadow-sm border ${
              activeTab === tab
                ? "bg-black text-white border-black"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Data Table Container */}
      <div className="bg-white border border-gray-200 rounded-none shadow-sm overflow-hidden">
        <div className="p-0">
          <div className="overflow-x-auto">
            <style>{`
              .discipline-table th { background-color: #000; color: #fff; padding-top: 1rem; padding-bottom: 1rem; border-bottom: none; font-weight: 600; }
              .discipline-table tr:nth-child(even) { background-color: #f9fafb; }
              .discipline-table tr:hover { background-color: #f3f4f6; }
              .discipline-table td { padding-top: 1rem; padding-bottom: 1rem; }
            `}</style>
            <DataTable
              columns={columns as unknown as Column<Record<string, unknown>>[]}
              data={paginatedData as unknown as Record<string, unknown>[]}
              keyField="id"
              className="discipline-table w-full"
            />
          </div>

          {/* Pagination Match */}
          <div className="flex items-center justify-between px-8 py-5 border-t border-gray-200 bg-white">
            <div className="text-sm font-medium text-gray-500">
              Showing {filteredData.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} results
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-bold border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 bg-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md font-bold text-sm ${
                      currentPage === i + 1 
                        ? 'bg-black text-white' 
                        : 'border border-gray-200 text-gray-700 hover:bg-gray-50 bg-white'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-4 py-2 text-sm font-bold border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 bg-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Modal Component */}
      {isActionModalOpen && (
        <DisciplineActionModal
          isOpen={isActionModalOpen}
          record={selectedRecord}
          onClose={() => {
            setIsActionModalOpen(false);
            setSelectedRecord(null);
          }}
        />
      )}
    </div>
  );
}

// Reused Modal Design directly matching the 'documents' page modal structure
function DisciplineActionModal({ 
  isOpen, 
  record, 
  onClose 
}: { 
  isOpen: boolean; 
  record: DisciplineMark | null;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    explanation: ""
  });

  if (!isOpen || !record) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[9999]">
        {/* Sidebar area exclusion */}
        <div className="absolute left-0 top-0 w-64 h-full bg-transparent pointer-events-none hidden md:block"></div>
        
        {/* Main content backdrop */}
        <div className="absolute left-0 md:left-64 top-0 right-0 bottom-0 bg-black bg-opacity-10 backdrop-blur-sm"></div>
        
        {/* Modal Container */}
        <div className="absolute left-0 md:left-64 top-0 right-0 bottom-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-md w-full max-w-2xl relative z-10 max-h-[90vh] flex flex-col shadow-2xl">
            {/* Dark Header */}
            <div className="bg-black text-white px-6 py-5 rounded-t-md flex items-center justify-between">
              <h2 className="text-xl font-bold">Discipline Record Details</h2>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-300 text-lg flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Read-Only Details Grid */}
                <div className="grid grid-cols-2 gap-6 p-5 bg-gray-50 border border-gray-100 rounded-md mb-6">
                  <div>
                    <span className="block text-sm font-bold text-gray-500 mb-1">Date</span>
                    <span className="text-base font-bold text-gray-900">{record.date}</span>
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-gray-500 mb-1">Prepared by</span>
                    <span className="text-base font-bold text-gray-900">{record.preparedBy}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-sm font-bold text-gray-500 mb-1">Reason</span>
                    <span className="text-base font-bold text-gray-900">{record.reason}</span>
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-gray-500 mb-1">Marks Deducted</span>
                    <span className="text-2xl font-extrabold text-red-600">{record.deducted}</span>
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-gray-500 mb-1">Term</span>
                    <span className="text-base font-bold text-gray-900">{record.term}</span>
                  </div>
                </div>

                {/* Interactive Input */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Submit Explanation/Appeal
                  </label>
                  <textarea
                    value={formData.explanation}
                    onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent min-h-[120px] resize-y"
                    placeholder="Provide additional details or context regarding this incident..."
                  />
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 mt-8">
                  <button
                    type="button"
                    onClick={onClose}
                    className="bg-white text-gray-700 border border-gray-300 px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-black text-white px-8 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-800 shadow-sm transition-colors"
                  >
                    Submit 
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}