"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { DataTable, Column, TableUser, Pagination } from "@/components/ui/DataTable";
import { SearchInput, Select } from "@/components/ui/FormElements";
import { MessageSquare, Clock, AlertTriangle, CheckCircle, Eye, X } from "lucide-react";
import { apiClient } from "@/lib/api/client";

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
  reason?: string;
  grade?: number;
}

const ITEMS_PER_PAGE = 5;

export default function TeacherAppealsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch appeals from backend
  const { data: appealsData, isLoading } = useQuery({
    queryKey: ["teacher-appeals"],
    queryFn: async () => {
      const response = await apiClient("/api/v1/grades/appeals");
      return response as any;
    },
    staleTime: 1000 * 60 * 5,
  });

  const rawAppeals = Array.isArray(appealsData) ? appealsData : appealsData?.data || [];

  // Transform backend data to match UI format
  const transformedAppeals: Appeal[] = rawAppeals.map((appeal: any) => ({
    id: appeal.id,
    studentName: appeal.student?.name || "Unknown Student",
    studentClass: appeal.student?.class?.name || "Unknown Class",
    avatarUrl: appeal.student?.avatarUrl || "",
    type: "Grade",
    subject: appeal.grade?.subject?.name || "Unknown Subject",
    priority: appeal.status === "PENDING" ? "High" : appeal.status === "REVIEWING" ? "Medium" : "Low",
    status: appeal.status === "PENDING" ? "Pending" : appeal.status === "REVIEWING" ? "Under Review" : appeal.status === "APPROVED" ? "Approved" : "Rejected",
    date: new Date(appeal.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
    reason: appeal.reason || "",
    grade: appeal.grade?.score || 0,
  }));

  // Extract unique types and statuses from backend data for filters
  const uniqueTypes = Array.from(new Set(transformedAppeals.map(a => a.type)));
  const uniqueStatuses = Array.from(new Set(transformedAppeals.map(a => a.status)));

  const typeOptions = [
    { value: "all", label: "All Types" },
    ...uniqueTypes.map(type => ({ value: type, label: type }))
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    ...uniqueStatuses.map(status => ({ value: status, label: status }))
  ];

  const stats = [
    { label: "Total Appeals", value: transformedAppeals.length, icon: <MessageSquare size={20} />, progress: 100 },
    { label: "Pending", value: transformedAppeals.filter(a => a.status === "Pending").length, icon: <Clock size={20} />, progress: 35 },
    { label: "Under Review", value: transformedAppeals.filter(a => a.status === "Under Review").length, icon: <AlertTriangle size={20} />, progress: 25 },
    { label: "Resolved", value: transformedAppeals.filter(a => a.status === "Approved").length, icon: <CheckCircle size={20} />, progress: 45 },
  ];

  const filteredAppeals = transformedAppeals.filter(appeal => {
    const matchesSearch = appeal.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appeal.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === "all" || appeal.type === filterType;
    const matchesStatus = filterStatus === "all" || appeal.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredAppeals.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAppeals = filteredAppeals.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
      render: (_, row) => (
        <button 
          onClick={() => setSelectedAppeal(row)}
          className="bg-black text-white p-2 rounded-md hover:bg-gray-800 transition-colors"
        >
          <Eye size={16} />
        </button>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <div className="h-10 bg-gray-200 rounded-lg w-64 mb-2 animate-pulse"></div>
          <div className="h-5 bg-gray-100 rounded-lg w-96 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-md border border-gray-100 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-4"></div>
              <div className="h-2 bg-gray-100 rounded-full w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="flex gap-4">
          <div className="w-48">
            <Select 
              options={typeOptions}
              value={filterType}
              onChange={(e) => {
                setFilterType(e.currentTarget.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="w-48">
            <Select 
              options={statusOptions}
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.currentTarget.value);
                setCurrentPage(1);
              }}
            />
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
          data={paginatedAppeals as any}
          keyField="id"
          className="appeals-table"
        />
        <div className="border-t border-gray-100 bg-white">
          <div className="flex items-center justify-between px-6 py-4">
            <span className="text-sm text-gray-400 font-medium">
              Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredAppeals.length)} of {filteredAppeals.length} appeals
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm font-medium text-gray-400 hover:bg-gray-50 rounded-md transition-colors disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "w-8 h-8 flex items-center justify-center text-sm font-medium rounded-md transition-all",
                    currentPage === page ? "bg-black text-white" : "text-gray-500 hover:bg-gray-50"
                  )}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-md transition-colors ml-2 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* View Appeal Modal */}
      {selectedAppeal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Appeal Details</h2>
              <button
                onClick={() => setSelectedAppeal(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Appeal Details */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Student Name</p>
                <p className="font-semibold text-gray-900">{selectedAppeal.studentName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Class</p>
                <p className="font-semibold text-gray-900">{selectedAppeal.studentClass}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Subject</p>
                <p className="font-semibold text-gray-900">{selectedAppeal.subject}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Grade</p>
                <p className="font-semibold text-gray-900">{selectedAppeal.grade}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Appeal Reason</p>
                <p className="font-semibold text-gray-900">{selectedAppeal.reason || "No reason provided"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <div className="flex items-center gap-2">
                  {selectedAppeal.status === "Approved" ? <CheckCircle size={16} className="text-green-600" /> :
                   selectedAppeal.status === "Rejected" ? <CheckCircle size={16} className="text-red-600 rotate-45" /> :
                   selectedAppeal.status === "Under Review" ? <AlertTriangle size={16} className="text-orange-600" /> :
                   <Clock size={16} className="text-yellow-600" />}
                  <span className="font-semibold text-gray-900">{selectedAppeal.status}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Date Submitted</p>
                <p className="font-semibold text-gray-900">{selectedAppeal.date}</p>
              </div>
            </div>

            {/* Close Button */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setSelectedAppeal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
