"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { StatCard, Card } from "@/components/ui/Card";
import { DataTable, Column, TableUser, Pagination } from "@/components/ui/DataTable";
import { SearchInput, Select } from "@/components/ui/FormElements";
import { MessageSquare, Clock, AlertTriangle, CheckCircle, Eye } from "lucide-react";

interface Appeal {
  id: string;
  studentName: string;
  studentClass: string;
  avatarUrl: string;
  type: "Grade" | "Attendance" | "Assignment" | "Discipline";
  subject: string;
  priority: "High" | "Medium" | "Low";
  status: "Pending" | "Under Review" | "Approved" | "Rejected";
  date: string;
}

const mockAppeals: Appeal[] = [
  { id: "1", studentName: "John Smith", studentClass: "Grade 10-A", avatarUrl: "", type: "Grade", subject: "Mathematics Final Exam", priority: "High", status: "Pending", date: "Mar 15, 2024" },
  { id: "2", studentName: "Emily Davis", studentClass: "Grade 9-B", avatarUrl: "", type: "Attendance", subject: "Absence on March 10", priority: "Medium", status: "Under Review", date: "Mar 14, 2024" },
  { id: "3", studentName: "Michael Brown", studentClass: "Grade 11-A", avatarUrl: "", type: "Assignment", subject: "Late Submission - Research Paper", priority: "Low", status: "Approved", date: "Mar 13, 2024" },
  { id: "4", studentName: "Sarah Wilson", studentClass: "Grade 10-C", avatarUrl: "", type: "Discipline", subject: "Unfair Detention", priority: "Medium", status: "Rejected", date: "Mar 12, 2024" },
  { id: "5", studentName: "David Lee", studentClass: "Grade 12-B", avatarUrl: "", type: "Grade", subject: "Chemistry Lab Report", priority: "Low", status: "Pending", date: "Mar 11, 2024" },
  { id: "6", studentName: "Lisa Anderson", studentClass: "Grade 11-C", avatarUrl: "", type: "Assignment", subject: "Essay Extension Request", priority: "High", status: "Under Review", date: "Mar 10, 2024" },
  { id: "7", studentName: "James Taylor", studentClass: "Grade 9-A", avatarUrl: "", type: "Attendance", subject: "Incorrect Absence Record", priority: "Medium", status: "Approved", date: "Mar 9, 2024" },
  { id: "8", studentName: "Emma Martinez", studentClass: "Grade 10-B", avatarUrl: "", type: "Grade", subject: "Physics Midterm", priority: "High", status: "Pending", date: "Mar 8, 2024" },
  { id: "9", studentName: "Robert Johnson", studentClass: "Grade 11-B", avatarUrl: "", type: "Discipline", subject: "Parking Violation Appeal", priority: "Low", status: "Under Review", date: "Mar 7, 2024" },
  { id: "10", studentName: "Sophia Chen", studentClass: "Grade 12-A", avatarUrl: "", type: "Assignment", subject: "Project Resubmission", priority: "Medium", status: "Approved", date: "Mar 6, 2024" },
];

export default function TeacherAppealsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const stats = [
    { label: "Total Appeals", value: mockAppeals.length, icon: <MessageSquare size={20} />, progress: 100 },
    { label: "Pending", value: mockAppeals.filter(a => a.status === "Pending").length, icon: <Clock size={20} />, progress: 35 },
    { label: "Under Review", value: mockAppeals.filter(a => a.status === "Under Review").length, icon: <AlertTriangle size={20} />, progress: 25 },
    { label: "Resolved", value: mockAppeals.filter(a => a.status === "Approved").length, icon: <CheckCircle size={20} />, progress: 45 },
  ];

  const filteredAppeals = mockAppeals.filter(appeal =>
    appeal.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appeal.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: Column<Appeal>[] = [
    {
      key: "studentName",
      header: "STUDENT",
      render: (_, row) => (
        <TableUser name={row.studentName} sub={row.studentClass} avatarUrl={row.avatarUrl} />
      ),
    },
    {
      key: "type",
      header: "TYPE",
      render: (val) => (
        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">
          {val as string}
        </span>
      ),
    },
    {
      key: "subject",
      header: "SUBJECT",
      render: (val) => <div className="text-sm font-medium text-gray-900 max-w-[250px] truncate">{val as string}</div>,
    },
    {
      key: "priority",
      header: "PRIORITY",
      render: (val) => {
        const color =
          val === "High" ? "text-red-500" : val === "Medium" ? "text-orange-500" : "text-gray-500";
        return <span className={`text-xs ${color}`}>{val as string}</span>;
      },
    },
    {
      key: "status",
      header: "STATUS",
      render: (val) => {
        const status = val as string;
        const icon =
          status === "Approved" ? <CheckCircle size={14} className="text-gray-900" /> :
            status === "Rejected" ? <CheckCircle size={14} className="text-gray-400 rotate-45" /> :
              status === "Under Review" ? <AlertTriangle size={14} className="text-gray-600" /> :
                <Clock size={14} className="text-gray-400" />;

        return (
          <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-100 rounded-md w-fit bg-white shadow-sm">
            {icon}
            <span className="text-xs font-medium text-gray-600">{status}</span>
          </div>
        );
      },
    },
    {
      key: "date",
      header: "DATE",
      render: (val) => <div className="text-xs text-gray-400">{val as string}</div>,
    },
    {
      key: "actions",
      header: "ACTIONS",
      align: "center",
      render: () => (
        <button className="bg-black text-white p-2 rounded-md hover:bg-gray-800 transition-colors">
          <Eye size={16} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Student Appeals</h1>
        <p className="text-gray-500 mt-1">Review and respond to student appeals</p>
      </div>

      <Card className="p-6 space-y-4 rounded-md">
        <div className="w-full">
          <SearchInput
            placeholder="Search by student name, ID, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <div className="w-48">
            <Select options={[{ value: "all", label: "All Types" }]} />
          </div>
          <div className="w-48">
            <Select options={[{ value: "all", label: "All Status" }]} />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard
            key={i}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            progress={stat.progress}
            className="rounded-md shadow-sm border-gray-100"
          />
        ))}
      </div>

      <Card className="overflow-hidden border border-gray-100 rounded-md shadow-sm">
        <DataTable
          columns={columns as any}
          data={filteredAppeals as any}
          keyField="id"
          className="appeals-table"
          pageSize={10}
          paginationClassName="border-t border-gray-100 bg-white"
        />
      </Card>
    </div>
  );
}
