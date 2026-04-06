"use client";

import { useState } from "react";
import { StatCard, Card, CardHeader, CardBody } from "@/components/ui/Card";
import { DataTable, Column, Pagination } from "@/components/ui/DataTable";
import { Select } from "@/components/ui/FormElements";
import { GraduationCap, BookOpen, FileText, BarChart2, Edit, Download, Filter } from "lucide-react";

// Stats data array for attendance
const attendanceStats = [
  {
    label: "Attendance rate",
    value: "78%",
    icon: <GraduationCap size={18} />,
    progress: 78,
    trend: { value: "3.6", direction: "up" as const, label: "This month" }
  },
  {
    label: "Days attended", 
    value: 128,
    icon: <BookOpen size={18} />,
    progress: 85,
    trend: { value: "3.6", direction: "up" as const, label: "This month" }
  },
  {
    label: "Absent days",
    value: 30, 
    icon: <FileText size={18} />,
    progress: 30,
    trend: { value: "3.6", direction: "up" as const, label: "This month" }
  },
  {
    label: "Late attendance",
    value: 3,
    icon: <BarChart2 size={18} />,
    progress: 15,
    trend: { value: "3.6", direction: "up" as const, label: "This month" }
  }
];

// Attendance data
interface AttendanceRecord {
  id: string;
  date: string;
  subject: string;
  term: string;
  arrival: string;
  arrivalStatus: "On Time" | "Late";
  status: "Present" | "Absent";
}

const attendanceData: AttendanceRecord[] = [
  {
    id: "1",
    date: "20-07-2025",
    subject: "Mathematics",
    term: "Term 1",
    arrival: "8:00 AM",
    arrivalStatus: "On Time",
    status: "Present"
  },
  {
    id: "2",
    date: "20-07-2025",
    subject: "Mathematics",
    term: "Term 1",
    arrival: "8:00 AM",
    arrivalStatus: "On Time",
    status: "Present"
  },
  {
    id: "3",
    date: "20-07-2025",
    subject: "Mathematics",
    term: "Term 1",
    arrival: "8:00 AM",
    arrivalStatus: "On Time",
    status: "Present"
  },
  {
    id: "4",
    date: "20-07-2025",
    subject: "Mathematics",
    term: "Term 1",
    arrival: "8:00 AM",
    arrivalStatus: "On Time",
    status: "Present"
  },
  {
    id: "5",
    date: "20-07-2025",
    subject: "Mathematics",
    term: "Term 1",
    arrival: "8:00 AM",
    arrivalStatus: "On Time",
    status: "Present"
  }
];

export default function AttendancePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All status");
  
  const itemsPerPage = 10;

  // Filter data based on status
  const filteredData = attendanceData.filter(record => {
    if (statusFilter === "All status") return true;
    return record.status === statusFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const columns: Column<AttendanceRecord>[] = [
    {
      key: "date",
      header: "Date",
      render: (_, row) => (
        <div className="font-medium text-gray-900">{row.date}</div>
      )
    },
    {
      key: "subject",
      header: "Subject",
      render: (_, row) => (
        <div className="text-gray-600">{row.subject}</div>
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
      key: "arrival",
      header: "Arrival",
      render: (_, row) => (
        <div className="text-gray-600">{row.arrival}</div>
      )
    },
    {
      key: "arrivalStatus",
      header: "Arrival status",
      render: (_, row) => (
        <span className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium inline-block min-w-[90px] text-center">
          {row.arrivalStatus}
        </span>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (_, row) => (
        <span className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium inline-block min-w-[90px] text-center">
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
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Attendance</h1>
        <p className="text-sm text-gray-500">Manage your class attendance patterns using our platform</p>
      </div>
      
      {/* Stats Cards */}
      <div className="stats-grid">
        {attendanceStats.map((stat, index) => (
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

      {/* Attendance Record History */}
      <Card>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Attendance record history</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-500" />
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: "All status", label: "All status" },
                  { value: "Present", label: "Present" },
                  { value: "Absent", label: "Absent" }
                ]}
                className="w-32"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
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
              totalItems={filteredData.length}
              pageSize={itemsPerPage}
              className="pagination-rounded"
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
