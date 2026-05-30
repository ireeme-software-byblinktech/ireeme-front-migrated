"use client";

import { useState } from "react";
import { StatCard, Card, CardBody } from "@/components/ui";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Select } from "@/components/ui/FormElements";
import { GraduationCap, BookOpen, FileText, BarChart2, Download, Filter } from "lucide-react";
import { useStudentAttendance, useStudentDashboard, useStudentProfile } from "@/hooks/api/useStudentAPI";

interface AttendanceRecord {
  id: string;
  date: string;
  subject: string;
  status: "Present" | "Absent" | "Late" | "Excused";
}

export default function AttendancePage() {
  const [statusFilter, setStatusFilter] = useState("All status");

  const { data: profile } = useStudentProfile();
  const { data: dashboardData } = useStudentDashboard(profile?.id);
  const { data: attendanceResponse, isLoading } = useStudentAttendance(profile?.id, 1);

  const attendanceData: AttendanceRecord[] = attendanceResponse?.data?.map(record => ({
    id: record.id,
    date: new Date(record.date).toLocaleDateString(),
    subject: "General", // API returns general attendance if subject is not provided, or subject-specific via relation
    status: record.status.charAt(0).toUpperCase() + record.status.slice(1).toLowerCase() as any,
  })) || [];

  const filteredData = attendanceData.filter(record => {
    if (statusFilter === "All status") return true;
    return record.status === statusFilter;
  });

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
      header: "Subject/Class",
      render: (_, row) => (
        <div className="text-gray-600">{row.subject}</div>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (_, row) => {
        let colorClass = "bg-black text-white";
        if (row.status === "Present") colorClass = "bg-green-600 text-white";
        if (row.status === "Absent") colorClass = "bg-red-600 text-white";
        if (row.status === "Late") colorClass = "bg-orange-500 text-white";

        return (
          <span className={`${colorClass} px-4 py-2 rounded-md text-sm font-medium inline-block min-w-[90px] text-center`}>
            {row.status}
          </span>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Attendance</h1>
        <p className="text-sm text-gray-500">View your class attendance patterns</p>
      </div>

      <div className="stats-grid">
        <StatCard
          label="Attendance rate"
          value={dashboardData ? `${dashboardData.overview.averageAttendance}%` : "-"}
          icon={<GraduationCap size={18} />}
          progress={dashboardData?.overview.averageAttendance || 0}
          trend={{ value: "0", direction: "up", label: "This month" }}
        />
        <StatCard
          label="Total Records"
          value={attendanceResponse?.total?.toString() || "-"}
          icon={<BookOpen size={18} />}
          progress={100}
          trend={{ value: "0", direction: "up", label: "This month" }}
        />
        <StatCard
          label="Absent"
          value={attendanceData.filter(r => r.status === "Absent").length.toString()}
          icon={<FileText size={18} />}
          progress={30}
          trend={{ value: "0", direction: "up", label: "This month" }}
        />
        <StatCard
          label="Late"
          value={attendanceData.filter(r => r.status === "Late").length.toString()}
          icon={<BarChart2 size={18} />}
          progress={15}
          trend={{ value: "0", direction: "up", label: "This month" }}
        />
      </div>

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
                  { value: "Absent", label: "Absent" },
                  { value: "Late", label: "Late" }
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
          {isLoading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
          ) : (
            <DataTable
              columns={columns as unknown as Column<Record<string, unknown>>[]}
              data={filteredData as unknown as Record<string, unknown>[]}
              keyField="id"
              className="assignments-table"
              pageSize={10}
              paginationClassName="pagination-rounded"
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
}
