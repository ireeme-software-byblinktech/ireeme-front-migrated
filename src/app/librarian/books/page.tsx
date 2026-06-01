"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  ClipboardList,
  FileText,
  Search,
  Book,
  Plus,
  Download,
  Edit2,
  Trash2,
  Filter,
} from "lucide-react";
import { Card, CardBody, StatCard } from "@/components/ui";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { libraryApi, Book as BookType } from "@/lib/api/library";
import { AddBookModal, EditBookModal, DeleteBookModal } from "@/components/librarian/LibraryModals";
import { toast } from "@/lib/utils/toast";

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Fetch all books matching current filters
      const response = await libraryApi.getBooks({
        search: searchQuery,
        limit: 10000,
      });

      const exportBooks = response.data || [];
      if (exportBooks.length === 0) {
        toast.error("No books found matching the search to export.");
        return;
      }

      // Generate CSV
      const headers = [
        "Book ID",
        "Title",
        "Author",
        "ISBN",
        "Genre",
        "Total Copies",
        "Available Copies",
        "Status"
      ];

      const rows = exportBooks.map(book => {
        const availableCount = book.availableCopies ?? book.available ?? 0;
        const status = availableCount > 0 ? "Available" : "Out of Stock";
        return [
          book.id,
          book.title,
          book.author,
          book.isbn || "N/A",
          book.genre || "General",
          String(book.totalCopies),
          String(availableCount),
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
      link.setAttribute("download", `Library_Books_${new Date().toISOString().slice(0, 10)}.csv`);
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
      // Fetch all books matching current filters
      const response = await libraryApi.getBooks({
        search: searchQuery,
        limit: 10000,
      });

      const exportBooks = response.data || [];
      if (exportBooks.length === 0) {
        toast.error("No books found matching the search to export.");
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
      doc.text("LIBRARY BOOKS INVENTORY", 14, 13);

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(`IREME Library Management Portal  |  Export Date: ${today}  |  Filters: Search "${searchQuery || "None"}"`, 14, 19);

      // ── Summary stats row ─────────────────────────────────────────────────────
      const totalTitles = exportBooks.length;
      const totalCopiesCount = exportBooks.reduce((sum, b) => sum + b.totalCopies, 0);
      const availableBooksCount = exportBooks.filter(b => (b.availableCopies ?? b.available ?? 0) > 0).length;
      const borrowedCopiesCount = exportBooks.reduce((sum, b) => sum + (b.totalCopies - (b.availableCopies ?? b.available ?? 0)), 0);

      const stats = [
        { label: "TOTAL TITLES", value: totalTitles },
        { label: "TOTAL COPIES", value: totalCopiesCount },
        { label: "AVAILABLE TITLES", value: availableBooksCount },
        { label: "BORROWED COPIES", value: borrowedCopiesCount },
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

      // ── Books table ─────────────────────────────────────────────────────────
      const tableBody = exportBooks.map((book, idx) => {
        const availableCount = book.availableCopies ?? book.available ?? 0;
        return [
          idx + 1,
          book.title,
          book.author,
          book.isbn || "N/A",
          book.genre || "General",
          `${availableCount}/${book.totalCopies}`,
          availableCount > 0 ? "Available" : "Out of Stock",
        ];
      });

      autoTable(doc, {
        startY: 46,
        head: [["#", "Book Title", "Author", "ISBN", "Genre", "Stock (Avail/Total)", "Status"]],
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
          3: { cellWidth: 35 },
          4: { cellWidth: 35 },
          5: { cellWidth: 35, halign: "center" },
          6: { cellWidth: 35, halign: "center" },
        },
        didDrawCell: (data) => {
          if (data.section === "body" && data.column.index === 6) {
            const val = data.cell.text[0];
            const isAvail = val === "Available";
            const { x, y, width, height } = data.cell;
            doc.setFillColor(...(isAvail ? [17, 24, 39] : [243, 244, 246]) as [number, number, number]);
            doc.setTextColor(...(isAvail ? [255, 255, 255] : [75, 85, 99]) as [number, number, number]);
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
      doc.save(`Library_Books_${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success("PDF downloaded successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF.");
    } finally {
      setIsExportingPDF(false);
    }
  };

  // Fetch books
  const { data: booksResponse, isLoading } = useQuery({
    queryKey: ["books", searchQuery, currentPage],
    queryFn: () => libraryApi.getBooks({ search: searchQuery, page: currentPage, limit: 10 }),
  });

  const books = booksResponse?.data || [];
  const totalPages = booksResponse?.totalPages || 1;

  // Ensure availableCopies is set (fallback to available if needed)
  const normalizedBooks = books.map(book => ({
    ...book,
    availableCopies: book.availableCopies ?? book.available ?? 0,
  }));

  const handleEdit = (book: BookType) => {
    setSelectedBook(book);
    setIsEditModalOpen(true);
  };

  const handleDelete = (book: BookType) => {
    setSelectedBook(book);
    setIsDeleteModalOpen(true);
  };

  const bookCols: Column<BookType>[] = [
    {
      key: "coverUrl",
      header: "Book Cover",
      width: "120px",
      render: (v, book) => (
        <div className="w-10 h-14 bg-gray-50 rounded-sm overflow-hidden flex items-center justify-center border border-gray-100 shadow-sm ml-2">
          {v ? (
            <img src={String(v)} alt={book.title} className="w-full h-full object-cover" />
          ) : (
            <Book className="text-gray-300" size={20} />
          )}
        </div>
      )
    },
    { key: "title", header: "Book Title", render: (v) => <span className="font-semibold text-gray-800">{String(v)}</span> },
    { key: "isbn", header: "ISBN", render: (v) => <span className="text-gray-500 tabular-nums">{v ? String(v) : "N/A"}</span> },
    { key: "genre", header: "Genre", render: (v) => <span className="text-gray-600">{v ? String(v) : "N/A"}</span> },
    { 
      key: "availableCopies", 
      header: "Stock", 
      render: (v, book) => <span className="text-gray-600">{String(v)}/{book.totalCopies}</span> 
    },
    {
      key: "availableCopies",
      header: "Status",
      render: (v) => (
        <span className={cn(
          "px-6 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border text-center block w-fit min-w-[100px]",
          Number(v) > 0 ? "bg-black text-white border-black" : "bg-white text-gray-900 border-gray-200"
        )}>
          {Number(v) > 0 ? "Available" : "Out of Stock"}
        </span>
      )
    },
    {
      key: "id",
      header: "Action",
      render: (v, book) => (
        <div className="flex items-center gap-4">
          <button 
            onClick={() => handleEdit(book)}
            className="text-gray-400 hover:text-black transition-colors"
          >
            <Edit2 size={18} />
          </button>
          <button 
            onClick={() => handleDelete(book)}
            className="text-gray-400 hover:text-rose-500 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  const totalBooks = normalizedBooks.length;
  const availableBooks = normalizedBooks.filter(b => b.availableCopies > 0).length;
  const borrowedBooks = normalizedBooks.reduce((sum, b) => sum + (b.totalCopies - b.availableCopies), 0);
  const totalCopies = normalizedBooks.reduce((sum, b) => sum + b.totalCopies, 0);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-10"
    >
      {/* Header Section */}
      <div>
        <h1 className="text-[28px] font-black text-gray-900 tracking-tight">Books Management</h1>
        <p className="text-gray-500 text-sm font-medium mt-1">Manage your library's book collection</p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by title, author, or ISBN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-100 rounded-xl bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all text-sm"
          />
        </div>
        <div className="flex items-center gap-3 w-full xl:w-auto">
          <Button variant="outline" className="flex-1 xl:flex-none h-11 px-6 rounded-xl border-gray-100 font-bold text-gray-600 hover:bg-gray-50">
            All Categories <Filter size={16} className="ml-2" />
          </Button>
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
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 xl:flex-none h-11 px-6 rounded-xl bg-black text-white font-bold hover:bg-gray-900 shadow-lg shadow-black/10 transition-all active:scale-95"
          >
            <Plus size={18} className="mr-2" /> Add Book
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Books"
          value={booksResponse?.total.toString() || "0"}
          icon={<BookOpen />}
          trend={{ value: "+3.6", direction: "up", label: "This month" }}
        />
        <StatCard
          label="Available Books"
          value={availableBooks.toString()}
          icon={<Book />}
          trend={{ value: "+3.6", direction: "up", label: "This month" }}
        />
        <StatCard
          label="Borrowed Books"
          value={borrowedBooks.toString()}
          icon={<ClipboardList />}
          trend={{ value: "+3.6", direction: "up", label: "This month" }}
        />
        <StatCard
          label="Total Copies"
          value={totalCopies.toString()}
          icon={<FileText />}
          trend={{ value: "+3.6", direction: "up", label: "This month" }}
        />
      </div>

      {/* Books Table */}
      <Card className="border-none shadow-xl shadow-gray-100/30 rounded-[24px] overflow-hidden bg-white">
        <CardBody className="p-0">
          <DataTable
            columns={bookCols}
            data={normalizedBooks}
            keyField="id"
          />
          <div className="p-6 flex items-center justify-between border-t border-gray-50 text-[11px] font-black text-gray-400 uppercase tracking-wider">
            <span>Showing {normalizedBooks.length > 0 ? ((currentPage - 1) * 10) + 1 : 0} to {Math.min(currentPage * 10, booksResponse?.total || 0)} of {booksResponse?.total || 0} results</span>
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-5 h-10 text-[11px] border-gray-100 font-extrabold hover:bg-black hover:text-white transition-all rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-5 h-10 text-[11px] border-gray-100 font-extrabold hover:bg-black hover:text-white transition-all rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Modals */}
      <AddBookModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <EditBookModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} book={selectedBook} />
      <DeleteBookModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} book={selectedBook} />
    </motion.div>
  );
}
