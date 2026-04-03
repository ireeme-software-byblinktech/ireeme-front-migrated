"use client";

import { useState } from "react";
import { StatCard, Card, CardHeader, CardBody } from "@/components/ui/Card";
import { DataTable, Column, Pagination } from "@/components/ui/DataTable";
import { GraduationCap, BookOpen, FileText, BarChart2, Edit } from "lucide-react";

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Pagination
  const totalPages = Math.ceil(gradesData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = gradesData.slice(startIndex, startIndex + itemsPerPage);

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
      render: (_, row) => (
        <span className="bg-black text-white px-8 py-2 rounded-md text-sm font-medium inline-block min-w-[100px] text-center">
          {row.termStatus}
        </span>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (_, row) => (
        <span className="bg-black text-white px-8 py-2 rounded-md text-sm font-medium inline-block min-w-[100px] text-center">
          {row.status}
        </span>
      )
    },
    {
      key: "action",
      header: "Action",
      align: "right",
      render: () => (
        <button className="text-gray-600 hover:text-gray-900 p-2">
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
          <div className="mb-6">
            <DataTable
              columns={columns as unknown as Column<Record<string, unknown>>[]}
              data={paginatedData as unknown as Record<string, unknown>[]}
              keyField="id"
              className="assignments-table"
            />
          </div>

          {/* Centered Pagination */}
          <div className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={gradesData.length}
              pageSize={itemsPerPage}
              className="pagination-rounded"
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
