"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StatCard } from "@/components/ui";
import { DataTable, Column } from "@/components/ui/DataTable";
import { 
  Shield, AlertTriangle, FileText, TrendingDown, Calendar,
  Eye, Loader2, MessageSquare, X
} from "lucide-react";
import { useDisciplineCases, useStudentDisciplineScore, useSubmitAppeal } from "@/hooks/api/useDiscipline";
import { useStudentProfile } from "@/hooks/api/useStudentAPI";
import { toast } from "@/lib/utils/toast";
import type { DisciplineCase } from "@/lib/api/discipline";

export default function StudentDisciplinePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<DisciplineCase | null>(null);
  const itemsPerPage = 6;

  const { data: profile } = useStudentProfile();
  const studentId = profile?.id;

  // Fetch discipline cases
  const { data: casesData, isLoading: isLoadingCases } = useDisciplineCases({
    studentId,
    page: 1,
    limit: 100,
  });

  // Fetch student discipline score
  const { data: scoreData, isLoading: isLoadingScore } = useStudentDisciplineScore(studentId);

  const cases = casesData?.data || [];
  const totalPointsDeducted = scoreData?.totalPointsDeducted || 0;
  const openCasesCount = scoreData?.openCasesCount || 0;
  const currentScore = Math.max(0, 100 - totalPointsDeducted);

  // Stats
  const statsData = [
    {
      label: "Current Score",
      value: currentScore,
      icon: <Shield size={20} />,
      progress: currentScore,
      trend: { value: totalPointsDeducted.toString(), direction: "down" as const, label: "Points deducted" }
    },
    {
      label: "Total Cases", 
      value: cases.length,
      icon: <FileText size={20} />,
      progress: 75,
      trend: { value: openCasesCount.toString(), direction: "up" as const, label: "Open cases" }
    },
    {
      label: "Points Deducted",
      value: totalPointsDeducted, 
      icon: <TrendingDown size={20} />,
      progress: totalPointsDeducted,
      trend: { value: "From 100", direction: "down" as const, label: "Starting score" }
    },
    {
      label: "Open Cases",
      value: openCasesCount,
      icon: <AlertTriangle size={20} />,
      progress: 60,
      trend: { value: (cases.length - openCasesCount).toString(), direction: "up" as const, label: "Closed cases" }
    }
  ];

  // Pagination
  const totalPages = Math.ceil(cases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = cases.slice(startIndex, startIndex + itemsPerPage);

  const StatusBadge = ({ status }: { status: string }) => {
    return status === "OPEN" ? (
      <span className="px-3 py-1.5 bg-[#FFF4E5] text-[#B86D00] text-xs font-bold rounded-full">
        Open
      </span>
    ) : (
      <span className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
        Closed
      </span>
    );
  };

  const columns: Column<DisciplineCase>[] = [
    {
      key: "createdAt",
      header: "Date",
      render: (_, row) => (
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar size={16} />
          <span>{new Date(row.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
        </div>
      )
    },
    {
      key: "offenseType",
      header: "Offense Type",
      render: (_, row) => (
        <div className="font-bold text-gray-900">{row.offenseType?.name || "Unknown"}</div>
      )
    },
    {
      key: "description",
      header: "Description",
      render: (_, row) => (
        <div className="text-gray-600 max-w-xs truncate">{row.description}</div>
      )
    },
    {
      key: "pointsDeduct",
      header: "Points Deducted",
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <TrendingDown size={16} className="text-red-600" />
          <span className="font-bold text-red-600">-{row.pointsDeduct}</span>
        </div>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (_, row) => <StatusBadge status={row.status} />
    },
    {
      key: "appeal",
      header: "Appeal",
      render: (_, row) => (
        row.appeal ? (
          <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
            row.appeal.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
            row.appeal.status === "APPROVED" ? "bg-green-100 text-green-700" :
            "bg-red-100 text-red-700"
          }`}>
            {row.appeal.status}
          </span>
        ) : (
          <button
            onClick={() => {
              setSelectedCase(row);
              setIsAppealModalOpen(true);
            }}
            className="text-blue-600 hover:text-blue-800 text-xs font-bold underline"
          >
            Submit Appeal
          </button>
        )
      )
    },
    {
      key: "action",
      header: "Action",
      align: "center",
      render: (_, row) => (
        <button 
          onClick={() => {
            setSelectedCase(row);
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

  if (isLoadingCases || isLoadingScore) {
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
        <h1 className="text-2xl font-bold text-[#111827]">Discipline Record</h1>
        <p className="text-sm text-gray-500">View your discipline cases, points, and submit appeals</p>
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

      {/* Warning Message if score is low */}
      {currentScore < 50 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="text-red-600 mt-0.5" size={20} />
          <div>
            <h3 className="font-bold text-red-900">Low Discipline Score Alert</h3>
            <p className="text-sm text-red-700">
              Your discipline score is below 50. Please consult with your class teacher or discipline officer.
            </p>
          </div>
        </div>
      )}

      {/* Title */}
      <h3 className="text-xl font-extrabold text-gray-900 pt-2">Discipline Cases</h3>

      {/* Data Table Container */}
      <div className="bg-white border border-gray-200 rounded-none shadow-sm overflow-hidden">
        <div className="p-0">
          {paginatedData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Shield size={48} className="mb-4 text-gray-300" />
              <p className="text-lg font-medium">No discipline cases</p>
              <p className="text-sm">You have a clean discipline record!</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <style>{`
                  .discipline-table th { background-color: #000; color: #fff; padding-top: 1rem; padding-bottom: 1rem; border-bottom: none; font-weight: 600; font-size: 0.875rem; }
                  .discipline-table tr { border-bottom: 1px solid #f3f4f6; }
                  .discipline-table td { padding-top: 0.75rem; padding-bottom: 0.75rem; }
                `}</style>
                <DataTable
                  columns={columns as unknown as Column<Record<string, unknown>>[]}
                  data={paginatedData as unknown as Record<string, unknown>[]}
                  keyField="id"
                  className="discipline-table w-full"
                />
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-8 py-5 bg-white">
                <div className="text-sm font-medium text-gray-500">
                  Showing {cases.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, cases.length)} of {cases.length} results
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

      {/* View Case Modal */}
      {isViewModalOpen && selectedCase && (
        <ViewCaseModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          case={selectedCase}
        />
      )}

      {/* Appeal Modal */}
      {isAppealModalOpen && selectedCase && (
        <AppealModal
          isOpen={isAppealModalOpen}
          onClose={() => setIsAppealModalOpen(false)}
          case={selectedCase}
        />
      )}
    </div>
  );
}

// View Case Modal Component
function ViewCaseModal({ 
  isOpen, 
  onClose, 
  case: disciplineCase 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  case: DisciplineCase;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      <div className="absolute left-0 top-0 w-64 h-full bg-transparent pointer-events-none"></div>
      <div className="absolute left-64 top-0 right-0 bottom-0 bg-black bg-opacity-10 backdrop-blur-sm"></div>
      <div className="absolute left-64 top-0 right-0 bottom-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl relative z-10 max-h-[90vh] flex flex-col">
          <div className="bg-black text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
            <h2 className="text-xl font-semibold">Discipline Case Details</h2>
            <button onClick={onClose} className="text-white hover:text-gray-300">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Case Date</label>
                  <input
                    type="text"
                    value={new Date(disciplineCase.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    readOnly
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                  <input
                    type="text"
                    value={disciplineCase.status}
                    readOnly
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 font-bold focus:outline-none ${
                      disciplineCase.status === 'OPEN' ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-50 text-gray-700'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Offense Type</label>
                <input
                  type="text"
                  value={disciplineCase.offenseType?.name || "Unknown"}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Points Deducted</label>
                <input
                  type="text"
                  value={`-${disciplineCase.pointsDeduct} points`}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-red-600 bg-red-50 focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea
                  value={disciplineCase.description}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none h-32 resize-none"
                />
              </div>

              {disciplineCase.appeal && (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-bold text-gray-900 mb-4">Appeal Status</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Appeal Status</label>
                      <input
                        type="text"
                        value={disciplineCase.appeal.status}
                        readOnly
                        className={`w-full border border-gray-300 rounded-lg px-3 py-2 font-bold focus:outline-none ${
                          disciplineCase.appeal.status === 'APPROVED' ? 'bg-green-50 text-green-700' :
                          disciplineCase.appeal.status === 'REJECTED' ? 'bg-red-50 text-red-700' :
                          'bg-yellow-50 text-yellow-700'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Submitted Date</label>
                      <input
                        type="text"
                        value={new Date(disciplineCase.appeal.createdAt).toLocaleDateString()}
                        readOnly
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Appeal Reason</label>
                    <textarea
                      value={disciplineCase.appeal.reason}
                      readOnly
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none h-20 resize-none"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center gap-4 pt-4">
                <button
                  onClick={onClose}
                  className="bg-black text-white px-10 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-800 transition-all shadow-md active:scale-95"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Appeal Modal Component
function AppealModal({ 
  isOpen, 
  onClose, 
  case: disciplineCase 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  case: DisciplineCase;
}) {
  const [reason, setReason] = useState("");
  const queryClient = useQueryClient();
  
  const submitAppealMutation = useSubmitAppeal();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      toast.error("Please provide a reason for your appeal");
      return;
    }

    submitAppealMutation.mutate(
      { caseId: disciplineCase.id, reason },
      {
        onSuccess: () => {
          toast.success("Appeal submitted successfully");
          queryClient.invalidateQueries({ queryKey: ["discipline-cases"] });
          onClose();
        },
        onError: (error: Error) => {
          toast.error(error.message || "Failed to submit appeal");
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-[9999]">
      <div className="absolute left-0 top-0 w-64 h-full bg-transparent pointer-events-none"></div>
      <div className="absolute left-64 top-0 right-0 bottom-0 bg-black bg-opacity-10 backdrop-blur-sm"></div>
      <div className="absolute left-64 top-0 right-0 bottom-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl relative z-10 max-h-[90vh] flex flex-col">
          <div className="bg-black text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
            <h2 className="text-xl font-semibold">Submit Appeal</h2>
            <button onClick={onClose} className="text-white hover:text-gray-300">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-2">Case Information</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><span className="font-bold">Offense:</span> {disciplineCase.offenseType?.name}</p>
                  <p><span className="font-bold">Points Deducted:</span> -{disciplineCase.pointsDeduct}</p>
                  <p><span className="font-bold">Date:</span> {new Date(disciplineCase.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Reason for Appeal *
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-gray-400 h-32 resize-none"
                  placeholder="Explain why you are appealing this disciplinary case..."
                  required
                />
              </div>

              <div className="flex items-center justify-center gap-4 pt-4">
                <button
                  type="submit"
                  disabled={submitAppealMutation.isPending}
                  className="bg-black text-white px-10 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-800 transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
                >
                  {submitAppealMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Submit Appeal
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitAppealMutation.isPending}
                  className="bg-white text-gray-700 border border-gray-300 px-10 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

