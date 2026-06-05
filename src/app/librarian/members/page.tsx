"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Download,
  Eye,
  Filter,
  Users,
  BookOpen,
  Book,
  Clock,
  FileText,
} from "lucide-react";
import { Card, CardBody, StatCard } from "@/components/ui";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { studentsApi, Student } from "@/lib/api/students";
import { libraryApi } from "@/lib/api/library";
import { ViewMemberModal } from "@/components/librarian/ViewModals";
import { toast } from "@/lib/utils/toast";

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Student | null>(null);

  // Fetch students (library members)
  const { data: studentsResponse, isLoading } = useQuery({
    queryKey: ["library-members", searchQuery, statusFilter, currentPage],
    queryFn: () => studentsApi.getStudents({ 
      search: searchQuery,
      isActive: statusFilter === "all" ? undefined : statusFilter === "active",
      page: currentPage,
      limit: 10 
    }),
  });

  // Fetch borrowings stats
  const { data: borrowingsResponse } = useQuery({
    queryKey: ["all-borrowings"],
    queryFn: () => libraryApi.getBorrowings({ limit: 1000 }),
  });

  const students = studentsResponse?.data || [];
  const totalPages = studentsResponse?.pages || 1;
  const borrowings = borrowingsResponse?.data || [];

  // Calculate borrowing counts per student
  const borrowingCounts = borrowings.reduce((acc, b) => {
    if (!b.returnedAt) {
      acc[b.studentId] = (acc[b.studentId] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Fetch actual total counts
  const { data: totalCountResponse } = useQuery({
    queryKey: ["library-total-members-count"],
    queryFn: () => studentsApi.getStudents({ limit: 1 }),
  });
  const totalMembersCount = totalCountResponse?.total || 0;

  const { data: activeCountResponse } = useQuery({
    queryKey: ["library-active-members-count"],
    queryFn: () => studentsApi.getStudents({ isActive: true, limit: 1 }),
  });
  const activeMembersCount = activeCountResponse?.total || 0;

  // Calculate stats
  const totalMembers = totalMembersCount;
  const activeMembers = activeMembersCount;
  const totalBorrowings = borrowings.filter(b => !b.returnedAt).length;
  const overdueBorrowings = borrowings.filter(b => 
    !b.returnedAt && new Date(b.dueDate) < new Date()
  ).length;

  const [isExporting, setIsExporting] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Fetch all students matching current filters
      const response = await studentsApi.getStudents({
        search: searchQuery,
        isActive: statusFilter === "all" ? undefined : statusFilter === "active",
        limit: 10000,
      });

      const exportStudents = response.data || [];
      if (exportStudents.length === 0) {
        toast.error("No members found matching the filters to export.");
        return;
      }

      // Generate CSV
      const headers = [
        "Student ID",
        "Student Number",
        "Name",
        "Email",
        "Class",
        "Status",
        "Gender",
        "Active Loans"
      ];

      const rows = exportStudents.map(student => {
        const studentName = `${student.user.firstName} ${student.user.lastName}`;
        const activeLoans = borrowingCounts[student.id] || 0;
        return [
          student.id,
          student.studentNumber,
          studentName,
          student.user.email,
          student.class?.name || "N/A",
          student.isActive ? "Active" : "Inactive",
          student.gender || "N/A",
          String(activeLoans)
        ];
      });

      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Library_Members_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Successfully exported CSV.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export CSV.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    try {
      // Fetch all students matching current filters
      const response = await studentsApi.getStudents({
        search: searchQuery,
        isActive: statusFilter === "all" ? undefined : statusFilter === "active",
        limit: 10000,
      });

      const exportStudents = response.data || [];
      if (exportStudents.length === 0) {
        toast.error("No members found matching the filters to export.");
        return;
      }

      // Dynamically import jsPDF to avoid SSR issues
      const { default: jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");

      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const today = new Date().toLocaleDateString();

      // ── Header block ─────────────────────────────────────────────────────────
      doc.setFillColor(17, 24, 39); // #111827
      doc.rect(0, 0, pageWidth, 22, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("LIBRARY MEMBERS DIRECTORY", 14, 13);

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(`IREME Library Management Portal  |  Export Date: ${today}  |  Filters: Search "${searchQuery || "None"}" · Status: ${statusFilter.toUpperCase()}`, 14, 19);

      // ── Summary stats row ─────────────────────────────────────────────────────
      const activeCount  = exportStudents.filter(s => s.isActive).length;
      const inactiveCount = exportStudents.length - activeCount;
      const totalLoans   = exportStudents.reduce((sum, s) => sum + (borrowingCounts[s.id] || 0), 0);

      const stats = [
        { label: "TOTAL MEMBERS", value: exportStudents.length },
        { label: "ACTIVE",        value: activeCount },
        { label: "INACTIVE",      value: inactiveCount },
        { label: "ACTIVE LOANS",  value: totalLoans },
      ];

      const cardW = (pageWidth - 28) / stats.length;
      stats.forEach((stat, i) => {
        const x = 14 + i * (cardW + 4);
        doc.setFillColor(249, 250, 251); // #f9fafb
        doc.setDrawColor(229, 231, 235);
        doc.roundedRect(x, 26, cardW, 16, 2, 2, "FD");

        doc.setTextColor(107, 114, 128);
        doc.setFontSize(6);
        doc.setFont("helvetica", "bold");
        doc.text(stat.label, x + 4, 32);

        doc.setTextColor(17, 24, 39);
        doc.setFontSize(13);
        doc.setFont("helvetica", "bold");
        doc.text(String(stat.value), x + 4, 39);
      });

      // ── Members table ─────────────────────────────────────────────────────────
      const tableBody = exportStudents.map((student, idx) => {
        const name = `${student.user.firstName} ${student.user.lastName}`;
        const loans = borrowingCounts[student.id] || 0;
        return [
          idx + 1,
          student.studentNumber,
          name,
          student.user.email,
          student.class?.name || "N/A",
          student.gender || "N/A",
          loans,
          student.isActive ? "Active" : "Inactive",
        ];
      });

      autoTable(doc, {
        startY: 46,
        head: [["#", "Student No.", "Member Name", "Email", "Class", "Gender", "Loans", "Status"]],
        body: tableBody,
        styles: {
          fontSize: 8,
          cellPadding: 3,
          textColor: [31, 41, 55],
          lineColor: [229, 231, 235],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [17, 24, 39],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 7.5,
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251],
        },
        columnStyles: {
          0: { cellWidth: 8,  halign: "center" },
          1: { cellWidth: 28 },
          2: { cellWidth: 40 },
          3: { cellWidth: 52 },
          4: { cellWidth: 24 },
          5: { cellWidth: 18, halign: "center" },
          6: { cellWidth: 14, halign: "center" },
          7: { cellWidth: 20, halign: "center" },
        },
        didDrawCell: (data) => {
          // Colour the Status cell like a badge
          if (data.section === "body" && data.column.index === 7) {
            const val = data.cell.text[0];
            const isActive = val === "Active";
            const { x, y, width, height } = data.cell;
            doc.setFillColor(...(isActive ? [17, 24, 39] : [243, 244, 246]) as [number, number, number]);
            doc.setTextColor(...(isActive ? [255, 255, 255] : [75, 85, 99]) as [number, number, number]);
            doc.roundedRect(x + 1, y + 1.5, width - 2, height - 3, 1.5, 1.5, "F");
            doc.setFontSize(6.5);
            doc.setFont("helvetica", "bold");
            doc.text(val, x + width / 2, y + height / 2 + 1, { align: "center" });
          }
        },
      });

      // ── Footer on every page ──────────────────────────────────────────────────
      const pageCount = (doc.internal as any).getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(156, 163, 175);
        doc.setFont("helvetica", "normal");
        doc.text(
          `Page ${i} of ${pageCount}  ·  IREME Library Management Portal  ·  ${today}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 5,
          { align: "center" }
        );
      }

      // ── Download ──────────────────────────────────────────────────────────────
      doc.save(`Library_Members_${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success("PDF downloaded successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF.");
    } finally {
      setIsExportingPDF(false);
    }
  };

  const memberCols: Column<Student>[] = [
    { 
      key: "user", 
      header: "Member Name", 
      render: (v: any, student) => (
        <span className="font-semibold text-gray-800 ml-4">
          {student.user.firstName} {student.user.lastName}
        </span>
      )
    },
    { 
      key: "studentNumber", 
      header: "Student Number", 
      render: (v) => <span className="text-gray-600 font-mono">{String(v)}</span> 
    },
    { 
      key: "user", 
      header: "Email", 
      render: (v: any) => <span className="text-gray-500">{v.email}</span> 
    },
    { 
      key: "class", 
      header: "Class", 
      render: (v: any) => <span className="text-gray-600">{v?.name || "N/A"}</span> 
    },
    { 
      key: "id", 
      header: "Active Loans", 
      render: (v, student) => (
        <span className="text-gray-900 font-bold">
          {borrowingCounts[student.id] || 0}
        </span>
      )
    },
    {
      key: "isActive",
      header: "Status",
      render: (v) => (
        <span className={cn(
          "px-6 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border text-center block w-fit min-w-[100px]",
          v ? "bg-black text-white border-black" : "bg-gray-100 text-gray-600 border-gray-200"
        )}>
          {v ? "Active" : "Inactive"}
        </span>
      )
    },
    {
      key: "id",
      header: "Action",
      render: (v, student) => (
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              setSelectedMember(student);
              setIsViewModalOpen(true);
            }}
            className="text-gray-400 hover:text-black transition-colors"
            title="View member details"
          >
            <Eye size={18} />
          </button>
        </div>
      )
    }
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-10"
    >
      {/* Header Section */}
      <div>
        <h1 className="text-[28px] font-black text-gray-900 tracking-tight">Library Members</h1>
        <p className="text-gray-500 text-sm font-medium mt-1">Manage library membership and member information</p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, student number, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-100 rounded-xl bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all text-sm"
          />
        </div>
        <div className="flex items-center gap-3 w-full xl:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 xl:flex-none h-11 px-6 rounded-xl border border-gray-100 font-bold text-gray-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Button 
            variant="outline" 
            onClick={handleExport}
            loading={isExporting}
            className="flex-1 xl:flex-none h-11 px-6 rounded-xl border-gray-100 font-bold text-gray-600 hover:bg-gray-50"
          >
            <Download size={16} className="mr-2" /> Export CSV
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExportPDF}
            loading={isExportingPDF}
            className="flex-1 xl:flex-none h-11 px-6 rounded-xl border-gray-100 font-bold text-gray-600 hover:bg-gray-50"
          >
            <FileText size={16} className="mr-2" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Members"
          value={totalMembers.toString()}
          icon={<Users />}
          trend={{ value: "+3.6", direction: "up", label: "This month" }}
        />
        <StatCard
          label="Active Members"
          value={activeMembers.toString()}
          icon={<BookOpen />}
          trend={{ value: "+3.6", direction: "up", label: "This month" }}
        />
        <StatCard
          label="Active Loans"
          value={totalBorrowings.toString()}
          icon={<Book />}
          trend={{ value: "+3.6", direction: "up", label: "This month" }}
        />
        <StatCard
          label="Overdue Loans"
          value={overdueBorrowings.toString()}
          icon={<Clock />}
          trend={{ value: "-2.1", direction: "down", label: "This month" }}
        />
      </div>

      {/* Members Table */}
      <Card className="border-none shadow-xl shadow-gray-100/30 rounded-[24px] overflow-hidden bg-white">
        <CardBody className="p-0">
          <DataTable
            columns={memberCols}
            data={students}
            keyField="id"
          />
          <div className="p-6 flex items-center justify-between border-t border-gray-50 text-[11px] font-black text-gray-400 uppercase tracking-wider">
            <span>
              Showing {students.length > 0 ? ((currentPage - 1) * 10) + 1 : 0} to {Math.min(currentPage * 10, studentsResponse?.total || 0)} of {studentsResponse?.total || 0} results
            </span>
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-5 h-10 text-[11px] border-gray-100 font-extrabold hover:bg-black hover:text-white transition-all rounded-lg disabled:opacity-50"
              >
                Previous
              </Button>
              <div className="flex gap-2">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                  <Button 
                    key={page}
                    size="sm" 
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "w-10 h-10 p-0 text-[11px] font-black rounded-lg transition-all",
                      currentPage === page 
                        ? "bg-black text-white shadow-lg shadow-black/20" 
                        : "bg-white text-gray-600 border border-gray-100 hover:bg-gray-50"
                    )}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-5 h-10 text-[11px] border-gray-100 font-extrabold hover:bg-black hover:text-white transition-all rounded-lg disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* View Modal */}
      <ViewMemberModal 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)} 
        member={selectedMember}
        activeLoanCount={selectedMember ? (borrowingCounts[selectedMember.id] || 0) : 0}
      />
    </motion.div>
  );
}

