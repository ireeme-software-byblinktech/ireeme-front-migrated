"use client";

import { useState, useEffect } from "react";
import { StatCard, Card, CardHeader, CardBody } from "@/components/ui/Card";
import { DataTable, Column, Pagination } from "@/components/ui/DataTable";
import { GraduationCap, BookOpen, FileText, BarChart2, Edit, X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/FormElements";

// Stats data array
const statsData = [
  {
    label: "Total Subjects",
    value: 15,
    icon: <GraduationCap size={18} />,
    progress: 75,
    trend: { value: "3.6", direction: "up" as const, label: "This month" }
  },
  {
    label: "Total Assignments",
    value: 30,
    icon: <BookOpen size={18} />,
    progress: 80,
    trend: { value: "3.6", direction: "up" as const, label: "This month" }
  },
  {
    label: "Total Notes",
    value: 30,
    icon: <FileText size={18} />,
    progress: 65,
    trend: { value: "3.6", direction: "up" as const, label: "This month" }
  },
  {
    label: "Total Reports",
    value: 30,
    icon: <BarChart2 size={18} />,
    progress: 90,
    trend: { value: "3.6", direction: "up" as const, label: "This month" }
  }
];

// Grades data
interface Grade {
  id: string;
  date: string;
  title: string;
  term: string;
  marks: string;
  termStatus: "Active" | "Inactive";
  status: "Active" | "Inactive";
}

const gradesData: Grade[] = [
  {
    id: "1",
    date: "Mathematics",
    title: "CAT",
    term: "Term 1",
    marks: "80%",
    termStatus: "Active",
    status: "Active"
  },
  {
    id: "2",
    date: "Mathematics",
    title: "CAT",
    term: "Term 1",
    marks: "80%",
    termStatus: "Active",
    status: "Active"
  },
  {
    id: "3",
    date: "Mathematics",
    title: "CAT",
    term: "Term 1",
    marks: "80%",
    termStatus: "Active",
    status: "Active"
  },
  {
    id: "4",
    date: "Mathematics",
    title: "CAT",
    term: "Term 1",
    marks: "80%",
    termStatus: "Active",
    status: "Active"
  },
  {
    id: "5",
    date: "Mathematics",
    title: "CAT",
    term: "Term 1",
    marks: "80%",
    termStatus: "Active",
    status: "Active"
  },
  {
    id: "6",
    date: "Mathematics",
    title: "CAT",
    term: "Term 1",
    marks: "80%",
    termStatus: "Active",
    status: "Active"
  }
];

export default function MyGradesPage() {
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const columns: Column<Grade>[] = [
    {
      key: "date",
      header: "Date",
      render: (_, row) => (
        <div className="font-medium text-gray-900">{row.date}</div>
      )
    },
    {
      key: "title",
      header: "Title",
      render: (_, row) => (
        <div className="text-gray-600">{row.title}</div>
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
      key: "marks",
      header: "Marks",
      render: (_, row) => (
        <div className="font-medium text-gray-900">{row.marks}</div>
      )
    },
    {
      key: "termStatus",
      header: "Term",
      align: "center",
      render: (_, row) => (
        <span className="bg-black text-white px-8 py-2 rounded-md text-sm font-medium inline-block min-w-[120px] text-center">
          {row.termStatus}
        </span>
      )
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: (_, row) => (
        <span className="bg-black text-white px-8 py-2 rounded-md text-sm font-medium inline-block min-w-[120px] text-center">
          {row.status}
        </span>
      )
    },
    {
      key: "action",
      header: "Action",
      align: "right",
      render: (_, row) => (
        <button
          onClick={() => {
            setSelectedGrade(row);
            setIsEditModalOpen(true);
          }}
          className="text-gray-600 hover:text-gray-900 p-2"
        >
          <Edit size={16} />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="stats-grid">
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

      {/* Grades Table */}
      <Card>
        <CardBody>
          {/* Table */}
          <DataTable
            columns={columns as unknown as Column<Record<string, unknown>>[]}
            data={gradesData as unknown as Record<string, unknown>[]}
            keyField="id"
            className="assignments-table"
            pageSize={10}
            paginationClassName="pagination-rounded"
          />
        </CardBody>
      </Card>

      {/* Edit Grade Modal */}
      <EditGradeModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        grade={selectedGrade}
      />
    </div>
  );
}

// Edit Grade Modal Component
function EditGradeModal({ isOpen, onClose, grade }: { isOpen: boolean; onClose: () => void; grade: Grade | null }) {
  const [formData, setFormData] = useState({
    marks: "",
    status: "Active",
    termStatus: "Active"
  });

  // Update form data when grade changes
  useEffect(() => {
    if (grade) {
      setFormData({
        marks: grade.marks,
        status: grade.status,
        termStatus: grade.termStatus
      });
    }
  }, [grade]);

  if (!isOpen || !grade) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Sidebar area - no blur */}
      <div className="absolute left-0 top-0 w-64 h-full bg-transparent pointer-events-none"></div>

      {/* Main content area - lighter blur */}
      <div className="absolute left-64 top-0 right-0 bottom-0 bg-black bg-opacity-10 backdrop-blur-sm"></div>

      {/* Modal container */}
      <div className="absolute left-64 top-0 right-0 bottom-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-md relative z-10 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-black text-white px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Edit grade record</h2>
            <button onClick={onClose} className="text-white hover:text-gray-300">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-1.5 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subject Reference</span>
              <p className="text-sm font-bold text-gray-900">{grade.date} - {grade.title}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Assign Marks</label>
                <input
                  type="text"
                  value={formData.marks}
                  onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:border-black transition-colors"
                  placeholder="e.g. 85%"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Term Status</label>
                  <select
                    value={formData.termStatus}
                    onChange={(e) => setFormData({ ...formData, termStatus: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 outline-none focus:border-black"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Overall Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 outline-none focus:border-black"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-black text-white py-3 rounded-lg text-sm font-bold hover:bg-gray-800 transition-all shadow-lg"
              >
                Save changes
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-white text-gray-700 border border-gray-300 py-3 rounded-lg text-sm font-bold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
