"use client";

import { useState, useEffect } from "react";
import { StatCard, Card, CardBody } from "@/components/ui";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/Shared";
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  MoreHorizontal
} from "lucide-react";
import { motion } from "framer-motion";
import { disciplineApi, DisciplineCase, CaseStatus } from "@/lib/api/discipline";
import { AddDisciplineCaseModal } from "@/components/discipline/DisciplineCaseModals";

export default function IncidentsPage() {
  const [cases, setCases] = useState<DisciplineCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<CaseStatus | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [offenseTypes, setOffenseTypes] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [newCaseForm, setNewCaseForm] = useState({
    studentId: "",
    offenseTypeId: "",
    description: "",
    pointsDeduct: 0,
  });
  const limit = 10;

  // Fetch cases
  useEffect(() => {
    fetchCases();
  }, [page, statusFilter]);

  // Fetch offense types and students when modal opens
  useEffect(() => {
    if (showNewCaseModal) {
      fetchOffenseTypes();
      fetchStudents();
    }
  }, [showNewCaseModal]);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const response = await disciplineApi.getCases({
        page,
        limit,
        status: statusFilter,
      });
      setCases(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error("Failed to fetch cases:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOffenseTypes = async () => {
    try {
      const data = await disciplineApi.getOffenseTypes();
      setOffenseTypes(data);
    } catch (error) {
      console.error("Failed to fetch offense types:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      console.log("Fetching students...");
      // Import students API
      const { studentsApi } = await import("@/lib/api/students");
      const response = await studentsApi.getStudents({ 
        limit: 50, 
        isActive: true 
      });
      console.log("Students response:", response);
      console.log("Students data:", response.data);
      setStudents(response.data || []);
    } catch (error) {
      console.error("Failed to fetch students:", error);
      setStudents([]);
    }
  };

  const handleCreateCase = async () => {
    if (!newCaseForm.studentId || !newCaseForm.offenseTypeId || !newCaseForm.description) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await disciplineApi.createCase(newCaseForm);
      setShowNewCaseModal(false);
      setNewCaseForm({
        studentId: "",
        offenseTypeId: "",
        description: "",
        pointsDeduct: 0,
      });
      fetchCases();
    } catch (error) {
      console.error("Failed to create case:", error);
      alert("Failed to create case");
    }
  };

  const handleOffenseTypeChange = (offenseTypeId: string) => {
    const offense = offenseTypes.find((o) => o.id === offenseTypeId);
    setNewCaseForm({
      ...newCaseForm,
      offenseTypeId,
      pointsDeduct: offense?.pointDeduction || 0,
    });
  };

  // Calculate stats
  const stats = {
    total: total,
    pending: cases.filter((c) => c.status === "OPEN").length,
    resolved: cases.filter((c) => c.status === "CLOSED").length,
    withAppeals: cases.filter((c) => c.appeal).length,
  };

  const getSeverityColor = (points: number) => {
    if (points >= 20) return "text-red-600 font-semibold";
    if (points >= 10) return "text-orange-600 font-semibold";
    return "text-yellow-600 font-semibold";
  };

  const getStatusBadge = (status: CaseStatus) => {
    if (status === "OPEN") {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Pending</span>;
    }
    return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Resolved</span>;
  };

  const incidentCols: Column<DisciplineCase>[] = [
    { 
      key: "id", 
      header: "", 
      render: () => <input type="checkbox" className="rounded border-gray-300" /> 
    },
    { 
      key: "student", 
      header: "Student", 
      render: (_, row) => (
        <span className="font-medium text-gray-900">
          {row.student?.user.firstName} {row.student?.user.lastName}
        </span>
      )
    },
    { 
      key: "offenseType", 
      header: "Incident", 
      render: (_, row) => (
        <span className="text-gray-600">{row.offenseType?.name || "N/A"}</span>
      )
    },
    { 
      key: "pointsDeduct", 
      header: "Severity", 
      render: (v, row) => (
        <span className={getSeverityColor(row.pointsDeduct)}>
          -{row.pointsDeduct} pts
        </span>
      )
    },
    { 
      key: "status", 
      header: "Status", 
      render: (v, row) => getStatusBadge(row.status)
    },
    { 
      key: "createdAt", 
      header: "Date", 
      render: (v) => (
        <span className="text-gray-600">
          {new Date(String(v)).toLocaleDateString()}
        </span>
      )
    },
    {
      key: "actions",
      header: "Actions",
      render: (_, row) => (
        <div className="flex gap-3">
          <button 
            className="text-gray-400 hover:text-black transition-colors"
            onClick={() => window.location.href = `/discipline/incidents/${row.id}`}
          >
            <Eye size={18} />
          </button>
          {row.status === "OPEN" && (
            <button 
              className="text-gray-400 hover:text-green-600 transition-colors"
              onClick={() => handleCloseCase(row.id)}
            >
              <Edit size={18} />
            </button>
          )}
          <button 
            className="text-gray-400 hover:text-red-500 transition-colors"
            onClick={() => handleDeleteCase(row.id)}
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    },
  ];

  const handleCloseCase = async (id: string) => {
    if (!confirm("Mark this case as resolved?")) return;
    try {
      await disciplineApi.closeCase(id);
      fetchCases();
    } catch (error) {
      console.error("Failed to close case:", error);
      alert("Failed to close case");
    }
  };

  const handleDeleteCase = async (id: string) => {
    if (!confirm("Are you sure you want to delete this case?")) return;
    try {
      await disciplineApi.deleteCase(id);
      fetchCases();
    } catch (error) {
      console.error("Failed to delete case:", error);
      alert("Failed to delete case");
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 p-1"
    >
      <PageHeader
        title="Discipline Cases"
        subtitle="Manage and track active student disciplinary cases"
      />

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search Cases"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all bg-white"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select
            value={statusFilter || ""}
            onChange={(e) => setStatusFilter(e.target.value as CaseStatus || undefined)}
            className="flex-1 md:flex-none py-3 px-6 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
          >
            <option value="">All status</option>
            <option value="OPEN">Pending</option>
            <option value="CLOSED">Resolved</option>
          </select>
          <Button 
            className="flex-1 md:flex-none py-3 px-8 h-auto bg-black text-white hover:bg-gray-900 rounded-lg flex gap-2 items-center font-bold"
            onClick={() => setShowNewCaseModal(true)}
          >
            New Case <Plus size={18} />
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Cases", value: stats.total.toString() },
          { label: "Pending", value: stats.pending.toString() },
          { label: "Resolved", value: stats.resolved.toString() },
          { label: "With Appeals", value: stats.withAppeals.toString() },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm rounded-2xl bg-white p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full border-[3px] border-black flex items-center justify-center p-0.5">
                <div className="w-full h-full rounded-full border border-black/10 flex items-center justify-center bg-white">
                  <AlertCircle size={24} />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-700 text-sm font-medium">{stat.label}</p>
                <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Table Section */}
      <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardBody className="p-0">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading cases...</div>
          ) : cases.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No cases found</div>
          ) : (
            <>
              <DataTable
                columns={incidentCols}
                data={cases}
                keyField="id"
                className="discipline-cases-table"
              />
              <div className="p-6 flex items-center justify-between border-t border-gray-50 text-[11px] font-bold text-gray-400">
                <span>Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} results</span>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="px-4 py-2 h-auto text-[11px] border-gray-200 uppercase font-black tracking-widest hover:bg-black hover:text-white transition-all rounded-lg"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                      <Button 
                        key={p}
                        size="sm" 
                        className={`w-8 h-8 p-0 text-[11px] font-black rounded-lg ${
                          page === p ? "bg-black text-white" : "bg-white border border-gray-200 hover:bg-gray-50"
                        }`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </Button>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="px-4 py-2 h-auto text-[11px] border-gray-200 uppercase font-black tracking-widest hover:bg-black hover:text-white transition-all rounded-lg"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardBody>
      </Card>

      {/* New Case Modal */}
      <AddDisciplineCaseModal
        open={showNewCaseModal}
        onClose={() => {
          setShowNewCaseModal(false);
          setNewCaseForm({
            studentId: "",
            offenseTypeId: "",
            description: "",
            pointsDeduct: 0,
          });
        }}
        onConfirm={handleCreateCase}
        students={students}
        offenseTypes={offenseTypes}
        formData={newCaseForm}
        onFormChange={(field, value) => {
          setNewCaseForm(prev => ({ ...prev, [field]: value }));
        }}
      />
    </motion.div>
  );
}
