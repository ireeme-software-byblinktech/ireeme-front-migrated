"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare, Clock, AlertTriangle, CheckCircle, Eye, X } from "lucide-react";
import { StatCard } from "@/components/ui";
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
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch appeals from backend
  const { data: appealsData, isLoading } = useQuery({
    queryKey: ["teacher-appeals"],
    queryFn: async () => {
      const response = await apiClient("/grades/appeals");
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

  const stats = [
    { label: "Total Appeals", value: transformedAppeals.length, icon: <MessageSquare size={20} />, progress: 100 },
    { label: "Pending", value: transformedAppeals.filter(a => a.status === "Pending").length, icon: <Clock size={20} />, progress: 35 },
    { label: "Under Review", value: transformedAppeals.filter(a => a.status === "Under Review").length, icon: <AlertTriangle size={20} />, progress: 25 },
    { label: "Resolved", value: transformedAppeals.filter(a => a.status === "Approved").length, icon: <CheckCircle size={20} />, progress: 45 },
  ];

  const filteredAppeals = transformedAppeals.filter(appeal => {
    const matchesSearch = appeal.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appeal.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || appeal.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredAppeals.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAppeals = filteredAppeals.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="pb-10">
        <div className="mb-8">
          <div className="h-10 bg-gray-200 rounded-lg w-64 mb-2 animate-pulse"></div>
          <div className="h-5 bg-gray-100 rounded-lg w-96 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
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
    <div className="pb-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-[28px] font-bold mb-2">Grade Appeals</h1>
        <p className="text-gray-500 font-medium text-sm sm:text-base">Review and manage student grade appeals</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <StatCard
            key={i}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            progress={stat.progress}
          />
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-100 p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by student name or subject..."
              className="w-full pl-4 pr-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-200 focus:border-black focus:outline-none text-xs sm:text-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none text-xs sm:text-sm"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Appeals List */}
      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-700">Student</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 hidden sm:table-cell">Subject</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-700">Priority</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-700">Status</th>
                <th className="px-4 sm:px-6 py-3 text-center text-xs font-bold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAppeals.length > 0 ? (
                paginatedAppeals.map((appeal) => (
                  <tr key={appeal.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">{appeal.studentName}</td>
                    <td className="px-4 sm:px-6 py-3 text-xs sm:text-sm text-gray-600 hidden sm:table-cell">{appeal.subject}</td>
                    <td className="px-4 sm:px-6 py-3">
                      <span className={`text-xs font-semibold ${
                        appeal.priority === "High" ? "text-red-600" :
                        appeal.priority === "Medium" ? "text-orange-600" :
                        "text-gray-600"
                      }`}>
                        {appeal.priority}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                        appeal.status === "Approved" ? "bg-green-100 text-green-700" :
                        appeal.status === "Rejected" ? "bg-red-100 text-red-700" :
                        appeal.status === "Under Review" ? "bg-yellow-100 text-yellow-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {appeal.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-center">
                      <button
                        onClick={() => setSelectedAppeal(appeal)}
                        className="p-1.5 sm:p-2 hover:bg-gray-200 rounded-lg transition-colors inline-block"
                      >
                        <Eye size={16} className="text-gray-600" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 sm:px-6 py-8 text-center text-gray-500">No appeals found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-gray-100 bg-white p-4 flex items-center justify-between">
            <span className="text-xs sm:text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center text-xs font-medium rounded-md ${
                    currentPage === page ? "bg-black text-white" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Appeal Modal */}
      {selectedAppeal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Appeal Details</h2>
              <button
                onClick={() => setSelectedAppeal(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Appeal Details */}
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 space-y-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Student Name</p>
                <p className="font-semibold text-sm sm:text-base text-gray-900">{selectedAppeal.studentName}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Class</p>
                <p className="font-semibold text-sm sm:text-base text-gray-900">{selectedAppeal.studentClass}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Subject</p>
                <p className="font-semibold text-sm sm:text-base text-gray-900">{selectedAppeal.subject}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Grade</p>
                <p className="font-semibold text-sm sm:text-base text-gray-900">{selectedAppeal.grade}%</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Appeal Reason</p>
                <p className="font-semibold text-sm sm:text-base text-gray-900">{selectedAppeal.reason || "No reason provided"}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  selectedAppeal.status === "Approved" ? "bg-green-100 text-green-700" :
                  selectedAppeal.status === "Rejected" ? "bg-red-100 text-red-700" :
                  selectedAppeal.status === "Under Review" ? "bg-yellow-100 text-yellow-700" :
                  "bg-blue-100 text-blue-700"
                }`}>
                  {selectedAppeal.status}
                </span>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Date Submitted</p>
                <p className="font-semibold text-sm sm:text-base text-gray-900">{selectedAppeal.date}</p>
              </div>
            </div>

            {/* Close Button */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setSelectedAppeal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-sm text-gray-700 hover:bg-gray-50 transition-colors"
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
