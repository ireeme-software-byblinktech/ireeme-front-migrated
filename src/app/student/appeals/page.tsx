"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { StatCard } from "@/components/ui";
import { DataTable, Column } from "@/components/ui/DataTable";
import { 
  GraduationCap, FileText, Eye, Calendar,
  Clock, AlertTriangle, CheckCircle2, XCircle, Loader2
} from "lucide-react";
import { useDisciplineCases } from "@/hooks/api/useDiscipline";
import { useStudentProfile } from "@/hooks/api/useStudentAPI";


// Stats data will be calculated from real data
interface AppealRecord {
  id: string;
  type: "Grade" | "Discipline";
  subject: string;
  reason: string;
  description: string;
  submittedDate: string;
  status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
}

export default function StudentAppealsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedAppeal, setSelectedAppeal] = useState<AppealRecord | null>(null);
  const itemsPerPage = 4;

  const { data: profile } = useStudentProfile();
  const studentId = profile?.id;

  // Fetch discipline cases with appeals
  const { data: disciplineCasesData, isLoading: isLoadingDiscipline } = useDisciplineCases({
    studentId,
    page: 1,
    limit: 100,
  });

  // Transform discipline cases with appeals into AppealRecord format
  const disciplineAppeals: AppealRecord[] = (disciplineCasesData?.data || [])
    .filter(c => c.appeal)
    .map(c => ({
      id: c.appeal!.id,
      type: "Discipline" as const,
      subject: "Discipline",
      reason: c.offenseType?.name || "Discipline Case",
      description: c.appeal!.reason,
      submittedDate: new Date(c.appeal!.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: c.appeal!.status,
    }));

  // Combine all appeals
  const allAppeals = [...disciplineAppeals];

  // Calculate stats from real data
  const totalAppeals = allAppeals.length;
  const pendingCount = allAppeals.filter(a => a.status === "PENDING").length;
  const approvedCount = allAppeals.filter(a => a.status === "APPROVED").length;
  const rejectedCount = allAppeals.filter(a => a.status === "REJECTED").length;

  const statsData = [
    {
      label: "Total Appeals",
      value: totalAppeals,
      icon: <GraduationCap size={20} />,
      progress: 75,
      trend: { value: "3.6", direction: "up" as const, label: "This month" }
    },
    {
      label: "Pending", 
      value: pendingCount,
      icon: <FileText size={20} />,
      progress: 80,
      trend: { value: "3.6", direction: "up" as const, label: "This month" }
    },
    {
      label: "Approved",
      value: approvedCount, 
      icon: <CheckCircle2 size={20} />,
      progress: 65,
      trend: { value: "3.6", direction: "up" as const, label: "This month" }
    },
    {
      label: "Rejected",
      value: rejectedCount,
      icon: <XCircle size={20} />,
      progress: 90,
      trend: { value: "3.6", direction: "down" as const, label: "This month" }
    }
  ];

  // Filtering
  const filteredData = activeTab === "All" 
    ? allAppeals 
    : allAppeals.filter(item => {
        if (activeTab === "Under Review") return item.status === "UNDER_REVIEW";
        return item.status === activeTab.toUpperCase();
      });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const StatusPill = ({ status }: { status: AppealRecord["status"] }) => {
    switch (status) {
      case "PENDING":
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF4E5] text-[#B86D00] text-xs font-bold rounded-full">
            <Clock size={14} />
            <span>Pending</span>
          </div>
        );
      case "UNDER_REVIEW":
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 text-blue-600 text-xs font-bold rounded-full">
            <AlertTriangle size={14} />
            <span>Under Review</span>
          </div>
        );
      case "APPROVED":
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E6F8EE] text-[#008A3D] text-xs font-bold rounded-full">
            <CheckCircle2 size={14} />
            <span>Approved</span>
          </div>
        );
      case "REJECTED":
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FDE8E8] text-[#C81E1E] text-xs font-bold rounded-full">
            <XCircle size={14} />
            <span>Rejected</span>
          </div>
        );
    }
  };

  const columns: Column<AppealRecord>[] = [
    {
      key: "type",
      header: "Type",
      render: (_, row) => (
        <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
          row.type === "Grade" 
            ? "bg-blue-50 text-blue-600" 
            : "bg-purple-50 text-purple-600"
        }`}>
          {row.type}
        </span>
      )
    },
    {
      key: "subject",
      header: "Subject/Title",
      render: (_, row) => (
        <div className="font-bold text-gray-900 py-3">{row.subject}</div>
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
      key: "submittedDate",
      header: "Submitted Date",
      render: (_, row) => (
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar size={16} />
          <span className="font-medium">{row.submittedDate}</span>
        </div>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (_, row) => <StatusPill status={row.status} />
    },
    {
      key: "action",
      header: "Action",
      align: "center",
      render: (_, row) => (
        <button 
          onClick={() => {
            setSelectedAppeal(row);
            setIsViewModalOpen(true);
          }}
          className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
        >
          <Eye size={16} />
          View
        </button>
      )
    }
  ];

  if (isLoadingDiscipline) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1240px] w-full pb-8">
      {/* Header Section */}
      <div className="flex flex-col md:items-start gap-1">
        <h1 className="text-2xl font-bold text-[#111827]">My Appeals</h1>
        <p className="text-sm text-gray-500">Track and manage your grade and discipline appeals</p>
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

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        {["All", "Pending", "Under Review", "Approved", "Rejected"].map((tab) => (
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

      {/* Title Below Filters */}
      <h3 className="text-xl font-extrabold text-gray-900 pt-2">My Appeals</h3>

      {/* Data Table Container */}
      <div className="bg-white border border-gray-200 rounded-none shadow-sm overflow-hidden">
        <div className="p-0">
          {paginatedData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <FileText size={48} className="mb-4 text-gray-300" />
              <p className="text-lg font-medium">No appeals found</p>
              <p className="text-sm">You haven't submitted any appeals yet.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <style>{`
                  .appeals-table th { background-color: #000; color: #fff; padding-top: 1rem; padding-bottom: 1rem; border-bottom: none; font-weight: 600; font-size: 0.875rem; }
                  .appeals-table tr { border-bottom: 1px solid #f3f4f6; }
                  .appeals-table td { padding-top: 0.75rem; padding-bottom: 0.75rem; }
                `}</style>
                <DataTable
                  columns={columns as unknown as Column<Record<string, unknown>>[]}
                  data={paginatedData as unknown as Record<string, unknown>[]}
                  keyField="id"
                  className="appeals-table w-full"
                />
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-8 py-5 bg-white">
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
            </>
          )}
        </div>
      </div>

      {/* View Appeal Modal */}
      {isViewModalOpen && selectedAppeal && (
        <ViewAppealModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          appeal={selectedAppeal}
        />
      )}
    </div>
  );
}

// View Appeal Modal Component
function ViewAppealModal({ 
  isOpen, 
  onClose, 
  appeal 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  appeal: AppealRecord;
}) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[9999]">
        {/* Sidebar area - no blur */}
        <div className="absolute left-0 top-0 w-64 h-full bg-transparent pointer-events-none"></div>
        
        {/* Main content area - lighter blur */}
        <div className="absolute left-64 top-0 right-0 bottom-0 bg-black bg-opacity-10 backdrop-blur-sm"></div>
        
        {/* Modal container - centered without top space */}
        <div className="absolute left-64 top-0 right-0 bottom-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl relative z-10 max-h-[90vh] flex flex-col">
            {/* Header with black background */}
            <div className="bg-black text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
              <h2 className="text-xl font-semibold">Appeal Details</h2>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {/* Appeal ID */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Appeal ID
                    </label>
                    <input
                      type="text"
                      value={appeal.id}
                      readOnly
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none"
                    />
                  </div>

                  {/* Appeal Type */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Appeal Type
                    </label>
                    <input
                      type="text"
                      value={appeal.type}
                      readOnly
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none"
                    />
                  </div>

                  {/* Submitted Date */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Submitted Date
                    </label>
                    <input
                      type="text"
                      value={appeal.submittedDate}
                      readOnly
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Current Status
                    </label>
                    <input
                      type="text"
                      value={appeal.status}
                      readOnly
                      className={`w-full border border-gray-300 rounded-lg px-3 py-2 font-bold focus:outline-none ${
                        appeal.status === 'APPROVED' ? 'bg-green-50 text-green-700' : 
                        appeal.status === 'REJECTED' ? 'bg-red-50 text-red-700' : 
                        'bg-gray-50 text-gray-900'
                      }`}
                    />
                  </div>
                </div>

                {/* Subject / Title */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Subject / Title
                  </label>
                  <input
                    type="text"
                    value={appeal.subject}
                    readOnly
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none font-bold"
                  />
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Reason for appeal
                  </label>
                  <input
                    type="text"
                    value={appeal.reason}
                    readOnly
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Additional Details
                  </label>
                  <textarea
                    value={appeal.description}
                    readOnly
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none h-32 resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-4 pt-4">
                  <button
                    onClick={onClose}
                    className="bg-black text-white px-10 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-800 transition-all shadow-md active:scale-95"
                  >
                    Close View
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
