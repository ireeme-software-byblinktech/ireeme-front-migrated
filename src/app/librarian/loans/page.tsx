"use client";

import { motion } from "framer-motion";
import {
  Search,
  Book,
  Eye,
  Filter,
  BookOpen,
  RotateCcw,
  Download,
  FileText,
} from "lucide-react";
import { Card, CardBody } from "@/components/ui";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { libraryApi, Borrowing } from "@/lib/api/library";
import { IssueBookModal, ReturnBookModal } from "@/components/librarian/BorrowingModals";
import { ViewBorrowingModal } from "@/components/librarian/ViewModals";
import { toast } from "@/lib/utils/toast";

// ─── Helper Functions ─────────────────────────────────────────────────────

const getStatus = (borrowing: Borrowing) => {
  if (borrowing.returnedAt) return "Returned";
  if (new Date(borrowing.dueDate) < new Date()) return "Overdue";
  return "Active";
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export default function LoansPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedBorrowing, setSelectedBorrowing] = useState<Borrowing | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Fetch all borrowings matching current status filter
      const response = await libraryApi.getBorrowings({
        status: statusFilter === "all" ? undefined : statusFilter,
        limit: 10000,
      });

      const exportBorrowings = response.data || [];
      
      // Filter locally by search string (consistent with table filter)
      const filtered = exportBorrowings.filter(b => 
        searchQuery === "" ||
        b.book?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.student?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.student?.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (filtered.length === 0) {
        toast.error("No transactions found matching the filters to export.");
        return;
      }

      // Generate CSV
      const headers = [
        "Borrowing ID",
        "Book Title",
        "Author",
        "Borrower Name",
        "Borrower Email",
        "Borrow Date",
        "Due Date",
        "Returned Date",
        "Status"
      ];

      const rows = filtered.map(b => {
        const name = b.student ? `${b.student.firstName} ${b.student.lastName}` : "N/A";
        const email = b.student?.email || "N/A";
        const status = getStatus(b);
        return [
          b.id,
          b.book?.title || "N/A",
          b.book?.author || "N/A",
          name,
          email,
          new Date(b.borrowedAt).toLocaleDateString(),
          new Date(b.dueDate).toLocaleDateString(),
          b.returnedAt ? new Date(b.returnedAt).toLocaleDateString() : "N/A",
          status
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
      link.setAttribute("download", `Library_Transactions_${new Date().toISOString().slice(0, 10)}.csv`);
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
      // Fetch all borrowings matching current status filter
      const response = await libraryApi.getBorrowings({
        status: statusFilter === "all" ? undefined : statusFilter,
        limit: 10000,
      });

      const exportBorrowings = response.data || [];
      
      // Filter locally by search string (consistent with table filter)
      const filtered = exportBorrowings.filter(b => 
        searchQuery === "" ||
        b.book?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.student?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.student?.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (filtered.length === 0) {
        toast.error("No transactions found matching the filters to export.");
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
      doc.text("LIBRARY LOANS & TRANSACTIONS", 14, 13);

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(`IREME Library Management Portal  |  Export Date: ${today}  |  Filters: Search "${searchQuery || "None"}" · Status: ${statusFilter.toUpperCase()}`, 14, 19);

      // ── Summary stats row ─────────────────────────────────────────────────────
      const totalTrans = filtered.length;
      const activeCount = filtered.filter(b => !b.returnedAt).length;
      const overdueCount = filtered.filter(b => !b.returnedAt && new Date(b.dueDate) < new Date()).length;
      const returnedCount = filtered.filter(b => !!b.returnedAt).length;

      const stats = [
        { label: "TOTAL TRANSACTIONS", value: totalTrans },
        { label: "ACTIVE LOANS", value: activeCount },
        { label: "OVERDUE LOANS", value: overdueCount },
        { label: "RETURNED BOOKS", value: returnedCount },
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

      // ── Table body ────────────────────────────────────────────────────────────
      const tableBody = filtered.map((b, idx) => {
        const name = b.student ? `${b.student.firstName} ${b.student.lastName}` : "N/A";
        const status = getStatus(b);
        return [
          idx + 1,
          b.book?.title || "N/A",
          name,
          new Date(b.borrowedAt).toLocaleDateString('en-GB'),
          new Date(b.dueDate).toLocaleDateString('en-GB'),
          b.returnedAt ? new Date(b.returnedAt).toLocaleDateString('en-GB') : "N/A",
          status,
        ];
      });

      autoTable(doc, {
        startY: 46,
        head: [["#", "Book Title", "Borrower", "Borrow Date", "Due Date", "Returned Date", "Status"]],
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
          0: { cellWidth: 8, halign: "center" },
          1: { cellWidth: 70 },
          2: { cellWidth: 50 },
          3: { cellWidth: 30, halign: "center" },
          4: { cellWidth: 30, halign: "center" },
          5: { cellWidth: 30, halign: "center" },
          6: { cellWidth: 30, halign: "center" },
        },
        didDrawCell: (data) => {
          if (data.section === "body" && data.column.index === 6) {
            const val = data.cell.text[0];
            const isReturned = val === "Returned";
            const isOverdue = val === "Overdue";
            let fill: [number, number, number] = [17, 24, 39]; // Black for active
            let text: [number, number, number] = [255, 255, 255];
            
            if (isReturned) {
              fill = [243, 244, 246];
              text = [75, 85, 99];
            } else if (isOverdue) {
              fill = [220, 38, 38]; // Red
              text = [255, 255, 255];
            }
            
            const { x, y, width, height } = data.cell;
            doc.setFillColor(...fill);
            doc.setTextColor(...text);
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
      doc.save(`Library_Loans_${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success("PDF downloaded successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF.");
    } finally {
      setIsExportingPDF(false);
    }
  };

  // Fetch borrowings
  const { data: borrowingsResponse, isLoading } = useQuery({
    queryKey: ["borrowings", statusFilter, currentPage],
    queryFn: () => libraryApi.getBorrowings({ 
      status: statusFilter === "all" ? undefined : statusFilter,
      page: currentPage,
      limit: 10 
    }),
  });

  const borrowings = borrowingsResponse?.data || [];
  const totalPages = borrowingsResponse?.totalPages || 1;

  // Filter by search
  const filteredBorrowings = borrowings.filter(b => 
    searchQuery === "" ||
    b.book?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.student?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.student?.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const loanCols: Column<Borrowing>[] = [
    {
      key: "bookId",
      header: "Book Cover",
      width: "100px",
      render: (v, borrowing) => (
        <div className="w-10 h-14 bg-gray-50 rounded-sm overflow-hidden flex items-center justify-center border border-gray-100 shadow-sm ml-2">
          {borrowing.book?.coverUrl ? (
            <img src={borrowing.book.coverUrl} alt={borrowing.book.title} className="w-full h-full object-cover" />
          ) : (
            <Book className="text-gray-300" size={20} />
          )}
        </div>
      )
    },
    { 
      key: "bookId", 
      header: "Book Title", 
      render: (v, borrowing) => <span className="font-semibold text-gray-800">{borrowing.book?.title || "N/A"}</span> 
    },
    { 
      key: "studentId", 
      header: "Borrower", 
      render: (v, borrowing) => (
        <span className="font-medium text-gray-600">
          {borrowing.student ? `${borrowing.student.firstName} ${borrowing.student.lastName}` : "N/A"}
        </span>
      )
    },
    { 
      key: "borrowedAt", 
      header: "Borrow date", 
      render: (v) => <span className="text-gray-500 tabular-nums">{formatDate(String(v))}</span> 
    },
    { 
      key: "dueDate", 
      header: "Due date", 
      render: (v) => <span className="text-gray-500 tabular-nums">{formatDate(String(v))}</span> 
    },
    {
      key: "id",
      header: "Status",
      render: (v, borrowing) => {
        const status = getStatus(borrowing);
        return (
          <span className={cn(
            "px-6 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border text-center block w-fit min-w-[100px]",
            status === "Active" ? "bg-black text-white border-black" : 
            status === "Overdue" ? "bg-red-600 text-white border-red-600" :
            "bg-gray-100 text-gray-600 border-gray-200"
          )}>
            {status}
          </span>
        );
      }
    },
    {
      key: "id",
      header: "Action",
      render: (v, borrowing) => (
        <div className="flex items-center gap-4">
          {!borrowing.returnedAt && (
            <button 
              onClick={() => {
                setIsReturnModalOpen(true);
              }}
              className="text-gray-400 hover:text-black transition-colors"
              title="Return Book"
            >
              <RotateCcw size={18} />
            </button>
          )}
          <button 
            onClick={() => {
              setSelectedBorrowing(borrowing);
              setIsViewModalOpen(true);
            }}
            className="text-gray-400 hover:text-black transition-colors"
            title="View Details"
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-black text-gray-900 tracking-tight">Issue & Return Books</h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Manage book transactions and returns</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => setIsIssueModalOpen(true)}
            className="h-11 px-6 rounded-xl bg-black text-white font-bold hover:bg-gray-900 shadow-lg shadow-black/10 transition-all active:scale-95"
          >
            <BookOpen size={18} className="mr-2" /> Issue Book
          </Button>
          <Button 
            onClick={() => setIsReturnModalOpen(true)}
            variant="outline"
            className="h-11 px-6 rounded-xl border-gray-200 font-bold text-gray-600 hover:bg-gray-50"
          >
            <RotateCcw size={18} className="mr-2" /> Return Book
          </Button>
        </div>
      </div>

      {/* Transaction Records Table */}
      <div className="space-y-4">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by book title, student name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-100 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all text-sm shadow-sm"
            />
          </div>
          <div className="flex items-center gap-3 w-full xl:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 xl:flex-none h-11 px-6 rounded-xl border border-gray-100 font-bold text-gray-600 bg-white hover:bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-black text-sm"
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="OVERDUE">Overdue</option>
              <option value="RETURNED">Returned</option>
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

        <Card className="border-none shadow-xl shadow-gray-100/30 rounded-[24px] overflow-hidden bg-white">
          <CardBody className="p-0">
            <DataTable
              columns={loanCols}
              data={filteredBorrowings}
              keyField="id"
            />
            <div className="p-6 flex items-center justify-between border-t border-gray-50 text-[11px] font-black text-gray-400 uppercase tracking-wider">
              <span>
                Showing {filteredBorrowings.length > 0 ? ((currentPage - 1) * 10) + 1 : 0} to {Math.min(currentPage * 10, borrowingsResponse?.total || 0)} of {borrowingsResponse?.total || 0} results
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
      </div>

      {/* Modals */}
      <IssueBookModal isOpen={isIssueModalOpen} onClose={() => setIsIssueModalOpen(false)} />
      <ReturnBookModal isOpen={isReturnModalOpen} onClose={() => setIsReturnModalOpen(false)} />
      <ViewBorrowingModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} borrowing={selectedBorrowing} />
    </motion.div>
  );
}

